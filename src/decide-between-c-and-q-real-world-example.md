# Choice between Read Model and Domain Model: Explained With Real World CQRS Example

## TL;DR

## The Choice in CQRS

CQRS (Command-Query Responsibility Segregation) provides us with a choice between the read model and the domain model. A domain model represents a collection of valid data persisted in a data store. Meanwhile, a read model, usually as a DTO (Data Transfer Object), is the return value of a query service. The query service uses the data from the data store, which could be from more than one domain model, to construct a read model.

> insert figure of CQRS (domain model and read model)

Should we use the domain model or the read model while implementing a user story that involves a new collection of data?

## What kind of model should we use

### Our User Stories

User

- Guest
- Member

Post

- GuestPost
- MemberPost

UserPostCount as Read Model (Q) or Domain Model (C)

### A New User Story

new requirement

UserGroup

### Retrospective

how did we make the chioce
