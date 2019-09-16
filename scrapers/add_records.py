import psycopg2

def add_records(tvs: list, store: str):
    try:
        conn = psycopg2.connect(host = "ec2-54-235-86-101.compute-1.amazonaws.com", database = "dbv6tpm3c2j6bg", user="vxnzeehptioyeb", password = "e2ea07be01dd5c0f8963a5bc9d5ee51dd7f403fa2951c8ed5cc40adf5ccb7f20", port = 5432)
        print('successfully connected to DB')
        

        #run through each dict object in list, and extract the values in a proper tuple format for psql
        values = ','.join( ("('%s','%s',%s,%s,'%s',%s,'%s','%s','%s')"\
                    %(tv['model'], tv['brand'], tv['price'], tv['display_size'], tv['display_tech'], tv['ref_rate'], tv['resolution'], tv['thumb_url'], tv['product_url'] ) )\
                    for tv in tvs )
        
        curr = conn.cursor()
        curr.execute('INSERT INTO ' + store + ' VALUES' + values + ''' ON CONFLICT(model) DO NOTHING''')

        conn.commit()
        conn.close()
        curr.close()
        
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
