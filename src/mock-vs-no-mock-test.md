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

To test this controller, we can start with a simple unit test by mocking the use case and asserting the return value of the controller. Our test ensures that when the parameters are valid and the order is successfully placed, OrderController will return that order to the client.

```php
class OrderControllerTest {
  public function testMakeOrder() {
    // prepare mock use case
    $mockUseCase = $this->createMock('MakeOrderUseCase')->method('handle')->willReturn($order);

    // set mock use case in our controller
    $sut = new OrderController();
    $sut->makeOrderUseCase = $mockUseCase;

    // execute and assert
    $actual = $sut->makeOrder(1, 1);
    $this->assertEquals($order, $actual);
  }
}
```

The test is effective as long as MakeOrderUseCase complies with its contract with OrderController, and keeps its interface unchanged. If we rename the use case to PlaceOrderUseCase for example, we have to update our mock first to avoid a Class Not Found error.

It sometimes becomes problematic that the mocked test cannot detect changes in the content of MakeOrderUseCase's return value. The return value can be any Order, but OrderController only needs the newly created one to return to the client, which the test cannot guarantee.

When structural and behavioral changes of MakeOrderUseCase occur frequently, it may be a better idea to create an unmocked test.

```php
class OrderControllerTest {


}


```

## Should we mock or not

It it not a simple linear question.

First we conside the cost of create a test.

In figure, we can have the following one.

## Conclusion

## References 
