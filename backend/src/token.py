import jwt
import uuid
import psycopg2
import psycopg2.extras
from src.config import *

SECRET = '3900W14B!customer'

def generate_token(user_id):
    """
    Given user id (customer / host), generate a token (always different)

    """

    session_id = uuid.uuid4().hex

    payload = {
        'user_id': user_id, 
        'session_id': session_id
    }
    token = jwt.encode(payload, SECRET, algorithm='HS256')

    return token


def decode_token(token):

    return jwt.decode(token, SECRET, algorithms=['HS256'])

# Check if token is in the database
def check_token(token):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        Get_token_SQL = "SELECT * FROM token WHERE token = %s"
        cur.execute(Get_token_SQL, [token])
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed find token:", error)

    DB_Data = cur.fetchone()
    if not DB_Data:
        return False
    
    return True

# Store token in the database
def store_token(token):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        Store_token_SQL = "INSERT INTO token (token) VALUES (%s)"
        cur.execute(Store_token_SQL, [token])
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed insert token:", error)

