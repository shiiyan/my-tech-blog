# Choice between Read Model and Domain Model: Explained With Real World CQRS Example

## TL;DR

## The Choice in CQRS

CQRS (Command-Query Responsibility Segregation) provides us with a choice between the read model and the domain model. A domain model represents a collection of valid data persisted in a data store. Meanwhile, a read model, usually as a DTO (Data Transfer Object), is the return value of a query service. The query service uses the data from the data store, which could be from more than one domain model, to construct a read model.

<img src="https://github.com/shiiyan/my-tech-blog/assets/36617009/121aca27-6b79-4788-974d-9eb0e54978fc" width="300">

Should we use the domain model or the read model while implementing a user story that involves a new collection of data?

## What kind of model should we use

### Our User Stories

Suppose we have a blog site comprising the following user stories.

- A guest can submit a guest post without registration.
- A member can submit a member post after registration.
- A post requires a title, email address of the writer, and content.
- The site admin can get a total number of posts, including both guest posts and member posts, grouped by email address.

We might create models of users and posts in this way.

<img src="https://github.com/shiiyan/my-tech-blog/assets/36617009/35b68e25-ef6f-4cda-83e3-0a765605847a" width="300">

Should we create User and UserPostCount as Read Models or Domain Models?

<img src="https://github.com/shiiyan/my-tech-blog/assets/36617009/67b073cf-ec4f-4550-b56d-ca854cedb3cd" width="300">

<img src="https://github.com/shiiyan/my-tech-blog/assets/36617009/9c7d5378-83e7-43c4-9470-0cc8415af434" width="300">

### A New User Story

new requirement

UserGroup

### Retrospective

how did we make the chioce
