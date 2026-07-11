# Sharding | Partition

- Sharding is a way to horizontally scale a db by breaking up a massive dataset into smaller, more manageable pieces (shards)
- Sharding is also known as partition
- The shards are spreaded across separate db server instances
- When a db grows too large to fit into a single physical machine or when the volume of writes overwhelms the disk, sharding is a way to remove the bottleneck
  - dataset > 1TB => sharding
  - write volume > 5k TPS (transactions per second) => sharding
- While replication you copy all the data to the instances, with sharding, you slice it up

```
                        db (shard 1) id: 0-10M
client --> server --->  db (shard 2) id: 10-20M
                        db (shard 3) id: 20M-30M
```

### A quick note on replication

- Replication is great for scaling reads, however, it doesn't help with writes, nor storage size
  - writes: every write must be copied to every replica
  - storage size: every machine still holds 100% of the data

## How to choose a shard key

- The most critical decision when implemeting sharding is choosing the **Sharding key**
- This is the column/field in the db which determines where a share will live

| Good                | Bad                            |
| ------------------- | ------------------------------ |
| High cardinality    | Low cardinality                |
| Evenly distributed  | Unevenly distributed           |
| Aligns with queries | Queries require scatter-gather |

- Cardinality means a good random distribution

## How sharding works

- Based on the key, we'll have different algorithms to determine in which shard a given entry will live

### 1. Range-based sharding

Data is split based on ranges of the sharding key value

- Shard 1: user_id 1:10k
- Shard 2: user_id 10,001:20k
- Like wagons in a train

Issue: easily leads to unbalanced shards. If new users are more active than old ones, shard 2 gets way more traffic than shard 1

### 2. Hash-based sharding

Db or app server takes the sharding key, passes it through a mathematical hash function, and users the remainder (modulo) of the number of shards to assign the location

- This is the industry standard

```ts
const hashResult = hash(sharding_key); // 105 let's say
const numShards = 3;
hashResult % numShards;
// 105 % 3 = 0 | the data goes to shard 0
```

Benefit: distributes data evenly, minimizing hotspots

Issue: with this one, data is evently distributed, which is great. However, if you need to rebalance your shards, then this one is tough

- if we need to rebalance, there's a huge reshuffling of the data

#### Consistent hashing

- Instead of using a module, we distribute the dbs into a range, like the fifth octave

```
              db 1
              0
         60       5
      55               10
db4 50                      15 db2
       45               25
          40        30
              35
             db3
```

Where does the data 1234 live?

1. hash(1234) = 16
2. Find the 16 on the ring
3. Move clockwise until we hit db3

> Consistent hashing eliminates the downside of hash-based sharding, since it doesn't lead to data reshuffling after

### 3. Directory-based sharding

Centralized lookup service or mapping table that keeps track of which shard holds which data

```
shard1:
    VALUE_1
    VALUE_10

shard2:
    VALUE_2
    VALUE_5
```

Benefit: Highly flexible. You can move data between shards dynamically without changing the sharding key logic
Trade-off: Every single query has a preliminary work of fetching the directory service. Besides: single point of failure + added (minor) latency

## Benefits or sharding

1. Infinite storage scaling
   - `single db (2tb) * shard instances (10) = 20tb`
   - you scale/descale this as you want
2. Horizontal write throughput
   - `single db (5k TPS) * shard instances (10) = 50k TPS`
3. Blast radius reduction: no single point of failure. If you shard goes down (1 out of 5, 20% out of 80% users/processes will feel it), the system continues working

## Engineering complexity

Sharding is rarely a first resort because it introduces a lot of architectural overhead

### 1. Hot spots: load unbalance

- Even though we might have a good sharding strategy, some entries might get more load than others
- how do we solve this?

1. salting the sharding key: adding a randomizing factor known as a salt
   - instead of sharding exclusively by user id, you modify the key before hashing by appending a random integer (e.g. a number from 0 to N)
   - then, when the system hashes these salted strings, they map to different shards
   - trade-off:
     - traffic is distributed
     - however, now application has to query all N shards in parallel and aggregate the results, rather than a single targeted lookup

2. Multi-tier caching

- When a very popular key is searched, implement a dedicated local cache on the app servers (in-memory app caching like Guava or Memcached) in addition to the other cache system

3. Having a dedicated shard for popular entries

### 2. Cross shard operations

- Cross-shared joins are broken

If you need to write a SQL query that joins a table sitting on shard A with shard B, the db can't perform this natively.

- Your app server needs to fetch the data from both instances, stitch them together in memory. Highly inneficient

- Any query that needs information that lives in more than one shard, becomes rather expensive

Solutions:

1. Selecting a good shard key diminishes this problem
2. Cache result of expensive cross shard queries
   - TTL 5min
3. Denormalize data, so related information lives together
   - put the data close to where it lives
   - you reduce latency at the cost of increasing writes
   - increase writes to reduce reads

Cross shard operations should be the exception, not the norm

### 3. Losing transactions / ACID guarantees

Performing atomic operations across multiple independent dbs requires complex distributed transaction protocols (e.g. two-phase commit), which slows down performance

Solution

1. 2PC: Two-phase commit

- there's an orchestrator that verifies whether to two parties are ready for the transaction
- sounds good in theory, but it's slow and fragile in prod
- if the shard coordinator goes down, then we have an issue

2. Saga pattern: sequence of smaller operations

- Each action, has a compensating reaction, so if anyone fails, we can "compensate", so things don't end up in an inconsistent state

### 4. Resharding is painful

If your db outgrows your current sharding setup and you need to move from 3 to 5 shards, re-calculating the hash positions and moving terabytes of live data across the network without downtime is very hard!

Given the complexity of maintaining a sharding architecture, the standard industry play book is to

1. Scale vertically as far as you can go
2. Introduce agressive caching
3. If needed, add read-replicas (replication)
4. Only pivot to sharding if data size or write volume gives you no other choice

## Sharding in System Design Interviews

- Bring it up on the deep dives when talking about scaling, but justify!

1. Storage:
   - storage > 25tb, shard
2. Write throughput
   - write throughput > 50k writes per second during peak, shard
3. Read throughput

When you have it, remember:

1. Propose a shard key based on the access pattern
2. Select distribution strategy
3. Identify the trade-offs
4. Describe how you'd handle growth
