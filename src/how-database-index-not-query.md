# How do database indexes work with NOT query?

Last time I talked about how database indexes perform a range search. This time I will dig into how indexes work with NOT query. I will use the same database schema and test data as before.

https://medium.com/@shiiyan/how-do-indexes-work-in-sql-range-search-4746cbcb01ce

## TL;DR

- NOT queries have an access type of range in the execution plan
- nested NOT queries are simplified by database engines using De Morgan's Law

## simple NOT query

Suppose table `coupons` has the following test data.

| coupon_code   | corporation_code | point_rate | usage_start_date    | usage_end_date      | distribution_limit |
| ------------- | ---------------- | ---------- | ------------------- | ------------------- | ------------------ |
| coupon_code_1 | corporation_a    | 0.0100     | 2023-01-03 00:00:00 | 2023-02-03 00:00:00 | 10000              |
| coupon_code_2 | corporation_a    | 0.0100     | 2023-01-02 00:00:00 | 2023-02-02 00:00:00 | 20000              |
| coupon_code_3 | corporation_a    | 0.0100     | 2023-01-01 00:00:00 | 2023-02-01 00:00:00 | 20000              |

A simple NOT query in MySQL is effectively the same as an OR query covering the negative value's upper and lower range.

```sql
-- The below queries are effectively the same.
SELECT * FROM coupons WHERE NOT (usage_start_date = '2023-01-02');
SELECT * FROM coupons WHERE usage_start_date < '2023-01-02' OR usage_start_date > '2023-01-02';
```

These two queries both have the same execution plan. The database engine scans one row for each half of the OR condition `usage_start_date < '2023-01-02` and `usage_start_date > '2023-01-02`. Then it combines the scanned range resulting in column `rows` being 2 in the execution plan below.

| id  | select_type | table   | partitions | type  | possible_keys                    | key                              | key_len | ref | rows | filtered | Extra                 |
| --- | ----------- | ------- | ---------- | ----- | -------------------------------- | -------------------------------- | ------- | --- | ---- | -------- | --------------------- |
| 1   | SIMPLE      | coupons |            | range | coupons_index_1_usage_start_date | coupons_index_1_usage_start_date | 4       |     | 2    | 100.00   | Using index condition |

## nested NOT query

When dealing with nested NOT queries, database engines usually simplify them by [De Morgan's Law](https://brilliant.org/wiki/de-morgans-laws/). The negation has no effect when someone negates an equation twice. Below is a simple example. In this example, `WHERE NOT (NOT (usage_start_date = '2023-01-02'))` is the same as `WHERE usage_start_date = '2023-01-02'`. The database engine uses a non-unique index to match a const, which results in an access type of `ref` and a ref type of `const` in the execution plan.

```sql
-- The below queries are effectively the same.
SELECT * FROM coupons WHERE NOT (NOT (usage_start_date = '2023-01-02'));
SELECT * FROM coupons WHERE usage_start_date = '2023-01-02';
```

| id  | select_type | table   | partitions | type | possible_keys                    | key                              | key_len | ref   | rows | filtered | Extra |
| --- | ----------- | ------- | ---------- | ---- | -------------------------------- | -------------------------------- | ------- | ----- | ---- | -------- | ----- |
| 1   | SIMPLE      | coupons |            | ref  | coupons_index_1_usage_start_date | coupons_index_1_usage_start_date | 4       | const | 1    | 100.00   |       |

Here is another example. According to De Morgan's Law, condition `NOT (usage_start_date < '2023-01-03' AND NOT(usage_start_date = '2023-01-01'))` is identical to condition `usage_start_date >= '2023-01-03' OR usage_start_date = '2023-01-01';`. The database engine uses the index on column `usage_start_date` to scan one row for part `>= 2023-01-03` and one row for part `= '2023-01-01`, that is a range search for two rows, as shown in the following execution plan.

```sql
-- The below queries are effectively the same.
SELECT * FROM coupons WHERE NOT (usage_start_date < '2023-01-03' AND NOT(usage_start_date = '2023-01-01'));
SELECT * FROM coupons WHERE usage_start_date >= '2023-01-03' OR usage_start_date = '2023-01-01';
```

| id  | select_type | table   | partitions | type  | possible_keys                    | key                              | key_len | ref | rows | filtered | Extra                 |
| --- | ----------- | ------- | ---------- | ----- | -------------------------------- | -------------------------------- | ------- | --- | ---- | -------- | --------------------- |
| 1   | SIMPLE      | coupons |            | range | coupons_index_1_usage_start_date | coupons_index_1_usage_start_date | 4       |     | 2    | 100.00   | Using index condition |
