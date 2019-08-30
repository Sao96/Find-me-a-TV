#!/usr/bin/env python3
import requests
import time
from fake_useragent import UserAgent

#Function that visits a desired web page
#@url: url to visit
#@return: the data sent back from the get request to @url
def scrape_data(url: str) -> str:
      usr_agent=UserAgent()



      #make a pretty looking real header set
      header_dict = {'User-Agent': usr_agent.random,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3,application/json,text/plain',
            'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
            'Accept-Encoding': 'none',
            'Accept-Language': 'en-US,en;q=0.8',
            'Connection': 'keep-alive'}

      response = requests.get(url, headers=header_dict)

      #clean out all of the generated \n characters
      return (response.text).replace('\n','')





#returns a substring based on the first occurance of a beginning string and until a matched string
#@source: the string we are taking a substring of     @begin: the first match to start a substring from     @end:the string we will stop reading when encountering
#@return:  a substring ranging from first occurance of @begin up until the next occurance of @end, starting from @begin
def substr_strs(source: str, begin: str, end: str) -> str:
      begin_index = source.find(begin)
      end_index = (source[ begin_index: ]).find(end) + begin_index

      print ('begin_index: ' + str(begin_index) + ', end_index: ' + str(end_index) )
      return source[ begin_index : end_index ] 





#Parses through a search results page and yanks out the links to each product
#@search_result: the html page recieved from the get request of a search
#@return: a list of strings, containing each product link
def parse_product_links(search_result: str) -> list:
      urls_list = list()

      curr_entry_loc = search_result.find('/ip/')

      #loop through and grab all links to products from search results
      while curr_entry_loc != -1:
            link_end = search_result.find('"',curr_entry_loc)
            urls_list.append( search_result[curr_entry_loc : link_end] )
            curr_entry_loc = search_result.find('/ip/', link_end)
      
      return urls_list





#@urls_list: list of strings containing the url links to each product from search result page
#@return: a list of dict objects that contain all meta information about these TV's
def process_urls(urls_list : list) -> list(){
      products = list()

      for prod_url in urls_list:
            #sleep for 10 (will be 30) seconds to gracefully scrape with very minimal requests. MUST update time when done, too agressive now.
            time.sleep(10)
            curr_page = scrape_data("https://walmart.com" + prod_url)

}




#main routine to scrape each TV off walmart website
#@return: a list of dict objects containing meta info about every
def scrape_walmart_tvs() -> list:
      web_name = 'https://walmart.com'

      #search for tv's
      #curr_page = scrape_data(web_name + '/search/?page=4&ps=40&query=tv')

      with open('output.html', 'r') as myfile:
            curr_page = myfile.read()

      #narrow response to search content
      curr_page = substr_strs(curr_page, '<script id="searchContent\"', '<div class="js-footer-content">')
      
      urls_list = parse_product_links(curr_page)


      
      return urls_list
