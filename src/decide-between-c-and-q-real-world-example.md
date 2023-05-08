# Choice between Read Model and Domain Model: Explained With Real World CQRS Example

## TL;DR

## The Choice in CQRS
 
CQRS (Command-Query Responsibility Segregation) provides us with a choice between the read model and the domain model. We can either create a new model as a domain model, which will be saved in a data store, or we can create it as a read model, which we reconstruct using the data fetched from a data store.

<figure>

## How to make the choice

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

