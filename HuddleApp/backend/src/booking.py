import psycopg2
import psycopg2.extras
from src.error import InputError, AccessError, DataBaseError
from src.token import check_token, decode_token
from src.badge import update_bades
from src.email import ticket_email, refund_email
from src.point import deduct_point, increase_point
from src.helper import check_event_id
from helpers import *
from src.config import *

GLOBAL_ADMIN_ID = "1"

def create_booking(token, event_id, seat, ticketurl, payment_num, points_gained, points_used):

    if not check_event_id(int(event_id)):
        raise InputError(description="Event ID does not exist")
    
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    user_id = decode_token(token)["user_id"]

    if not deduct_point(user_id, int(points_used)):
        raise InputError(description="Insufficient point")

    if not seat_availability(seat, event_id):
        increase_point(user_id, int(points_used))
        raise InputError(description="Seat has already been booked")
    
    id = generate_booking_reference_number()
        
    try:
        find_tag_SQL = '''
            SELECT tags, price from event where id = %s
        '''
        cur.execute(find_tag_SQL, [event_id])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to find tags from event table:", error)
            raise DataBaseError(description=error)
        
    event_tag = cur.fetchone()
  
    music_count = 0
    sport_count = 0
    business_count = 0

    # Find if there is another booking already exist for this event
    try:
        find_dup_event_SQL = "SELECT * from bookings where event = %s AND customer = %s LIMIT 1"
        cur.execute(find_dup_event_SQL, (event_id, user_id))
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to find tags:", error)
            raise DataBaseError(description=error)
    
    booking = cur.fetchone()

    # If there is no other booking exist for this event, add a tag
    if not booking:
        if event_tag["tags"] == "music":
            music_count = 1
        elif event_tag["tags"] == "sport":
            sport_count = 1
        else:
            business_count = 1

    try:
        find_customer_tags_SQL = '''
            SELECT  music, sport, business, spending
            FROM    tags
            WHERE   customer = %s
        '''
        cur.execute(find_customer_tags_SQL, [user_id])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to find tags:", error)
            raise DataBaseError(description=error)
        
    user_tag = cur.fetchone()
    if user_tag:
        try:
            update_user_tag_SQL = '''
                UPDATE tags SET Music = %s, Sport = %s, Business = %s, spending = %s WHERE customer = %s
            '''
            cur.execute(update_user_tag_SQL, (int(user_tag["music"]) + music_count, int(user_tag["sport"]) + sport_count, int(user_tag["business"]) + business_count, float(user_tag["spending"]) + float(event_tag['price']), user_id))
            db.commit()
        except(Exception) as error:
            if (db):
                print("Failed to update tags:", error)
                raise DataBaseError(description=error)
    else:
        try:
            insert_tag_SQL = '''
                INSERT INTO tags 
                    (customer, music, sport, business, spending)
                VALUES
                    (%s, %s, %s, %s, %s)
            '''
            cur.execute(insert_tag_SQL, (user_id, music_count, sport_count, business_count, float(event_tag['price'])))
            db.commit()
        except(Exception) as error:
            if (db):
                print("Failed to insert tags:", error)
                raise DataBaseError(description=error)

    try:
        insert_SQL = '''
            INSERT INTO bookings (id, is_active, customer, event, seat, admin) 
            VALUES (%s, %s, %s, %s, %s, %s)
        '''
        booking_record = (id, True, user_id, event_id, seat, GLOBAL_ADMIN_ID)
        cur.execute(insert_SQL, booking_record)
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed to insert bookings:", error)
            raise DataBaseError(description=error)
        
    try:
        alloc_seat_SQL = '''
            INSERT INTO seats
                (id, is_booked, customer, event, admin)
            VALUES
                (%s, %s, %s, %s, %s)
        '''
        cur.execute(alloc_seat_SQL, (seat, True, user_id, event_id, GLOBAL_ADMIN_ID))
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to insert seat:", error)
            raise DataBaseError(description=error)

    increase_point(user_id, int(points_gained))
    ticket_email(user_id, id, event_id, ticketurl, payment_num)
    update_bades(user_id)

    return {
        'booking_id': id
    }

