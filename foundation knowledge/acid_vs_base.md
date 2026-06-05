# ACID vs. BASE

- When designing distributed systems, db transactions generally fall within to "school of thoughts"

- CAP explains:

> Since network partitions (P) is a given in distributed hardward, dbs must choose between C and A

## ACID (Focus: Consistency & Data Integrity)

- It's the traditional relational db model (postgres, mysql)
- Operates within a safety-first mindset, what ensures that data is never in a corrupt state

1. Atomical: "all-or-nothing" rule
2. Consistency: a transaction can only happen between valid states
   - up to date values > being always accessible
3. Isolation: concurrent transactions executing without stepping on each other's toes
4. Durability: once a transition is commited, it's saved

## BASE (Focus: Scale, Availability & Speed)

- Attends the needs of massive, web-scale applications (cassandra, dynamoDB), where a split-second of downtime costs million, but slight delay is acceptable

1. Basically available: system will almost always respond requests, but with no guarantee if the data is "up to date"
   - stale response > timeout

2. Soft state: data is being copied accross nodes in the background

3. Eventual consistency: at some point the data becomes fully updated in all nodes, provided no new update is made
   - data catches up, but takes a while

| Feature              | ACID                                     | BASE                                    |
| -------------------- | ---------------------------------------- | --------------------------------------- |
| Core prio            | Consistency / correctness                | Availability / scale                    |
| Typical architecture | Relational dbs                           | distributed / nosql                     |
| Handling failures    | "all-or-nothing" / roll back transaction | accepts temp inconsistency              |
| Best use case        | Inventory, finances, medical situations  | social media, video platform, analytics |
