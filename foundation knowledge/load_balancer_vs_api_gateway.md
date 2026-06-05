# Load Balancer vs. API Gateway

- Load balancer: directs traffic to different servers
- API gateway: a security guard, checking IDs

## Load balancer: Traffic Cop

- Handles routing
- Takes requests and distributes them through the servers
- Operates at layer 4 (transport layer - TCP/UDP) or layer 7 (applicatoin layer - http/https)

### Core features

- Health checks: pings servers to check their state and see if it can route traffic there
- SSL termination: adds the layer of SSL, so inner traffic can happen without encryption

## API Gateway: Receptionist

- Reverse proxy tailored for API management and security
- Usually sits behind the load balancer, but in front of the services
- Operates on layer 7

### Core features

- Authentication & Authorization: checks if incoming request has valid JWT or API key before it lets it pass through
- Rate limiting / Throttling: limits requests per users
- Protocol translation: it can translate a public REST API into internal gRPC or GraphQL

```
Client ---> Load balancer ---> API Gateway
```
