# Understanding RPC (Remote Procedure Call)

- Allows a program to execute a piece of code on a remote server as if it were a local function call on the developer's own machine
- It allows developers to write distributed software without getting bogged down in how bytes moves across the wire
  - sockets
  - serialization
  - byte-ordering
  - data transmission

Local call:

- Your code calls a function
- Computer pushes the variables onto the local CPU stack
- Moves execution to the memory address of that function
- Returns result

Remote call:

- Code calls a function
- RPC packages the arguments, passes them over the internet to another server
- Runs calculations there
- Passes answer back to your code

## RPC vs. REST (HTTP)

| Feature      | RPC                                                                   | REST                                                                |
| ------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Core concept | Actions/Verbs. You're calling a function                              | Resources/Nouns. Manipulating data using HTTP methods and URL paths |
| Data format  | Usually binary (Protobuf, Avro)                                       | JSON/XML (normally human-readable)                                  |
| Coupling     | Tigher coupling. Client/server share the same interface contract      | Loose coupling. Client interacts with URLs and HTTP methods         |
| Primary use  | High-performance, internal microservice-to-microservice communication | Publicly exposed APIs, frontend-backend communication               |
