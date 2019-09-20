# Find-me-a-TV
Find Me a TV (FMaT) is a website that displays TV's from all around the web, giving users an easy way to search for TV's from all around the web. 

## General Usage
There are 3 major components that make FMaT work. Although touched on here, details on implementation are contained in a readme in each folder respectively.

### Web Scraper
All TV's are retrieved by web scraping. Each store has a special scraper written for it, but the pattern is generally the same. Load the search results page, grab the URL of each TV, then open each of them individually and scrape the meta infomration from them.

### Database
All scraped TV's are pushed into a PSQL database. The DB holds a record of a TV's model, price, brand, display size, technology, refresh rate, resolution, and a picture url as well as the actual link to the product page itself.

### Website
A simple react app that connects to the database and displays TV's with the option to form a search filter (custom query)

## Connecting the Components
The python web scrapers can be ran as frequent as you choose. They can be ran automatedly to help keep the TV database up to date. The web application can afterward read from the records in the database, and request queries to get TV's to display.

## Dependencies
* Node 
* NPM
* Python 3 & The following packages:
    *  fake_useragent
    *  psycopg2
    


Node & NPM should be a recent enough version to install and run all packages from `package.json` which can be found in both the psql query app and react web app.  
