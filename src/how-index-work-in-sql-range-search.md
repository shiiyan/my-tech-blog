# How do indexes work in SQL range search

I always need clarification about indexes, how they work, and why they can improve SQL query performance. In this article, I want to answer these questions by exploring an example of a range search. If you have the same questions, this article will help you.

## TL;DR

- Rule of thumb: index for equality first then for ranges.

## What are SQL indexes

SQL indexes are just like a book's table of contents, which links a chapter title to its contents by page numbers. Like the table of contents, SQL indexes are sorted too. Technically speaking, SQL indexes have a sortable B-Tree (balanced search tree) structure.

For example, we create a table like the one below.

```sql
CREATE TABLE `coupons` (
  `coupon_code` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `corporation_code` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `point_rate` decimal(5,4) NOT NULL,
  `usage_start_date` timestamp NOT NULL,
  `usage_end_date` timestamp NOT NULL,
  `distribution_limit` int NOT NULL,
  PRIMARY KEY (`coupon_code`),
  KEY `coupons_index_1_usage_start_date` (`usage_start_date`),
  KEY `coupons_index_2_usage_end_date` (`usage_end_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

Other than the index of the primary key coupon_code, there are two indexes for columns usage_start_date and usage_end_date, respectively. We will focus on the index of usage_start_date right now. Suppose we have data like the following.

| coupon_code   | corporation_code | point_rate | usage_start_date    | usage_end_date      | distribution_limit |
| ------------- | ---------------- | ---------- | ------------------- | ------------------- | ------------------ |
| coupon_code_1 | corporation_a    | 0.0100     | 2023-01-03 00:00:00 | 2023-02-03 00:00:00 | 10000              |
| coupon_code_2 | corporation_a    | 0.0100     | 2023-01-02 00:00:00 | 2023-02-02 00:00:00 | 20000              |
| coupon_code_3 | corporation_a    | 0.0100     | 2023-01-01 00:00:00 | 2023-02-01 00:00:00 | 20000              |

When we perform the following query without any index,

```sql
SELECT * FROM coupons WHERE usage_start_date = '2022-01-01';
```

the execution plan would be like the following.

| id  | select_type | table   | partitions | type | possible_keys | key | key_len | ref | rows | filtered | Extra       |
| --- | ----------- | ------- | ---------- | ---- | ------------- | --- | ------- | --- | ---- | -------- | ----------- |
| 1   | SIMPLE      | coupons |            | ALL  |               |     |         |     | 3    | 33.33    | Using where |

The execution plan tells us that even if the usage_start_date provided in the query is one year before the actual data, the database engine must first fetch all three rows from storage before it can perform the comparison and generate an empty result in the end.

Now we add the index for usage_start_date like the one below.

| usage_start_date | row_id |
| ---------------- | ------ |
| 2023-01-01       | 3      |
| 2023-01-02       | 2      |
| 2023-01-03       | 1      |

The execution plan for the same query becomes

| id  | select_type | table   | partitions | type | possible_keys                    | key                              | key_len | ref   | rows | filtered | Extra |
| --- | ----------- | ------- | ---------- | ---- | -------------------------------- | -------------------------------- | ------- | ----- | ---- | -------- | ----- |
| 1   | SIMPLE      | coupons |            | ref  | coupons_index_1_usage_start_date | coupons_index_1_usage_start_date | 4       | const | 1    | 100.00   |       |

Instead of a full table scan, the database engine fetches one row this time. Since all dates in the database are older than the provided date, the index search will stop at the first node of 2023-01-01, resulting in an empty set.

Now we add some complexity to the query's where condition. Consider the following query,

```sql
SELECT * FROM coupons WHERE usage_start_date = '2022-01-01' OR usage_end_date = '2023-02-01';
```

If there are no indexes in this table, the database engine will perform a full table scan before completing the comparison.

| id  | select_type | table   | partitions | type | possible_keys | key | key_len | ref | rows | filtered | Extra       |
| --- | ----------- | ------- | ---------- | ---- | ------------- | --- | ------- | --- | ---- | -------- | ----------- |
| 1   | SIMPLE      | coupons |            | ALL  |               |     |         |     | 3    | 33.33    | Using where |

If there are indexes, the database engine will utilize two indexes of column usage_start_date and usage_end_date to narrow down rows to fetch separately, then union the results.

