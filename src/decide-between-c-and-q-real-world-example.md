# Choice between Read Model and Domain Model: Explained With Real World CQRS Example

## TL;DR

## The Choice in CQRS

CQRS (Command-Query Responsibility Segregation) provides us with a choice between the read model and the domain model. A domain model represents a collection of valid data persisted in a data store. Meanwhile, a read model, usually as a DTO (Data Transfer Object), is the return value of a query service. The query service uses the data from the data store, which could be from more than one domain model, to construct a read model.

> insert figure of CQRS (domain model and read model)

Should we use the domain model or the read model while implementing a user story that involves a new collection of data?

## What kind of model should we use

### Our User Stories

Suppose we have a blog site comprising the following user stories.

- A guest can submit a guest post without registration.
- A member can submit a member post after registration.
- A post requires a title, email address of the writer, and content.
- The site admin can get a total number of posts, including both guest posts and member posts, grouped by email address.

We might create models of users and posts in this way.

UserInterface

- Guest
- Member

PostInterface

- GuestPost
- MemberPost

Should we model UserPostCount as Read Model (Q) or Domain Model (C)

### A New User Story

new requirement

UserGroup

### Retrospective

how did we make the chioce
