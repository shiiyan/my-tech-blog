# Shallow Copy vs. Deep Copy with Examples

## Shallow copy

In a shallow copy, the original object and the copied one share the same reference. Changes made to the original object will be reflected in the copied object. For example, we have the original orders of fruits.

```javascript
const originOrders = [
  { item: "apple", quantity: 1 },
  { item: "banana", quantity: 2 },
];
const copiedOrders = [...$originOrders];
originOrders[0].quantity += 1;

console.log(originOrders); // [{item: "apple", quantity: 2}, {item: "banana", quantity: 2}]
console.log(copiedOrders); // [{item: "apple", quantity: 2}, {item: "banana", quantity: 2}]
```

In this case, original orders array and copied orders array share the same reference to order (the element of the array of objects). If we increase the quantity by one of the order of apple, both arrays will be affected. Meanwhile preforming operations beyond the shared references will create difference between the two arrays.

```javascript
originOrders.push({ item: "pomegranate", quantity: 3 });

console.log(originOrders); // [{item: "apple", quantity: 2}, {item: "banana", quantity: 2}, {item: "pomegranate", quantity: 3}]
console.log(copiedOrders); // [{item: "apple", quantity: 2}, {item: "banana", quantity: 2}]
```

In JavaScript, all of the following methods creates shallow copies of objects.

- spread syntax
- Array.prototype.concat()
- Array.prototype.slice()
- Array.from()
- Object.assign()
- Object.create()
- ...

## Deep copy

In contrast to shallow copy, deep copy creates completely unrelated objects. A common way to do deep copy is through serialize/unserialize. In JavaScript, this can be done with `JSON.stringify()` and `JSON.parse()`.

```javascript
const originOrders = [
  { item: "apple", quantity: 1 },
  { item: "banana", quantity: 2 },
];
const copiedOrders = JSON.parse(JSON.stringify(originOrders));
originOrders[0].quantity += 1;

console.log(originOrders); // [{item: "apple", quantity: 2}, {item: "banana", quantity: 2}]
console.log(copiedOrders); // [{item: "apple", quantity: 1}, {item: "banana", quantity: 2}]
```

### Real world usage of deep copy

In unit tests, we want test cases inside a test class to be completely isolated, even though they share the same test fixtures. A convenient way to accomplish this is by utilizing deep copy.

We created functions to add and subtract quantity of an order, and unit tests were written accordingly. The unit tests should be independent, allowing the assertion to work properly no matter in what order the tests are examined.

```javascript
const addQuantity = (order, quantity) => {
  order.quantity += quantity;
};

const subtractQuantity = (order, quantity) => {
  order.quantity -= quantity;
};
```

```javascript
class OrderTest {
  testFixtures = [{ item: "apple", quantity: 1 }];

  testAddQuantity() {
    addQuantity(this.testFixtures[0]);
    assertEquals(2, this.testFixtures[0].quantity);
  }

  testSubtractQuantity() {
    subtractQuantity(this.testFixtures[0]);
    assertEquals(0, this.testFixtures[0].quantity); // this assertion will fail if testAddQuantity runs first.
  }
}
```

To do this, we introduce a cache layer for test data in our unit tests, ensuring that all test cases use fresh test fixtures by utilizing deep copy.

```javascript
class TestDataCache {
  dataMap = new Map();

  static set(key, value) {
    this.dataMap.set(key, JSON.stringify(value));
  }

  static get(key) {
    return JSON.parse(this.dataMap.get(key));
  }
}
```

```javascript
class OrderTest {
  testFixtures = [];

  setUpBeforeClass() {
    TestDataCache.set("OrderTest", [{ item: "apple", quantity: 1 }]);
  }

  setUp() {
    this.testFixtures = TestDataCache.get("OrderTest");
  }

  testAddQuantity() {
    addQuantity(this.testFixtures[0]);
    assertEquals(2, this.testFixtures[0].quantity); // all test cases use fresh fixtures.
  }

  testSubtractQuantity() {
    subtractQuantity(this.testFixtures[0]);
    assertEquals(0, this.testFixtures[0].quantity); // all test cases use fresh fixtures.
  }
}
```
