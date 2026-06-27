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

### 2.1 External caching | Cache-aside

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

## 3. Cache architectures

## 4. Cache eviction policies

## 5. Common issues that come up from caching

## 6. How to talk about caching in an interview

```

```
