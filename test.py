import requests
import threading
import random
def req(num):
    # print("hi")
    cities = ['Boston', 'Paris', 'Bengaluru']
    responses = []
    # print("number ={}".format(num))
    # print("Starting")
        # print(city)
    try:
        response = requests.get(f'http://localhost:8008?q={cities[random.randint(0,2)]}', headers={'Accept': 'application/json'})
    except Exceptions as e:
        print("An error={}".format(e))

        # print(responses[-1])
    
    # print(responses)

thread_list=[threading.Thread(target=req,args=(i+1,)) for i in range(10000)]
[i.start() for i in thread_list]
[i.join() for i in thread_list]
