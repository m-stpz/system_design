# Measuring performance

We look at performance from two angles: throughput and response time

## Throughput

- Service capacity
- How much work a system can finish within a given time frame
  - Batch systems: often measured in records processed per second
  - Messaging systems: often measured in the number of messages moved through a queue per minute

## Response time & Latency

- Time elapsed between a client sending a request and receiving a response
- Latency: time a requests spends to be handled
- Response time: total time the user experiences (latency + processing time)

## Why percentiles

- In data-intensive systems, averages are misleading
- Instead of averages, we use percentiles

| metric       | why use it?                                 |
| ------------ | ------------------------------------------- |
| p50 (median) | "typical" user experiences                  |
| p95          | "long tail" delays                          |
| p99 / p99.9  | "slowest" users are often the most valuable |
