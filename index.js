const { displayOptions, add, remove, edit, enqueue, dequeue } = require("./src/itemController");
const { readJSONFile } = require("./src/helpers");
const inquirer = require('inquirer');
const { print } = require("./src/asciiArt");

const wishlist = readJSONFile("data", "wishlist.json");
const sampleCart = readJSONFile("data", "sampleCart.json");
const question1 = {
        type:"list",
        name:"value", 
        message: "What would you like to do?",
        choices: ["Display Shopping List", "Add to Shopping List", "Remove from Shopping List", "Edit Main Shopping List", "Exit"]
    }

ask = (firstLaunch) => {
    if(firstLaunch)
        print("Happy Holidays!");

    inquirer.prompt(question1)
    .then((answer1) => {
        if (answer1.value === "Display Shopping List"){
            displayOptions(wishlist, sampleCart);
        } else if (answer1.value === "Add to Shopping List"){
            const questionA = {
                type:"list",
                name:"value", 
                message: "Which shopping list would you like to add to?",
                choices: ["Main Shopping List", "Sample Shopping Cart"]
            };
            inquirer.prompt(questionA).then(answerA => {
                if(answerA.value === "Main Shopping List"){
                    add(wishlist);
                } else {
                    enqueue(wishlist, sampleCart);
                }
            })
        } else if (answer1.value === "Remove from Shopping List"){
            const questionB = {
                type:"list",
                name:"value", 
                message: "Which shopping list would you like to remove from?",
                choices: ["Main Shopping List", "Sample Shopping Cart"]
            };
            inquirer.prompt(questionB).then(answerB => {
                if(answerB.value === "Main Shopping List"){
                    remove(wishlist);
                } else {
                    dequeue(sampleCart);
                }
            })
        } else if (answer1.value === "Edit Main Shopping List"){
            edit(wishlist, sampleCart);
        }
    })
    
}

ask(true);

var Table = require('cli-table');
var table = new Table({ head: ["", "Top Header 1", "Top Header 2"] });

table.push(
    { 'Left Header 1': ['Value Row 1 Col 1', 'Value Row 1 Col 2'] }
  , { 'Left Header 2': ['Value Row 2 Col 1', 'Value Row 2 Col 2'] }
);

//console.log(table.toString());