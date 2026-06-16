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
