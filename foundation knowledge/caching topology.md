# Caching topology

They are

1. Cache-aside
2. Read-through cache
3. Write-through cache
4. Write-behind cache
5. Write-around cache

![alt text](image.png)

## 1. Cache-aside

- Most common topology
- Application code is the orchestrator between the cache and the db

```
            db
            /
service ---
            \
            cache

1. read from cache
2. cache hit?
    yes
        2.1 return the data
    no
        2.1 service reads from db
        2.2 service updates cache
        2.3 return the data
```

- Cache is only populated after a miss

Pros:

- if redis goes down, the application routes queries through the db and keeps function (although slower)
- efficient RAM: only requested data is loaded into cache

Cons

- cache miss penalty: every first request for any data piece will always have a performance hit, since the request must go to the db
- stale data (eventual consistency): if data is updated in the db without being refreshed on cache, the cache returns old data until its TTL expires

## 2. Read-through cache

- Application only talks to cache
- Cache is responsible for updating the db

```
service <--- cache ---> db

1. read from cache
2. cache hit?
    yes
        2.1 return the data
    no
        2.1 cache reads from db
        2.2 cache updates itself
        2.3 return the data
```

## 3. Write-through cache

## 4. Write-behind cache

## 5. Write-around cache
