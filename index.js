const { displayOptions, add, remove, edit, enqueue, dequeue } = require("./src/itemController");
const { readJSONFile } = require("./src/helpers");
const chalk = require("chalk");
const inquirer = require('inquirer');
const figlet = require("figlet");

const red = chalk.rgb(255, 0, 0);
const green = chalk.rgb(0, 255, 0);

let colorFns = [red, green];

const candyCane = (...x) => {
  let e = x.join(' ').split(' ');
  let c = { counter: 0, limit: 1 };
  let n = [];
  e.forEach(u => {
    let y = u.split('').map(j => {
      let d = colorFns[c.counter](j);
      if (c.counter >= c.limit) c.counter = 0;
      else c.counter++;
      return d;
    });
    n.push(y.join(''));
  });

  return n.join(' ');
};

const print = (...x) => {
    console.log(
        candyCane(
            figlet.textSync(...x, {
            font: "Dr Pepper",
            horizontalLayout: "controlled smushing",
            verticalLayout: "controlled smushing",
            width: 60
            })
        )
    );
};

const wishlist = readJSONFile("data", "wishlist.json");
const sampleCart = readJSONFile("data", "sampleCart.json");
const question1 = {
        type:"list",
        name:"value", 
        message: "What would you like to do?",
        choices: ["Show Shopping Lists", "Add to Shopping List", "Remove from Shopping List", "Edit Main Shopping List", "Exit"]
    }

function ask() {
    print("Happy Holidays!");

    inquirer.prompt(question1)
    .then((answer1) => {
        if (answer1.value === "Show Shopping Lists"){
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
                message: "Which shopping list would you like to add to?",
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

ask();