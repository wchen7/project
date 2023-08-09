import psycopg2
import psycopg2.extras
from src.error import InputError, AccessError, DataBaseError
from src.token import check_token, decode_token
from src.helper import *
from src.auth import auth_logout
from src.event import Refund_event, admin_delete_event
from src.config import *

def get_all_customer(token):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    user_id = decode_token(token)["user_id"]
    
    if not check_admin_id(user_id):
        raise AccessError(description="Invalid token")
    
    try:
        get_all_customer_SQL = "SELECT id, first_name, last_name FROM customer"
        cur.execute(get_all_customer_SQL, [])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed lookup customer:", error)

    customers_data = cur.fetchall()
    row_headers = [x[0] for x in cur.description]
    customer_list = []
    for count, result in enumerate(customers_data):
        customer = dict(zip(row_headers, result))
        customer_list.append(customer)
    
    return customer_list

def get_all_host(token):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    user_id = decode_token(token)["user_id"]
    
    if not check_admin_id(user_id):
        raise AccessError(description="Invalid token")
    
    try:
        get_all_host_SQL = "SELECT id, company_name, company_number FROM host"
        cur.execute(get_all_host_SQL, [])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed lookup host:", error)

    hosts_data = cur.fetchall()
    row_headers = [x[0] for x in cur.description]
    host_list = []
    for count, result in enumerate(hosts_data):
        host = dict(zip(row_headers, result))
        host_list.append(host)
    
    return host_list

def update_user_profile(token, first_name, last_name, email, password, profile_picture, card_details, points):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    user_id = decode_token(token)["user_id"]

    try:
        update_customer_SQL = '''
            UPDATE customer
            SET 
                first_name = coalesce(%s, first_name),
                last_name = coalesce(%s, last_name),
                email = coalesce(%s, email),
                password = coalesce(%s, password),
                profile_picture = coalesce(%s, profile_picture),
                card_details = coalesce(%s, card_details),
                points = coalesce(%s, points)
            WHERE id = %s
        '''

        cur.execute(update_customer_SQL, (first_name, last_name, email, password, profile_picture, card_details, points, user_id))
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed update customer:", error)


    return {}

def update_host_profile(token, company_name, company_number, email, password, company_picture):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    user_id = decode_token(token)["user_id"]
    
    if company_number and not (len(str(company_number)) == 10):
        raise InputError(description="Invalid company number")

    try:
        update_host_SQL = '''
                UPDATE host
                SET
                    company_name = coalesce(%s, company_name),
                    company_number = coalesce(%s, company_number),
                    email = coalesce(%s, email),
                    password = coalesce(%s, password),
                    company_picture = coalesce(%s, company_picture)
                WHERE id = %s
            '''
        
        cur.execute(update_host_SQL, (company_name, company_number, email, password, company_picture, user_id))
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed update host:", error)

    return {}


def delete_customer_profile(token):

    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    user_id = decode_token(token)["user_id"]

    remove_customer(user_id)
    auth_logout(token)

    return {}

def admin_delete_customer(token, customerid):
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    user_id = decode_token(token)["user_id"]
    
    if not check_admin_id(user_id):
        raise AccessError(description="insufficient permissions")
    
    remove_customer(customerid)
    
    return {}


def remove_customer(customer_id):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    if not check_customer_id(customer_id):
        raise InputError(description="Customer not found")

    try:
        # Remove customer from db
        Remove_customer_SQL = "DELETE FROM customer WHERE id = %s"
        cur.execute(Remove_customer_SQL, [customer_id])
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed delete customer:", error)

    return None

def delete_host_profile(token):
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    user_id = decode_token(token)["user_id"]

    remove_host(token, user_id)
    auth_logout(token)

    return {}

def admin_delete_host(token, hostid):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    user_id = decode_token(token)["user_id"]
    
    if not check_admin_id(user_id):
        raise AccessError(description="insufficient permissions")
    
    try:
        Get_Host_eventids = "SELECT id FROM event WHERE host = %s"
        cur.execute(Get_Host_eventids, [hostid])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed delete customer:", error)
    
    event_ids = cur.fetchall()
    for eventid in event_ids:
        admin_delete_event(token, eventid['id'])
    
    remove_host(token, hostid)
    
    return {}

def remove_host(token, host_id):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    if not check_host_id(host_id):
        raise InputError(description="Host not found")

    try:
        # Remove host from db
        Remove_host_SQL = "DELETE FROM host WHERE id = %s"
        cur.execute(Remove_host_SQL, [host_id])
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed delete host:", error)

    try:
        # Remove host events from db
        host_events_SQL = "SELECT id FROM event WHERE host = %s"
        cur.execute(host_events_SQL, [host_id])
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed delete host:", error)

    events_id = cur.fetchall()
    for event in events_id:
        Refund_event(token, event['id'])

    try:
        # Remove host events from db
        Remove_host_events_SQL = "DELETE FROM event WHERE host = %s"
        cur.execute(Remove_host_events_SQL, [host_id])
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed delete host:", error)
        
    return None

def uplook_customer_monthly_booking(token, datepoint):
    '''
    Check the booking history for a customer monthly

    Exceptions:
        AccessError if token is invalid.

    Args:

    Returns:
        list of dict: 
            {
                "id": string,
                "title": string,
                "description": string,
                "venue": string,
                "start_date": string,
                "end_date": string,
                "price": float,
                "num_tickets": int,
                "host": string,
                "age_restriction": int,
                "event_image": string,
                "admin": string,
                "tags": string,
                "is_active": boolean,
                "customer": string,
                "event": int,
                "seat": string
            },
    '''
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    user_id = decode_token(token)["user_id"]
    try:
        Past_event_booking_SQL = '''
            SELECT  * 
            FROM    event E
                JOIN Bookings B ON (B.event = E.id)
            WHERE   E.start_date ~ %s AND B.customer = %s
        '''
        cur.execute(Past_event_booking_SQL, (datepoint, user_id))
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to check event table:", error)
            raise DataBaseError(description=error)
        
    event_data = cur.fetchall()
    row_headers = [x[0] for x in cur.description]
    json_list = []
    for count, result in enumerate(event_data):
        _data = dict(zip(row_headers, result))
        json_list.append(_data)
    return json_list

def uplook_host_monthly_event(token, hostid, datepoint):
    '''
    Check the host events in monthly basis

    Exceptions:
        AccessError if token is invalid.

    Args:

    Returns:
        list of dict: 
            {
                "id": int,
                "title": string,
                "description": string,
                "venue": string,
                "start_date": string,
                "end_date": string,
                "price": float,
                "num_tickets": int,
                "host": string,
                "age_restriction": int,
                "event_image": string,
                "admin": string,
                "tags": string
            },
    '''
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    date = str(datepoint).strip('\"')
    try:
        Month_host_event_SQL = '''
            SELECT  * 
            FROM    event
            WHERE   start_date ~ %s AND host = %s
        '''
        cur.execute(Month_host_event_SQL, (date, hostid))
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to check event table:", error)
            raise DataBaseError(description=error)
        
    event_data = cur.fetchall()
    row_headers = [x[0] for x in cur.description]
    json_list = []
    for count, result in enumerate(event_data):
        _data = dict(zip(row_headers, result))
        json_list.append(_data)
    return json_list