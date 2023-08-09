import psycopg2
import psycopg2.extras
from src.error import InputError, AccessError, DataBaseError
from src.token import check_token, decode_token
from helpers import *
from src.custom import *
from src.config import *

# Check customer badges to see if they are allowed in a channel
def customer_channel(token):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    user_id = decode_token(token)["user_id"]

    try:
        find_customer_badge_SQL = "SELECT * FROM badges where customer = %s"
        cur.execute(find_customer_badge_SQL, [user_id])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to find badges:", error)
            raise DataBaseError(description=error)
        
    customer_badge = cur.fetchone()
    if customer_badge:
        row_headers = [x[0] for x in cur.description]
        _badge = dict(zip(row_headers, customer_badge))
    return _badge if customer_badge else {}

# Send message to channel and return message id
def message_send(token, message, timestamp, badgechannel):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    user_id = decode_token(token)["user_id"]

    if not check_channel_privilege(user_id, badgechannel):
        raise AccessError(description="Invalid channel privilege")

    message_id = generate_random_id()

    try:
        insert_message_SQL = '''
            INSERT INTO messages (id, customer, message, timestamp, badge_name) 
            VALUES (%s, %s, %s, %s, %s)
        '''
        message_record = (message_id, user_id, message, timestamp, badgechannel)
        cur.execute(insert_message_SQL, message_record)
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed to insert message:", error)
            raise DataBaseError(description=error)

    return {
        "message_id": message_id
    }

def message_get(token, badgechannel, search):
    """
    Given token, badge channel name and search page, get 20 channel messages each time per [search]

    Exceptions:
        AccessError if token is invalid.
        AccessError if customer does have the appropriate badge.

    Args:
        string: token
        string: badgechannel
        int: search

    Returns:
        list of dict:
        [
            {
                "id": int,
                "message": string,
                "timestamp": string,
                "full_name": string,
                "profile_picture": string,
                "customer": string,
                "big_spender": int,
                "music_maestro": int,
                "conference_connoisseur": int,
                "helpful_critic": int,
                "sports_fanatic": int
            }
        ]
    """
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    user_id = decode_token(token)["user_id"]

    if not check_channel_privilege(user_id, badgechannel):
        raise AccessError(description="Invalid channel privilege")
    
    try:
        find_channel_msg_SQL = '''
            SELECT  M.id, M.message, M.timestamp, CONCAT(C.first_name, ' ', C.last_name) AS full_name, C.profile_picture, B.*
            FROM    messages M
                JOIN customer C ON (C.id = M.customer)
                JOIN badges B ON (B.customer = M.customer)
            WHERE   M.badge_name = %s 
            ORDER BY M.timestamp DESC
            Limit %s OFFSET %s
            '''
        cur.execute(find_channel_msg_SQL, [badgechannel, GET_CHANNEL_MSG_COUNT, (int(search) - 1) * GET_CHANNEL_MSG_COUNT])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to find message:", error)
            raise DataBaseError(description=error)
        
    channel_msg = cur.fetchall()
    json_list = []
    row_headers = [x[0] for x in cur.description]
    for count, result in enumerate(channel_msg):
        _data = dict(zip(row_headers, result))
        json_list.append(_data)

    return json_list

# Return boolean whether customer is allowed in the channel
def check_channel_privilege(userid, channel):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        find_customer_badge_SQL = "SELECT * FROM badges where customer = %s"
        cur.execute(find_customer_badge_SQL, [userid])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to find badges:", error)
            raise DataBaseError(description=error)
        
    customer_badge = cur.fetchone()
    if customer_badge:
        if customer_badge[channel] > 0:
            return True
    
    return False