def update_booking(token, booking_id, seat):
    """
    Given token, booking id and updated seat, update (only) seat for customer

    Exceptions:
        InputError if booking id is invalid.

    Args:
        string: token
        string: booking_id
        string: seat

    Returns:

    """
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    user_id = decode_token(token)["user_id"]

    try:
        Find_Bid_SQL = "SELECT * FROM bookings WHERE id = %s AND customer = %s"
        cur.execute(Find_Bid_SQL, (booking_id, user_id))
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to find booking:", error)
            raise DataBaseError(description=error)
        
    booking = cur.fetchone()
    if not booking:
        raise InputError(description="Booking id not found")
    
    if not seat_availability(seat, booking["event"]):
        raise InputError(description="Seat has already been boooked")
    
    try:
        update_booking_SQL = "UPDATE bookings SET seat = %s WHERE id = %s"
        cur.execute(update_booking_SQL, (seat, booking_id))
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to update bookings:", error)
            raise DataBaseError(description=error)

    try:
        update_seat_SQL = "UPDATE seats SET id = %s WHERE id = %s AND event = %s AND customer = %s"
        cur.execute(update_seat_SQL, (seat, booking["seat"], booking["event"], user_id))
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to update seat:", error)
            raise DataBaseError(description=error)
    
    return {}

def uplook_booking(token):
    '''
    Check the booking history for a customer

    Exceptions:
        AccessError if token is invalid.

    Args:

    Returns:
        list of dict: 
            {
                "id": string,
                "is_active": boolean,
                "customer": string,
                "event": int,
                "seat": string,
                "admin": string
            },
    '''
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    user_id = decode_token(token)["user_id"]

    try:
        Find_Bid_SQL = "SELECT * FROM bookings WHERE customer = %s"
        cur.execute(Find_Bid_SQL, [user_id])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to find booking:", error)
            raise DataBaseError(description=error)
        
    bookings = cur.fetchall()
    
    row_headers = [x[0] for x in cur.description]
    json_list = []
    for count, result in enumerate(bookings):
        _data = dict(zip(row_headers, result))
        json_list.append(_data)

    return json_list

def remove_booking(token, user_id, booking_id):
    '''
    Remove a booking

    Exceptions:
        AccessError if token is invalid.
        InputError if booking id is invalid

    Args:
        token: string
        user_id: string
        booking_id: string

    Returns:
        list of dict: 
            {
                "id": string,
                "is_active": boolean,
                "customer": string,
                "event": int,
                "seat": string,
                "admin": string
            },
    '''
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    # user_id = decode_token(token)["user_id"]

    try:
        Find_Bid_SQL = "SELECT * FROM bookings WHERE customer = %s and id = %s"
        cur.execute(Find_Bid_SQL, (user_id, booking_id))
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to find booking:", error)
            raise DataBaseError(description=error)
        
    bookings = cur.fetchone()
    if not bookings:
        raise InputError(description="No booking found")
    
    print(bookings)
    seat = bookings['seat']
    event = bookings['event']
    
    try:
        delete_booking_SQL = '''
            DELETE FROM bookings WHERE id = %s
        '''
        cur.execute(delete_booking_SQL, [booking_id])
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed to delete booking:", error)
            raise DataBaseError(description=error)
        
    try:
        delete_seat_SQL = '''
            DELETE FROM seats WHERE event = %s and id = %s
        '''
        cur.execute(delete_seat_SQL, (event, seat))
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed to delete seat:", error)
            raise DataBaseError(description=error)
        
    try:
        Find_Bid_SQL = "SELECT card_details FROM customer WHERE id = %s"
        cur.execute(Find_Bid_SQL, [user_id])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to find booking:", error)
            raise DataBaseError(description=error)
        
    card_detail = cur.fetchone()
    payment_info = "Not Provided"
    if card_detail:
        payment_info = card_detail['card_details']
        
    refund_email(user_id, booking_id, event, payment_info)
        
    return {}

# Check seat availability for an event
def seat_availability(seat, event_id):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        find_seat_SQL = '''
            SELECT * FROM seats where id = %s AND event = %s
        '''
        cur.execute(find_seat_SQL, (seat, event_id))
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to find seat:", error)
            raise DataBaseError(description=error)
        
    DB_DATA = cur.fetchall()
    if DB_DATA:
        return False
    
    return True

