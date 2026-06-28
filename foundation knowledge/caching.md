# Caching

1. What is caching?
2. Where to place a cache
3. Cache architectures
4. Cache eviction policies
5. Common issues that come up from caching
6. How to talk about caching in an interview

## 1. What is caching?

It's a temporary storage that keeps recently used data available, such that the next time you get it, it's easily reachable/faster

```
server -> db  [~1 millisecond]
server -> cache [~100 nanoseconds]

```

> **Memory (RAM) is around 10,000x faster than disk (SSD) on average**

## 2. Where to place a cache

### 2.1 External caching

In this setup, we have a dedicated, global cache server

- If one server writes to cache, all the others can access it

```
                         1. check cache ---> cache
            server      /
client ---> server ---
            server      \
                        2. read from db as fallback ---> db
```

### 2.2 In process caching

In this setup, we use the local RAM memory of our servers themselves

- Differently from the external, global cache, each app server will have its own, individual cache
- If one server caches something, the others won't see it

```
            server
client ---> server ---> db
            [cache]
            server
```

### 2.3 CDN [Content delivery networks]

- CDN is a form of cache

> **CDN is a geographically distributed network of servers that cache content closer to users**

- Meaning, CDN is putting servers closer to put people
- In a CDN, we're not optimizing for memory and disk optmization (as in the external caching), instead we're trying to reduce network latency, so that the request doesn't need to travel too far

_For more info, check foundation knowledge/cdn.md_

### 2.4 Client-side caching

Data is stored within the client's device

- HTTP cache or local storage
- This way, the request doesn't need to go through the network, however, it's trickier to keep control of the cache
  - how to deal with TTL, stalesness, etc, here? More difficult
- Client-side caching is only relevant if it's necessary some sort of offline functionality, or client-heavy workloads

## 3. Cache architectures

Cache architectures define how your application interacts with the cache

- It defines the read/write order between your cache and db

They are:

1. cache-aside: app server is the orchestrator
   - cache -> app server -> db
   - keeps the cache lean
   - only caches used data
   - the issue is the latency on the first time grabbing that given data

2. read-through: similar to cache-aside, the only difference is that the cache reads from the db as a fallback, instead of the app server
   - app server -> cache --> db
   - if cache goes down, we've got an issue
   - this is how CDNs work

3. write-through: write to cache first and then sync cache to db
   - app server -> cache --(sync)--> db
   - write is only considered sucessfull once the data's been written both to cache and db
   - issue is that we cache a lot of garbage
   - slower writes and polluted cache

4. write-back: similar to write-through above, however, instead of updating it sync, it does async batches
   - app server -> cache --(async bactch)--> db
   - if the cache crashes, data is lost

## 4. Cache eviction policies

It decides which data stays in the cache when the memory is filled

1. Least recently used (LRU): evicts items that haven't been used recently. Most common and balanced
2. Least frequently used (LFU): evicts items that are used least often, even if accessed recently. Good for unbalanced access patterns
3. First-in-first-out (FIFO): evicts the oldest item first. Simple, but rarely the right choice
4. Time-to-live (TTL): Each item expires after a given time (e.g. 5min). Good for data that can go stale, e.g. API responses

## 5. Common issues that come up from caching

1. Cache stampede (Thundering herd): when a popular entry is hit multiple times and the entry has had its TTL expired. Now, there will be several services trying to rebuild that cache
   - how to solve it:
     - unifying the requests: if the requests are equal, operate the first request, add to cache and all the rest wait to be able to grab from cache
     - cache warming: popular keys get they ttl renewed

2. Cache consistency: you can have stale data in the cache
   - no silver bullet here, as usually, it mainly depends on how fresh your data needs to be
   - how to solve it:
     - invalidate on write: if data is updated on the db, clean it up from cache
     - short TTLs

3. Hot keys: entries that can disproportionate access/demand. This entry can overload the given cache node
   - how to solve it:
     - replicate the keys across the cache cluster
     - add local cache on the app server

## 6. How to talk about caching in an interview

When to bring it up?

- Don't simply add a cache for the sake of it. It should be justified

- Read-heavy workloads: when the read load is quite heavy and we want to take the load off the db
- Expensive queries: if a query has complex JOIN or heavy payload, a cache can do wonders
- High datatabase CPU
- Latency requirements

How to introduce caching

1. Identify the bottleneck
2. Decide what to cache
3. Choose your cache architecture
4. Set an eviction policy
5. Address the downsides
