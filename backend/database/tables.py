import psycopg2
import psycopg2.extras
from src.config import *

'''
Database Details

'''

def create_customer_table():
    try:
        # Connect to Database
        db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
        print("DEBUG: Connected to Database")

        cur = db.cursor()
        new_customer_table_query = '''
            Create table if not exists Customer (
                id VARCHAR(32) NOT NULL UNIQUE,
                first_name VARCHAR(256) NOT NULL,
                last_name VARCHAR(256) NOT NULL,
                email text NOT NULL UNIQUE,
                password text NOT NULL,
                birthday date NOT NULL,
                profile_picture text,
                card_details VARCHAR(256),
                points integer,
                admin VARCHAR(2) References admin(id),
                PRIMARY KEY(id, admin)
            );
        '''
        cur.execute(new_customer_table_query)
        db.commit()
        print("Customer table added to database.")

    except Exception as err:
        print("DEBUG: Failed Connect to Database", err)
        exit(1)

def create_host_table():
    try:
        # Connect to Database
        db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
        print("DEBUG: Connected to Database")

        cur = db.cursor()
        new_host_table_query = '''
            Create table if not exists Host (
                id VARCHAR(32) NOT NULL UNIQUE,
                company_name VARCHAR(256) NOT NULL,
                company_number bigint NOT NULL,
                email text NOT NULL UNIQUE,
                password text NOT NULL,
                company_picture text,
                admin VARCHAR(2) References admin(id),
                PRIMARY KEY(id, admin)
            );
        '''
        cur.execute(new_host_table_query)
        db.commit()
        print("Host table added to database.")

    except Exception as err:
        print("DEBUG: Failed Connect to Database", err)
        exit(1)

def create_admin_table():
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor()
    print("DEBUG: Connected to Database")

    try:
        # Connect to Database
        # db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
        # print("DEBUG: Connected to Database")

        # cur = db.cursor()
        new_admin_table_query = '''
            Create table if not exists Admin (
                id VARCHAR(2) NOT NULL UNIQUE,
                first_name VARCHAR(256) NOT NULL,
                last_name VARCHAR(256) NOT NULL,
                email text NOT NULL UNIQUE,
                password text NOT NULL,
                PRIMARY KEY(id)
            );
        '''
        cur.execute(new_admin_table_query)
        db.commit()
        print("Admin table added to database.")

    except Exception as err:
        print("DEBUG: Failed Connect to Database", err)
        exit(1)

    try:
        insert_admin = "INSERT INTO admin (id, first_name, last_name, email, password) VALUES (%s, %s, %s, %s, %s) ON CONFLICT (id) DO NOTHING"
        cur.execute(insert_admin, ("1", "admin", "admin", "admin@admin.com", "admin"))
        db.commit()
    except Exception as err:
        print("DEBUG: Failed Connect to Database", err)
        exit(1)

def create_events_table():
    try:
        # Connect to Database
        db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
        print("DEBUG: Connected to Database")

        cur = db.cursor()
        new_events_table_query = '''
            Create table if not exists Event (
                id SERIAL NOT NULL UNIQUE,
                title text NOT NULL UNIQUE,
                description text NOT NULL,
                venue VARCHAR(256) NOT NULL,
                start_date VARCHAR(30) NOT NULL,
                end_date VARCHAR(30) NOT NULL, 
                price Numeric(5,2) NOT NULL,
                num_tickets Integer NOT NULL,
                host VARCHAR(32) References host(id),
                age_restriction Integer NOT NULL,
                event_image text,
                admin VARCHAR(2) References admin(id),
                tags event_tag,
                PRIMARY KEY(id, host, admin)
            );
        '''
        cur.execute(new_events_table_query)
        db.commit()
        
        print("Events table added to database.")

    except Exception as err:
        print("DEBUG: Failed Connect to Database", err)
        exit(1)

