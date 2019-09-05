import psycopg2

def create_tables():
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
            model text,
            brand text PRIMARY KEY,
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
        conn = psycopg2.connect(host = "ec2-54-235-86-101.compute-1.amazonaws.com", database = "dbv6tpm3c2j6bg", user="vxnzeehptioyeb", password = "e2ea07be01dd5c0f8963a5bc9d5ee51dd7f403fa2951c8ed5cc40adf5ccb7f20", port = 5432)
        print('successfully connected to ')
        cur = conn.cursor()

        for command in commands:
            cur.execute(command)

        conn.commit()
        conn.close()
        cur.close()
        
        
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)

    
    