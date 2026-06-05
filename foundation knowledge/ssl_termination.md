# SSL Termination

- It's a system design pattern where encrypting and decrypting HTTPS traffic is handled by a frontend proxy or load balancer, rather than by the application server(s)
- When a user securely connects to the app, the encrypted TLS/SSL connection ends at the gateway
- From the gateway to the internal network, traffic travels as regular, unencrypted HTTP

```
                                                                            service 2
                                                                            /
request [encrypted/https] <---> load balancer <------> data [unenctrypted/http] <---> service 1
                        - ssl termination
```

## Without SSL Termination

- Every individual backend application has to:

1. hold the SSL certificate
2. perform the cryptographic handshake
3. decrypt every packet before processing the business logic

## With SSL Termination

- We introduce a load balancer at the frontier of your infra

1. Load balancer has the SSL certificate
2. Incoming requests from client are established (secure HTTPS connection) with the Load Balancer
3. Load balancer forwards the plain HTTP requests over the private, internal network
4. App server replies in HTTP, and load balancer encrypts it back
