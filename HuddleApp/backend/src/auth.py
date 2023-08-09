import re
import psycopg2
import psycopg2.extras
from src.error import InputError, AccessError
from src.config import *
from src.token import generate_token, store_token, check_token
from src.badge import update_bades
from helpers import *

regex = r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'
GLOBAL_ADMIN_ID = "1"


def auth_user_register(email, first_name, last_name, password, birthdate):
    """
    Given email, names, password, and birthdate, generates a new user id and session id (token)

    Exceptions:
        InputError if email, password, or the names are invalid.

    Args:
        string: email
        string: first_name
        string: last_name
        string: password
        date: birthdate

    Returns:
        Dictionary containing:
            'token': string
            'customer_id': string

    """
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    lowered_email = str(email).lower()

    if not re.match(regex, lowered_email):
        raise InputError(description="Invalid email")
    
    try:
        Email_Check_SQL = "SELECT email FROM customer"
        cur.execute(Email_Check_SQL)
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to check email:", error)
    
    All_Emails = cur.fetchall()

    for db_email in All_Emails:
        if lowered_email == db_email[0]:
            raise InputError(description="Duplicate email")

    user_id = generate_UUID()
    token = generate_token(user_id)
    store_token(token)

    try:
        insert_SQL = "INSERT INTO customer (id, first_name, last_name, email, password, birthday, points, admin) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        user_record = (user_id, first_name, last_name, lowered_email, password, birthdate, 0, GLOBAL_ADMIN_ID)
        cur.execute(insert_SQL, user_record)
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to insert customer:", error)
    finally:
        update_bades(user_id)
        return {
            'token': token,
            'customer_id': user_id,
        }
    
def auth_user_login(email, password):
    """
    Given email and password, gives user id and session id (token)

    Exceptions:
        InputError if email, password are invalid.

    Args:
        string: email
        string: password

    Returns:
        Dictionary containing:
            'token': string
            'customer_id: string

    """
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    lowered_email = str(email).lower()

    try:
        Get_user_SQL = "SELECT * FROM customer WHERE email = %s"
        cur.execute(Get_user_SQL, [lowered_email])
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed find customer:", error)

    DB_Data = cur.fetchone()
    if not DB_Data:
        raise InputError(description="Invalid email")
    if DB_Data["password"] != password:
        raise InputError(description="Incorrect password")
    
    user_id = DB_Data["id"]
    update_bades(user_id)
    token = generate_token(user_id)
    store_token(token)
    
    return {
        'token': token,
        'customer_id': user_id
    }

def auth_host_register(email, business_name, business_number, password):
    """
    Given email, business name, business number (currently abn) and password, generates a new user id and session id (token)

    Exceptions:
        InputError if email, password, or the names are invalid.

    Args:
        string: email
        string: first_name
        string: last_name
        string: password
        date: birthdate

    Returns:
        Dictionary containing:
            'token': string
            'host_id': string

    """
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    lowered_email = str(email).lower()
    if not re.match(regex, lowered_email):
        raise InputError(description="Invalid email")
    
    try:
        Email_Check_SQL = "SELECT email FROM host"
        cur.execute(Email_Check_SQL)
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to check email:", error)

    All_Emails = cur.fetchall()

    for db_email in All_Emails:
        if lowered_email == db_email[0]:
            raise InputError(description="Duplicate email")

    if len(str(business_number)) != 10:
        raise InputError(description="Invalid Business number")
    

    host_id = generate_UUID()
    token = generate_token(host_id)
    store_token(token)

    try:
        insert_SQL = "INSERT INTO host (id, company_name, company_number, email, password, admin) VALUES (%s, %s, %s, %s, %s, %s)"
        host_record = (host_id, business_name, business_number, lowered_email, password, GLOBAL_ADMIN_ID)
        cur.execute(insert_SQL, host_record)
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to insert host:", error)
    finally:
        return {
            'token': token,
            'host_id': host_id
        }
    
    
def auth_host_login(email, password):
    """
    Given email and password, gives host id and session id (token)

    Exceptions:
        InputError if email, password are invalid.

    Args:
        string: email
        string: password

    Returns:
        Dictionary containing:
            'token': string
            'host_id: string

    """
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    lowered_email = str(email).lower()

    try:
        Get_host_SQL = "SELECT * FROM host WHERE email = %s"
        cur.execute(Get_host_SQL, [lowered_email])
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed find host:", error)

    DB_Data = cur.fetchone()
    if not DB_Data:
        raise InputError(description="Invalid email")
    
    if DB_Data["password"] != password:
        raise InputError(description="Incorrect password")
    
    host_id = DB_Data["id"]
    token = generate_token(host_id)
    store_token(token)
    
    return {
        'token': token,
        'host_id': host_id
    }
    
def auth_admin_login(email, password):
    """
    Given email and password, gives user id and session id (token)

    Exceptions:
        InputError if email, password are invalid.

    Args:
        string: email
        string: password

    Returns:
        Dictionary containing:
            'token': string
            'admin_id: string

    """
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        Get_admin_SQL = "SELECT * FROM admin WHERE email = %s"
        cur.execute(Get_admin_SQL, [email])
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed find admin:", error)

    DB_Data = cur.fetchone()
    if not DB_Data:
        raise InputError(description="Invalid email")
    if DB_Data["password"] != password:
        raise InputError(description="Incorrect password")
    
    admin_id = DB_Data["id"]
    token = generate_token(admin_id)
    store_token(token)
    
    return {
        'token': token,
        'admin_id': admin_id
    }

def auth_logout(token):
    """
    Given a token, user (customer / host) logout the system. Remove token from database

    Exceptions:
        AccessError if token is invalid.

    Args:
        string: token

    """
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    try:
        Remove_token_SQL = "DELETE FROM token WHERE token = %s"
        cur.execute(Remove_token_SQL, [token])
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed delete token:", error)

    return {}


    

    



    
