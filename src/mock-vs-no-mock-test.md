# Testing with or without Mocks: a non-linear perspective

Mocking can be helpful in testing as it simplifies fixture preparation and speeds up test-running. Yet, it can cause issues if overused. Whether to use a mock or not is a well-discussed question. In this article, I’ll be sharing my thoughts on the matter and providing my answer to this question.

## Mocking a test

Let’s consider implementing this user story using a three-layered DDD architecture.

- Customers can make orders for products.

We might create these classes.

- Controller
  - OrderController
- UseCase
  - MakeOrderUseCase
- Domain
  - Order
  - Product
  - Customer

## Comparison of mocking and not mocking

## Conclusion

## References 
