// Calculator operations

const Operator = Object.freeze({
  Add: 'Add',
  Subtract: 'Subtract',
  Multiply: 'Multiply',
  Divide: 'Divide',
  Negate: 'Negate',
  Percent: 'Percent'
});

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
  return x / y;
}

function negate(x) {
  return -x;
}

function percent(x) {
  return x * 0.01;
}

function operate(op, x, y) {
  switch(op) {
    case Operator.Add:
      return add(x + y);
  }
}

// Screen elements
const display = document.querySelector('div.display > p')

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