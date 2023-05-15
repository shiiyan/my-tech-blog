# Choice between Read Model and Domain Model: Explained With Real World CQRS Example

## TL;DR

## The Choice in CQRS

CQRS (Command-Query Responsibility Segregation) provides us with a choice between the read model and the domain model. A domain model represents a collection of valid data persisted in a data store. Meanwhile, a read model, usually as a DTO (Data Transfer Object), is the return value of a query service. The query service uses the data from the data store, which could be from more than one domain model, to construct a read model.

<img src="https://github.com/shiiyan/my-tech-blog/assets/36617009/121aca27-6b79-4788-974d-9eb0e54978fc" width="500">

I'm going to try and answer the following question. Should we use the domain model or the read model to implement a user story that involves a new collection of data?

## What kind of model should we use

### Our User Stories

Suppose we have a blog site comprising the following user stories.

- A guest can submit a guest post without registration.
- A member can submit a member post after registration.
- A post requires a title, email address of the writer, and content.
- The site admin can get a total number of posts and a list of past posts, including both guest posts and member posts, grouped by email address.

First, we might create models of Guest and GuestPost, Member and MemberPost in this way.

<img src="https://github.com/shiiyan/my-tech-blog/assets/36617009/35b68e25-ef6f-4cda-83e3-0a765605847a" width="300">

Then, we consider User and UserPostCount. Should we create them as read models or domain models?

Based on the CQRS diagram, if our decision is to create User and UserPostCount as read models, we can save guest posts and member posts separately. However, the task of collecting all the guest posts and member posts with the same email address as the target user, must be done every time a site admin visits the admin page.

<img src="https://github.com/shiiyan/my-tech-blog/assets/36617009/67b073cf-ec4f-4550-b56d-ca854cedb3cd" width="300">

If we decide User and UserPostCount should be domain models, we will need to store guest posts and member posts in the database, as well as retrieve the user with the same email address as the post and add one to the user's count of posts.

<img src="https://github.com/shiiyan/my-tech-blog/assets/36617009/9c7d5378-83e7-43c4-9470-0cc8415af434" width="300">

At this point, it is hard to say which way is better. It appears to be a waste of computing resource to add up the post count every time a site admin visits the admin page. But in reality, if we set up the correct index of email address in the guest post and member post tables, it won't be a huge issue, particularly when the amount of users is still minimal.

### A New User Story

new requirement

UserGroup

### Retrospective

how did we make the chioce

## Further Reading

https://www.martinfowler.com/bliki/CQRS.html
