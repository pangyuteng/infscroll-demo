import random
from pymongo import MongoClient
client = MongoClient('localhost',27017)
collections=client['my-todo'].todos


print('count before {}'.format(collections.count({})))

sz = 10000
for r in range(sz):
    val = ''.join([random.choice('abcdefghij') for x in range(3)])
    doc = {'text':val,'done':False,}
    #collections.insert_one(doc)

print('count after {}'.format(collections.count({})))

