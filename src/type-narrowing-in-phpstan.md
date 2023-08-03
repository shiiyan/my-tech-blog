# Type Narrowing in PHPStan

## Type narrowing

Type narrowing is necessary when we want to work with a particular case of a union-typed variable or class property. When dealing with a nullable variable, we might consider handling the non-null scenario first before moving on to the more complicated case when it has contents.

PHP language provides default tools like comparison operators and type-checking functions for this purpose. To narrow type, we use these tools either in an `if` statement or in an `assert()` call. PHPStan understands these kinds of type narrowing completely.

<img width="980" alt="Screenshot 2023-08-03 at 7 55 05 AM" src="https://github.com/shiiyan/my-tech-blog/assets/36617009/4e0ecca8-9837-4ac8-9870-815bb8985528">

## Type narrowing by custom type-checking functions

However, type hints become less obvious when we use a custom type-checking function and methods. During the analysis of the outer method `sayHello()`, PHPStan's analyzer doesn't recognize that the type has already been narrowed in the nested method `assertString()`, as it doesn't read the contents of the nested method, it only examines its return type declaration and PHPDocs.

<img width="975" alt="Screenshot 2023-08-03 at 8 14 33 AM" src="https://github.com/shiiyan/my-tech-blog/assets/36617009/597db34c-ad51-4286-8cc4-a64969a65d23">

To assist PHPStan in recognizing narrowed types after function and method calls, we need to supply additional type details. PHPStan provides supports of several PHPDoc tags for accomplishing this.

- `@phpstan-assert`
- `@phpstan-assert-if-true`
- `@phpstan-assert-if-false`

`@phpstan-assert` tag works well with function and methods that perform assertion or throw exceptions when type examination fails. It informs the analyzer of what type the property is after the function call.

<img width="978" alt="Screenshot 2023-08-03 at 8 32 50 AM" src="https://github.com/shiiyan/my-tech-blog/assets/36617009/21503e04-fb3c-4d43-b118-503dd39af185">

`@phpstan-assert-if-true` and `@phpstan-assert-if-false` are useful when the called method indicates type hints via boolean return value and doesn't throw exceptions.

<img width="984" alt="Screenshot 2023-08-03 at 9 21 07 AM" src="https://github.com/shiiyan/my-tech-blog/assets/36617009/636fd79b-e28d-4e95-8c16-54df9a7fcfea">

## More information

https://phpstan.org/writing-php-code/narrowing-types

https://phpstan.org/writing-php-code/phpdocs-basics#narrowing-types-after-function-call
