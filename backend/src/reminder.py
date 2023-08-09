from datetime import timedelta
from datetime import datetime
from datetime import timedelta
import pytz
from src.config import *
import psycopg2
import psycopg2.extras
from src.email import reminder_email

  
###############################################
############## DEFINING HELPERS ###############
###############################################

# Get's the time in AEST timezone
def aus_time_now():
  return datetime.now(tz=pytz.timezone('Australia/Sydney'))

# Given a date returns the date of next week in YYYY-MM-DD format
def date_next_week(inp_date):
  next_week = inp_date + timedelta(days= 7)
  return next_week.strftime("%Y-%m-%d")


###############################################
############## CHECKING DATABASE ##############
##############  & SENDING EMAIL  ##############
###############################################
def reminder_email_trigger():
  db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
  cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

  try:
      Get_bookings_SQL = '''SELECT bookings.id
          FROM bookings
          JOIN event on bookings.event = event.id
          WHERE start_date ~ %s'''
      cur.execute(Get_bookings_SQL, [date_next_week(aus_time_now())])
      db.commit()
  except(Exception) as error:
      if (db):
          print("No events to remind:", error)
  booking_ids = cur.fetchall()

  for booking in booking_ids:
      reminder_email(booking["id"])