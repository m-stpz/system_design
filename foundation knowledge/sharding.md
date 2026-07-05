# Sharding

- Sharding is a way to horizontally scale a db by breaking up a massive dataset into smaller, more manageable pieces (shards)
- The shards are spreaded across separate db server instances
- When a db grows too large to fit into a single physical machine or when the volume of writes overwhelms the disk, sharding is a way to remove the bottleneck
  - dataset > 1TB => sharding
  - write volume > 5k TPS (transactions per second) => sharding
- While replication you copy all the data to the instances, with sharding, you slice it up

## A quick note on replication

- Replication is great for scaling reads, however, it doesn't help with writes, nor storage size
  - writes: every write must be copied to every replica
  - storage size: every machine still holds 100% of the data

## How sharding works

- The most critical decision when implemeting sharding is choosing the **Sharding key**
- This is the column/field in the db which determines where a share will live
- Based on the key, we'll have different algorithms to determine in which shard a given entry will live

### 1. Range-based sharding

Data is split based on ranges of the sharding key value

- Shard 1: user_id 1:10k
- Shard 2: user_id 10,001:20k
- Like wagons in a train

Issue: easily leads to unbalanced shards. If new users are more active than old ones, shard 2 gets way more traffic than shard 1

### 2. Hash-based sharding

Db or app server takes the sharding key, passes it through a mathematical hash function, and users the remainder (modulo) of the number of shards to assign the location

```ts
const hashResult = hash(sharding_key); // 105 let's say
const numShards = 3;
hashResult % numShards;
// 105 % 3 = 0 | the data goes to shard 0
```

Benefit: distributes data evenly, minimizing hotspots

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
