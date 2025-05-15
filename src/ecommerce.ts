export const EcommerceImplementation = ()=>{
abstract class Products{
    public id;
    public name;
    public price;
    constructor(id:number,name:string,price:number){
        this.id= id
        this.name = name
        this.price= price
    }
    // abstract method to be implemented by every class
    abstract getDetails():string
}

// class electronics products
class electronicsProducts extends Products{
    constructor(id:number,name:string,price:number,private warrant:number){
        super(id,name,price)
        this.id=id
        this.name=name
        this.price=price
        this.warrant=warrant
    }
    getDetails(): string {
     return `${this.name} - Warranty: ${this.warrant} year(s)`;
    }
}

// class clothingProduct
class clothingProducts extends Products{
    constructor(id:number,name:string,price:number,private size:string){
        super(id,name,price)
        this.id= id
        this.name=name
        this.price= price
        this.size=size
    }
    getDetails(): string {
        return `${this.name} - size ${this.size}`
    }

}
// class furnitureProduct
class furnitureProduct extends Products {
    constructor(id:number,name:string,price:number,private materials:string){
        super(id,name,price)
        this.id = id
        this.name= name
        this.price = price
        this.materials=materials
    }
    getDetails(): string {
        return `${this.name}- materials ${this.materials}`
    }
}
type ProductType = {
    electronic: { warranty: number };
    clothing: { size: string };
    furniture: { material: string };
};

class ProductFactory {
    static createProduct<T extends keyof ProductType>(
        type: T,
        id: number,
        name: string,
        price: number,
        extra: ProductType[T]
    ): Products {
        switch (type) {
            case "electronic":
                return new electronicsProducts(id, name, price, (extra as ProductType["electronic"]).warranty);
            case "clothing":
                return new clothingProducts(id, name, price, (extra as ProductType["clothing"]).size);
            case "furniture":
                return new furnitureProduct(id, name, price, (extra as ProductType["furniture"]).material);
            default:
                throw new Error("Invalid product type.");
        }
    }
}


class users{
    id;
    name;
    role;
    constructor(id:number,name:string,role:string){
        this.id=id
        this.name=name
        this.role= role
    }
}
class admin extends users{
    constructor(id:number,name:string){
        super(id,name,"admin")
    }
}
class seller extends users{
    constructor(id:number,name:string,public shopName:string){
        super(id,name,"seller")
    }
}
class customer extends users{
    constructor(id:number,name:string){
        super(id,name,"customer")
    }
}

// Strategy Interface
interface DiscountStrategy {
    applyDiscount(amount: number): number;
}

// No Discount
class NoDiscount implements DiscountStrategy {
    applyDiscount(amount: number): number {
        return amount;
    }
}

// Percentage Discount
class PercentageDiscount implements DiscountStrategy {
    constructor(private percent: number) { }

    applyDiscount(amount: number): number {
        return amount - (amount * this.percent) / 100;
    }
}

class Cart {
    private items: Products[] = [];
    private taxRate: number = 0.1; // 10% tax

    addProduct(product: Products) {
        this.items.push(product);
    }

    listItems(): string[] {
        return this.items.map((item) => item.getDetails());
    }

    getTotal(discount: DiscountStrategy): number {
        let subtotal = this.items.reduce((sum, item) => sum + item.price, 0);
        subtotal = discount.applyDiscount(subtotal);
        const tax = subtotal * this.taxRate;
        return subtotal + tax;
    }
}

interface Payment {
    pay(amount: number): void;
}

class CardPayment implements Payment {
    pay(amount: number): void {
        console.log(`Paid ${amount} using Card`);
    }
}

class WalletPayment implements Payment {
    pay(amount: number): void {
        console.log(`Paid ${amount} using Wallet`);
    }
}

class CODPayment implements Payment {
    pay(amount: number): void {
        console.log(`Cash on Delivery - Pay ${amount} at doorstep`);
    }
}
class Order {
    constructor(
        private customer: customer,
        private cart: Cart,
        private payment: Payment,
        private discount: DiscountStrategy
    ) { }

    processOrder(): void {
        console.log(`\nOrder for: ${this.customer.name}`);
        console.log("Items:");
        this.cart.listItems().forEach((item) => console.log("- " + item));
        const total = this.cart.getTotal(this.discount);
        console.log("Total Amount (with tax & discount):", total);
        this.payment.pay(total);
        console.log("✅ Order completed.\n");
    }
}
// Create a customer
const customer2 = new customer(1, "Antony");

// Create a cart and add products
const cart = new Cart();
cart.addProduct(ProductFactory.createProduct("electronic", 1, "Laptop", 1000, { warranty: 2 }));
cart.addProduct(ProductFactory.createProduct("clothing", 2, "T-Shirt", 30, { size: "M" }));
cart.addProduct(ProductFactory.createProduct("furniture", 3, "Chair", 150, { material: "Wood" }));

// Choose discount and payment method
const discount = new PercentageDiscount(10); // 10% off
const paymentMethod = new CardPayment(); // can change to WalletPayment or CODPayment

// Create and process the order
const order = new Order(customer2, cart, paymentMethod, discount);
order.processOrder();
}