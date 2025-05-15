
export const libraryImplementation =()=>{

abstract class LibraryItem {
    protected id;
    protected title;
    private isAvailabe:boolean = true;

  

     constructor(_id:number, _title:string){
           this.id = _id
           this.title = _title
}
// implemented by a child class
abstract getdetails():string

// common  methods for all library items

checkout():void{
    if(this.isAvailabe){
        this.isAvailabe=false;
        console.log(`${this.title} has been checked out`)
    }else{
        console.log(`${this.title}is not available`)
    }
}
return():void{
    if(this.isAvailabe){
        this.isAvailabe=true;
        console.log(`${this.title}has been returned`)
    }
}
isItemAvailable():boolean{
    return this.isAvailabe
}
}


// class book inherits from class libraryitem
class Book extends LibraryItem{
   constructor(title:string,id:number, private author:string) {  
    super(id,title)
   }
   getdetails(): string {
       return `book: ${this.title}by ${this.author}`
   }
}
class DVD  extends LibraryItem{
    constructor(title:string,id:number, private director:string){
        super(id,title)
    }
    getdetails(): string {
        return `DVD: ${this.title} by ${this.director}`
    }
}
class Library {
    private items: LibraryItem[] = [];

    // Public methods to interact with the private items array
    addItem(item: LibraryItem): void {
        this.items.push(item);
        console.log(`Added ${item.getdetails()} to library.`);
    }

    listItems(): void {
        console.log('\nLibrary Catalog:');
        this.items.forEach(item => {
            console.log(`- ${item.getdetails()} (Available: ${item.isItemAvailable()})`);
        });
    }
}


// Create a library
const library = new Library();

// Create some items
const book = new Book('The Great Gatsby', 1, 'F. Scott Fitzgerald');
const dvd = new DVD('The Matrix', 1, 'Lana Wachowski');

// Add items to library
library.addItem(book);
library.addItem(dvd);

// List all items
library.listItems();

// Check out and return items
book.checkout();
book.return();
dvd.checkout();

// List items again to see changes
library.listItems(); 

}

// class Book extends LibraryItem {
//     constructor(id:number,title:string,author:string,status:boolean){
//        super(id,title,author,status)
// }
//     }
    

// class UserAccount{
//     private name;
//     private password;
//     private isAuthenticated;
    

//     constructor(_name: string, _password: string, _isAuthenticated: boolean  ){
//             this.name = _name;
//             this.password = _password;
//             this.isAuthenticated = _isAuthenticated;
//         }


//         public login(name: string, password: string): void {
//             if (!name || !password) {
//                 console.log("Name and password are required");
//             } else {
//                 this.isAuthenticated = true;
//                 console.log("Logged in successfully");
//             }
//         }

//       public  borrowHistory (): void {

//       }

//       public calculateFine (): void {

//       }

// }

// interface Borrowable {
//     borrowItem(user: UserAccount): void;
//     returnItem(user: UserAccount): void;
// }

// class BorrowableLibraryItem extends LibraryItem implements Borrowable {
//     private borrowedBy: UserAccount | null = null;

//     borrowItem(user: UserAccount): void {
//         if (this.borrowedBy) {
//             console.log("Item is already borrowed.");
//         } else {
//             this.borrowedBy = user;
//             console.log("Item borrowed successfully.");
//         }
//     }

//     returnItem(user: UserAccount): void {
//         if (this.borrowedBy === user) {
//             this.borrowedBy = null;
//             console.log("Item returned successfully.");
//         } else {
//             console.log("This item was not borrowed by this user.");
//         }
//     }
// }