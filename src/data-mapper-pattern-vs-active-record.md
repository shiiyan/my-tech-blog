# Active Record Pattern vs. Repository Pattern: A Comprehensive Comparison

## Introduction

In the world of software development, the bridge between relational databases and object-oriented programming languages has always been crucial. This bridge, often referred to as Object-Relational Mapping, seamlessly connects the object-oriented web application to the relational structured databases. It enables developers to manipulate database records using more intuitive object-oriented constructs, instead of writing nasty raw SQL queries. This ensures a more consistent and maintainable codebase.

Over the years, different patterns have emerged, each offering its own approach to encapsulating the complexities of relational database interactions in objects. Among these, the Active Record and the Repository Patterns are widely adopted by famous web frameworks. In this article, I'll explore their differences and offers my thoughts on how to choose the one that fits best for your projects.

## Overview of Active Record Pattern

The active record pattern is a software architecture pattern that seamlessly integrates both business logic and data persistence within a single object. This object typically mirrors a row in a relational database management system (RDBMS) table. With this pattern, when developers instantiate an active record object, they are essentially working directly with a corresponding database row. This direct representation makes it straightforward and intuitive for developers to perform create, read, update and delete (CRUD) operations on the databases, thereby simplifying database interactions.

![image](https://github.com/shiiyan/my-tech-blog/assets/36617009/2b615edf-b500-40b9-ba97-e7cbc58e212e)

The concept of the active record pattern was popularized by Martin Fowler in his seminal work, "Patterns of Enterprise Application Architecture" (P of EAA), published in 2003. It gained substantial traction and recognition when it was adopted by the Ruby on Rails (RoR) framework, which was introduced in 2010. The seamless implementation of the active record pattern in RoR contributes significantly to the framework's popularity, making it a go-to choice for many web developers. RoR's active record implementation not only simplifies database interactions but also ensures that developers adhere to best practices while working with databases.

## Overview of Repository Pattern

### Understanding the Data Mapper Pattern

Before diving into the repository pattern, it's essential to first grasp the concept of the data mapper pattern. In contrast to the active record pattern, the data mapper pattern is designed with the primary objective of separate the in-memory objects from the complexity of database access.

![image](https://github.com/shiiyan/my-tech-blog/assets/36617009/e855285f-9021-4014-bb17-65f255d42a92)

The data mapper pattern ensures domain objects only contain business rules. Any task related to database operations is handed over to the data mapper layer. By separating these concerns, developers can make sure that changes in one don't unintentionally impact the other, leading to more modular, flexible, and maintainable applications.

### the Repository Layer

The repository pattern introduces an additional layer upon the data mapper layer. The main purpose of the repository layer is to centralize the query construction code, providing a more object-oriented way of communicating with a set of objects. This becomes especially beneficial in scenarios where the queries are complex or
there are a large number of domain objects.

![image](https://github.com/shiiyan/my-tech-blog/assets/36617009/fcba7ef0-eb9b-4a37-8f19-ec25782a1a4d)

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

- [P of EAA: Active Record](https://www.martinfowler.com/eaaCatalog/activeRecord.html)
- [Active Record Basics — Ruby on Rails Guides](https://guides.rubyonrails.org/active_record_basics.html)
- [P of EAA: Data Mapper](https://martinfowler.com/eaaCatalog/dataMapper.html)
- [P of EAA: Repository](https://martinfowler.com/eaaCatalog/repository.html)

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
