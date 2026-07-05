# Multiple DB instances

- When should we have multiple-dbs?
  - high-availability: avoiding a single point of failure
  - compute throughput
  - storage capacity
  - network bottlenecks

- The reasons can be categorized into:

1. Throughput bottlenecks
2. Storage bottlenecks
3. Design requirements

## 1. Throughput bottlenecks (I/O and CPU)

- Even if the data is mall, a high volume of concurrent traffic can exhaust a single db instance

### 1.1 IOPS: Input/Output operations per second

- Disk read/write speeds are finite
  - standard cloud storage usually offer a baseline of 3k IOPS. 16k or more on premium tiers
  - signal: if performance metrics show disk queue length spiking or IOPS >= 80% capacity, your db is waiting on the physical hardware
  - reads exhausting IOPS? add replicas
  - writes exhausting IOPS? shard

### 1.2 CPU usage

- Complex queries, indexing new rows, managing connection pools, etc (heavy-cpu usage operations), can also demand another db instance
- signal: Sustained CPU usage above 75-80% during peak hours is a signal

### 1.3 Connection pool exhaustion

- The db has a limit of how many "open" TCP connections it can maintain (few hundred to a couple thousand of connections depending on memory)
- signal: app servers throwing `too many connections` or `connection timeout` errors can mean that the db doesn't have the compute overhead to handle more incoming traffic streams

## 2. Storage bottlenecks (Data size)

- Data size introduces operational bottlenecks longs before we run out of physical hard drive space

### 2.1 The working set vs. RAM (Golden rule of caching)

- For a db to be fast, its Working set (active indexes and most frequently accessed data rows) must fit entirely inside the db server's RAM
- signal: dropping buffer cache hit ratio
  - it should be >= 99%. If it drops to 95% or lower, it means the db must constantl go to the hard disk to find data because it couldn't fit into RAM

- Once the active dataset exceeds the maximum meory config available on a single commercial instance tier (256GB to 512GB of ram to standard db nodes), you must split the data across multiple instances (sharding)

### 2.2 Operational and maintenance limits

- When a single db instance grows beyond 1 to 2 terabytes, it becomes an operational liability
  - backups and restore: taking a snapshot takes hours
    - If the db crashes, recovering a 2TB file from a backup could take half a day
  - index rebuilding and alternations: running an `ALTER TABLE` or creating a new index on a table with hundreds of millions of rows can lock the db and degrade performance for hours

## 3. Concrete design targets

- Design heuristics to when transition from one to multiple db instances

| Metric             | Single db instance (safe)                | Multiple dbs (time to scale)      | Strategy choice                                         |
| ------------------ | ---------------------------------------- | --------------------------------- | ------------------------------------------------------- |
| Read volume        | < 5k to 10k QPS (queries per second)     | > 10k QPS                         | Read replicas (Scale reads horizontally)                |
| Write volume       | < 2k to 5k TPS (transactions per second) | > 5k TPS                          | Sharding/NoSQL architecture (Scale writes horizontally) |
| Total storage size | < 1TB                                    | > 1TB to 2TB                      | Sharding or moving older data to a cold data warehouse  |
| Cache hit ratio    | >= 99%                                   | < 95% (data outgrew RAM capacity) | Vertical scaling first, then sharding                   |
