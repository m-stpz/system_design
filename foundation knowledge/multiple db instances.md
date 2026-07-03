# Multiple DB instances

- When should we have multiple-dbs?
  - high-availability: avoiding a single point of failure
  - compute throughput
  - storage capacity
  - network bottlenecks

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
