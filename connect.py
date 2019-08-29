#!/usr/bin/env python3
import requests
from fake_useragent import UserAgent

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

def substr_strs(source: str, begin: str, end: str) -> str:
      begin_index = source.find(begin)
      end_index = (source[ begin_index: ]).find(end)
      return source[ begin_index : end_index ] 

def scrape_walmart_tvs() -> list:
      web_name = 'https://walmart.com'

      #search for tv's
      #curr_page = scrape_data(web_name + '/search/?page=4&ps=40&query=tv')
      














      print(curr_page)

      #narrow response to search content
      curr_page = substr_strs(curr_page, '<script id="searchContent"', '<div class="js-footer-content">')
      
      urls_list = list()

      curr_entry_loc = curr_page.find('/ip/')

      #loop through and grab all links to products from search results
      while curr_entry_loc != -1:
            link_end = curr_page.find('"',curr_entry_loc)
            urls_list.append( curr_page[curr_entry_loc : link_end] )
            curr_entry_loc = curr_page.find('/ip/', link_end)
      
      return urls_list