| id  | select_type | table   | partitions | type        | possible_keys                                                   | key                                                             | key_len | ref | rows | filtered | Extra                                                                                     |
| --- | ----------- | ------- | ---------- | ----------- | --------------------------------------------------------------- | --------------------------------------------------------------- | ------- | --- | ---- | -------- | ----------------------------------------------------------------------------------------- |
| 1   | SIMPLE      | coupons |            | index_merge | coupons_index_1_usage_start_date,coupons_index_2_usage_end_date | coupons_index_1_usage_start_date,coupons_index_2_usage_end_date | 4,4     |     | 2    | 100.00   | Using union(coupons_index_1_usage_start_date,coupons_index_2_usage_end_date); Using where |

## How do indexes work in range search

Consider the following query.

```sql
SELECT * FROM coupons WHERE usage_start_date BETWEEN '2023-01-01' AND '2023-01-02';
```

The execution plan for this query is

| id  | select_type | table   | partitions | type  | possible_keys                    | key                              | key_len | ref | rows | filtered | Extra                 |
| --- | ----------- | ------- | ---------- | ----- | -------------------------------- | -------------------------------- | ------- | --- | ---- | -------- | --------------------- |
| 1   | SIMPLE      | coupons |            | range | coupons_index_1_usage_start_date | coupons_index_1_usage_start_date | 4       |     | 2    | 100.00   | Using index condition |

The index search will start at the first index greater than or equal to '2023-01-01' and end at the first index greater than '2023-01-02'. All rows inside the searched range will be fetched. In this case, the database engine will fetch two rows with id 3 and 2.

Next, we add another condition to the query.

```sql
SELECT * FROM coupons WHERE usage_start_date BETWEEN '2023-01-01' AND '2023-01-02' AND distribution_limit = 20000;
```

It is obvious that we need an index covering both usage_start_date and distribution_limit columns to optimize this query. The question is in which order? We have two options.

coupons_index_3 (usage_start_date, distribution_limit)

| usage_start_date | distribution_limit | row_id |
| ---------------- | ------------------ | ------ |
| 2023-01-01       | 10000              | 3      |
| 2023-01-02       | 20000              | 2      |
| 2023-01-03       | 20000              | 1      |

coupon_index_4 (distribution_limit, usage_start_date)

| distribution_limit | usage_start_date | row_id |
| ------------------ | ---------------- | ------ |
| 10000              | 2023-01-01       | 3      |
| 20000              | 2023-01-02       | 2      |
| 20000              | 2023-01-03       | 1      |

In this case, they can both perform well and limit fetch targets to a single row. The difference is in the range of the index scan. For index coupons_index_3, usage_start_date is the only column that defines the index scan range because the search condition of usage_start_date is a range, and the database engine needs to scan all leaf nodes within the range to determine which rows to fetch. From the execution plan, we can tell that rows with id 3 and 2 are scanned, then distribution_limit is used to filter out row 1, resulting in a 50% filtering rate.

| id  | select_type | table   | partitions | type  | possible_keys                                                    | key             | key_len | ref | rows | filtered | Extra                 |
| --- | ----------- | ------- | ---------- | ----- | ---------------------------------------------------------------- | --------------- | ------- | --- | ---- | -------- | --------------------- |
| 1   | SIMPLE      | coupons |            | range | coupons_index_1_usage_start_date,coupons_index_3,coupons_index_4 | coupons_index_3 | 8       |     | 1    | 50.00    | Using index condition |

| id  | select_type | table   | partitions | type  | possible_keys                                    | key             | key_len | ref | rows | filtered | Extra                 |
| --- | ----------- | ------- | ---------- | ----- | ------------------------------------------------ | --------------- | ------- | --- | ---- | -------- | --------------------- |
| 1   | SIMPLE      | coupons |            | range | coupons_index_1_usage_start_date,coupons_index_4 | coupons_index_4 | 8       |     | 1    | 100.00   | Using index condition |

## Some good explanations of SQL indexes

- [How Does Indexing Work](https://chartio.com/learn/databases/how-does-indexing-work/)
- [The Search Tree (B-Tree) Makes the Index Fast](https://use-the-index-luke.com/sql/anatomy/the-tree)
- [Greater, Less and BETWEEN](https://use-the-index-luke.com/sql/where-clause/searching-for-ranges/greater-less-between-tuning-sql-access-filter-predicates)
