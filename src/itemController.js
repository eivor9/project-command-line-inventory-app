const log = console.log;
const endl = () => console.log();
const { nanoid } = require("nanoid");
const chalk = require("chalk");
const inquirer = require('inquirer');
const { writeJSONFile } = require("./helpers")
const Table = require('cli-table');

const red = chalk.rgb(255, 0, 0);
const green = chalk.rgb(0, 255, 0);
const blue = chalk.rgb(0, 128, 255);

function displayOptions(wishlist, sampleCart) {

    const question1 = {
            type: "list",
            name: "value",
            message: "Which list would you like to see?",
            choices: ["Both", "Main Shopping List", "Sample Shopping Cart"]
    };

    inquirer.prompt(question1)
    .then((answer1) => {

        const question2 = {
            type: "list",
            name: "value",
            message: `Show "in stock" items only?`,
            choices: ["YES", "NO"],
            default: "NO"
        };

        inquirer.prompt(question2)
        .then((answer2) => {

            if(answer2.value === "YES"){
                wishlist = wishlist.filter(x => x.inStock);
                sampleCart = sampleCart.filter(x => x.inStock);
            }

            const question3 = {
                    type: "list",
                    name: "value",
                    message: "Category?",
                    choices: ["All", "Electronics", "Automotive", "Jewelry", "Books", "Other"]
            };
    
            inquirer.prompt(question3)
            .then((answer3) => {
                if (answer1.value === "Both"){
                    if (answer3.value === "All"){
                        const total = sampleCart.reduce((total, item) => total += item.priceInCents, 0);
                        
                        display(wishlist);
                        
                        display(sampleCart);
                        log(blue(` Current Total: $${total/100}\n`));
                    } else {
                        wishlist = wishlist.filter(x => x.category === answer3.value);
                        sampleCart = sampleCart.filter(x => x.category === answer3.value);
                        const total = sampleCart.reduce((total, item) => total += item.priceInCents, 0);
                        
                        display(wishlist);
                        
                        display(sampleCart);
                        log(blue(` Current Total: $${total/100}\n`));
                    }
                } else if (answer1.value === "Main Shopping List"){
                    if (answer3.value === "All"){
                        
                        display(wishlist);
                    } else {
                        wishlist = wishlist.filter(x => x.category === answer3.value);
                        
                        display(wishlist);
                    } 
                } else {
                    if (answer3.value === "All"){
                        const total = sampleCart.reduce((total, item) => total += item.priceInCents, 0);
                        
                        display(sampleCart);
                        log(blue(` Current Total: $${total/100}\n`));
                    } else {
                        sampleCart = sampleCart.filter(x => x.category === answer3.value);
                        const total = sampleCart.reduce((total, item) => total += item.priceInCents, 0);
                        
                        display(sampleCart);
                        log(blue(` Current Total: $${total/100}\n`));
                    }
                }
                mainLoop();
            })
        })
    })
}

function display(list) {
    

    if(!list.length) 
        log(`This Shopping List is empty...\n`)

    else{
        const head = [];
        const mainList = !list[0].quantity;

        if(mainList)
            head.push(
                blue("Main Shopping List"), 
                "Name", 
                "Category", 
                "Price"
            );
        else
            head.push(
                blue("Sample Shopping Cart"), 
                "Name", 
                "Category", 
                "Quantity",
                "Price"
            );

        const table = new Table({ head });
        list = list.map(x => {
            const result = {};
            const header = green(`Item No. ${x.id}${x.inStock ? "" : "\n  (OUT OF STOCK)"}`);
            const values = Object.values(x);
            const tableValues = [];

            if (mainList) 
                tableValues.push( values[1], values[3], "$" + values[2]/100 )
            else 
                tableValues.push( values[1], values[3], values[5], "$" + values[2]/100 );

            result[header] = tableValues;
            return result;
        })
        table.push(...list);
        console.log(table.toString());
    }
}

