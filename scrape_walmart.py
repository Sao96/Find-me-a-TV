#!/usr/bin/env python3
import requests
import time
from fake_useragent import UserAgent

#     Function that visits a desired web page
#     @url: url to visit
#     @return: the data sent back from the get request to @url
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


#     returns a substring based on the first occurance of a beginning string and until a matched string
#     @source: the string we are taking a substring of     @begin: the first match to start a substring from     @end:the string we will stop reading when encountering
#     @return:  a substring ranging from first occurance of @begin up until the next occurance of @end, starting from @begin

def substr_strs(source: str, begin: str, end: str) -> str:
      begin_index = source.find(begin)
      end_index = source.find(end, begin_index) 

      return source[ begin_index : end_index + 1 ] 


#     Parses through a search results page and yanks out the links to each product
#     @search_result: the html page recieved from the get request of a search
#     @return: a list of strings, containing each product link

def parse_product_links(search_result: str) -> list:
      urls_list = list()

      curr_entry_loc = search_result.find('/ip/')

      #loop through and grab all links to products from search results
      while curr_entry_loc != -1:
            link_end = search_result.find('"',curr_entry_loc)
            urls_list.append( search_result[curr_entry_loc : link_end] )
            curr_entry_loc = search_result.find('/ip/', link_end)
      
      return urls_list


#     takes a product page, reads it, and retruns a dict object of all metadata
#     @prod_page: the current loaded product page
#     @return: a dict objects containing the metadata of the given TV.

def process_product_page(prod_page: str) -> dict:
      tv_info = dict()
      #trim the page to get to the part containing the meta data
    
      spec_section = substr_strs(prod_page, '<td class="display-name" colspan="1" rowspan="1">Display Technology</td>', '<td class="display-name" colspan="1" rowspan="1">Assembled Product Dimensions (L x W x H)</td>' )
      
      data_range = substr_strs(spec_section,'<div>', '</div>')
      tv_info['disp_technology'] = data_range[len('<div>') : (data_range.find('</div>'))]

      spec_section = spec_section[ (spec_section.find('</div>') + len( '</div>' ) ) : ]
      
      data_range = substr_strs(spec_section,'<div>', '</div>')
      tv_info['resolution'] = data_range[len('<div>') : data_range.find('</div>')]

      #slice down to part with the model string
      spec_section = spec_section [ spec_section.find('<td class="display-name" colspan="1" rowspan="1">Model</td>') : ]

      data_range = substr_strs(spec_section,'div itemprop="Model">', '</div>')
      tv_info['model'] = data_range[len('div itemprop="Model">') : data_range.find('</div>')]

       #slice down to part with the screen size string
      spec_section = spec_section [ spec_section.find('<td class="display-name" colspan="1" rowspan="1">Screen Size</td>') : ]

      data_range = substr_strs(spec_section,'<div>', '</div>')
      tv_info['screen_size'] = data_range[len('<div>') : data_range.find('</div>')]

      #slice down to part with the brand name string
      spec_section = spec_section [ spec_section.find('td class="display-name" colspan="1" rowspan="1">Brand</td>') : ]

      data_range = substr_strs(spec_section,'<div>', '</div>')
      tv_info['brand'] = data_range[len('<div>') : data_range.find('</div>')]

      #slice down to part with the brand name string
      spec_section = spec_section [ spec_section.find('<td class="display-name" colspan="1" rowspan="1">Refresh Rate</td>') : ]

      data_range = substr_strs(spec_section,'<div>', '</div>')
      tv_info['ref_rate'] = data_range[len('<div>') : data_range.find('</div>')]

      prod_page = substr_strs(prod_page, 'itemprop="image" src', '" class')
      prod_page = prod_page[prod_page.find('//i5.') : ]
      tv_info['img_url'] = prod_page[ : prod_page.find('"') ]
      
      return tv_info


#     @urls_list: list of strings containing the url links to each product from search result page
#     @return: a list of dict objects that contain all meta information about these TV's

def process_urls(urls_list : list) -> list():
      products = list()
      
      ctr = 0

      for prod_url in urls_list:
            #sleep for 10 (will be 30) seconds to gracefully scrape with very minimal requests. MUST update time when done, too agressive now.
            time.sleep(2)
            curr_page = scrape_data("https://walmart.com" + prod_url)
            products.append(process_product_page(curr_page))

            with open('product_page' + str(ctr) + '.html', 'w') as myFile:
                  myFile.write(curr_page)
            ctr = ctr + 1
      
      return products
      
#     main routine to scrape each TV off walmart website
#     @return: a list of dict objects containing meta info about every

def scrape_walmart_tvs() -> list:
      web_name = 'https://walmart.com'

      #search for tv's
      #curr_page = scrape_data(web_name + '/search/?page=4&ps=40&query=tv')

      with open('output.html', 'r') as myfile:
            curr_page = myfile.read()

      #narrow response to search content
      curr_page = substr_strs(curr_page, '<script id="searchContent\"', '<div class="js-footer-content">')
      
      urls_list = parse_product_links(curr_page)
      
      return process_urls(urls_list)
