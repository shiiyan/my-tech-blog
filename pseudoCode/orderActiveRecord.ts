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

  public update(params) {}

  public delete(params) {}
}

class ActiveRecord {
  private table: Table;

  constructor() {
    const tableName = this.constructor.name.toLowerCase();
    this.table = new Table(tableName);
  }

  public create() {
    const propertyNames = Object.getOwnPropertyNames(this).filter(
      (propertyName: string) => propertyName !== "id"
    );
    const params = propertyNames.map((propertyName: string) =>  ({
      columnName: propertyName,
      value: <string>this[propertyName]
    }));

    this.table.insert(params);
  }

  public update() {}

  public findById(id: number) {}

  public delete() {}
}

class Orders extends ActiveRecord {
  private id?: number;
  private itemId: number;
  private itemPrice: number;
  private quantity: number;

  public getId(): number | undefined {
    return this.id;
  }
  public getItemId(): number {
    return this.itemId;
  }
  public getItemPrice(): number {
    return this.itemPrice;
  }
  public getQuantity(): number {
    return this.quantity;
  }

  public setId(id: number): void {
    this.id = id;
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
    return this.itemPrice * this.quantity;
  }
}

// usage

const order = new Orders();
order.setItemId(10);
order.setItemPrice(100);
order.setQuantity(2);

order.create();
