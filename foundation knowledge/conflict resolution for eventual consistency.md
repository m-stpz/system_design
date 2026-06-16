# Conflict resolution for eventual consistency

https://www.youtube.com/watch?v=yCcWpzY8dIA

- Serializable in db means: operations happen in a SERIAL order

## Central server issues

- Requires constant connectivity
- User waits for round-trio: Can do "optimistic" local updates, but conflict/error handling?
- Single point of failure

The issue happens, on data mutation, when we have, for instance:

- `userA` deletes `item1`
- `userB` edits `item1`

What now? Which is the true one?

- Concurrent means doesn't mean at the same time, but that they happen without knowing about each other
- We need to achieve convergence, where everybody aggrees on the same data at the end

## Eventual consistency

- We allow concurrent things to happen and just want to end up to the same state
- What do people mean when they say "eventual consistency"?

1. Eventual delivery: eventually every operation is seen by every node
   - after a given amount of time, if you keep retrying your can get the message through (eventually)

2. Convergence: different nodes that've seen same operations will end up in the same state

3. Don't lose data
   - many dbs use LWW (last write wins), if many people change that at the same time, the last one wins
   - this is lossy. data is lost

> A conflict-free replicated JSON datatype

- CRDTS: Conflict-free Replicated Data Types
  - specialized data structures designed to solve conflicts in an eventual consistency system
  - they allow multiple replicas to be updated concurrently and independently, without any coordination
  - they guarantee that the replicas will mathematically converge to the exact same state once they received all updates
