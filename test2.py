import requests
from concurrent.futures import ThreadPoolExecutor

# Define the URL of your web server through the proxy
url = "http://localhost:8008/api?q=Boston"

num_requests = 1000
hit_count = 0  # Global hit variable
miss_count = 0
errors=[]
def send_request(url):
    global hit_count  # Access the global hit variable
    global miss_count
    try:
        response = requests.get(url)
        print(f"Request to {url} - Status code: {response.status_code}")

        # Increment hit count after successful request
        hit_count += 1

    except requests.exceptions.RequestException as e:
        print(f"Request to {url} - Error: {str(e)}")
        errors.append(str(e))
        miss_count += 1
# Create a ThreadPoolExecutor to send multiple requests concurrently
with ThreadPoolExecutor(max_workers=10000) as executor:
    # Submit the requests to the executor
    print("hello")
    executor.map(send_request, [url] * num_requests)

# Print the final hit count
print("Hit rate:{} requests={} ".format(hit_count/num_requests,num_requests))
print("Miss rate: ", (miss_count/num_requests))
print("Errors={}".format(errors))