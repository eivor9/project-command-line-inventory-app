const { writeJSONFile, readJSONFile } = require("./src/helpers");
const { display, add, remove, edit, enqueue, dequeue } = require("./src/itemController")
const { print } = require("lolcats");
const log = console.log;

function run(){
    const [ apple, cinnamon, action, item, price, inStock ] = process.argv;
    const wishlist = readJSONFile("data", "wishlist.json");
    const sampleCart = readJSONFile("data", "sampleCart.json");
    const total = sampleCart.reduce((total, item) => total += item.priceInCents, 0);
    let writeToFile = false;
    let updatedWishlist = wishlist;
    let updatedSampleCart = sampleCart;

    switch(action){
        case "display":
            print("Your Current Wishlist")
            display(wishlist);
            print("Your Sample Cart")
            display(sampleCart);
            log(`Current Total: $${total/100}`)
            break;
        case "add":
            add(wishlist);
            break;
        case "remove":
            remove(wishlist);
            writeToFile = true;
            break;
        case "edit":
            edit(wishlist, sampleCart);
            writeToFile = true;
            break;
        case "enqueue":
            enqueue(wishlist, sampleCart);
            break;
        case "dequeue":
            dequeue(sampleCart);
            break;
    }
    if (writeToFile){
        writeJSONFile("data", "wishlist.json", updatedWishlist);
        writeJSONFile("data", "sampleCart.json", updatedSampleCart);
    }
}
run();