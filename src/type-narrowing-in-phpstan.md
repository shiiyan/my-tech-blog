# Type Narrowing in PHPStan

Type narrowing is necessary when we want to deal with a particular case of a union-typed variable or class property.

SomeObject | null

will result in a TypeError

this is how to do it use PhpStan

in a service

in a class as a property

for more details,

https://phpstan.org/try

https://phpstan.org/writing-php-code/narrowing-types
