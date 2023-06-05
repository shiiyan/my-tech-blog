# Testing with or without Mocks: a non-linear perspective

Mocking can be helpful in testing as it simplifies fixture preparation and speeds up test-running. Yet, it can cause issues if overused. Whether to use a mock or not is a well-discussed question. In this article, I’ll be sharing my thoughts on the matter and providing my answer to this question.

## Mocking a test

Let’s consider implementing this user story.

- Customers can make orders of products.

According to the three-layered DDD architecture, we might have these classes.

- Controller Layer
  - OrderController
- Use Case Layer
  - MakeOrderUseCase
- Domain Layer
  - Order
  - Product
  - Customer

The following is a possible implementation of OrderController.

```php
class OrderController {
	public function makeOrder(int $productId, int $customerId) {
    // validations of $productId and $customerId.
    $order = $this->makeOrderUseCase->handle($productId, $customerId);
    return $order;
  }
}
```

how should we test this controller?

## Comparison of mocking and not mocking

## Conclusion

## References 
