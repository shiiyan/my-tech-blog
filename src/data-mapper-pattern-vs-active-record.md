# Data Mapper Pattern vs. Active Record Pattern, explained by examples

## Summary

## Active Reocrd Pattern

### Overview

The active record pattern encapsulates business logic and data persistence into the same object, which represents a row in an RDBMS table. Developer can naturally learn to perform CRUD operations on a database by following this pattern when creating an active record instance.

### Pseudocode

```typescript
class Order extends ActiveRecord {}

class ActiveRecord {}

class Table {}

class Row {}
```

### History

Martin Fowler coined this term in his book P of EAA in 2003.

It is adapted by Ruby On Rails introduced in 2010?
after that becomes famous

### Criticism

## Data Mapper Pattern

## Repository Pattern
