# Redis

- It's an open-source, in-memory data structure store
- It can be used as: database, cache, and message broker
- Unlike traditional relational dbs that store the data on disk, Redis keeps it in RAM
  - this allows for much faster read/write

## Characteristics

1. RAM, but persistent: Even though the data is kept in RAM, it's persisted through async flush to disk
2. Single-threaded core: Handles operations using a single-threaded event loop
   - Eliminates CPU context switching and race conditions
   - Operations are atomic without complex locking mechanisms
3. Not just dictionaries (key-value pairs): It accepts advanced data structures (strings, lists, sets, sorted sets, hashes, bitmaps)

## What it does

- It usually sits between your application server and your main db to alleviate load

```
client --> server --> redis --> db
```

1. Caching: It stores `____` to reduce latency
   - query results
   - user sessions
   - API responses

2. Rate limiting: uses atomic increment to limit the number of API requests a user can make per minute

3. Distributed locking: ensures only a microservice can perform given operation at a time (usually RedLock algorithm)

4. Pub/Sub & Queues: acts as a message-broker for real-time chat, notifications, or background job processing
