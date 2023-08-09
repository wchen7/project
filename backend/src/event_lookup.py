from datetime import datetime
import psycopg2
import psycopg2.extras
from src.event_helper import get_num_seat, get_host_event_ids
from src.token import check_token, decode_token
from src.error import InputError, AccessError, DataBaseError
from src.config import *
from src.custom import *

def uplook_id_event(eventid):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        Event_data_SQL = "SELECT * FROM event where id = %s"
        cur.execute(Event_data_SQL, [eventid])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to check event table:", error)
            raise DataBaseError(description=error)
        
    event_data = cur.fetchone()
    if event_data:
        row_headers = [x[0] for x in cur.description]
        _event = dict(zip(row_headers, event_data))
        end = datetime.fromisoformat(str(event_data['end_date']).strip("Z"))
        dt_now = datetime.now()
        _event['seat_available'] = get_num_seat(eventid, event_data['num_tickets'])
        _event['is_active'] = False if dt_now > end else True

        try:
            host_data_SQL = "SELECT * FROM host where id = %s"
            cur.execute(host_data_SQL, [event_data['host']])
            db.commit()
        except(Exception) as error:
            if (db):
                print("Failed to check host table:", error)
                raise DataBaseError(description=error)
        host_data = cur.fetchone()
        _event['hostname'] = host_data['company_name']
        _event['host_picture'] = host_data['company_picture']


    return _event if event_data else {}

# Lookup every event in the database
def uplook_all_event():
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        Event_data_SQL = "SELECT * FROM event"
        cur.execute(Event_data_SQL, [])
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
        end = datetime.fromisoformat(str(result['end_date']).strip("Z"))
        dt_now = datetime.now()
        _data['is_active'] = False if dt_now > end else True
        _data['seat_available'] = get_num_seat(result['id'], result['num_tickets'])
        json_list.append(_data)

    return json_list

# Lookup some events with specific keyword in the title
def uplook_key_event(keyword):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        Key_event_data_SQL = "SELECT * FROM event WHERE title ILIKE concat('%%' || %s || '%%')"
        cur.execute(Key_event_data_SQL, [keyword])
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
        end = datetime.fromisoformat(str(result['end_date']).strip("Z"))
        dt_now = datetime.now()
        _data['is_active'] = False if dt_now > end else True
        _data['seat_available'] = get_num_seat(result['id'], result['num_tickets'])
        json_list.append(_data)

    return json_list

# Lookup events that is hosted by a specific host
def uplook_host_event(hostid):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        Event_data_SQL = "SELECT * FROM event where host = %s"
        cur.execute(Event_data_SQL, [hostid])
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
        end = datetime.fromisoformat(str(result['end_date']).strip("Z"))
        dt_now = datetime.now()
        if dt_now > end:
            continue
        else:
            _data['is_active'] = True
        _data['seat_available'] = get_num_seat(result['id'], result['num_tickets'])
        json_list.append(_data)

    return json_list

