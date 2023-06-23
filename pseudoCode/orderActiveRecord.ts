class DatabaseConnection {
  public execute(query: string) {
    console.log("Executed: ", query);
  }
}

class Table {
  private db: DatabaseConnection;
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.db = new DatabaseConnection();
  }

  public insert(params: { columnName: string; value: string }[]) {
    const query = `INSERT INTO ${this.tableName} () VALUES ();`;
    this.db.execute(query);
  }
}

abstract class ActiveRecord {
  protected id?: number;
  private table: Table;

  constructor() {
    this.table = new Table(this.constructor.name.toLowerCase());
  }

  public getId(): number | undefined {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public create() {
    const propertyNames = Object.getOwnPropertyNames(this).filter(
      (propertyName: string) => !["id", "table"].includes(propertyName)
    );
    const params = propertyNames.map((propertyName: string) => ({
      columnName: propertyName,
      value: <string>this[propertyName as keyof this],
    }));

    this.table.insert(params);
  }

  public update() {}

  public findById(id: number) {}

  public delete() {}
}

class Orders extends ActiveRecord {
  private itemId?: number;
  private itemPrice?: number;
  private quantity?: number;

  public getItemId(): number | undefined {
    return this.itemId;
  }
  public getItemPrice(): number | undefined {
    return this.itemPrice;
  }
  public getQuantity(): number | undefined {
    return this.quantity;
  }

  public setItemId(itemId: number) {
    this.itemId = itemId;
  }
  public setItemPrice(itemPrice: number) {
    this.itemPrice = itemPrice;
  }
  public setQuantity(quantity: number) {
    this.quantity = quantity;
  }

  public calculatePaymentAmount(): number {
    if (this.itemPrice === undefined || this.quantity === undefined) {
      throw new Error("price or quantity undefined");
    }

    return this.itemPrice * this.quantity;
  }
}

// usage

const order = new Orders();
order.setItemId(10);
order.setItemPrice(100);
order.setQuantity(2);

order.create();
