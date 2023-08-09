import psycopg2
import psycopg2.extras
from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, request
from flask_cors import CORS
from json import dumps, JSONEncoder
from decimal import Decimal
from src.config import *
from database.tables import * 
from helpers import *
from src.user import get_customer_profile, get_host_profile
from src.auth import auth_user_register, auth_user_login, auth_host_register, auth_host_login, auth_admin_login, auth_logout
from src.profile import *
from src.pass_reset import request_pass_reset_code, reset_password_in_db
from src.event import *
from src.event_lookup import uplook_id_event, uplook_all_event, uplook_date_event, uplook_fav_event, uplook_host_event, uplook_key_event, uplook_some_event, uplook_recent_created_event, uplook_recent_ended_event
from src.booking import create_booking, update_booking, uplook_booking, remove_booking
from src.channel import *
from src.badge import update_bades, get_customer_badge
from src.token import decode_token
from src.reminder import reminder_email_trigger

APP = Flask(__name__)
cors = CORS(APP)

# To add when database layout is confirmed
create_admin_table()
create_badge_enum_table()
create_tag_enum_table()
create_customer_table()
create_badges_table()
create_tags_table()
create_tokens_table()
create_host_table()
create_events_table()
create_seats_table()
create_bookings_table()
create_review_table()
create_reply_table()
install_extension()
create_index()

# Scheduler for reminder email
sched = BackgroundScheduler(daemon=True)
sched.add_job(reminder_email_trigger, 'interval', seconds=5)
sched.start()

### 0.0 Obtain a temporary code
@APP.route("/reset_code", methods=['POST'])
def get_temp_code():
    data = request.get_json()
    return dumps(request_pass_reset_code(data['email'], data['tablename']))

### 0.1 Resetting a customer's password
@APP.route("/customer/password", methods=['PUT'])
def reset_customer_password():
    data = request.get_json()
    return dumps(reset_password_in_db(data['email'], data['tablename'], data['new_password']))

### 0.2 Resetting a host's password
@APP.route("/host/password", methods=['PUT'])
def reset_host_password():
    data = request.get_json()
    return dumps(reset_password_in_db(data['new_password']))

### 1.1 Registers a new customer
@APP.route("/customer/register", methods=['POST'])
def add_new_customer():
    data = request.get_json()
    return dumps(auth_user_register(data['email'], data['first_name'], data['last_name'], data['password'], data['birthday']))

### 1.2 Logs an existing customer back in
@APP.route("/customer/login", methods=['POST'])
def login_existing_customer():
    data = request.get_json()
    return dumps(auth_user_login(data['email'], data['password']))

### 1.3 Logs an existing customer/host/admin out
@APP.route("/logout", methods=['POST'])
def logout_existing_customer():
    data = request.get_json()
    return dumps(auth_logout(data['token']))

### 1.4 Update an existing customer's details
@APP.route("/customer/update", methods=['PUT'])
def update_customer_info():
    data = request.get_json()
    return dumps(update_user_profile(data['token'], data['first_name'], data['last_name'], data['email'], data['password'], data['profile_picture'], data['card_details'], data['points']))

### 1.5 Delete an existing customer's details
@APP.route("/customer/delete", methods=['DELETE'])
def delete_customer_info():
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    return dumps(delete_customer_profile(token))

### 1.6 Returning customer table
@APP.route("/customer/profile/", methods=['GET'])
def get_customer_info():
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    customer_id = request.args.get('customer_id', '')
    return dumps(get_customer_profile(token, customer_id))

### 2.1 Adding a new host
@APP.route("/host/register", methods=['POST'])
def add_new_host():
    data = request.get_json()
    return dumps(auth_host_register(data['email'], data['name'], data['abn'], data['password']))

### 2.2 Logging an existing host in
@APP.route("/host/login", methods=['POST'])
def host_login():
    data = request.get_json()
    return dumps(auth_host_login(data['email'], data['password']))

### 2.3 Updating a host's details
@APP.route("/host/update", methods=['PUT'])
def update_host_info():
    data = request.get_json()
    return dumps(update_host_profile(data['token'], data['company_name'], data['company_number'], data['email'], data['password'], data['company_picture']))

