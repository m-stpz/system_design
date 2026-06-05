# Important terminology

## Volume metrics

- DAU (Daily Active Users)
- Throughput: amount of work systems processes within timeframe
- RPS (Requests per second): how many individual API/network requests your severs (application/db) process in a second
  - a specific unit of throughput
- Peak RPS: amount of rps within busiest timeframe
  - actual number you must design the infra to survive
- Read:Write ratio: amount of traffic that asks (read) for data versus modifies the data (write)
  - twitter: 100:1 (heavy read)
  - logging servive: 100:1 (heavy write)
    - This influences the db choice

## Speed and capacity

- Latency: time it takes for request to travel from the user, to server, be processed, and returned
  - usually measured in ms

```
| ------------ latency -------------------|

client -- sends request --> server -- processed
 | <------- responded ------------------- |
```

- Bandwidth: maximum theorical capacity of your network link
  - the width of the pipe
  - how many mbs/gbs of data can be pushed through the wire per second

## Performance and user expeicne

- Percentile latency (p50, p99, p99.9): average percentiles is a lie since slow requests get hidden by fast ones (skewed measuring), instead we use percentile
  - p50 (median): time it takes for typical user
  - p99 (worst-case latency): experienced by 1% of users
    - if you have 1k rps, 10% of these requests are experiencing the p99 speed
    - optimize this to keep system reliable
