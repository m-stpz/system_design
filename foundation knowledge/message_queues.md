# Message Queues

- Form of async service-to-service communication
  - used in serverless and microservices architecture
- Examples: Amazon SQS, Kafka, RabbitMQ
  - RabbitMQ: great for complex routing logic and traditional message queuing
  - Apache Kafka: designed for high-throughput, log-based streaming (Pub/Sub) where data needs to be replayed/retained
    - in doubt, pick kafka | most widely used
  - AWS SQS: Fully managed cloud-native queues
    - if you want simplicity and a hosted solution

```
// not a good pipeline
                            server
client -- uploads image -->  - resize ----> database
   ^                          - filter
   |                          - content moderation
   |                             |
   -------- response 6s later ---


- bad user experience [waiting 6s for an answer]
- what if one of the services fails? (resize service is down, for instance)
- what if there's increased load?
```

- Much better if the server receives the request and only saves a message to a queue

## When to use it?

1. Async work: emails, reports, uploads
2. Bursty traffic: when spikes need to be absorbed
3. Decoupling: services that scale independently
4. Reliability: can't afford to lose work

### When not to do it

- Simple CRUD with low traffic
- When you need:
  - faster responses
  - established latency
  - predictable request/response workflows
  - prectictable sequence

### Architectural alternatives

- Do you need ACID compliance, but doesn't want new infra? Use database as a queue
- Do you need that microservices talk with each other with low-latency and established request/response workflows? Use gRPC
- Do you need an updated real-time for the client's UI after a long-running process? Use web-socket

## Core concepts

1. Producer: application/service that creates and sends the message
   - fires and moves on
   - the waiter grabs your order
2. Queue: temporary storage folder/buffer that holds the message (either FIFO or priority sequence)
   - a buffer between the two services
   - adds it to the dishes to be cooked list
3. Consumer: application/service that connects to the queue, retrives the message, and processes it
   - pulls the message and processes it
   - kitchen prepares it

### Sync vs. Async

1. Sync (HTTP/REST): service A calls service B and must wait for B to finish processing
   - If service B is slow or down, service A hangs or crashes

2. Async (Message queues): service A drops a message into the queue and moves on
   - Service B picks it up whenever possible

### Implementation

- Once a workers grabs a message from the queue, only when it has finished processing it, it sends an ack saying that it's done. Only then, the queue deletes the message
  - otherwise, if the worker gave the ack as soon as it started working on it and the queue deleted the message, in case the worker crashed that data would be lost

- Duplicate processing: but then, can't this message be "picked up" by another consumer ?
  - different solutions by different systems. Different methods of avoiding duplicate processing:

1. invisible time period: once the message is picked it, it becomes "invisible" for a time window and deleted after the ack. If no ack, message is back
2. logical queues: queues are separated by consumers, so only one consumer grabs from that given queue. No competition.

- Delivery guarantee: what if the worker processes the message successfully, but crashes before `ack`?

1. At-least-once: message may be delivered more than once
   - most widely used | almost aways the right choice
   - consumers must idempotent (processing the same message twice produces the exact same result)
   - design operations to be idempotent:
     - set user's photo to 5 -> idempotent
     - increase counter by one -> not idempotent (if it runs twice, it adds 2)

2. At-most-once: fire and forget; message may never arrive
3. Exactly-once
   - even though it's the best, it's extremely hard to achieve in distributed systems

## Important considerations

1. Data consistency and idempotency: messages can sometimes be delivered twice
   - Consumers must be idempotent

2. Message ordering: the messages might be received out of order.
   - If order is important, we need to choose a queue that guarantees ordering

### Deep dive

- How does your queue handle increased throughput? (incrased load)
  - partition: like a subqueue
  - consumer groups

- What happens if your consumers produce more messages than your consumers can process them? (unbalance of producers and consumers)
  - auto scaling
  - increase consumers as the message queue increases
  - add monitoring, so you know if a queue is growing too large

- What happens if a message fails to process? (poisoned message)
  - a message that crashes the consumer everytime it tries to process it
  - max retry account
  - dead letter queue (DLQ): where fail messages go
    - then someone can inspect them later
    - separated from the main queues

- What happens if the queue goes down?
  - some systems (kafka) save a replica, so we can recover the messages