### 2.4 Deleting a host from the database
@APP.route("/host/delete", methods=['DELETE'])
def delete_host_info():
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    return dumps(delete_host_profile(token))

### 2.5 Returning the host table
@APP.route("/host/profile/", methods=['GET'])
def get_host_info():
    # data = request.get_json()
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    host_id = request.args.get('host_id', '')
    return dumps(get_host_profile(token, host_id))

### 3.1 Adding a new admin
# @APP.route("/admin/register", methods=['POST'])
# def add_new_admin():
#     data = request.get_json()
#     return dumps(auth_admin_register(data['email'], data['first_name'], data['last_name'], data['password']))

### 3.2 Logging an existing admin in
@APP.route("/admin/login", methods=['POST'])
def admin_login():
    data = request.get_json()
    return dumps(auth_admin_login(data['email'], data['password']))

### 4.1 Adding a new event
@APP.route("/event", methods=['POST'])
def add_event():
    data = request.get_json()
    return dumps(create_event(data['token'], data['title'], data['description'], data['venue'], data['start_date'], data['end_date'], data['price'], data['num_tickets'], data['age_restriction'], data['tags'], data['event_image']))

### 4.2 Deleting an existing event
@APP.route("/event/", methods=['DELETE'])
def delete_event_wrapper():
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    event_id = request.args.get('event_id', '')
    return dumps(host_delete_event(token, event_id))

### 4.3 Updating an existing event
@APP.route("/event/update", methods=['PUT'])
def update_event():
    data = request.get_json()
    return dumps(update_event_detail(data['token'], data['event_id'], data['title'], data['description'], data['venue'], data['start_date'], data['end_date'], data['price'], data['num_tickets'], data['age_restriction'], data['tags'], data['event_image']))

class JSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return JSONEncoder.default(self, obj)
    
### 4.4.1 Get event detail (show every events, first-time user / prospective user)
@APP.route("/event/all", methods=['GET'])
def get_every_event_detail():
    return dumps(uplook_all_event(), cls=JSONEncoder)

### 4.4.2 Get event detail (Look at request.args.get first to see if your param is supported)
# Only one parameter each time!
@APP.route("/event/", methods=['GET'])
def get_key_event_detail():
    # Searching events with key word (title) (search bar)
    search_key_word = request.args.get('search', '')
    if search_key_word:
        return dumps(uplook_key_event(search_key_word), cls=JSONEncoder)
    # Searching events with event id 
    event_id = request.args.get('event_id', '')
    if event_id:
        return dumps(uplook_id_event(event_id), cls=JSONEncoder)
    # Searching events with host id (show host's events)
    host_id = request.args.get('host_id', '')
    if host_id:
        return dumps(uplook_host_event(host_id), cls=JSONEncoder)
    # Searching events with pagination (Show 9 events each page)
    start = request.args.get('start', '')
    if start:
        return dumps(uplook_some_event(start), cls=JSONEncoder)
    date = request.args.get('date', '')
    if date:
        return dumps(uplook_date_event(date), cls=JSONEncoder)
    
### 4.4.3 Get event detail (Only show recommended (highest tags amount based on booking history), for customer who has been some events)
@APP.route("/event/recommend", methods=['GET'])
def get_recommened_event_detail():
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    return dumps(uplook_fav_event(token), cls=JSONEncoder)

### 4.5.1 Add review for event
@APP.route("/event/review", methods=['POST'])
def add_event_reviews():
    data = request.get_json()
    return dumps(add_event_review(data['token'], data['message'], data['timestamp'], data['event_id'], data['rating']))

### 4.5.2 Get reviews for event
@APP.route("/event/review/", methods=['GET'])
def get_event_reviews():
    event_id = request.args.get('event_id', '')
    searchindex = request.args.get('search', '')
    return dumps(get_event_review(event_id, searchindex))

### 4.5.3 Add reply for reiew
@APP.route("/event/reply", methods=['POST'])
def add_event_replys():
    data = request.get_json()
    return dumps(add_review_reply(data['token'], data['review_id'], data['message'], data['timestamp'], data['event_id']))

