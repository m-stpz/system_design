# Hash Tables

- A hash table is a data structure that allows fast lookup regardless of the data size
- For this reason, it's widely used in:
  - db indexing
  - caching
  - program compilation
  - error checking

## Hashing algorithm/function

- Calculation applied to a key to transform it into an address
- For numeric keys, divide the key by the number of available addresses (n) and take the remainder

```bash
numeric_hash_value = key % n

# address = key Mod n
```

- For alphanumeric keys, divide the sum of ASCII codes in a key by the number available of available addresses (n) and take the remainder

```bash
alphanumeric_hash_value = getASCIICode(key) % n
```

Objectives of hash function

- Minimize collisions
- Uniform distribution of hash values
- Easy to calculate
- Resolve any conflicts
