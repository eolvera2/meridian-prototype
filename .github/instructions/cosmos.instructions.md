---
globs: src/meridian/services/cosmos_repository.py
---

# Cosmos DB Repository Instructions

## Container Definitions

`CONTAINER_DEFINITIONS` is a `dict[str, dict]` with `partition_key` + `indexing_policy` (composite indexes and excluded paths). When adding containers:
1. Add entry to `CONTAINER_DEFINITIONS`
2. `provision_containers()` will create it at startup

## Protocol Sync

Every public method in `CosmosRepository` MUST have a matching signature in `RepositoryProtocol` (`protocols.py`). Keep them in sync.

## Return Types

Repository methods return **plain dicts** — not Pydantic models, not ORM objects. Routes convert to Pydantic response models.

## Client Lifecycle

- `CosmosClient` is initialized in the FastAPI lifespan handler
- Stored on `app.state` via `repo_factory`
- Closed on shutdown — do not create additional clients

## Current State

8 containers with partition keys. Update this count if adding containers.
