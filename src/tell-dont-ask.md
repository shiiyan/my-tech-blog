# Understanding the TDA(TellDontAsk) Principle

## TellDontAsk

In Object-oriented programming, TDA (Tell Don’t Ask) means telling an object to perform an action rather than asking for information and taking action on behalf of the object.

One of OOP's fundamental ideas is to bind behavior and data together. When a service class asks for information from an object and performs operations on it, it causes separation of behavior and data, with behavior implemented in the service class and data remained in the object.

Behavior and data are best tightly coupled because they usually change together and for the same reason. This also decouples the object from the client, allowing it to concentrate on performing the operations and maintaining the validity of its state. Meanwhile, the client can handle the application logic, interaction between objects and communication with other layers. This kind of separation of concerns brings maintainability to the system in the long term.

## Example

Let's think of a real-world scenario. In restaurants, it's common for waiters to tell customers to pay their bills rather than asking for their wallets and taking cash from them. In the latter way, the customer can't be sure of how much cash has been taken out of their wallet. This could lead to troubles because it's the customer's responsibility to manage the money in their wallet.

The implementation of asking for the wallet would be as follows.

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

The implementation of telling customer to pay the bill would be as follows.

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

## Related articles

The Art of Enbugging by Andy Hunt and Dave Thomas

https://media.pragprog.com/articles/jan_03_enbug.pdf

TellDontAsk by Martin Fowler

https://martinfowler.com/bliki/TellDontAsk.html
