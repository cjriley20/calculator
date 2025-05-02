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

// Mapping from symbols to display text

const BinaryOperator = Object.freeze({
  Add: '+',
  Subtract: '-',
  Multiply: '*',
  Divide: '/',
});

const UnaryOperator = Object.freeze({
  Negate: '+/-',
  Percent: '%',
});

const GeneralFunction = Object.freeze({
  Clear: 'AC',
  Equal: '='
});

// Populate operator and general function buttons.

const binaryOperatorButtons = document.querySelectorAll('.binary-operator')
binaryOperatorButtons.forEach((button) => {
  const op = button.dataset.op;
  button.textContent = BinaryOperator[op];
})

const unaryOperatorButtons = document.querySelectorAll('.unary-operator')
unaryOperatorButtons.forEach((button) => {
  const op = button.dataset.op;
  button.textContent = UnaryOperator[op];
})

const generalFunctionButtons = document.querySelectorAll('.general-function')
generalFunctionButtons.forEach((button) => {
  const op = button.dataset.op;
  button.textContent = GeneralFunction[op];
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