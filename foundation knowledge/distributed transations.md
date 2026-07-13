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

### 2-Phase Commit - Strong consistency

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

- The issue with 2PC is that it's blocking, and blocking at distributed system levels is dangerous, since we rely on all machines being healthy at the same time

### Saga Pattern
