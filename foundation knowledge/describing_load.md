# Describing load (Load parameters)

- Requests per second (RPS) / Queries per second (QPS): Common for web servers. The volume of incoming traffic
- Ratio of reads to writes: A db behaves differently if it's handling 99% reads (like a news site) versus 50% writes (messaging app)
- Concurrent users: number of people actively using the system at the exact same moment
- Hit rate on cache: how often the system finds data in the "fast" memory versus having to dig into the "slow" main db