def create_seats_table():
    try:
        # Connect to Database
        db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
        print("DEBUG: Connected to Database")

        cur = db.cursor()
        new_seats_table_query = '''
            Create table if not exists Seats (
                id VARCHAR(3) NOT NULL, 
                is_booked BOOLEAN,
                customer VARCHAR(32) references customer(id) ON DELETE CASCADE,
                event Integer References event(id) ON DELETE CASCADE,
                admin VARCHAR(2) References admin(id),
                PRIMARY KEY(customer, event, admin, id)
            );
        '''
        cur.execute(new_seats_table_query)
        db.commit()
        print("Seats table added to database.")

    except Exception as err:
        print("DEBUG: Failed Connect to Database", err)
        exit(1)
        
def create_bookings_table():
    try:
        # Connect to Database
        db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
        print("DEBUG: Connected to Database")

        cur = db.cursor()
        new_bookings_table_query = '''
            Create table if not exists Bookings (
                id VARCHAR(12) NOT NULL UNIQUE,
                is_active BOOLEAN NOT NULL,
                customer VARCHAR(32) References customer(id) ON DELETE CASCADE,
                event Integer References event(id),
                seat VARCHAR(3),
                admin VARCHAR(2) References admin(id),
                PRIMARY KEY(id, customer, event, admin)
            );
        '''
        cur.execute(new_bookings_table_query)
        db.commit()
        print("Bookings table added to database.")

    except Exception as err:
        print("DEBUG: Failed Connect to Database", err)
        exit(1)

def create_review_table():
    try:
        # Connect to Database
        db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
        print("DEBUG: Connected to Database")

        cur = db.cursor()
        new_reviews_table_query = '''
            Create table if not exists Reviews (
                id Integer NOT NULL UNIQUE,
                message text NOT NULL,
                timestamp text NOT NULL,
                customer VARCHAR(32),
                event Integer References event(id) ON DELETE CASCADE,
                admin VARCHAR(2) References admin(id),
                rating Integer check (rating between 0 and 5),
                PRIMARY KEY(id, event, admin)
            );
        '''
        cur.execute(new_reviews_table_query)
        db.commit()
        print("Review table added to database.")

    except Exception as err:
        print("DEBUG: Failed Connect to Database", err)
        exit(1)

def create_reply_table():
    try:
        # Connect to Database
        db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
        print("DEBUG: Connected to Database")

        cur = db.cursor()
        new_reviews_table_query = '''
            Create table if not exists Reply (
                id Integer NOT NULL UNIQUE,
                message text NOT NULL,
                timestamp text NOT NULL,
                review Integer NOT NULL,
                host VARCHAR(32),
                event Integer References event(id) ON DELETE CASCADE,
                admin VARCHAR(2) References admin(id),
                PRIMARY KEY(id, event, review, admin)
            );
        '''
        cur.execute(new_reviews_table_query)
        db.commit()
        print("Reply table added to database.")

    except Exception as err:
        print("DEBUG: Failed Connect to Database", err)
        exit(1)

def create_badge_enum_table():
    try:
        # Connect to Database
        db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
        print("DEBUG: Connected to Database")

        cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
        # drop_enum_tag = '''
        #     drop type if exists user_badges cascade;
        # '''
        new_enum_tag = '''
            create type user_badges as enum (
                'big_spender', 
                'music_maestro', 
                'conference_connoisseur', 
                'helpful_critic', 
                'sports_fanatic'
            );
        '''
        check_enum_exist = "select exists (select 1 from pg_type where typname = 'user_badges')"
        cur.execute(check_enum_exist)
        db.commit()
        enum_check = cur.fetchone()
        print("is user_badges exist?" + str(enum_check["exists"]))
        # cur.execute(drop_enum_tag)
        if not enum_check["exists"]:
            cur.execute(new_enum_tag)
            db.commit()
        print("Badges type added to database.")

    except Exception as err:
        print("DEBUG: Failed Connect to Database (badge)", err)
        exit(1)


