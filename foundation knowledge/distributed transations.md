# Distributed Transactions

- When we move from a monolithic db to a distributed system, we lose ACID transactions at the storage layer
- Basically, when a given operation needs to interact with multiple dbs
  - For example, what if you a client buys a ticket

```
payment_service => withdraw money from client [db1]
ticket_service => reserve ticket to client [db2]
email_service => send a confirmation email with reservation details [db3]
```

- What happens if one of these fails? They aren't located on the same db, how do you deal with that?

## Two Strategies for Distributed Transactions

### 2-Phase Commit - Strong consistency | All or Nothing

- Classic academic solution for distributed transactions
- Coordinator ensures the necessary transactions happened

```
                    payment_service
                     /
client -- coordinator - ticket_service
                    \
                        email_service
```

1. Phase 1: can everybody make this happen?
   - coordinator sends message to each participant
     - "can you commit this transaction?"
     - participants after having performed the operation answer "yes/no"
     - if any participant says no, coordinator tells other participants to cancel

2. Phase 2: if yes, then do it
   - after everybody said "yes", coordinator sends a `commit` message to all participants

> However, 2PC doesn't work well in production, at scale

#### Issues with 2PC

1. Coordinator crashing: The issue with 2PC is that it's blocking, and blocking at distributed system levels is dangerous, since we rely on all machines being healthy at the same time

- Coordinator collects yes from all participants [phase 1]
- Coordinator crashes
- Now, all participants are "blocked"
  - they can't commit on their own, nor block it

2. Slow participant: It holds up the entire process

> The entire system moves at the speed of the slowest participant

Due to these issues 2PC doesn't work in production. Across independent services, it's not a good choice

### Saga Pattern | Eventual Consistency

While 2PC assumes that we need all or nothing atomicity across multiple services, Saga Pattern has a different take

- We just need a way to get to an eventually consistent state, even when things go wrong
- Instead of coordinating every transaction with locks across services, we break the work into independent local transactions

- Then, you run a compensating action. These are business level undos that reverse the effects

- payment_service -> refund instead of rollback
- ticket_service -> cancelation instead of an abort

> The system might be temporarily in an inconsistent state while compensation is running. Customer might see a charge in their card before refund goes through

> For every sub-transaction Ti, there must be a corresponding compensating transaction Ci that undoes its effects

#### Ways of implementing Saga Pattern: Choreography vs. Orchestration

1. Choreography: decentralized, better for simpler flows

- Publish/subscribe pattern
  - each service broadcasts an event when it finishes its work
    - payment service -> if success publishes "card charged" event
    - inventory service -> if success publishes "inventory reserved" event
      - if failed publishes "inventory reserved failed" event ---> now, the upstream event, payment service needs to "compensate" this failure

  - any interested service can pick it up and react
  - if we have 2-3 related events, this works well. However, if we have many services publishing events, this becomes difficult to maintain
    - where did it fail?
    - which compensating actions have already run?

2. Orchestration: usually used at production-level

- dedicated orchestration
- it tells each service what to do each step at a time
- isn't a coordinator way of implemeting SAGA a "step back" to 2PC (2-phase commit)?
  - no, because it doesn't block any part of the system
    - no locks dangling that stop the system
  - however, what if it crashes?
    - since it's non-blocking, the system continues working correctly
    - once a new coordinator gets to scene, it just reads the logs and identifies in which step the process stopped and if there are any compensating actions to be run

- Temporal, AWS Step Functions are orchestration tools

## Compensations are not that simple

- The core of saga pattern is performing the actions, in a non-blocking, manner and allow the system to eventually get to a consistent state through compensating actions
- However, the "redo", the compensating actions aren't that straightforward
  - When should they run?
    - decide based on business logic and just trigger "final"/user-facing events when you're pretty sure everything is in place
  - What if they fail?
    - you need to have try logic for them
    - they need to be idempotent. You shouldn't refund 100 euros twice, for instance
- You need the same level of reliability for your failures as you do your happy paths

> Usually in prod, high-scalable systems, you have: saga with orchestration, idempotent operations, transactional outbox

## Transactional outbox pattern

- When building event-driver distributed system or Saga pattern (specially with choreography), you can run into "dual-write" problem

Let's say a given action needs to write to two places:

- 1. db: insert into given table
- 2. message broker: publish the event to the message brokers

What happens if the write to the db succeeds, but the write to the message broker fails?

- you'd have a created entry on the db without a respective event to deal with it

What happens if the write to the message broker successed, but the one of the db fails?

- you'd have an event created on the message broker that wouldn't have a respective db entry

Then, it enters the Transactional outbox pattern: you guarantee that updating the db and publishing the event happen as a single, atomic operation

### How it works

- Instead of having two writes to two different systems over the network at the same time, you write to two tables in the same db within a single local db transaction

Step 1: atomic local write

- add a dedicated table called `outbox` to your services db
- when a business action happens, open a standard db transaction and write to both tables
  - since they are atomic transactions, either both succeed or nothing is written -> no data mismatch

```
write to specific_table_business_logic (e.g. add to oders)
write to outbox_event
```

Step 2: relay event to broker

- now that the event is persisted to the db, a separate async process reads the rows from the `outbox` table and ships them to the message broker

```
[ order_service ]
       │
       ▼ (Atomic Local Transaction)
 ┌─────────── Database ───────────┐
 │ ┌──────────────┐ ┌───────────┐ │
 │ │ orders table │ │  outbox   │ │
 │ └──────────────┘ └─────┬─────┘ │
 └────────────────────────┼───────┘
                          │
                          ▼ (Asynchronous Relay)
                 [ Message Relayer ] ───> [ Message Broker (Kafka) ]
```

There are two ways to implement this secondary engine

- Approch A: Transaction log mining (change data capture / CDC)
  - cleanest, lowest-overhead approach used in high-scale production
  - a tool (Debezium/AWS database migration service [DMS]) constantly tails your db's internal transaction logs
  - the moment it spots a new entry inside the `outbox` table, it extracts the payload and publishes to Kafka
  - almost zero performance penalty on your primary application

- Approach B: Polling publisher
  - simpler approach for smaller architectures
  - a background worker thread inside your application runs a cron query every <time-window> (e.g. 500ms)
  - Loops through them, publishes them to the message brokers and marks them as `processed = true` or deletes them
