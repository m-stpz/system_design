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

```
                           microservice 1
                       /                   \
client -- api gateway ---> microservie 2 ---> db
           [routing]    \                   /
                           microservice 3
```

- A thin layer in front of the microservices
- Clients need to know only one endpoint, the api gateway's endpoint
- API gateway is responsible for forwarding the requests

### API Gateway Routing and Middleware | 2015-now

```
                           microservice 1
                       /                   \
client -- api gateway ---> microservie 2 ---> db
           [routing]    \                   /
           [middleware]    microservice 3
```

- Instead of each microservice having the boilerplate of authentication, we handle this at the api gateway layer

## What happens inside an API gateway

1. Validates the request
   - does it have the proper formatting?
   - does it have the proper heading?
2. Run middleware: auth, rate limiting, etc
   - we can check 3rd party services (auth, rate limiting) on this stage
3. Route to correct service
   - maps URL paths to services

```
routes:
    - path: /users/*
    service: user-service
    port: 8080
    - path: /orders/*
    service: order-service
    port: 8081
    - path: /payments/*
    service: payment-service
    port: 8082

```

4. Transform the response

- If any microservice is using gRPC or any other protocol, and the client HTTP, the API gateway would transform/translate it, so the systems could communicate

> With a microservice architecture, an API gateway is basically a requirement

## Most popular API gateways

Managed:

- Amazon API gateway
- Azure API management

Open source:

- Kong
- Tyk
- Express gateway
