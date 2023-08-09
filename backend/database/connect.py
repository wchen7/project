import psycopg2
import psycopg2.extras
from src.config import *

'''

Database Details

'''

db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
