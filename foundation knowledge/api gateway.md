# API Gateway

## A bit of history

### Monolith | 2000s

- Simple to reason about
- Doesn't escale very well
- Singe-point of failure

```
- client -> monolith -> db
```

### Microservices | 2010-2012

```
            microservice 1
        /                   \
client ---> microservie 2 ---> db
        \                   /
            microservice 3
```

- In this architecture, we gain scalability/flexibility
- However, the client would need to know the URL of each of the microservices server and when to forward to a given microservice
  - or client could send it to `microservice 1` for example, but the issue would remain

### API Gateway Routing | 2013-2014