function add(wishlist){
    let inStock;

    const questions = [
        {
            type: "input",
            name: "itemName",
            message: "What is the name of this gift?",
            default: "Gift_Name"
        },
        {
            type: "list",
            name: "category",
            message: "Which department does this gift fit under?",
            choices: ["Electronics", "Automotive", "Jewelry", "Books", "Other"]
        },
        {
            type: "input",
            name: "price",
            message: "How much does this gift cost (in cents)?",
        },
        {
            type: "list",
            name: "inStock",
            message: "Is it in stock right now?",
            choices: ["YES", "NO"]
        }
    ];
    
    inquirer.prompt(questions)
            .then((answers) => {
                inStock = answers.inStock === "YES" ? true : false;
                const newItem = {
                    id: "W"+nanoid(8),
                    name: answers.itemName.toUpperCase() || "Unknown",
                    priceInCents: Number(answers.price) || 0,
                    category: answers.category,
                    inStock
                };
                wishlist.push(newItem);
                writeJSONFile("data", "wishlist.json", wishlist);
                display(wishlist);
                mainLoop();
            });
}

function remove(wishlist){
    const choices = wishlist.map(item => `${item.id} - ${item.name}: $${item.priceInCents/100}`);
    choices.unshift("Please select a gift below");

    const question = [
        {
            type: "list",
            name: "newItem",
            message: "Which item would you like to remove from your shopping list?",
            choices
        }
    ];

    inquirer.prompt(question)
    .then((answer) => {
        if (answer.newItem === "Please select a gift below"){
            
            display(wishlist);
            log(red("No valid gift selected. No action taken..."))
            endl();
        } else {
            const itemID = answer.newItem.substring(0,9);
            const index = wishlist.findIndex(item => item.id === itemID);
            const removedItem = wishlist[index].name;
            wishlist.splice(index, 1);

            writeJSONFile("data", "wishlist.json", wishlist);
            
            display(wishlist);
            log(`${red(removedItem)} has been removed from your shopping list successfully...`);
            endl();
        }
        mainLoop();
    });
}

function edit(wishlist, sampleCart){
    const choices = wishlist.map(item => `${item.id} - ${item.name}: $${item.priceInCents/100}`);
    choices.unshift("Please select a gift below");

    const question = [
        {
            type: "list",
            name: "badItem",
            message: "Which item would you like to edit from your shopping list?",
            choices
        }
    ];

    inquirer.prompt(question)
            .then((answer) => {
                if (answer.badItem === "Please select a gift below"){
                    
                    display(wishlist);
                    log(red("No valid gift selected. No action taken..."))
                    endl();
                    mainLoop();
                } else {
                    const itemID = answer.badItem.substring(0,9);
                    const index = wishlist.findIndex(item => item.id === itemID);
                    const badItem = wishlist[index];

                    const questions = [
                        {
                            type: "list",
                            name: "key",
                            message: "Which property would you like to edit?",
                            choices: Object.keys(badItem).slice(1)
                        }
                    ];

                    inquirer.prompt(questions)
                        .then((answer) => {
                            let lastQuestion;

                            switch (answer.key){
                                case "inStock":
                                    lastQuestion = {
                                        type: "list",
                                        name: "inStock",
                                        message: "Is this item in stock right now?",
                                        choices: ["YES", "NO"]
                                    }
                                    break;

                                case "category":
                                    lastQuestion = {
                                        type: "list",
                                        name: "category",
                                        message: "Which department does this gift fit under?",
                                        choices: ["Electronics", "Automotive", "Jewelry", "Books", "Other"]
                                    }
                                    break;

                                case "name":
                                    lastQuestion = {
                                        type: "input",
                                        name: "name",
                                        message: "What is the name of this gift?"
                                    }
                                    break;

                                case "priceInCents":
                                    lastQuestion = {
                                        type: "input",
                                        name: "priceInCents",
                                        message: "How much does this gift cost (in cents)?"
                                    }
                                    break;
                            }

                            inquirer.prompt(lastQuestion)
                                .then((lastAnswer) => {
                                    const key = Object.keys(lastAnswer)[0];
                                    const newValue = lastAnswer[key];

                                    if (key === "name") 
                                        badItem[key] = newValue.toUpperCase() || "Unknown";
                                    else if (key === "priceInCents") 
                                        badItem[key] = newValue || 0;
                                    else
                                        badItem[key] = newValue

                                    const updatedList = wishlist.reduce((newList, x) => {
                                        newList[x.id] = [x.name, x.category, x.priceInCents, x.inStock];
                                        return newList;
                                    }, {})

                                    for (const item of sampleCart){
                                        [item.name, item.category, item.priceInCents, item.inStock] = updatedList[item.id];
                                    }
                                    writeJSONFile("data", "sampleCart.json", sampleCart);
                                    writeJSONFile("data", "wishlist.json", wishlist);
                                    blue("Your Main Shopping List\n");
                                    display(wishlist);

                                    log(`${green(badItem.name)} has been updated successfully...`)
                                    endl();
                                    mainLoop();
                                })
                            
                        })
                    }
            });
}

