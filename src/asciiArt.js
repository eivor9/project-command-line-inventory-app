const chalk = require("chalk");
const figlet = require("figlet");

const red = chalk.rgb(255, 0, 0);
const green = chalk.rgb(0, 255, 0);

const colorFns = [red, green];

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

module.exports = { print };