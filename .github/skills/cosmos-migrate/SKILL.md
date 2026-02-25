---
name: cosmos-migrate
description: 'Cosmos DB schema migration workflow for Meridian. Use when adding or modifying containers, partition keys, indexes, or repository methods. Guides safe schema evolution for a schemaless database.'
---

# Cosmos DB Schema Migration

## Overview

Meridian uses Azure Cosmos DB (NoSQL) with 8 containers. Unlike relational databases, there's no `ALTER TABLE` — schema evolution requires careful coordination across multiple files.

## Workflow

### 1. Update CONTAINER_DEFINITIONS

In `src/meridian/services/cosmos_repository.py`:

```python
CONTAINER_DEFINITIONS = {
    "patients": {
        "partition_key": "/id",
        "indexing_policy": {
            "compositeIndexes": [[...]],
            "excludedPaths": [{"path": "/*"}]
        }
    },
    # Add your new container here
    "new_container": {
        "partition_key": "/partitionKey",
        "indexing_policy": { ... }
    }
}
```

### 2. Update RepositoryProtocol

In `src/meridian/services/protocols.py`, add abstract method signatures:

```python
class RepositoryProtocol(Protocol):
    async def get_new_thing(self, id: str) -> dict | None: ...
    async def create_new_thing(self, data: dict) -> dict: ...
    async def list_new_things(self, **filters) -> list[dict]: ...
```

### 3. Implement in CosmosRepository

In `src/meridian/services/cosmos_repository.py`, implement the methods:

```python
async def get_new_thing(self, id: str) -> dict | None:
    container = self._database.get_container_client("new_container")
    try:
        return await container.read_item(item=id, partition_key=id)
    except CosmosResourceNotFoundError:
        return None
```

### 4. Add/Update Tests

- **Cosmos tests** (`tests/cosmos/`): Test repository methods against emulator
- **API tests** (`tests/api/`): Test new endpoints if any
- **Unit tests** (`tests/unit/`): Mock the new protocol methods

### 5. Test with Emulator

```bash
# Cosmos tests need Docker and confcutdir flag
.venv\Scripts\python.exe -m pytest tests/cosmos/ --confcutdir=tests/cosmos -v
```

**Testcontainers config**: `partition_count >= number of containers`, `mem_limit=4g`, `nano_cpus=4B`

## Partition Key Design

| Principle | Guidance |
|-----------|----------|
| High cardinality | Choose keys with many distinct values |
| Even distribution | Avoid hot partitions |
| Query alignment | Partition key should be in most queries |
| Cross-partition | Avoid cross-partition queries for hot paths |

## Checklist

- [ ] `CONTAINER_DEFINITIONS` updated with partition_key + indexing_policy
- [ ] `RepositoryProtocol` updated with new method signatures
- [ ] `CosmosRepository` implements all new protocol methods
- [ ] `provision_containers()` will create the new container at startup
- [ ] Container count documented (update from "8 containers" if changed)
- [ ] Cosmos tests added (`tests/cosmos/`)
- [ ] API tests added if new endpoints (`tests/api/`)
- [ ] Unit tests mock new protocol methods (`tests/unit/`)
- [ ] Tested against emulator with `--confcutdir=tests/cosmos`