function enqueue(wishlist, sampleCart){
    const choices = wishlist.map(item => `${item.id} - ${item.name}: $${item.priceInCents/100}`);
    choices.unshift("Please select a gift below");

    const question = [
        {
            type: "list",
            name: "newItem",
            message: "Which item would you like to add to your cart?",
            choices
        }
    ];

    inquirer.prompt(question)
            .then((answer) => {
                if (answer.newItem === "Please select a gift below"){
                    const total = sampleCart.reduce((total, item) => total += item.priceInCents, 0);
                    
                    display(sampleCart);
                    log(blue(` Current Total: $${total/100}\n`))
                    endl();
                    log(red("No valid gift selected. No action taken..."))
                    endl();
                } else {
                    const itemID = answer.newItem.substring(0,9);
                    let index = wishlist.findIndex(item => item.id === itemID);
                    const newItem = wishlist[index];

                    index = sampleCart.findIndex(item => item.id === newItem.id);

                    if(index === -1){
                        newItem.quantity = 1;
                        sampleCart.push(newItem);
                    } else {
                        sampleCart[index].quantity++;
                        sampleCart[index].priceInCents += newItem.priceInCents;
                    }
                    writeJSONFile("data", "sampleCart.json", sampleCart);
                    
                    const total = sampleCart.reduce((total, item) => total += item.priceInCents, 0);
                    display(sampleCart);
                    log(blue(` Current Total: $${total/100}\n`))
                    log(`${green(newItem.name)} has been added to your cart successfully...`)
                    endl();
                }
                mainLoop();
            });
        
}

function dequeue(sampleCart){
    const choices = sampleCart.map(item => `${item.id} - ${item.name} (${item.quantity}): $${item.priceInCents/100}`);
    choices.unshift("Please select a gift below");

    const question = [
        {
            type: "list",
            name: "badItem",
            message: "Which item would you like to remove from Your Sample Shopping Cart?",
            choices
        }
    ];

    inquirer.prompt(question)
            .then((answer) => {
                if (answer.badItem === "Please select a gift below"){
                    const total = sampleCart.reduce((total, item) => total += item.priceInCents, 0);
                    
                    display(sampleCart);
                    log(blue(` Current Total: $${total/100}\n`));
                    endl();
                    log(red("No valid gift selected. No action taken..."))
                    endl();
                } else{
                    const itemID = answer.badItem.substring(0,9);
                    const index = sampleCart.findIndex(item => item.id === itemID);
                    
                    const badItem = sampleCart[index];
                    badItem.priceInCents = badItem.priceInCents - (badItem.priceInCents / badItem.quantity);
                    badItem.quantity--;
                    if(!badItem.quantity) sampleCart.splice(index, 1);

                    writeJSONFile("data", "sampleCart.json", sampleCart);

                    const total = sampleCart.reduce((total, item) => total += item.priceInCents, 0);
                    
                    display(sampleCart);
                    log(blue(` Current Total: $${total/100}\n`));
                    endl();
                    log(`${red(badItem.name)} has been successfully removed from your cart...`)
                    log(`Remaining Quantity: ${badItem.quantity}`);
                }
                mainLoop();
            });
}

function mainLoop() {

    const question = [
        {
            type: "list",
            name: "value",
            message: "Where would you like to go next?",
            choices: ["Main Menu", "Exit"]
        }
    ];

    inquirer.prompt(question)
    .then(answer => {
        if (answer.value === "Main Menu")
            ask();
    })
}

module.exports = { display, displayOptions, add, remove, edit, enqueue, dequeue };