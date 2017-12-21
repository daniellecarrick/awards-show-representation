# import necessary libraries

import requests
import urllib
from bs4 import BeautifulSoup

# specify the url
page = urllib.urlopen("https://www.goldenglobes.com/winners-nominees/2016")

# parse the html using beautiful soup and store in variable 'soup'
soup = BeautifulSoup(page, "html.parser")
 
#award_category = soup.findAll("div", attrs = { "class" : "event-widgets__award-category-name"})
award_category = soup.findAll("div", class_ = "view-grouping")

for category in award_category:
	category_name = category.h2.div.text
	nominee_name = category.div
	print	category_name
	#print nominee_name

award_nominees = soup.findAll("div", attrs = { "class" : "primary-nominee"})



#print award_category, award_nominees
