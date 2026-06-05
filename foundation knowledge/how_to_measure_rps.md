# How to measure requests per second?

- Going from DAU (Daily Active Users) to RPS (Requests Per Second) is an important system design calculation
- Usually it's good to calculate Average RPS, then apply Peak Factor to estimate maximum load

Steps:

1. Find the total daily requests (TDR)
   - identify how many requests a normal user would do per day
   - multiply that by DAU

2. Calculate average RPS
   - divide the total daily requests per seconds in a day (86400)

3. Calculate Peak RPS
   - add a multiplier (2-5) for traffic spikes
   - users aren't usually spaced out evenly during the 24 hours

## 1. Finding the total daily requests

- Find how many API requests a single active user generates in a day
- E.g.: scenario
  - user opens application 3 times a day generating 20 API requests per session (3 x 20 = 60)
  - 1M daily users

```
total_daily_requests = DAU x requests_per_user
total_daily_requests = 1M x 60 = 60M (TDR)
```

## 2. Average RPS

```
average_rps = total_daily_requests / 86400 (round that up to 100k for making things easier)
average_rps = 60M / 86400 = 695 (RPS)
```

## 3. Calculate the Peak RPS

```
peak_rps = average_rps x 3 (multiplier factor)
peak_rps = 695 x 3 = 2085 (peak rps)
```
