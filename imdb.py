# import necessary libraries

import requests
import urllib
from bs4 import BeautifulSoup

# specify the url
page = urllib.urlopen("http://www.imdb.com/event/ev0000292/2016/1")

# parse the html using beautiful soup and store in variable 'soup'
soup = BeautifulSoup(page, "html.parser")

print soup
 
award_category = soup.findAll('h2', attrs = {'div': 'event-widgets__award-category-name'})
award_nominees = soup.findAll('span', attrs = {'class': 'event-widgets__nominee-name'})

print award_category, award_nominees
