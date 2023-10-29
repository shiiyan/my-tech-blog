# Active Record Pattern vs. Repository Pattern: Making the Right Choice

## Introduction

In the world of software development, the bridge between relational databases and object-oriented programming languages has always been crucial. This bridge, often referred to as Object-Relational Mapping, seamlessly connects the object-oriented web application to the relational structured databases. It enables developers to manipulate database records using more intuitive object-oriented constructs, instead of writing nasty raw SQL queries. This ensures a more consistent and maintainable codebase.

Over the years, different patterns have emerged, each offering its own approach to encapsulating the complexities of relational database interactions in objects. Among these, the Active Record and the Repository Patterns are widely adopted by famous web frameworks. In this article, I'll explore their differences and offers my thoughts on how to choose the one that fits best for your projects.

## Overview of the Active Record Pattern

The active record pattern is a software architecture pattern that seamlessly integrates both business logic and data persistence within a single object. This object typically mirrors a row in a relational database management system (RDBMS) table. With this pattern, when developers instantiate an active record object, they are essentially working directly with a corresponding database row. This direct representation makes it straightforward and intuitive for developers to perform create, read, update and delete (CRUD) operations on the databases, thereby simplifying database interactions.

![image](https://github.com/shiiyan/my-tech-blog/assets/36617009/2b615edf-b500-40b9-ba97-e7cbc58e212e)

The concept of the active record pattern was popularized by Martin Fowler in his seminal work, "Patterns of Enterprise Application Architecture" (P of EAA), published in 2003. It gained substantial traction and recognition when it was adopted by the Ruby on Rails (RoR) framework, which was introduced in 2010. The seamless implementation of the active record pattern in RoR contributes significantly to the framework's popularity, making it a go-to choice for many web developers. RoR's active record implementation not only simplifies database interactions but also ensures that developers adhere to best practices while working with databases.

## Overview of the Repository Pattern

### Understanding the Data Mapper Pattern

Before diving into the repository pattern, it's essential to first grasp the concept of the data mapper pattern. In contrast to the active record pattern, the data mapper pattern is designed with the primary objective of separate the in-memory objects from the complexity of database access.

![image](https://github.com/shiiyan/my-tech-blog/assets/36617009/e855285f-9021-4014-bb17-65f255d42a92)

The data mapper pattern ensures domain objects only contain business rules. Any task related to database operations is handed over to the data mapper layer. By separating these concerns, developers can make sure that changes in one don't unintentionally impact the other, leading to more modular, flexible, and maintainable applications.

### The Repository Layer

The repository pattern introduces an additional layer upon the data mapper layer. The main purpose of the repository layer is to centralize the query construction code, providing a more object-oriented way of communicating with a collection of objects. This becomes especially beneficial in scenarios where the queries are complex or there are a large number of domain objects.

<img width="1568" alt="image" src="https://github.com/shiiyan/my-tech-blog/assets/36617009/02b7292a-ab79-4d55-893d-c231926f0c30">

Repositories act as domain object collections. This makes data operations - like adding, removing, or querying objects - feel like you're simply working with in memory collection-like data structures. By pooling all the query construction code into repositories, the codebase remains DRY (Don't Repeat Yourself). This centralized approach makes changes to data operation localized, reducing the risk of unintended side effects.

## Direct Comparison

### Scalability

#### The Bloated User Model

Let's start with an simple example of a blogging platform. On this platform, a user can write articles, post comments on these articles, and also like them. Adopting the active record pattern, we would implement a `User` model like the following. The pseudo code is written in a JavaScript fashion.

```javascript
class User extends ActiveRecord {
  hasMany = ["Article", "Comment", "Like"];

  addArticles(title, content) {
    this.Article.create(title, content);
  }

  commentOnArticle(article, commentText) {
    article.Comment.create(this, commentText);
  }

  likeArticle(article) {
    this.Like.create(article);
  }
}
```

Using just a couple lines of code, we've set up the core functionalities of our blogging platform. Everything looks concise and clean. But as the platform grows, more features get added:

1. Soft Deletion: Instead of permanently deleting user records, we need a mechanism to mark users as 'soft deleted.' This way, they're hidden from regular operations but can be restored if needed.
2. Validation Logic:
   - Article Content: It's essential that every article has content. We can't have blank articles being saved.
   - Comment Length: Comments have constraints too. They must adhere to a specified minimum and maximum length to ensure both relevance and readability.
3. Notifications: When a new comment is added to an article, it's required to notify the article's author about this new interaction.

Implementing each of these features, the `User` model starts getting bloated.

```javascript
class User extends ActiveRecord {
  hasMany = ["Article", "Comment", "Like"];
  actsAs = ["SoftDelete"];
  validate = {
    Article: {
      content: "NotBlank",
    },
    Comment: {
      text: {
        MinLength: 5,
        MaxLength: 500,
      },
    },
  };

  addArticle(title, content) {
    this.Article.create(title, content);
  }

  commentOnArticle(article, commentText) {
    article.Comment.create(this, commentText);
  }

  likeArticle(article) {
    this.Like.create(article);
  }

  getActiveUser() {
    return this.find({ isDeleted: false });
  }

  afterSave(article, comment) {
    article.User.notify(
      `New comment on your article titled "${article.title}"`
    );
  }

  notify(message) {
    // send notifications to external services.
  }
}
```

Active Record Pattern here tightly couples domain logic with data persistence in relational databases. When such an intertwining occurs, developers often find themselves thinking primarily from a data persistence perspective, rather than focusing on the pure domain logic of the application.

Consider the way we approach the additional requirements. We internally transform these requirements into more database-centric questions: How do we persist related data, such as Articles and Comments? What types of validation should be applied before saving the data? How do we send notifications after saving the data? What conditions should we set when querying the saved data? When web frameworks provide convenient methods or hooks to handle these scenarios, it's tempting to put all these functionalities into one class.

As a result, our model becomes a "god class", which handles everything in one place. The `User` model now has responsibilities for things from validation logic, business rules, the details of how data is persisted (soft deletion) and fetched to interactions with external services. In real-world scenarios, it's usual for such a model to span over 1000 lines of code.

As complexity grows exponentially, it becomes more challenging to read, understand and debug our model. Also modifying such a bulky class is risky. With so many functionalities packed into a single place, even minor modifications can lead to unexpected side effects, potentially affecting seemingly unrelated features.

#### Embracing the Repository Pattern and DDD Tactical Design

To address the pitfalls we've identified with the bloated `User` model, we can turn to a combination of the Repository pattern and the Domain-Driven Design (DDD) tactical approach.

By adhering to the Single Responsibility Principle (SRP), we restructure our codebase to ensure each class does only what it's supposed to:

1. User Domain: This is the core domain, handling the primary functionalities of a user and maintaining the referential integrity between the User, Article, and Comment entities. It encapsulates the core business logic of our application.
2. UserRepository: This is dedicated to data persistence and retrieval tasks. It abstracts away the details of database operations.
3. CommentPostedEvent: As the name suggests, this class indicates that a comment has been posted. It is used to decouple side-effects (sending notification) from main operations (posting comments).
4. Notifier: A class designated to handle notification.

Combining all of the above, let's look at the source code.

```javascript
// User Domain
class User {
  id: number;
  name: string;
  isDeleted: boolean;
  articles: Article[]; // A list of articles associated with this user
  comments: Comment[]; // A list of comments associated with this user
  userLikes: Like[]; // A list of likes associated with this user

  addArticle(title, content) {
    this.articles.push(new Article(this, title, content));
  }

  commentOnArticle(article: Article, commentText: string) {
    const comment = new Comment(this, article, commentText);
    this.comments.push(comment);
    article.addComment(comment);

    // Dispatch an event when a comment is posted
    const event = new CommentPostedEvent(comment);
    event.dispatch();
  }

  likeArticle(article) {
    this.userLikes.push(new Like(this, article));
  }
}
```

```javascript
// 2. UserRepository
class UserRepository {
  database: any; // This can be a reference to a database connection

  save(user: User) {
    this.database.save(user);
  }

  findById(id: number): User | null {
    return this.database.findById(id);
  }

  findActive(): User[] {
    return this.database.findAllBy({ isDeleted: false });
  }

  // ... Additional CRUD operations ...
}
```

```javascript
// 3. CommentPostedEvent
class CommentPostedEvent {
  comment: Comment;

  dispatch() {
    // Notify the system that a comment has been posted
    // This is just a showcase. Real-world applications mostly use pub/sub pattern here.
    Notifier.sendNotification(this.comment);
  }
}
```

```javascript
// 4. Notifier
class Notifier {
  static sendNotification(comment: Comment) {
    // Logic to send notification, e.g., email or push notification
    console.log(
      `Notification: New comment posted by ${comment.user.name} on article ${comment.article.title}`
    );
  }
}
```

With this structure, changes made to the `UserRepository` , for instance, won't directly impact the `User` domain and vice versa. This approach makes our codebase more resilient to changes in business requirements and data persistence specifics.

### Flexibility(Portability)

When it comes to the flexibility of managing persistence mechanisms, the active record pattern can present more challenges than the repository pattern. The active record pattern is less modular because the domain model is closely tied to a specific persistence mechanism, such as a relational database or a document-based NoSQL database. Consequently, any global alterations in the persistence mechanism equate to modifying the domain model's content. If you transition from a NoSQL to an SQL database, those changes might include:

- Modifying how data is serialized/deserialized for NoSQL.
- Adjusting queries (or ORM) for SQL.
- Restructuring the domain model to align with the new database schema.

The repository pattern shines in such circumstances. Its strength lies in its ability to maintain a consistent repository interface, even when the underlying persistence mechanism changes. If a decision is made to switch the data store, developers can simply design a new repository tailored for that data store. The beauty of the repository pattern is that there's no obligation to modify the domain object itself, ensuring a smoother transition of persistent mechanism and greater flexibility in design choices.

```javascript
interface UserRepository {
  save(user: User): void;
  findById(id: number): User | null;
  // other CRUD methods ...
}
```

```javascript
class RedisUserRepository implements UserRepository {
  private client: RedisClient;

  save(user: User) {
    this.client.set(`user:${user.id}`, JSON.stringify(user));
  }

  findById(id: number): User | null {
    const data = this.client.get(`user:${id}`);
    if (!data) {
      return null;
    }

    const userData = JSON.parse(data);
    return new User(userData.id, userData.username, userData.isDeleted); // reconstruct other properties ...
  }

  // other CRUD methods ...
}
```

```javascript
class MySQLUserRepository implements UserRepository {
  private connection: MysqlConnection;

  save(user: User) {
    this.database.save(user);
  }

  findById(id: number): User | null {
    return this.database.findById(id);
  }

  // ... Additional CRUD operations ...
}
```

### Testability

when consider which unit test is an important part

(### Complexity)

(learning curve)

## Making the Right Choice

When xxx, you should use Active Record,

when xxx, you should use Repository.

DDD
with complex domain
scalability
with plan to extends

## Further Reading & Resources

- [P of EAA: Active Record](https://www.martinfowler.com/eaaCatalog/activeRecord.html)
- [Active Record Basics — Ruby on Rails Guides](https://guides.rubyonrails.org/active_record_basics.html)
- [P of EAA: Data Mapper](https://martinfowler.com/eaaCatalog/dataMapper.html)
- [P of EAA: Repository](https://martinfowler.com/eaaCatalog/repository.html)
- https://softwareengineering.stackexchange.com/a/108852
- some resource of DDD
