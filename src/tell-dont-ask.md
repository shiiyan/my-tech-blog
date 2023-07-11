# Understanding the TDA(TellDontAsk) Principle

## TellDontAsk

In Object-oriented programming, TDA (Tell Don’t Ask) means telling an object to perform an action rather than asking for information and taking action on behalf of the object.

One of OOP's fundamental ideas is to bind behavior and data together. When a service class asks for information from an object and performs operations on it, it causes separation of behavior and data, with behavior implemented in the service class and data remained in the object.

Behavior and Data together. (tight coupled).

object and its client loosely coupled.

## Example

```typescript
type Wallet = { cash: number };

class Customer {
  private wallet: Wallet = { cash: 100 };

  public getWallet(): Wallet {
    return this.wallet;
  }

  public setWallect(wallet: Wallet): void {
    this.wallet = wallet;
  }
}

class PayBillService {
  public handle(paymentAmount: number): void {
    const customer = new Customer();
    const wallet: Wallet = { cash: customer.getWallet().cash - paymentAmount };
    customer.setWallect(wallet);
  }
}

new PayBillService().handle(10);
```

```typescript
type Wallet = { cash: number };

class Customer {
  private wallet: Wallet = { cash: 100 };

  public pay(paymentAmount: number) {
    this.wallet.cash -= paymentAmount;
  }
}

class PayBillService {
  public handle(paymentAmount: number): void {
    const customer = new Customer();
    customer.pay(paymentAmount);
  }
}

new PayBillService().handle(10);
```

## My thoughts

put in mind.
but not for every objects.

https://media.pragprog.com/articles/jan_03_enbug.pdf

https://martinfowler.com/bliki/TellDontAsk.html
