# Testing with or without Mocks: a non-linear perspective

<img width="744" alt="image" src="https://github.com/shiiyan/my-tech-blog/assets/36617009/5544f238-d53a-4695-870a-270353a5b08f">

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

    // execute
    $actual = $sut->makeOrder(1, 1);

    // assert
    $this->assertEquals($order, $actual);
  }
}
```

The test is effective as long as MakeOrderUseCase complies with its contract with OrderController, and keeps its interface unchanged. If we rename the use case to PlaceOrderUseCase for example, we have to update our mock first to avoid a Class Not Found error.

It sometimes becomes problematic that the mocked test cannot detect changes in the content of MakeOrderUseCase's return value. The return value can be any Order, but OrderController only needs the newly created one to return to the client, which the test cannot guarantee.

When structural and behavioral changes of MakeOrderUseCase like above occur frequently, it may be a better idea to create an unmocked test.

```php
class OrderControllerTest {
  public function testMakeOrder() {
    // prepare test data
    $this->ProductRepository->save($product); // productId: 1
    $this->CustomerRepository->save($customer); // customerId: 1

    // execute
    $sut = new OrderController();
    $actual = $sut->makeOrder(1, 1);

    // assert
    $expected = $order;
    $this->assertEquals($expected, $actual);

    // clear test data
    $this->ProductRepository->clear();
    $this->CustomerRepository->clear();
    $this->OrderRepository->clear();
  }
}
```

This approach reduces the direct dependency of OrderControllerTest on MakeOrderUseCase at the cost of making it more expensive to create and run the test. Before running the test, we have to create and save a sample Product and Customer to the repositories. A connection to the test database is probably needed when executing the test. We clear all repositories after the test is done.

## Should we mock or not

Should we use mock or not is not a simple yes or no question. First, we consider the cost of test creation and execution.

<img width="500" alt="image" src="https://github.com/shiiyan/my-tech-blog/assets/36617009/7d445895-c151-44b5-9ca8-b1e4ce2810d6">

It's always easier to write and run mocked tests than unmocked ones, regardless of the number of test cases. As the number of test cases increase, I've noticed that the time it takes me to write an additional test case also increases. This is because when dealing with edge cases, a significant portion of the time is spent on designing the test, rather than writing the actual test code.

<img width="500" alt="image" src="https://github.com/shiiyan/my-tech-blog/assets/36617009/3b41dfbe-5237-47ae-a63f-df8b72152154">

Now, taking into account test effectiveness, namely the ability of a test to ensure system quality. Test effectiveness improvement decelerates with an increase in the number of test cases. Writing a test to cover an edge case that happens only 1% of the time will only increase test efficiency by 1%. At a certain point, the cost of creating a rare case test outweighs its effectiveness.

Based on the analysis, I prefer using a combination of mocked and unmocked tests to strike a balance between cost and effectiveness. I use unmocked tests for common cases and mocked ones for rare cases.
