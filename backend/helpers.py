import psycopg2
import psycopg2.extras
import random
import uuid
import string
import random
from src.config import *

def generate_random_id():
    id = random.randint(10, 999999)
    return id

def get_latest_id():
    id = 0
    try:
        # Connect to Database
        db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
        print("DEBUG: Connected to Database")

        cur = db.cursor()
        cur.execute("select NEXTVAL('event_id_seq')")
        id = cur.fetchone()[0]
        
        return int(id)

    except Exception as err:
        print("DEBUG: Failed Connect to Database", err)
        exit(1)

def generate_UUID():
    user_id = uuid.uuid4().hex
    
    return user_id

def generate_booking_reference_number():

    chars = string.ascii_lowercase + string.digits
    booking_number = ''.join(random.choice(chars) for i in range(12))

    try:
        # Connect to Database
        db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
        print("DEBUG: Connected to Database")

        cur = db.cursor()
        cur.execute("select id from bookings")
        result = cur.fetchall()
        for tuples in result:
            if booking_number in tuples:
                return generate_booking_reference_number()
            
        return booking_number
            
    except Exception as err:
        print("DEBUG: Failed Connect to Database", err)
        exit(1)
        
    