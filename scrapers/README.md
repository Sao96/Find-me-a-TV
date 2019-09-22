# Scrapers & Database Communication

## Running the Scrapers

Each scraper for each store runs with the same flow.

1. Get request for "TV" page `x`
2. Scrape off all URL's to each TV
3. Process each product page one by one, append to TV list
4. loop back to first step with page `x+1`

Repeat this process until you end at the page you want to stop. The scrapers currently haven't been written to pick up the max number of pages, but generally, websites stay pretty consistent with the max numbers of pages to display. If it becomes the case a website isn't very consistent enough, this piece of information should be scraped as well from a basic search page.

## Implementation

### Shared Functions

Each scraper generally has the same functions shared amongst eachother:

`scrape_data()`: Performs a `GET` request to a passed in URL link. To handle bot protection/ filter, headers are faked using the `UserAgent` library. This general avoids the filters, as I haven't even ran into an issue since using the library to help generate a spoof header. Returns the downloaded file from the get request.

`get_num_only()`: Takes a string, and will truncate any part passed a numeric portion of it.

`add_null_vals()`: Unfortunately, many times, data retrieved will be missing some fields. To allow our data to be easily passed into our psql DB, we need to append the string 'NULL' to them.

### API For Stores

`scrape_store_tvs()`: Initial function that retrieves a list of all TV's for the entered page range.

`parse_product_links()`: Given a search query, pulls out the URL for each TV in search result and puts them into a list.

`process_urls()`: Given a list of URL's for the current website, returns a list of dict objects containing the desired information of each tv from the current searched page.

`process_product_page()`: Given a product web page, scrapes all desired information and returns a dict object containing all desired information.

Abstractly, the calls should look like this:

#### Call Order

This should almost always be the flow of function calls when developing this API for a particular store. In a short algorithmic format:

```
scrape_store_tvs():
    for each search page:

        product_links = parse_product_links(curr_search_page)
        process_urls(product_links):

            for each product link:
                get TV information from page, append to a list of tv's.
```

## Database Communication

The communication is pretty simple. Every TV's information can be written into a psql database by using the `psycopg2` library.

### API For PSQL DB Communication

Each function will always you require you pass in a dict object as the first argument that has the following fields: "host","database","user", "password", and "port". Note that "port" should be an integer, and the rest a string.

`create_tables()`: Creates the following schema for whatever store name you pass in:

```
CREATE TABLE $(store_name)(
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
```

`add_records()`: Adds TV records to a specified databases store table. The function expects a list of TV's, and parses them into a format possible to pass as a record value for the psql DB.
