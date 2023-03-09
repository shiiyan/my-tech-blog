# How do database indexes work with NOT query?

Last time I talked about how database indexes perform a range search. This time I will dig into how indexes work with NOT query. I will use the same database schema and test data as before.

https://medium.com/@shiiyan/how-do-indexes-work-in-sql-range-search-4746cbcb01ce

## TL;DR

## simple NOT query

A simple NOT query in MySQL is effectively the same as an OR query covering the negative value's upper and lower range.

```sql
-- The below queries are effectively the same.
SELECT * FROM coupons WHERE NOT (usage_start_date = '2023-01-02');
SELECT * FROM coupons WHERE usage_start_date < '2023-01-02' OR usage_start_date > '2023-01-02';
```

These two queries both have the same execution plan. The database engine scans one row for each half of the OR condition `usage_start_date < '2023-01-02` and `usage_start_date > '2023-01-02`. Then it combines the scanned range resulting in two rows in the execution plan below.

| id  | select_type | table   | partitions | type  | possible_keys                    | key                              | key_len | ref | rows | filtered | Extra                 |
| --- | ----------- | ------- | ---------- | ----- | -------------------------------- | -------------------------------- | ------- | --- | ---- | -------- | --------------------- |
| 1   | SIMPLE      | coupons |            | range | coupons_index_1_usage_start_date | coupons_index_1_usage_start_date | 4       |     | 2    | 100.00   | Using index condition |

## nested NOT query

## NOT query with OR