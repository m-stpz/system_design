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

2. Rate limiting: uses atomic increment to limit the number of API requests a user can make per minute

3. Distributed locking: ensures only a microservice can perform given operation at a time (usually RedLock algorithm)

4. Pub/Sub & Queues: acts as a message-broker for real-time chat, notifications, or background job processing

## Where does Redis live?

- Locally: running on local machine as a background processes
- On-premise / VM: Installed on a dedicated Linux server in the company's data center
- Cloud (managed): Hosted on cloud platforms, e.g. AWS ElastiCache, GCP Memorystore, or Redis Cloud
