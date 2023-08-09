import psycopg2
import psycopg2.extras
from src.config import *

def check_customer_id(customerid):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        Email_Check_SQL = "SELECT id FROM customer"
        cur.execute(Email_Check_SQL)
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to check customer:", error)

    ALL_customer = cur.fetchall()

    for db_customer in ALL_customer:
        if customerid == db_customer['id']:
            return True
    
    return False

def check_host_id(hostid):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        Email_Check_SQL = "SELECT id FROM host"
        cur.execute(Email_Check_SQL)
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to check host:", error)

    ALL_host = cur.fetchall()

    for db_host in ALL_host:
        if hostid == db_host['id']:
            return True
    
    return False

def check_admin_id(adminid):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        Email_Check_SQL = "SELECT id FROM admin"
        cur.execute(Email_Check_SQL)
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to check admin:", error)

    ALL_admin = cur.fetchall()

    for db_admin in ALL_admin:
        if adminid == db_admin['id']:
            return True
    
    return False

def check_event_id(eventid):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        Check_SQL = "SELECT id FROM event"
        cur.execute(Check_SQL)
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to check event:", error)

    ALL_event = cur.fetchall()

    for db_event in ALL_event:
        if eventid == db_event['id']:
            return True
    
    return False
