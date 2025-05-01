// Calculator operations

function add(x, y) {
  return x + y;
}

function subtract(x, y) {
  return x - y;
}

function multiply(x, y) {
  return x * y;
}

function divide(x, y) {
  return y !== 0 ? x / y : 'Error'
}

function negate(x) {
  return -x;
}

function percent(x) {
  return x / 100;
}

// Mapping from operator symbols to display text
const OperatorInfo = Object.freeze({
  Add: { fn: add, label: '+' },
  Subtract: { fn: subtract, label: '-' },
  Multiply: { fn: multiply, label: '*' },
  Divide: { fn: divide, label: '/' },
  Negate: { fn: negate, label: '+/-' },
  Percent: { fn: percent, label: '%' },
  Clear: { fn: null, label: 'AC' },
  Equal: { fn: null, label: '=' }
});

function operate(op, x, y) {
  return OperatorInfo[op].fn(x, y);
}

// Populate operator buttons.
const operatorButtons = document.querySelectorAll('.operator')
operatorButtons.forEach((button) => {
  const op = button.dataset.op;
  button.textContent = OperatorInfo[op].label;
})

// Screen elements
const display = document.querySelector('div.display p')

const buttons = document.querySelectorAll('button.digit')

buttons.forEach((button) => {
  button.addEventListener('click', (e) => {
    display.textContent = e.target.textContent;
  });
});
  
// Test

// let askForNumbers = true;
// while (askForNumbers) {
//   const x = prompt('Enter x');
//   const y = prompt('Enter y');

//   if (y == 'q') {
//     askForNumbers = false;
//     continue;
//   }

//   console.log(`x = ${x}`)
//   console.log(`y = ${y}`)
// }