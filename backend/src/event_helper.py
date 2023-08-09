import psycopg2
import psycopg2.extras
from src.error import DataBaseError
from src.config import *

# Get number of seat available for an event
def get_num_seat(eventid, seat_row):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    seat_plan = set(str(x)+y for x in range(1, int(seat_row) + 1) for y in 'ABCDEFGHIJK')

    try:
        find_booked_seat_SQL = "SELECT id FROM seats WHERE event = %s"
        cur.execute(find_booked_seat_SQL, [eventid])
        db.commit()

    except(Exception) as error:
        if (db):
            print("Failed to find seats:", error)
            raise DataBaseError(description=error)

    BookedSeat_data = cur.fetchall()
    if len(BookedSeat_data) > 0:
        BookedSeat_list = set(d['id'] for d in BookedSeat_data)
    else:
        BookedSeat_list = set()
    
    num_seat = len(seat_plan - BookedSeat_list)
    return num_seat

def get_host_event_ids(hostid):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        Customer_data_SQL = "SELECT id FROM event WHERE host = %s"
        cur.execute(Customer_data_SQL, [hostid])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to check event table:", error)

    event_ids = cur.fetchall()
    events = []
    for event in event_ids:
        events.append(event['id'])
    return events