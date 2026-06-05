# How much RPS can a server and db handle on average?

- 1k is a reasonable answer
  - for an application server, 1k rps usually fine
  - for a relational db, 1k rps can be fine or a bottleneck, depending on how complex the requests are

## Application server

- Lighweight | I/O-Bound (e.g. nodejs, go, fastify): if server is just fetching a row from a cache or validating JWT, a single instance can handle 2k-10k+ rps

- Heavyweight | CPU-Bound (e.g. python/django, ruby on rails, heavy serialization): depending on how heavy the operation (json parsing/encryption, etc) is for given request, something like 200-500 rps

## DB

- It's important to know read vs. write radio, this influences drastically the answer

| Request type         | Capacity estimate | Why?                                                                                                                |
| -------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| Point reads (by id ) | 5k - 20k+ rps     | if the data fits in the db's RAM, it doesn't touch the disk. Super fast                                             |
| Complex queries      | 50-500 rps        | missing indexes, sequential table scans, complex joins, consults disk. Expensive and slow                           |
| Standard writes      | 1k - 5k rps       | Relational dbs write a WAL (Write-Ahead Log) and guarantee ACID, which requires disk serialization, what takes time |

- What does disk serialization mean?
  - Data is written to physical, non-volatile storage (disk)
  - Strict, sequential write order to guarantee th db transaction is recorded before it can be marked as successful
  - When aiming for 1k rps to a relational db, this physical constraint becomes the primary bottleneck

- Also, it's important to think about the payload
  - 1k rps x 1kb JSON -> 1MB bandwidth
  - 1k rps x 1mb json -> 1GB bandwidth
