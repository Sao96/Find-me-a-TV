import psycopg2

#     function that initializes the tables for the TV's, based on where they were scraped from
#     @login: a dict with all credentials filled out (expects "host","database","user", "password" ) 
def create_tables(login: dict):
    commands = (
        """ CREATE TABLE AMAZON(
            model text PRIMARY KEY,
            brand text ,
            price float,
            display_size float,
            display_tech text,
            ref_rate float,
            resolution text,
            thumb_url text,
            product_url text
        );
        """,
        
        """ CREATE TABLE WALMART(
            model text PRIMARY KEY,
            brand text ,
            price float,
            display_size float,
            display_tech text,
            ref_rate float,
            resolution text,
            thumb_url text,
            product_url text
        );
        """)

    try:
        conn = psycopg2.connect(login["host"] , login["database"], login["user"], login["password"], login["port"])
        print('successfully connected to DB')
        cur = conn.cursor()

        for command in commands:
            cur.execute(command)

        conn.commit()
        conn.close()
        cur.close()
        
        
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)

    
    