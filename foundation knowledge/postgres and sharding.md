# Partition and Postgres

- Although relational dbs can be partitioned, NoSQL dbs (mongodb or firestore) make that much easier out of the box since they were designed with this in mind
- There are two flavors of partition: local (single machine) vs. distributed (multiple machines/sharding)
- Postgres handles partition really well, however, natively, it prefers to do it vertically or locally on a single instance

## Local partition

- You take a massive table and tell postgres to split it into smaller sub-tables (this is behind the scenes based on a key)
- To the application, it still looks like a single table, but physically on disk, Postgres splits them up
- This makes indexes smaller and queries really fast (partition pruning)

## Horizontal partition

- Once you need to have multiple dbs, with postgres with becomes tricker.
- Natively, postgres doesn't manage a distributed cluster ring
- So, with postgres and horizontal partition you usually need:

1. Application-level sharding: your app servers manage multiple db connections pools and decide whether to send a query to db_instance_1 or db_instance_2
2. Extensions: Citus (transforms postgres into a distributed db) or choosing natively distributed SQL engine like CockroachDB or Yugabyte

# Document/NoSQL Dbs (MongoDB, Firestore)

- They were built specifically to handle the scaling limitations of traditional relational dbs
- They usually handle horizontal sharding natively out of the box

## Native Sharding

- In MongoDB, you define a shard key. The db handles the cluster organization automatically
- MongoDB automatically balances the shards