def create_tag_enum_table():
    try:
        # Connect to Database
        db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
        print("DEBUG: Connected to Database")

        cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
        drop_enum_tag = '''
            drop type if exists event_tag cascade;
        '''
        new_enum_tag = '''
            create type event_tag as enum ('music', 'sport', 'business');
        '''

        check_enum_exist = "select exists (select 1 from pg_type where typname = 'event_tag')"
        cur.execute(check_enum_exist)
        db.commit()
        enum_check = cur.fetchone()
        print("is event_tag exist?" + str(enum_check["exists"]))
        if not enum_check["exists"]:
            cur.execute(new_enum_tag)
            db.commit()
        # cur.execute(drop_enum_tag)

        print("Tags type added to database.")

    except Exception as err:
        print("DEBUG: Failed Connect to Database", err)
        exit(1)

def create_tags_table():
    try:
        # Connect to Database
        db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
        print("DEBUG: Connected to Database")

        cur = db.cursor()
        new_tags_table_query = '''
            Create table if not exists Tags (
                customer VARCHAR(32) references customer(id) ON DELETE CASCADE,
                Music Integer,
                Sport  Integer,
                Business Integer,
                spending Numeric(6,2),
                PRIMARY KEY(customer) 
            );
        '''
        cur.execute(new_tags_table_query)
        db.commit()
        print("Tags table added to database.")

    except Exception as err:
        print("DEBUG: Failed Connect to Database", err)
        exit(1)

def create_badges_table():
    try:
        # Connect to Database
        db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
        print("DEBUG: Connected to Database")

        cur = db.cursor()
        new_badges_table_query = '''
            Create table if not exists Badges (
                customer VARCHAR(32) references customer(id) ON DELETE CASCADE,
                big_spender Integer,
                music_maestro Integer,
                conference_connoisseur Integer,
                helpful_critic Integer,
                sports_fanatic Integer,
                PRIMARY KEY(customer) 
            );
        '''
        new_messages = '''
            Create table if not exists Messages (
                id Integer NOT NULL UNIQUE,
                customer VARCHAR(32),
                message text,
                timestamp text,
                badge_name user_badges
            );
        '''

        cur.execute(new_badges_table_query)
        cur.execute(new_messages)
        db.commit()

        print("Badges table added to database.")

    except Exception as err:
        print("DEBUG: Failed Connect to Database", err)
        exit(1)

def create_tokens_table():
    try:
        # Connect to Database
        db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
        print("DEBUG: Connected to Database")

        cur = db.cursor()
        new_tokens_table_query = '''
            Create table if not exists token (
                token text
            );
        '''
        cur.execute(new_tokens_table_query)
        db.commit()
        print("Token table added to database.")

    except Exception as err:
        print("DEBUG: Failed Connect to Database", err)
        exit(1)

# For recommendation

def install_extension():
    try:
        # Connect to Database
        db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
        print("DEBUG: Connected to Database")

        cur = db.cursor()
        pg_trgm_query = '''
            CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA pg_catalog;
        '''
        cur.execute(pg_trgm_query)
        db.commit()
        print("EXTENSION: pg_trgm added to database.")

        cur = db.cursor()
        btree_gist_query = '''
            CREATE EXTENSION IF NOT EXISTS btree_gist SCHEMA pg_catalog;
        '''
        cur.execute(btree_gist_query)
        db.commit()
        print("EXTENSION: btree_gist added to database.")

    except Exception as err:
        print("DEBUG: Failed Connect to Database", err)
        exit(1)

def create_index():
    try:
        # Connect to Database
        db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
        print("DEBUG: Connected to Database")

        cur = db.cursor()
        event_index_desc_query = '''
            CREATE INDEX ON event USING GIST (description, id);
        '''
        cur.execute(event_index_desc_query)
        db.commit()
        print("Index added to database.")

    except Exception as err:
        print("DEBUG: Failed Connect to Database", err)
        exit(1)