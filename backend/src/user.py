import psycopg2
import psycopg2.extras
from src.error import InputError, AccessError
from src.token import check_token, decode_token
from src.helper import check_customer_id, check_host_id
from src.config import *

def get_customer_profile(token, customerid):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    if not check_customer_id(customerid):
        raise InputError(description="Invalid customer id")
    
    id_match = False
    token_userId = decode_token(token)['user_id']
    if (token_userId == customerid):
        id_match = True
    
    try:
        Customer_data_SQL = "SELECT * FROM customer where id = %s"
        cur.execute(Customer_data_SQL, [customerid])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to check table:", error)
        
    data = cur.fetchone()

    if data:
    
        birthdate = data["birthday"]

        pastevent = []
        try:
            Customer_data_event_SQL = '''
                SELECT event.id 
                FROM event
                JOIN bookings on event.id = bookings.event
                WHERE bookings.customer = %s
            '''
            cur.execute(Customer_data_event_SQL, [customerid])
            db.commit()
        except(Exception) as error:
            if (db):
                print("Failed to check event:", error)

        eventids = cur.fetchall()
        pastevent = []
        for row in eventids:
            pastevent.append(row["id"])

        pastevent = list(dict.fromkeys(pastevent))

    return {
        "customer_id": data['id'],
        "first_name": data["first_name"],
        "last_name": data["last_name"],
        "email": data["email"],
        "birthdate": "{:%Y-%m-%d}".format(birthdate),
        "profile_pic": data["profile_picture"],
        "card_details": data["card_details"],
        "points": data["points"],
        "events": pastevent,
        "is_user": id_match
    } if data else {}

def get_host_profile(token, hostid):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    if not check_host_id(hostid):
        raise InputError(description="Invalid host id")
    
    id_match = False
    token_userId = decode_token(token)['user_id']
    if (token_userId == hostid):
        id_match = True
    
    try:
        Host_data_SQL = "SELECT * FROM host where id = %s"
        cur.execute(Host_data_SQL, [hostid])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to check table:", error)

    host_data = cur.fetchone()
    
    return {
        "host_id": host_data['id'],
        "company_name": host_data['company_name'],
        "company_number": host_data['company_number'],
        "email": host_data['email'],
        "company_pic": host_data['company_picture'],
        "is_user": id_match
    } if host_data else {}
