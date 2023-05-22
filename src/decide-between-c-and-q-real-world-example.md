# Choice between Read Model and Domain Model: Explained With Real World CQRS Example

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

An additional requirement has been added to our user stories.

- An administrator of the website can make user groups based on the number of posts by users.
- A user group contains a name, the conditions needed to be part of the group and the users that belong to it.

First, we should create an aggregation known as UserGroup.

<img src="https://github.com/shiiyan/my-tech-blog/assets/36617009/d9d85f87-1b29-4c7a-bf09-e33c4e6dbe1a" width="300">

The diagram indicates that we need to include UserId, which is the User's identifier, as well as the identifier of a GroupMember. It's difficult to model a group member using only Guest and Member, since UserGroup is made up of User, not Guests or Members. Now, User is no longer an aggregation result that is displayed on the admin page, but it is an essential domain with an identifier that is a dependency of another domain.

Next, let’s consider UserPostCount. If we keep treating it as a read model, then these use cases must be implemented to meet the requirements.

- Whenever the administrator accesses the user admin page, we calculate the total number of posts from MemberPosts and GuestPosts that have the same email address as the User.
- Whenever the administrator creates a new UserGroup or changes the GroupCondition of an existing UserGroup, we calculate the UserPostCount of all Users and decide who belongs to the new group by comparing the UserPostCount of the User and of the GroupCondition.
- Whenever a User submits a new post, we gathering the GroupCondition of all UserGroups and decide which group the User should join by comparing the UserPostCount of the GroupCondition and of the User.

The calculation of UserPostCount using GuestPosts and MemberPosts appeared in all three use cases. Duplication is connected with dependency, so if we alter the UserPostCount calculation, we have to guarantee the three use cases all still work.

We can eliminate duplication by creating a CountUserPostQueryService, a common query service for calculating UserPostCount, and injecting it into the use cases. But it does not change the fact that these use cases still rely on GuestPosts and MemberPosts, instead of UserPostCount directly. From this perspective, implementing UserPostCount as a read model would not be a very reasonable choice.

Here is the completed domain model of UserAggregation.

<img src="https://github.com/shiiyan/my-tech-blog/assets/36617009/8cf431da-11ed-4a04-971a-4edae2ee45c1" width="500">

### Retrospective

The decision between using a domain model or read model has no right answer. The answer will depend on the user stories we have and the system requirements we must meet. As long as we keep things reversible, we can try different approaches to find the best choice.

When making decisions, it's helpful to remember two good principles: reducing duplication and doing things once and once only. If a model is utilized by several domain models or use cases, making it a domain model would be a good starting point.

## Further Reading

https://www.martinfowler.com/bliki/CQRS.html
