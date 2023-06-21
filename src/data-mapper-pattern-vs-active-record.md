# Data Mapper Pattern vs. Active Record Pattern, explained by examples

## Summary

## Active Reocrd Pattern

### Overview

The active record pattern encapsulates business logic and data persistence into the same object, which represents a row in an RDBMS table. Developers can naturally learn to perform CRUD operations on a database by following this pattern when creating an active record instance.

### Pseudocode

```typescript
class Orders extends ActiveRecord {
  private id: number;
  private itemId: number;
  private itemPrice: number;
  private quantity: number;

  getId(): number {}
  getItem(): number {}
  getQuantity(): number {}

  setId(id: number) {}
  setItem(itemId: number) {}
  setItemPrice(itemPrice: number) {}
  setQuantity(quantity: number) {}

  calculatePaymentAmount(): number {
    return this.itemPrice * this.quantity;
  }
}

class ActiveRecord {
  constructor() {
    this.table = new Table('orders');
  }

  create() {}

  update() {}

  findById(id: number) {}

  delete();
}

class Table {
  private db: DatabaseConnection;
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.db = new DatabaseConnection();
  }

  insert(params) {}

  update(params) {}

  delete(params) {}
}
```

### History

Martin Fowler coined this term in his book P of EAA in 2003.

It is adapted by Ruby On Rails introduced in 2010?
after that becomes famous

### Criticism

## Data Mapper Pattern

implemented as DAO pattern.

## Repository Pattern
