import requests
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

#     given a string, it retrieves only the numeric part of it (keeping . for change portion)
#     @s: a string to filter out any non-numeric parts of it (e.g, units)
#     @return: s converted into a number without extra characters or nunits
def get_num_only(s:str) -> str:
      for pos in range(0, len(s)):
            if not (s[pos].isdigit() or s[pos]=='.'):
                  return s[0:pos]

      return s

#     goes through a given list of dicts values and searches for any empty strings and replaces with 'NULL'
#     @tvs: list of dict objects that represent TV's
#     @return: @tvs with any field containing the empty string as NULL
def add_null_vals(tvs: list) -> list:
      
      #remove any tvs that have model field being null
      tvs = [tv for tv in tvs if (tv['model'] != '')]

      for tv in tvs:
            for field in tv:
                  if tv[field] == '':
                        tv[field] = 'NULL'
      return tvs


      