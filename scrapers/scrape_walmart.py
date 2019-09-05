#!/usr/bin/env python3
import time
from scrape_utils import  *


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

def filter_resolution(res_str:str) -> str:
      if res_str.find('4K') != -1:
            return '4K'
      elif res_str.find('1080'):
            return '1080P'
      elif res_str.find('720'):
           return '720P'
      elif res_str.find('480'):
            return '480P'
      
      return res_str

#checks if the price wasn't parsed properly, or if it's not available, and replaces value to 'NULL'
#     @s: the string to parse
#     @return: @s if it's valid or 'NULL' if it's not
def clean_price(s: str) -> str:
      for char in s:
            if not (char.isdigit() or char == '.'):
                  return 'NULL'
      
      return s

#     removes any additional text to the numeric part of the display size
#     @s: the string to have its units removed
#     @return: @s with only it's numeric part
def remove_units(s:str) -> str:
      for pos in range(0, len(s)):
            if not (s[pos].isdigit() or s[pos]=='.'):
                  return s[0:pos]

      return s

#     main routine to scrape each TV off walmart website    
#     @return: a list of dict objects containing meta info about every

def process_product_page(prod_page: str, url: str) -> dict:
      tv_info = dict()

      tv_info['product_url'] = "https://walmart.com" + url
      price_loc_str = '<span class="hide-content display-inline-block-m"><span class="price display-inline-block arrange-fit price price--stylized"><span role="text" class="visuallyhidden">'
      price_index = prod_page.find(price_loc_str) + len(price_loc_str) + 1

      tv_info['price'] = clean_price(prod_page[ price_index : prod_page.find('<', price_index) ])


      #trim the page to get to the part containing the meta data
      spec_section = substr_strs(prod_page, '<td class="display-name" colspan="1" rowspan="1">Display Technology</td>', '<td class="display-name" colspan="1" rowspan="1">Assembled Product Dimensions (L x W x H)</td>' )
      
      data_range = substr_strs(spec_section,'<div>', '</div>')
      tv_info['display_tech'] = data_range[len('<div>') : (data_range.find('</div>'))]

      spec_section = spec_section[ (spec_section.find('</div>') + len( '</div>' ) ) : ]
      
      data_range = substr_strs(spec_section,'<div>', '</div>')
      tv_info['resolution'] = filter_resolution(data_range[len('<div>') : data_range.find('</div>')])

      #slice down to part with the model string
      spec_section = spec_section [ spec_section.find('<td class="display-name" colspan="1" rowspan="1">Model</td>') : ]

      data_range = substr_strs(spec_section,'div itemprop="Model">', '</div>')
      tv_info['model'] = data_range[len('div itemprop="Model">') : data_range.find('</div>')]

       #slice down to part with the screen size string
      spec_section = spec_section [ spec_section.find('<td class="display-name" colspan="1" rowspan="1">Screen Size</td>') : ]

      data_range = substr_strs(spec_section,'<div>', '</div>')
      tv_info['display_size'] = remove_units(data_range[len('<div>') : data_range.find('</div>')])

      #slice down to part with the brand name string
      spec_section = spec_section [ spec_section.find('td class="display-name" colspan="1" rowspan="1">Brand</td>') : ]

      data_range = substr_strs(spec_section,'<div>', '</div>')
      tv_info['brand'] = data_range[len('<div>') : data_range.find('</div>')]

      #slice down to part with the brand name string
      spec_section = spec_section [ spec_section.find('<td class="display-name" colspan="1" rowspan="1">Refresh Rate</td>') : ]

      data_range = substr_strs(spec_section,'<div>', '</div>')
      tv_info['ref_rate'] = remove_units(data_range[len('<div>') : data_range.find('</div>')])

      prod_page = substr_strs(prod_page, 'itemprop="image" src', '" class')
      prod_page = prod_page[prod_page.find('//i5.') : ]
      tv_info['thumb_url'] = prod_page[ : prod_page.find('"') ]
      
      return tv_info


#     @urls_list: list of strings containing the url links to each product from search result page
#     @return: a list of dict objects that contain all meta information about these TV's

def process_urls(urls_list : list) -> list():
      products = list()
      
      for prod_url in urls_list:
            #sleep for 10 (will be 30) seconds to gracefully scrape with very minimal requests. MUST update time when done, too agressive now.
            time.sleep(1)
            curr_page = scrape_data("https://walmart.com" + prod_url)
            products.append(process_product_page(curr_page, prod_url))
      
      return products
      

#     goes through a given list of dicts values and searches for any empty strings and replaces with 'NULL'
#     @tvs: list of dict objects that represent TV's
#     @return: @tvs with any field containing the empty string as NULL
def add_null_vals(tvs: dict) -> dict:
      for tv in tvs:
            for field in tv:
                  if tv[field] == '':
                        tv[field] = 'NULL'
      return tvs

#     main method
#     runs through walmart's website and scrapes off TV's, parses them into a format appropriate to pass into a PSQL DB
#     obtains each TV's brand, price, model, product URL, thumbnail URL, display size, display technology, resolution, and refresh rate
def scrape_walmart_tvs() -> list:
      web_name = 'https://walmart.com'

      tvs = list()
      #search for tv's
      for page_num in range(1,3): 
            curr_page = scrape_data(web_name + '/search/?page=' + str(page_num) + '&ps=40&query=tv')

            #narrow response to search content
            curr_page = substr_strs(curr_page, '<script id="searchContent\"', '<div class="js-footer-content">')
            urls_list = parse_product_links(curr_page)

            #takes a while, since we need to sleep after each op to perform graceful scraping
            tvs = tvs + process_urls(urls_list)

      return add_null_vals(tvs)
