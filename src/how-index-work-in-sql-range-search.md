# How do SQL indexes work in SQL range search?

I always need clarification about indexes, how they work, and why they can improve SQL query performance. In this article, I want to answer these questions by exploring an example of a range search. If you have the same questions, this article will help you.

## What are SQL indexes

SQL indexes are just like a book's table of contents, which links a chapter title to its contents by page numbers. Like the table of contents, SQL indexes are sorted too. Technically speaking, SQL indexes have a sortable B-Tree (balanced search tree) structure.

For example, we create a table like the one below.

```sql
CREATE TABLE `coupons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

## Some good explanations of SQL indexes

https://chartio.com/learn/databases/how-does-indexing-work/