# Return events based on customer bookings and description (bookings in the past)
def uplook_fav_event(token):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    user_id = decode_token(token)["user_id"]
    event_ids = set()
    try:
        customer_to_host_SQL = '''
            SELECT  count(E.host), E.host 
            FROM    event E JOIN Bookings B ON (B.event = E.id) 
            WHERE   B.customer = %s
            GROUP BY E.host 
            ORDER BY count(E.host)
        '''
        cur.execute(customer_to_host_SQL, [user_id])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to check tags table:", error)
            raise DataBaseError(description=error)
        
    customer_host_fav = cur.fetchall()
    for count, result in enumerate(customer_host_fav):
        if int(result['count']) < CUSTOMER_SUB_HOST:
            break
        event_ids.update(get_host_event_ids(result['host']))

    # Finding description for booked events in customer bookings
    try:
        customer_booked_events_SQL = '''
            SELECT  DISTINCT E.description
            FROM    event E
                JOIN    bookings B ON (B.event = E.id)
            WHERE   B.customer = %s
        '''
        cur.execute(customer_booked_events_SQL, [user_id])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to check tags table:", error)
            raise DataBaseError(description=error)
        
    booked_event_desc = cur.fetchall()
    # Set similarity margin
    try:
        set_similarity_SQL = '''
            SELECT  set_limit(%s)
        '''
        cur.execute(set_similarity_SQL, [SIMILARITY_THRESHOLD])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to update similarity table:", error)
            raise DataBaseError(description=error)

    # List of event ids that have similar description
    for count, result in enumerate(booked_event_desc):
        try:
            find_similar_desc_SQL = '''
                SELECT  pg_catalog.similarity(description, %s) as similarity, E.id
                FROM    event E
                WHERE   E.description %% %s
            '''
            excute_tuples = (booked_event_desc[count][0], booked_event_desc[count][0])
            cur.execute(find_similar_desc_SQL, excute_tuples)
            db.commit()
        except(Exception) as error:
            if (db):
                print("Failed to check event table:", error)
                raise DataBaseError(description=error)

        events = cur.fetchall()
        for event in events:
            event_ids.add(event['id'])

    json_list = []
    for id in event_ids:
        try:
            Event_data_SQL = "SELECT * FROM event where id = %s"
            cur.execute(Event_data_SQL, [id])
            db.commit()
        except(Exception) as error:
            if (db):
                print("Failed to check event table:", error)
                raise DataBaseError(description=error)
            
        event_data = cur.fetchone()
        row_headers = [x[0] for x in cur.description]
        _event = dict(zip(row_headers, event_data))
        end = datetime.fromisoformat(str(event_data['end_date']).strip("Z"))
        dt_now = datetime.now()
        _event['is_active'] = False
        if dt_now > end:
            continue
        else:
            _event['is_active'] = True
        _event['seat_available'] = get_num_seat(id, event_data['num_tickets'])
        json_list.append(_event)

    return json_list

# Lookup some events (pagination)
def uplook_some_event(startpoint):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    offset_startpoint = int(startpoint) - 1

    try:
        Event_data_SQL = "SELECT * FROM event ORDER BY start_date DESC LIMIT %s OFFSET %s "
        cur.execute(Event_data_SQL, [9, offset_startpoint * 9])
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
        end = datetime.fromisoformat(str(result['end_date']).strip("Z"))
        dt_now = datetime.now()
        _data['is_active'] = False if dt_now > end else True
        _data['seat_available'] = get_num_seat(result['id'], result['num_tickets'])
        json_list.append(_data)

    return json_list

# Lookup some events in each month
def uplook_date_event(datepoint):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        Event_data_SQL = "SELECT * FROM event where start_date ~ %s"
        cur.execute(Event_data_SQL, [datepoint])
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
        end = datetime.fromisoformat(str(result['end_date']).strip("Z"))
        dt_now = datetime.now()
        _data['is_active'] = False if dt_now > end else True
        json_list.append(_data)

    return json_list

def uplook_recent_created_event(startpoint):
    '''
    Check event list sorted by id (created time) desc

    Exceptions:
        AccessError if token is invalid.

    Args:
        string: startpoint

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
                "tags": string,
                "is_active": boolean,
                "seat_available": int
            },
    '''
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    offset_startpoint = int(startpoint) - 1
    dt_now = datetime.now()
    today = str(dt_now.strftime("%Y-%m-%d %H:%M:%S"))
    try:
        Event_data_SQL = "SELECT * FROM event WHERE %s::date < end_date::date ORDER BY id DESC LIMIT %s OFFSET %s"
        cur.execute(Event_data_SQL, (today, 9, offset_startpoint * 9))
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
        end = datetime.fromisoformat(str(result['end_date']).strip("Z"))
       
        # print (dt_now, end)
        # if dt_now > end:
        #     continue
        # _data['is_active'] = False if dt_now > end else True
        _data['seat_available'] = get_num_seat(result['id'], result['num_tickets'])
        json_list.append(_data)

    return json_list

def uplook_recent_ended_event(startpoint):
    '''
    Check event list sorted by end_date desc

    Exceptions:
        AccessError if token is invalid.

    Args:
        string: startpoint

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
                "tags": string,
                "is_active": boolean,
                "seat_available": int
            },
    '''
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    offset_startpoint = int(startpoint) - 1
    try:
        Event_data_SQL = "SELECT * FROM event ORDER BY end_date DESC LIMIT %s OFFSET %s"
        cur.execute(Event_data_SQL, (9, offset_startpoint * 9))
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
        end = datetime.fromisoformat(str(result['end_date']).strip("Z"))
        dt_now = datetime.now()
        if dt_now < end:
            continue
        _data['seat_available'] = get_num_seat(result['id'], result['num_tickets'])
        json_list.append(_data)

    return json_list