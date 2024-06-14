const log = console.log;
const endl = () => console.log();
const { nanoid } = require("nanoid");
const chalk = require("chalk");
const inquirer = require('inquirer');
const { writeJSONFile } = require("./helpers")

const red = chalk.rgb(255, 0, 0);
const green = chalk.rgb(0, 255, 0);
const blue = (s) => log(chalk.rgb(0, 0, 255)(s));

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
                message: "Which category would you like to see?",
                choices: ["All", "Electronics", "Automotive", "Jewelry", "Books", "Other"]
        };
    
        inquirer.prompt(question2)
        .then((answer2) => {
            if (answer1.value === "Both"){
                if (answer2.value === "All"){
                    const total = sampleCart.reduce((total, item) => total += item.priceInCents, 0);
                    blue("Your Current Shopping List");
                    display(wishlist);
                    blue("Your Sample Shopping Cart");
                    display(sampleCart);
                    log(`Current Total: $${total/100}`);
                } else {
                    wishlist = wishlist.filter(x => x.category === answer2.value);
                    sampleCart = sampleCart.filter(x => x.category === answer2.value);
                    const total = sampleCart.reduce((total, item) => total += item.priceInCents, 0);
                    blue("Your Current Shopping List");
                    display(wishlist);
                    blue("Your Sample Shopping Cart");
                    display(sampleCart);
                    log(`Current Total: $${total/100}`);
                }
            } else if (answer1.value === "Main Shopping List"){
                if (answer2.value === "All"){
                    blue("Your Current Shopping List");
                    display(wishlist);
                } else {
                    wishlist = wishlist.filter(x => x.category === answer2.value);
                    blue("Your Current Shopping List");
                    display(wishlist);
                } 
            } else {
                if (answer2.value === "All"){
                    const total = sampleCart.reduce((total, item) => total += item.priceInCents, 0);
                    blue("Your Sample Shopping Cart");
                    display(sampleCart);
                    log(`Current Total: $${total/100}`);
                } else {
                    sampleCart = sampleCart.filter(x => x.category === answer2.value);
                    const total = sampleCart.reduce((total, item) => total += item.priceInCents, 0);
                    blue("Your Sample Shopping Cart");
                    display(sampleCart);
                    log(`Current Total: $${total/100}`);
                }
            }
        })
    })
}

function display(list) {
    if(!list.length) log(`  This list is empty`)
    
    let result = "";
    for (const item of list){
        result += `\n  Item No. ${item.id}${item.inStock ? "" : " (OUT OF STOCK)"}\n    ${item.name}\n    ${item.quantity ? `Quantity: ${item.quantity}\n    ` : ""}Category: ${item.category}\n    Price: $${item.priceInCents/100 || 0}\n\n`
    }
    log(result);
}

function add(wishlist){
    let inStock;

    const questions = [
        {
            type: "input",
            name: "itemName",
            message: "What is the name of this gift?",
            default: "Gift Name"
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
            })
            .then(() => {
                writeJSONFile("data", "wishlist.json", wishlist);
            })
            .then(() => {
                blue("Your Current Shopping List\n")
                display(wishlist);
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
                    blue("Your Current Shopping List")
                    display(wishlist);
                    log(red("No valid gift selected. No action taken..."))
                    return;
                }
                const itemID = answer.newItem.substring(0,9);
                const index = wishlist.findIndex(item => item.id === itemID);
                const removedItem = wishlist[index].name;
                wishlist.splice(index, 1);

                writeJSONFile("data", "wishlist.json", wishlist);
                blue("Your Current Shopping List")
                display(wishlist);
                log(`${red(removedItem)} has been removed from your shopping list successfully...`);
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
                    blue("Your Current Shopping List")
                    display(wishlist);
                    log(red("No valid gift selected. No action taken..."))
                    return;
                }
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
                            default:
                                blue("Your Current Shopping List\n");
                                display(wishlist);
                                log(red("Item id's have ben randomely selected and may not be edited...\nNo action taken..."))
                                return;
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
                                blue("Your Current Shopping List\n");
                                display(wishlist);

                                log(`${green(badItem.name)} has been updated successfully...`)
                            })
                        
                    })
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
                    blue("Your Sample Shopping Cart")
                    display(sampleCart);
                    log(`Current Total: $${total/100}`)
                    endl();
                    log(red("No valid gift selected. No action taken..."))
                    return;
                }
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
                blue("Your Sample Shopping Cart")
                const total = sampleCart.reduce((total, item) => total += item.priceInCents, 0);
                display(sampleCart);
                log(`Current Total: $${total/100}`)
                log(`${green(newItem.name)} has been added to your cart successfully...`)
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
                    blue("Your Sample Shopping Cart");
                    display(sampleCart);
                    log(`Current Total: $${total/100}`);
                    endl();
                    log(red("No valid gift selected. No action taken..."))
                    return;
                }
                
                const itemID = answer.badItem.substring(0,9);
                const index = sampleCart.findIndex(item => item.id === itemID);
                
                const badItem = sampleCart[index];
                badItem.priceInCents = badItem.priceInCents - (badItem.priceInCents / badItem.quantity);
                badItem.quantity--;
                if(!badItem.quantity) sampleCart.splice(index, 1);

                writeJSONFile("data", "sampleCart.json", sampleCart);

                const total = sampleCart.reduce((total, item) => total += item.priceInCents, 0);
                blue("Your Sample Shopping Cart");
                display(sampleCart);
                log(`Current Total: $${total/100}`);
                endl();
                log(`${red(badItem.name)} has been successfully dequeued from your cart...`)
                log(`Remaining Quantity: ${badItem.quantity}`);
            });
}

module.exports = { display, displayOptions, add, remove, edit, enqueue, dequeue };