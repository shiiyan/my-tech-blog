# Moment.js is a legacy project

https://momentjs.com/docs/#/-project-status/recommendations/

Moment is popular javascript datetime library, but it now becomes a legacy project.

Main reasons are

- Moment is mutable.
- Moment tends to increase its size under internationalizaion or time zone support.

## Moment is mutable

https://momentjs.com/guides/#/lib-concepts/mutability/

```javascript
var a = moment("2016-01-01");
var b = a.add(1, "week");
a.format();
// "2016-01-08T00:00:00-06:00"
```

In order to perserve previous state of moment object, one needs to clone that object before mutating.

```javascript
var a = moment("2016-01-01");
var b = a.clone().add(1, "week");
a.format();
// "2016-01-01T00:00:00-06:00"
```

According to Moment's document, this behavior is comes to most new users a surprise.

## Moment's immutable alternatives

Immutability means when a object can not be altered in place, instead a cloned object with new state is returned.

A example of Luxon.

https://moment.github.io/luxon/#/tour?id=immutability

```javascript
// Math
// This is easier to show than to tell. All of these calls return new DateTime instances:
var dt = DateTime.now();
dt.plus({ hours: 3, minutes: 2 });
dt.minus({ days: 7 });
dt.startOf("day");
dt.endOf("hour");
```

A example of Day.js.

https://day.js.org/docs/en/manipulate/add

```javascript
const a = dayjs();
const b = dayjs().add(7, "day");

// a -> the original value and will not change
// b -> the manipulation result
```

## Why immutable is important with datetime objects

Datetime objects are generally considered as value objects.
They do not have an identifier nor lifecycle. They are naturally used like value.

```javascript
const a = 1;
const b = 2;
const c = a + b;

// c == 3, a == 1, b == 2
```

In the above example, if a becomes 3 in the end, it will be quite a surprise.
The same reason applies to datetime objects.

Immutablity is considered important to a solid application.
It becomes useful when original objects are used later.
If original objects are changed internally, it will be easier to make bugs.
These kind of bugs are difficult to detect since they tend to be runtime errors,
which happen during runtime.

For example,

```javascript
var orderedDate = moment("2016-01-01");
var paymentDueDate = orderedDate.add(1, "week");
var paymentDate = moment("2016-01-03");

if (orderedDate.isBefore(paymentDate)) {
  // ship the product
}
```
