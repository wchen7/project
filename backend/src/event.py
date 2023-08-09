from datetime import datetime, timedelta
import psycopg2
import psycopg2.extras
from src.error import InputError, AccessError, DataBaseError
from src.token import check_token, decode_token
from src.helper import check_event_id, check_host_id, check_admin_id
from src.point import increase_point
from src.booking import remove_booking
from src.event_helper import get_num_seat
from src.config import *
from src.custom import *
from helpers import *

GLOBAL_ADMIN_ID = "1"

# Create an event
def create_event(token, title, description, venue, start_date, end_date, price, num_tickets, age_restriction, tags, event_image):
    # Can check the start and end dates, prices, num_ticks and tags in frontend
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    user_id = decode_token(token)["user_id"]

    if not check_host_id(user_id):
        raise AccessError(description="Only host can create event")
    
    upper_title = str(title).upper()
    
    try:
        title_Check_SQL = "SELECT title FROM event"
        cur.execute(title_Check_SQL)
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed to check title:", error)
            raise DataBaseError(description=error)

    All_Events = cur.fetchall()

    for db_title in All_Events:
        if upper_title == db_title[0]:
            raise InputError(description="Title already exists")
        
    id = get_latest_id()

    # Add the new event
    try:
        insert_SQL = '''
            INSERT INTO event (id, title, description, venue, start_date, end_date, price, num_tickets, host, age_restriction, event_image, admin, tags) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        '''
        event_record = (id, upper_title, description, venue, start_date, end_date, price, num_tickets, user_id, age_restriction, event_image, GLOBAL_ADMIN_ID, tags)
        cur.execute(insert_SQL, event_record)
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed to insert event:", error)
            raise DataBaseError(description=error)
        
    return {
        "event_id": id
    }

# HOST: Remove an event
def host_delete_event(token, eventid):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    if not check_event_id(int(eventid)):
        raise InputError(description="Event ID does not exist")
    
    user_id = decode_token(token)["user_id"]

    try:
        find_event_host_SQL = "SELECT host FROM event WHERE id = %s"
        cur.execute(find_event_host_SQL, [eventid])
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed to find event:", error)
            raise DataBaseError(description=error)
        
    event_host = cur.fetchone()
    
    if user_id != event_host['host']:
        raise AccessError(description="insufficient permissions")
    
    remove_event(token, eventid)

    # if not check_host_id(user_id) and not check_admin_id(user_id):
    #     raise InputError(description="User does not have permission to delete this event!")

    return {}

# ADMIN: Remove an event
def admin_delete_event(token, eventid):
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    user_id = decode_token(token)["user_id"]

    if not check_admin_id(user_id):
        raise AccessError(description="insufficient permissions")
    
    remove_event(token, eventid)

    return {}

# HELPER FUNCTION: Remove an event
def remove_event(token, event_id):

    if not check_event_id(int(event_id)):
        raise InputError(description="Event ID does not exist")
    
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # Refund
    Refund_event(token, event_id)

    try:
        delete_SQL = '''
            DELETE FROM event WHERE id = %s
        '''
        cur.execute(delete_SQL, [event_id])
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed to delete event:", error)
            raise DataBaseError(description=error)
        
    return None

# Remove booking and refund
def Refund_event(token, event_id):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        find_event_bookings = '''
            SELECT  id, customer
            FROM    bookings
            WHERE   event = %s
        '''
        cur.execute(find_event_bookings, [event_id])
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed to delete event:", error)
            raise DataBaseError(description=error)
        
    bookings = cur.fetchall()
    for booking in bookings:
        remove_booking(token, booking['customer'], booking['id'])

    return None

# Update event 
def update_event_detail(token, eventid, title, description, venue, start_date, end_date, price, num_tickets, age_restriction, tags, event_image):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    user_id = decode_token(token)["user_id"]
    
    if not check_event_id(eventid):
        raise InputError(description="Event ID does not exist")

    try:
        Check_host_permission_SQL = "SELECT * FROM event where host = %s AND id = %s"
        cur.execute(Check_host_permission_SQL, [user_id, eventid])
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed to host permission:", error)
    
    _events = cur.fetchall()
    if not _events:
        raise AccessError(description="This user does not have permission to edit this event")
    
    try:
        update_event_SQL = '''
                UPDATE event
                SET
                    title = coalesce(%s, title),
                    description = coalesce(%s, description),
                    venue = coalesce(%s, venue),
                    start_date = coalesce(%s, start_date),
                    end_date = coalesce(%s, end_date),
                    price = coalesce(%s, price),
                    num_tickets = coalesce(%s, num_tickets),
                    age_restriction = coalesce(%s, age_restriction),
                    tags = coalesce(%s, tags),
                    event_image = coalesce(%s, event_image)
                WHERE id = %s
            '''
        
        cur.execute(update_event_SQL, (title, description, venue, start_date, end_date, price, num_tickets, age_restriction, tags, event_image, eventid))
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed update event:", error)
            raise DataBaseError(description=error)

    return {}

