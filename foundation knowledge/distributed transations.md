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

<!-- video  7:14 -->

https://www.youtube.com/watch?v=DOFflggE_0Q
