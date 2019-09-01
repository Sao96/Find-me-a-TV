#!/usr/bin/env python3
import time
from scrape_utils import  *

def remove_bad_url(url: str) -> bool:
    url_prefix = url[0:3]

    if url_prefix == '/gp' or url_prefix == '/s/':
        return False

    return True


def parse_product_links(search_result: str) -> list:
    urls_list = list()

    curr_entry_loc = search_result.find('/')
    print('curr_entry_loc: ', curr_entry_loc)
    #loop through and grab all links to products from search results
    while curr_entry_loc != -1:
        link_end = search_result.find('">',curr_entry_loc)
        urls_list.append( search_result[curr_entry_loc : link_end] )
        next_section = search_result.find('<span data-component-type="s-product-image" class="rush-component">        <a class="a-link-normal" href="/')

        if next_section != -1:
            search_result = search_result[ search_result.find('<span data-component-type="s-product-image" class="rush-component">        <a class="a-link-normal" href="/', link_end) : ]
            curr_entry_loc = search_result.find('/')
        else:
            curr_entry_loc = -1            
    
    return filter(remove_bad_url, urls_list)

def process_product_page(prod_page: str) -> dict:
    tv_info = dict()
    prod_page = substr_strs(prod_page, '<span class="a-size-base a-color-base">Customer Rating</span>', 'Total HDMI Ports')
    
    tv_info['price'] = substr_strs(prod_page, '$', '<')

    loop_targets = ['Display Size', 'Display Type', 'disp_tech', 'Refresh Rate', 'Resolution' ]

    #push prod_page to next important column of info table
    prod_page = prod_page[ prod_page.find('Display Size') : ]
    prod_page = prod_page[ prod_page.find('<span class="a-size-base a-color-base">') : ]

    

    tv_info['screen_size'] = substr_strs(prod_page, '>', '<') 

    #push prod_page to next important column of info table
    prod_page = prod_page[ prod_page.find('Display Type') : ]
    prod_page = prod_page[ prod_page.find('<span class="a-size-base a-color-base">') : ]

    tv_info['disp_technology'] = substr_strs(prod_page, '>', '<') 

    #push prod_page to next important column of info table
    prod_page = prod_page[ prod_page.find('Refresh Rate') : ]
    prod_page = prod_page[ prod_page.find('<span class="a-size-base a-color-base">') : ]

    tv_info['ref_rate'] = substr_strs(prod_page, '>', '<') 

    #push prod_page to next important column of info table
    prod_page = prod_page[ prod_page.find('Resolution') : ]
    prod_page = prod_page[ prod_page.find('<span class="a-size-base a-color-base">') : ]

    tv_info['resolution'] = substr_strs(prod_page, '>', '<') 



def process_urls(urls_list : list) -> list():
    products = list()

    ctr = 0

    #   for prod_url in urls_list:
    #         #sleep for 10 (will be 30) seconds to gracefully scrape with very minimal requests. MUST update time when done, too agressive now.
    #         time.sleep(2)
    #         curr_page = scrape_data("https://amazon.com" + prod_url)
    #         products.append(process_product_page(curr_page))

    with open('amazon_prod.html', 'r') as myFile:
        curr_page = myFile.read()      
        

    process_product_page(curr_page)

    #return products

def scrape_amazon_tvs() -> list:
    web_name = 'https://amazon.com'

    #search for tv's
    #curr_page = scrape_data(web_name + '/search/?page=4&ps=40&query=tv')

    with open('amaz_search.html', 'r') as myfile:
        curr_page = myfile.read()
    
    #narrow response to search content. Here, we particularly care about the links to each product.
    curr_page = curr_page[ curr_page.find('<span data-component-type="s-product-image" class="rush-component">        <a class="a-link-normal" href="/') : ]
    
    urls_list = parse_product_links(curr_page)

    return process_urls(urls_list)