# CUSTOMER: add a review for an event
def add_event_review(token, message, timestamp, eventid, rating):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    if not check_event_id(int(eventid)):
        raise InputError(description="Event ID does not exist")
    
    customer_id = decode_token(token)["user_id"]

    review_id = generate_random_id()

    try:
        insert_review_SQL = '''
            INSERT INTO reviews (id, message, timestamp, customer, event, rating, admin) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        '''
        review_record = (review_id, message, timestamp, customer_id, eventid, rating, GLOBAL_ADMIN_ID)
        cur.execute(insert_review_SQL, review_record)
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed to insert review:", error)
            raise DataBaseError(description=error)
        
    increase_point(customer_id, REVIEW_POINT_GAINED)
        
    return {
        "review_id": review_id
    }

# Getting reviews for an event
def get_event_review(eventid, startpoint):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if not check_event_id(int(eventid)):
        raise InputError(description="Event ID does not exist")
    offset_startpoint = int(startpoint) - 1
    try:
        find_review_SQL = "SELECT id, message, timestamp, customer, rating FROM reviews WHERE event = %s ORDER BY timestamp DESC LIMIT %s OFFSET %s"
        cur.execute(find_review_SQL, (eventid, GET_REVIEW_COUNT, offset_startpoint * GET_REVIEW_COUNT))
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed to find review:", error)
            raise DataBaseError(description=error)
        
    review_data = cur.fetchall()
    row_headers = [x[0] for x in cur.description]
    json_list = []
    for result in review_data:
        _data = dict(zip(row_headers, result))
        _data['sender'], _data['profile_pic'] = get_customer_name(result['customer'])
        _data["reply"] = get_host_reply(result['id'])
        json_list.append(_data)

    return json_list

# Return list of available seat for an event
def get_event_seats(eventid):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if not check_event_id(int(eventid)):
        raise InputError(description="Event ID does not exist")
    
    try:
        find_event_SQL = "SELECT num_tickets FROM event WHERE id = %s"
        cur.execute(find_event_SQL, [eventid])
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed to find event:", error)
            raise DataBaseError(description=error)
        
    event_data = cur.fetchone()
    seat_row = event_data['num_tickets']
    seat_plan = set(str(x)+y for x in range(1, int(seat_row) + 1) for y in 'ABCDEFGHIJK')

    try:
        find_booked_seat_SQL = "SELECT id FROM seats WHERE event = %s"
        cur.execute(find_booked_seat_SQL, [eventid])
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed to find seats:", error)
            raise DataBaseError(description=error)

    BookedSeat_data = cur.fetchall()
    if len(BookedSeat_data) > 0:
        BookedSeat_list = set(d['id'] for d in BookedSeat_data)
    else:
        BookedSeat_list = set()
    
    available_seat_list = list(seat_plan - BookedSeat_list)

    return sorted(available_seat_list)

# HOST: Added a reply for a review
def add_review_reply(token, review_id, message, timestamp, eventid):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    host_id = decode_token(token)["user_id"]

    reply_id = generate_random_id()

    try:
        insert_review_SQL = '''
            INSERT INTO reply (id, message, timestamp, review, host, event, admin) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        '''
        review_record = (reply_id, message, timestamp, review_id, host_id, eventid, GLOBAL_ADMIN_ID)
        cur.execute(insert_review_SQL, review_record)
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed to insert reply:", error)
            raise DataBaseError(description=error)
        
    return {
        "reply_id": reply_id
    }

# Getting host's reply for a review
def get_host_reply(reviewid):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        find_reply_SQL = "SELECT id, message, timestamp, host FROM reply WHERE review = %s"
        cur.execute(find_reply_SQL, [reviewid])
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed to find reply:", error)
            raise DataBaseError(description=error)
    
    reply = cur.fetchone()
    if reply:
        row_headers = [x[0] for x in cur.description]
        _reply = dict(zip(row_headers, reply))

    return _reply if reply else {}

# Getting customer name and picture for review
def get_customer_name(customerid):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        Customer_data_SQL = "SELECT first_name, last_name, profile_picture FROM customer WHERE id = %s"
        cur.execute(Customer_data_SQL, [customerid])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to check customer table:", error)

    customer_name = cur.fetchone()
    customer_full_name = None
    customer_pic = None
    if customer_name:
        customer_full_name = customer_name["first_name"] + ' ' + customer_name["last_name"]
    
    if customer_name["profile_picture"]:
        customer_pic = customer_name["profile_picture"]

    return customer_full_name, customer_pic