### 4.6 Get available seat for event
@APP.route("/event/seat/", methods=['GET'])
def get_event_seat_wrapper():
    event_id = request.args.get('event_id', '')
    return dumps(get_event_seats(event_id))

### 5.1 Adding a booking
@APP.route("/booking", methods=['POST'])
def create_booking_detail():
    data = request.get_json()
    return dumps(create_booking(data['token'], data['event_id'], data['seat'], data['ticketurl'], data['payment_num'], data['points_gained'], data['points_used']))

### 5.2 Update a booking
@APP.route("/booking/update", methods=['PUT'])
def update_booking_detail():
    data = request.get_json()
    return dumps(update_booking(data['token'], data['booking_id'], data['seat']))

### 5.3 Get a booking
@APP.route("/booking/", methods=['GET'])
def get_booking_detail():
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    return dumps(uplook_booking(token))

### 5.4 Delete a booking
@APP.route("/booking/", methods=['DELETE'])
def remove_booking_detail():
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    user_id = decode_token(token)["user_id"]
    bookingid = request.args.get('booking_id', '')
    return dumps(remove_booking(token, user_id, bookingid))

### 6.1 Get Customer Channel Privilege
@APP.route("/channel/customer", methods=['GET'])
def channel_privilege():
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    return dumps(customer_channel(token))

### 6.2 Add Channel Message
@APP.route("/channel/message/send", methods=['POST'])
def channel_message_send():
    data = request.get_json()
    return dumps(message_send(data['token'], data['message'], data['timestamp'], data['badge_channel']))

### 6.3 Get Channel Message
@APP.route("/channel/message/get", methods=['GET'])
def channel_message_get():
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    channel = request.args.get('badge_channel', '')
    searchindex = request.args.get('search', '')
    return dumps(message_get(token, channel, searchindex))

### 7.1 Get User badge
@APP.route("/customer/badge/", methods=['GET'])
def customer_badge_get():
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    customer_id = request.args.get('customer_id', '')
    return dumps(get_customer_badge(token, customer_id))

@APP.route("/admin/customer_list", methods=['GET'])
def admin_get_all_customer():
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    return dumps(get_all_customer(token))

@APP.route("/admin/host_list", methods=['GET'])
def admin_get_all_host():
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    return dumps(get_all_host(token))

@APP.route("/customer/events/", methods=['GET'])
def get_customer_event_detail():
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    date = request.args.get('date', '')
    return dumps(uplook_customer_monthly_booking(token, date), cls=JSONEncoder)

@APP.route("/host/events/", methods=['GET'])
def get_host_event_detail():
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    date = request.args.get('date', '')
    host_id = request.args.get('host_id', '')
    return dumps(uplook_host_monthly_event(token, host_id, date), cls=JSONEncoder)

@APP.route("/event/recent/created/", methods=['GET'])
def get_recent_created_event_detail():
    searchindex = request.args.get('search', '')
    return dumps(uplook_recent_created_event(searchindex), cls=JSONEncoder)

@APP.route("/event/recent/ended/", methods=['GET'])
def get_recent_ended_event_detail():
    searchindex = request.args.get('search', '')
    return dumps(uplook_recent_ended_event(searchindex), cls=JSONEncoder)

@APP.route("/admin/customer/delete/", methods=['DELETE'])
def admin_delete_customer_info():
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    customer_id = request.args.get('customer_id', '')
    return dumps(admin_delete_customer(token, customer_id))

@APP.route("/admin/host/delete/", methods=['DELETE'])
def admin_delete_host_info():
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    host_id = request.args.get('host_id', '')
    return dumps(admin_delete_host(token, host_id))

@APP.route("/admin/event/delete/", methods=['DELETE'])
def admin_delete_event_wrapper():
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    event_id = request.args.get('event_id', '')
    return dumps(admin_delete_event(token, event_id))

## NF.1 Force update user badge (DEBUG ONLY, DO NOT USE THIS)
@APP.route("/customer/badge", methods=['PUT'])
def customer_badge_update():
    headers = request.headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]
    user_id = decode_token(token)["user_id"]

    return dumps(update_bades(user_id))

if __name__ == "__main__":
    APP.run(debug=True, port=backend_port) 
