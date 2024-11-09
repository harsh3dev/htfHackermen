import os
from dotenv import load_dotenv
import pandas as pd
import time
import requests
import fetchBlacklist

class RateLimiter:
    def __init__(self, max_calls_per_second):
        self.max_calls_per_second = max_calls_per_second
        self.call_count = 0
        self.last_reset_time = time.time()

    def wait_if_needed(self):
        current_time = time.time()

        if current_time - self.last_reset_time >= 1.01:
            self.call_count = 0
            self.last_reset_time = current_time

        if self.call_count >= self.max_calls_per_second:
            sleep_time = 1 - (current_time - self.last_reset_time)
            time.sleep(sleep_time)
            self.call_count = 0
            self.last_reset_time = time.time()

        # Increment call count
        self.call_count += 1

    def rate_limited_call(self, func, *args, **kwargs):
        self.wait_if_needed()  # Check if we need to wait
        return func(*args, **kwargs)  # Call the actual function

def get_eth_wallet_transactions(input_eth_wallet,txn_accs,end):
  api_key = API_KEY
  url='https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist'
  url+='&address='+input_eth_wallet
  url+='&startblock=0'
  url+='&endblock='+str(end)
  url+='&page=1'
  url+='&offset=1000'
  url+='&sort=desc'
  url+='&apikey='+api_key

  try:
    response = requests.get(url)
    data = response.json()

    if data['status'] == '1':
        transactions = data['result']
        for txn in transactions:
            # Add `from` address if it's not the input wallet
            if str(txn['from']) != input_eth_wallet:
                if txn['from'] not in txn_accs:
                    txn_accs[txn['from']] = 1
                else:
                    txn_accs[txn['from']] += 1

            # Add `to` address if it's not the input wallet
            if str(txn['to']) != input_eth_wallet:
                if txn['to'] not in txn_accs:
                    txn_accs[txn['to']] = 1
                else:
                    txn_accs[txn['to']] += 1

        # Update the end block number based on the last transaction in this batch
        end = transactions[-1]['blockNumber']
        return txn_accs, end
    else:
        return None, 99999999
  except requests.exceptions.RequestException as e:
    return None, 99999999

def helper1(eth_wallet):
  input_eth_wallet = eth_wallet.lower()
  txn_accs={}
  end=99999999
  for i in range(1):
    prev=end
    txn_accs,end=get_eth_wallet_transactions(input_eth_wallet,txn_accs,end)
    if end == prev:
      break
  return txn_accs

def txnGraphScore(input_eth_wallet):
  load_dotenv()
  API_KEY = os.getenv('API_KEY')
  blacklist = fetchBlacklist.fetchBlacklist()

  rate_limiter = RateLimiter(max_calls_per_second=5)
  input_eth_wallet = input_eth_wallet.lower()

  if input_eth_wallet in blacklist['address'].values:
      return 1
  
  second_lvl_accs = rate_limiter.rate_limited_call(helper1,input_eth_wallet)
  second_lvl_scores = {}

  if second_lvl_accs is None:
      return 0
  # Calculate blacklist scores for each second-level account
  for acc in second_lvl_accs.keys():
      blacklist_txn = 0
      total_txn = 0
      third_lvl_accs = rate_limiter.rate_limited_call(helper1,acc)

      if third_lvl_accs is None:
          second_lvl_scores[acc] = 0
          continue

      for acc3 in third_lvl_accs.keys():
          if acc3 in blacklist['address'].values:
              blacklist_txn += third_lvl_accs[acc3]
          total_txn += third_lvl_accs[acc3]

      if total_txn == 0:
          second_lvl_scores[acc] = 0
      else:
          second_lvl_scores[acc] = blacklist_txn / total_txn

  # Initialize blacklist and total transaction counters
  overall_blacklist_txn = 0
  overall_total_txn = 0

  # Calculate weighted blacklist score across all second-level accounts
  for acc in second_lvl_scores:
      if acc in blacklist['address'].values:
        overall_blacklist_txn += second_lvl_accs[acc]
        overall_total_txn += second_lvl_accs[acc]
      else:
        overall_blacklist_txn += (second_lvl_scores[acc] * second_lvl_accs[acc])
        overall_total_txn += (second_lvl_scores[acc] * second_lvl_accs[acc])

  score=0
  # Output the final score
  if overall_total_txn != 0:
    score = overall_blacklist_txn / overall_total_txn

  return score

