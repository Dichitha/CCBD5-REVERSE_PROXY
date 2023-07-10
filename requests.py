import requests
from concurrent.futures import ThreadPoolExecutor


url = "http://localhost:8008/api?q=Boston"

num_requests = 999
hit_count = 0 
miss_count = 0

def send_request(url):
    global hit_count
    global miss_count
    try:
        response = requests.get(url)
        print(f"Request to {url} - Status code: {response.status_code}")
        hit_count += 1

    except requests.exceptions.RequestException as e:
        print(f"Request to {url} - Error: {str(e)}")
        miss_count += 1
# Create a ThreadPoolExecutor to send multiple requests concurrently
with ThreadPoolExecutor(max_workers=10) as executor:
    executor.map(send_request, [url] * num_requests)

# Print the final hit count
print("Hit rate: ", (hit_count/num_requests))
print("Miss rate: ", (miss_count/num_requests))
