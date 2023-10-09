# Active Record Pattern vs. Repository Pattern: A Comprehensive Comparison

## Introduction

In the world of software development, the bridge between relational databases and object-oriented programming languages has always been crucial. This bridge, often referred to as Object-Relational Mapping, seamlessly connects the object-oriented web application to the relational structured databases. It enables developers to manipulate database records using more intuitive object-oriented constructs, instead of writing nasty raw SQL queries. This ensures a more consistent and maintainable codebase.

Over the years, different patterns have emerged, each offering its own approach to encapsulating the complexities of relational database interactions in objects. Among these, the Active Record and the Repository Patterns are widely adopted by famous web frameworks. In this article, I'll explore their differences and offers my thoughts on how to choose the one that fits best for your projects.

## Overview of Active Record Pattern

The active record pattern encapsulates business logic and data persistence into the same object, which represents a row in an RDBMS table. Developers can naturally learn to perform CRUD operations on a database by following this pattern when creating an active record instance.

Martin Fowler coined this term in his book P of EAA in 2003.

It is adapted by Ruby On Rails introduced in 2010?
after that becomes famous

## Overview of Repository Pattern

## Direct Comparison

### Design Philosophy

### Granularity

### Flexibility

### Testability

### Scalability and Complexity

## Pros and Cons

### Recommendations

## Conclusion

## Further Reading & Resources

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
    this.table = new Table("orders");
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

## Data Mapper Pattern

implemented as DAO pattern.

## Repository Pattern
