# CAP Theorem

- Consistency, Availability and Partition Tolerance
  - We have have only 2 of these 3
  - Partition tolerance is a must. We must be able to deal with network failures. So the question is:
    - consistency or availability?

- When considering that network fails (partition tolerance), what's more important: consistency or availability?
  - in distributed systems, we need to have partition tolerance
  - is consistency or availability?
    - does it need strong consistency or high availability?
    - do I need strong read-after-write consistency?
    - does every single read of my system need to have the latest write?

## Definition

You can only have 2 out of 3:

1. Consistency: all nodes/users see the same data at the same time
2. Availability: every request gets a response (sucessful or not)
3. Partition tolerance: system works despite network failures between nodes

The questions boil down to:

Network fails between the nodes

- should we error when user try to access a given resource that's stale?
  - STOP serving data (consistency)
- should we allow the access to the given resource even though it's stale?
  - RISK wrong data (availability)

> Network fails between them? Stop serving data (consistency) OR risk wrong data (availability)

### When to choose consistency

- Systems that need:
  - strong consistency read after write
  - every read must return the last write
  - the data can't be stale

- Examples:
  - financial systems
    - stock trades must be executed in a strict order
    - deposit/withdraw, etc
  - ticket booking (airline, event)
    - if we sell a ticket, everyone needs to see it as unavailable, without delay
  - inventory system (amazon)
    - can't sell the same last item to multiple customers

> Does every single user in my system need to see the latest state and in case they didn't this would be catastrophic? If yes, then choose consistency

#### Different types of consistency

1. Strong: all reads reflect the most recent
2. Causal: related events appear in order
3. Read-your-writes: user see their own updates
4. Eventual: updates propagate eventually

> When our system prioritizes availability, we're saying that it's fine for it to be eventually consistent

### When to choose availability

> If you don't need strong consistency, then choose availability!

- Social media
- Review services
- Streaming services

- If it's fine that some of the data isn't the most up to date, we should choose availability

- Examples:
  - most software would live here

## How does it influence the design?

### Consistency | The system should return an error instead of stale or incorrect data

- Distributed transactions
- Limit to a single node
  - atomic transactions
- Discuss consensus protocols
- Accept higher latency
  - use loading states
- use synchronous replication
- single-leader architecture
- two-phase commit (2PC)
- Example tools:
  - Postgres
  - Traditional RDBMS
  - Spanner
  - NoSQL with consistency mode (DynamoDB)

### Availability | The system should accept write/reads even if the data is stale

- use multiple replicas
- async replication
- multi-leader / leaderless
- conflict resolution strategies
  - LWW
  - CRDTs
- Caching
- CDC (change data capture) and eventual consistency
- Example tools
  - DynamoDB (multi-availability zones)
  - Cassandra

## Different parts of the system can have different requirements

- Ticketmaster
  - availability for CRUD on events
  - consistency for booking tickets

- Tinder
  - availability for viewing profile data
  - consistency for matching
