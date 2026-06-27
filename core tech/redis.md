# Redis

- It's an open-source, in-memory data structure store
- It can be used as: database, cache, and message broker
- Unlike traditional relational dbs that store the data on disk, Redis keeps it in RAM
  - this allows for much faster read/write
- Single-threaded, in-memory data structure server

## Characteristics

1. In-memory (RAM), but persistent: Even though the data is kept in RAM, it's persisted through async flush to disk
2. Single-threaded core: Handles operations using a single-threaded event loop
   - Eliminates CPU context switching and race conditions
   - Operations are atomic without complex locking mechanisms

Since it's single-threaded, it simplifies the order of writes significantly, since in distributed systems that is a challenging thing to perform correctly

3. Not just dictionaries (key-value pairs): It accepts advanced data structures (strings, lists, sets, sorted sets, hashes, bitmaps)

## What it does | Use-cases

### 1. Caching

- It usually sits between your application server and your main db to alleviate load

```
client --> server --> redis --> db
```

1. Caching: It stores `____` to reduce latency
   - query results
   - user sessions
   - API responses

```
1. Service checks cache for given query
2. If it's not on cache, we grab from the db
3. After grabbing it from the db, we store it on cache
```

```ts
import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis client error", err));

// simulated slow db query (e.g, postgres or mongodb)
async function fetchUserFromDb(userId: string) {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    id: userId,
    name: "john doe",
    eamil: "john@example.com",
  };
}

// cache-aside pattern
async function getUserProfile(userId: string) {
  const cacheKey = `user:profile:${userId}`;

  // step 1: check cache
  const cachedData = await redisClient.cache(cacheKey);

  if (cachedData) {
    console.log("cache hit!");
    return JSON.parse(cachedData);
  }

  // step 2: if not on cache, grab from db
  const dbResult = await fetchUserFromDb(userId);

  // step 3: after grabbing it from db, store it on cache
  await redisClient.set(cacheKey, JSON.stringify(dbResult), {
    EX: 3600, // TTL of 3600 seconds (1 hour)
  });
  console.log("data cached");

  return dbResult;
}
```

For more info on caching, see foundation knowledge/caching_topologies.md

### 2. Rate limiting: uses atomic increment to limit the number of API requests a user can make per minute

- Redis can also be used to rate limit access to an **expensive service**
- We set an increment key and allow requests to pass through while the number is less than the request limit for a given time period

3. Distributed locking: ensures only a microservice can perform given operation at a time (usually RedLock algorithm)

4. Pub/Sub & Queues: acts as a message-broker for real-time chat, notifications, or background job processing

## Where does Redis live?

- Locally: running on local machine as a background processes
- On-premise / VM: Installed on a dedicated Linux server in the company's data center
- Cloud (managed): Hosted on cloud platforms, e.g. AWS ElastiCache, GCP Memorystore, or Redis Cloud

## Important questions

### What's the hotkey issue?

- a large volume of concurrent traffic hits one specific redis key at the exact same time
- this single point of failure, creates a bottleneck

#### How to mitigate it?

1. local memory caching (near-caching): store the specific ultra-hot key directly in memory of your application servers for a few seconds

- this way, the app server won't need to reach to redis for that key

2. key scattering (salting): duplicate hot keys across multiple redis slots by appending a random suffix

- instead of grabbing `product:123`, the application will request `product:123_1`, `product:123_2`, `product:123_3`, this distributing the load across multiple redis nodes

### What's the expiration policy of your cache?

Here, there are two things to keep in mind: **TTL** (time-to-live | how data naturally dies) and **Maxmemory eviction** (what happens when Redis runs out of space)

#### TTL: How to delete expired keys

Redis doesn't constantly scan every single key to check if it's dead, instead it uses a hybrid approach:

1. passive deletion: when a user requests a key, Redis checks if it's expired. If it is, Redis deletes it and returns `nil`
2. active deletion: peridiocally (about 10 times a second), Redis tests a random sample of keys with a TTL. If more than 25% of the sample is expired, it clears them out and repeats the process to keep memory clean

#### Eviction policies (when maxmemory is reached)

If the cache has 100% of its RAM memory filled, Redis relies on `maxmemory-policy` config to decide what to kick out to make new room for new writes. Most common policies

- `allkeys-lru` (least recently used): evaluates all keys and evicts the ones that haven't been requested recently (best choice for general caching)
- `volatire-lru`: ony look at keys that have TTL set, evicting the least recently used among them
  - better if some keys should always be kept there
- `allkeys-lfu` (least frequently used): evicts keys that are requests the least number of times, regardless of how recently they were touched
  - great for ensuring "hot" items always stay in cache
- `noeviction`: redis will refuse to write any new data and return out-of-memory (OOM) error
  - standard behavior when redis is used as a primary db, not a cache, where losing data is fine
