import psycop

#    Function that logs into a psql DB and adds a list of Ts
#    @tvs: a list of tv's with the correct fields defid
#    @store: the store the tv's came from
#    @login: a dict with all credentials filled out (expects "host","database","user", "password" )
def add_records(tvs: list, store: str, login: dict):
    try:
        conn = psycopg2.connect(login["host"] , login["database"], login["user"], login["password"], login["port"])
        print('successfully connected to DB')
        
        
        #run through each dict object in list, and extract the values in a proper tuple format for psql
        values = ','.join( ("('%s','%s',%s,%s,'%s',%s,'%s','%s','%s')"\
                    %(tv['model'], tv['brand'], tv['price'], tv['display_size'], tv['display_tech'], tv['ref_rate'], tv['resolution'], tv['thumb_url'], tv['product_url'] ) )\
                    for tv in tvs )
        print(values)

        curr = conn.cursor()
        curr.execute('INSERT INTO ' + store + ' VALUES' + values + ''' ON CONFLICT(model) DO NOTHING''')

        conn.commit()
        conn.close()
        curr.close()
        
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)