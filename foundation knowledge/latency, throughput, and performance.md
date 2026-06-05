# Latency, throughput and performance

## Metrics

1.  Latency: time it takes for a single unit of data to travel from point A to point B, or for a single operation to complete
    - measured in nanoseconds, milliseconds, or seconds
    - ex: the time it takes to drive from linz to vienna

2.  Throughput: the N of actions or data units processed within a timeframe
    - measured in Queries per second (QPS), Transactions per second (TPS)
    - ex: how many cars pass through a tool booth per minute

3.  Performance: a holistic measure of how a system handles workload
    - high performance = low latency + high throughput

## Understanding nano vs. milliseconds

- Computers operate on a clock cycle
- Modern CPU ticks billions of times per second
- Within the computer, things are measured in nanoseconds
- Within a network, we use milliseconds

### Scale: nanoseconds vs. Milliseconds

- 1 second = 1k ms = 1m microsecond = 1 billion ns
- 1 ms = 1k microsecond
- 1 microsecond = 1k ns

```
1 Second (s)
      │
      ▼ (÷ 1,000)
 1 Millisecond (ms)    [10^-3 seconds]
      │
      ▼ (÷ 1,000)
 1 Microsecond (μs)   [10^-6 seconds]
      │
      ▼ (÷ 1,000)
 1 Nanosecond (ns)     [10^-9 seconds]
```

Every new scale divides time by 1000

- 1 millisecond (ms) = 1k microseconds = 1M nanoseconds

A ms is one million nanoseconds

If 1 nanosecond is the width of a human hair:

- 1 millisecond = length of a football field
- 1 second = 100km

Meaning that 1 ns is equal 1 billion seconds

#### Nanosecond realm | inside the silicon

- CPU L1 cache and RAM live here

- When the CPU is doing math, it moves data across microscopic distances
- When the CPU has to reach outside itself over writes on the motherboard to grab data from the RAM, it takes around 100ns. To the CPU this is a considerable wait time

#### Millisecond realm | moving parts and networks

- SSD/HDD operations + network live here
  - SSD: 0.1 - 0.4ms = 100k - 400k ns
  - HDD: 2 - 10ms = 2 - 10M ns
    - the mechanical move, in computer terms, takes an eternity
- The moment data has to be read on a physical disk or sent over the wire to another compute, we cross a massive boundary, the ms boundary

#### The "day in the life of a cpu"

Let's imagine that a CPU is someone sitting besides us and 1 nanosecond is equal to one second

- Execute basic instruction [0.5ns] = 0.5 seconds
- Fetch data from CPU cache [1n] = 1 second
- Fetch data from RAM [100ns] = 1.6 minutes
- Fetch data from an SSD [200k ns/ 0.2ms] = 2.3 days
- Fetch data from a HHD [5M ns/5ms] = 5.7 days
- Send an internet packet & get a reply [50M ns/50ms]: 1.5 years

That's why when designing systems, memory management and caching matters so much

- If the application forces the CPU to constantly go all the way to a distant hard drive (ms) or make an external API call over the network instead of pulling data out of RAM, you are asking for an executive who operates in split-seconds to wait years for an answer

#### Speed of light

In a vaccum, light travels 300k km/s

- 1s = 300km
- 1ms = 300km
- 1microsecond = 30 m
- 1ns = 30 cm

In a network, data travels as light ppulses through fiber-optic cables

- Light is slower in glass than in vaccum (around 200k km/s), so it takes around 5ms for light to travel 1k km + time for routers and switches to process and route the data

## Latency numbers

- To design fast systems, we need to understand the physical reality of hardware

### 1. Hardware and memory latency

Data access is bound by physics

- Moving electrons through a CPU cache is vastly faster than spinning a magnetic platter on an HDD

- L1/L2 cache access: 0.5 - 4 ns (insanely fast, on the CPU chip)
- Main memory (RAM) access: ~100ns (fast, but order of magnitudes slower than CPU cache)
- Solid State Drive (SSD) I/O: ~0.1 - 0.2 ms (100k - 200k ns): SSDs are electronic, eliminating mechanical seek times
- Hard disk drive (HDD): ~1 - 10 ms (1M - 10M ns): they are slow because a physical read/write must mechanically move to the correct sector on a spinning platter

> Reading from RAM is 1k-2k times faster than reading from a fast SSD, and about 100k times faster than an old-school HDD. This is why caching layers are so critical for high-performance apps

```
       / \
      /   \        CPU Registers / Cache (< 1 - 4 ns)
     /_____\       ---------------------------------
    /       \      Main Memory / RAM (~100 ns)
   /_________\     ---------------------------------
  /           \    Solid State Drive / SSD (~0.1 - 0.2 ms)
 /_____________\   ---------------------------------
/               \  Hard Disk Drive / HDD (~1 - 10 ms)
```

### 2. Network & data exchange latency

Once data leaves a single machine and travels through cables, packet transit times and routing overhead take over

- Same data center / region: 1-10ms
- Cross-region: 50-150ms (bound ny the physical speed of light through glass fibers over thousands of kms)

- Global round tipe (Europe to South America): 250-400ms

```
                     /\
                    /  \          CPU Registers / Cache (< 1 - 4 ns)
                   /____\         --------------------------------------------------
                  /      \        Main Memory / RAM (~100 ns)
                 /________\       --------------------------------------------------
                /          \      Solid State Drive / SSD (~0.1 - 0.2 ms)
               /____________\     --------------------------------------------------
              /              \    Hard Disk Drive / HDD (~1 - 10 ms)
             /________________\   --------------------------------------------------
            /                  \  Network: Same Data Center / Region (~1 - 10 ms)
           /____________________\ --------------------------------------------------
          /                      \ Network: Cross-Region / Global (~50 - 250+ ms)
         /________________________\
```

## Optmizations

### To improve latency

- Move data closer to where it's needed
- Use memory caching (RAM over disk)
- Optimize indexing
- Minimize netwrok hops
- Implement CDNS

### To improve throughput

- Introduce concurrency and parellelism (add lanes to the highway)
- Scale horizontally
- Implement load balancing
- Partition/shard dbs
- Message queues to handle long-running tasks async
