import psycopg2
import psycopg2.extras
from src.error import DataBaseError
from src.config import *

def deduct_point(customerid, point):
    if point == 0:
        return True
    
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    # Find points available in the customer account
    try:
        find_customer_SQL = '''
            SELECT points FROM customer where id = %s
        '''
        cur.execute(find_customer_SQL, [customerid])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to find customer:", error)
            raise DataBaseError(description=error)
        
    customer_point = cur.fetchone()
    # Check if points available are enough to deduct
    if customer_point:
        point_available = int(customer_point['points'])
    else:
        return False

    if point <= point_available:
        # Deduct point in customer account
        deducted_point = point_available - point
        try:
            update_customer_SQL = '''
                UPDATE  customer
                SET
                    points = %s
                WHERE   id = %s
            '''
            cur.execute(update_customer_SQL, (deducted_point, customerid))
            db.commit()
        except(Exception) as error:
            if (db):
                print("Failed to update customer:", error)
                raise DataBaseError(description=error)
            
        return True    
    
    return False

def increase_point(customerid, point):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # Find points available in the customer account
    try:
        find_customer_SQL = '''
            SELECT points FROM customer where id = %s
        '''
        cur.execute(find_customer_SQL, [customerid])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to find customer:", error)
            raise DataBaseError(description=error)
        
    customer_point = cur.fetchone()
    point_available = int(customer_point['points'])

    # Update customer points
    Increased_point = point_available + point
    try:
        update_customer_SQL = '''
            UPDATE  customer
            SET
                points = %s
            WHERE   id = %s
        '''
        cur.execute(update_customer_SQL, (Increased_point, customerid))
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to update customer:", error)
            raise DataBaseError(description=error)