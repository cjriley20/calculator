import { 
  Calculator, 
  BinaryOperator, 
  UnaryOperator, 
  GeneralFunction ,
  BinaryOperatorKeyMap,
  UnaryOperatorKeyMap,
  GeneralFunctionKeyMap
} from './calculator.js'

const calculator = new Calculator();
const display = document.querySelector('div.display p')

const MAX_NUMBER_LENGTH = 10;

function updateDisplay() {
  display.textContent = calculator.getDisplay().slice(0, MAX_NUMBER_LENGTH);
}

// Binary operator buttons

let activeBinaryOperatorButton = null;

function clearActiveBinaryOperatorButton() {
  if (activeBinaryOperatorButton) {
    activeBinaryOperatorButton.classList.remove('active-binary-operator');
    activeBinaryOperatorButton = null;
  }
}

function setActiveBinaryOperatorButton(button) {
  button.classList.add('active-binary-operator');
  activeBinaryOperatorButton = button;
}

const binaryOperatorButtons = document.querySelectorAll('.binary-operator');

binaryOperatorButtons.forEach((button) => {
  const op = button.dataset.op;

  button.textContent = BinaryOperator[op].label;

  button.addEventListener('click', (e) => {
    clearActiveBinaryOperatorButton();
    setActiveBinaryOperatorButton(button);
    calculator.inputBinaryOperator(op);
    updateDisplay();
  });
});

// Unary operator buttons

const unaryOperatorButtons = document.querySelectorAll('.unary-operator');

unaryOperatorButtons.forEach((button) => {
  const op = button.dataset.op;

  button.textContent = UnaryOperator[op].label;

  button.addEventListener('click', (e) => {
    clearActiveBinaryOperatorButton();
    calculator.inputUnaryOperator(op);
    updateDisplay();
  });
});

// General function buttons

const generalFunctionButtons = document.querySelectorAll('.general-function');

generalFunctionButtons.forEach((button) => {
  const op = button.dataset.op;

  button.textContent = GeneralFunction[op].label;

  button.addEventListener('click', (e) => {
    clearActiveBinaryOperatorButton();

    if (op === 'Clear') {
      calculator.reset();
    }
    else if (op === 'Equal') {
      calculator.evaluate();
    }
    updateDisplay();
  });
});

// Digit buttons

const digitButtons = document.querySelectorAll('.digit')

digitButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    clearActiveBinaryOperatorButton();
    calculator.inputDigit(button.textContent);
    updateDisplay();
  });
})

// Decimal button

const decimalButton = document.querySelector('.decimal')

decimalButton.addEventListener('click', (e) => {
  clearActiveBinaryOperatorButton();
  calculator.inputDecimal();
  updateDisplay();
});

// Keyboard support

document.addEventListener('keydown', (e) => {
  const key = e.key;

  // Digits
  if (/[1-9]/.test(key)) {
    const button = Array.from(digitButtons).find(btn => btn.textContent === key);
    if (button) button.click();
    return;
  }

  // Decimal
  if (key === '.') {
    decimalButton.click();
    return;
  }

  // Binary operators
  if (key in BinaryOperatorKeyMap) {
    const op = BinaryOperatorKeyMap[key];
    const button = Array.from(binaryOperatorButtons).find(btn => btn.dataset.op == op);
    if (button) button.click();
    return;
  }

  // Unary operators
  if (key in UnaryOperatorKeyMap) {
    const op = UnaryOperatorKeyMap[key];
    const button = Array.from(unaryOperatorButtons).find(btn => btn.dataset.op == op);
    if (button) button.click();
    return;
  }

  // General functions
  if (key in GeneralFunctionKeyMap) {
    const op = GeneralFunctionKeyMap[key];
    const button = Array.from(generalFunctionButtons).find(btn => btn.dataset.op == op);
    if (button) button.click();
    return;
  }

  // Backspace
  if (key === 'Backspace') {
    calculator.backspace();
    updateDisplay();
  }
});
