import psycopg2
import psycopg2.extras
from src.error import InputError, AccessError, DataBaseError
from src.token import check_token, decode_token
from src.custom import *
from src.config import *


def update_bades(user_id):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    music_tier, sport_tier, business_tier, spend_tier = update_event_tier(user_id)
    review_tier = update_review_tier(user_id)
        
    try:
        find_badge_SQL = "SELECT * FROM badges where customer = %s"
        cur.execute(find_badge_SQL, [user_id])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to find badge:", error)
            raise DataBaseError(description=error)
        
    _badge = cur.fetchone()
    if _badge:
        try:
            update_badge_SQL = '''
                UPDATE badges 
                SET 
                    big_spender = %s, 
                    music_maestro = %s, 
                    conference_connoisseur = %s, 
                    helpful_critic = %s, 
                    sports_fanatic = %s 
                WHERE customer = %s
            '''
            cur.execute(update_badge_SQL, (spend_tier, music_tier, business_tier, review_tier, sport_tier, user_id))
            db.commit()
        except(Exception) as error:
            if (db):
                print("Failed to update badge:", error)
                raise DataBaseError(description=error)
    else:
        try:
            insert_badge_SQL = '''
                INSERT INTO badges (customer, big_spender, music_maestro, conference_connoisseur, helpful_critic, sports_fanatic)
                VALUES (%s, %s, %s, %s, %s, %s)
            '''
            cur.execute(insert_badge_SQL, (user_id, spend_tier, music_tier, business_tier, review_tier, sport_tier))
            db.commit()
        except(Exception) as error:
            if (db):
                print("Failed to insert badge:", error)
                raise DataBaseError(description=error)

    return None

def get_customer_badge(token, user_id):
    """
    Given token, get (only) customer owned badges

    Exceptions:
        AccessError if token is invalid.

    Args:
        string: token

    Returns:
        {
            "customer": char,
            "big_spender": int,
            "music_maestro": int,
            "conference_connoisseur": int,
            "helpful_critic": int,
            "sports_fanatic": int
        }
        OR (if customer doesn't have any badge)
        {}
    """
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    if not check_token(token):
        raise AccessError(description="Invalid token")
    
    is_user = False
    token_user_id = decode_token(token)["user_id"]

    if (token_user_id == user_id):
        is_user = True

    try:
        find_badge_SQL = '''
            SELECT * FROM badges WHERE customer = %s
        '''
        cur.execute(find_badge_SQL, [user_id])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to find badge:", error)
            raise DataBaseError(description=error)
        
    customer_badge = cur.fetchone()
    if customer_badge:
        row_headers = [x[0] for x in cur.description]
        _badge = dict(zip(row_headers, customer_badge))
        _badge['is_user'] = is_user

    return _badge if customer_badge else {}

# update customer badges depending on their booking records
def update_event_tier(user_id):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    music_tier = 0
    sport_tier = 0
    business_tier = 0
    spend_tier = 0

    try:
        find_customer_tags_SQL = '''
            SELECT music, sport, business, spending
            FROM tags
            WHERE customer = %s
        '''
        cur.execute(find_customer_tags_SQL, [user_id])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to find tags:", error)
            raise DataBaseError(description=error)

    user_tag = cur.fetchone()
    if user_tag:
        music_event_count = user_tag['music']
        sport_event_count = user_tag['sport']
        business_event_count = user_tag['business']
        spend_total = user_tag['spending']
    else:
        music_event_count = 0
        sport_event_count = 0
        business_event_count = 0
        spend_total = 0

    if (music_event_count + sport_event_count + business_event_count + spend_total) > 0:
        if music_event_count >= MM_TIER3:
            music_tier = 3
        elif music_event_count >= MM_TIER2:
            music_tier = 2
        elif music_event_count >= MM_TIER1:
            music_tier = 1

        if sport_event_count >= SF_TIER3:
            sport_tier = 3
        elif sport_event_count >= SF_TIER2:
            sport_tier = 2
        elif sport_event_count >= SF_TIER1:
            sport_tier = 1

        if business_event_count >= CC_TIER3:
            business_tier = 3
        elif business_event_count >= CC_TIER2:
            business_tier = 2
        elif business_event_count >= CC_TIER1:
            business_tier = 1
        
        if spend_total > BIGS_TIER3:
            spend_tier = 3
        elif spend_total > BIGS_TIER2:
            spend_tier = 2
        elif spend_total > BIGS_TIER1:
            spend_tier = 1

    return music_tier, sport_tier, business_tier, spend_tier

# update customer badges depending on their number of reviews
def update_review_tier(user_id):
    db = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_POST)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    review_tier = 0
    try:
        find_customer_tags_SQL = '''
            SELECT COALESCE(COUNT(id), 0)
            FROM reviews
            WHERE customer = %s
        '''
        cur.execute(find_customer_tags_SQL, [user_id])
        db.commit()
    except(Exception) as error:
        if (db):
            print("Failed to find tags:", error)
            raise DataBaseError(description=error)
    
    reviews = cur.fetchone()
    reviews_count = reviews['coalesce']

    if reviews_count >= HC_TIER3:
        review_tier = 3
    elif reviews_count >= HC_TIER2:
        review_tier = 2
    elif reviews_count >= HC_TIER1:
        review_tier = 1

    return review_tier
