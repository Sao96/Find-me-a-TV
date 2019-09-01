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



def scrape_amazon_tvs() -> list:
    web_name = 'https://amazon.com'

    #search for tv's
    #curr_page = scrape_data(web_name + '/search/?page=4&ps=40&query=tv')

    with open('amaz_search.html', 'r') as myfile:
        curr_page = myfile.read()
    
    #narrow response to search content. Here, we particularly care about the links to each product.
    curr_page = curr_page[ curr_page.find('<span data-component-type="s-product-image" class="rush-component">        <a class="a-link-normal" href="/') : ]
    
    urls_list = parse_product_links(curr_page)

    return urls_list


