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

// Display

const MAX_NUMBER_LENGTH = 10;

const display = document.querySelector('div.display p')

function updateDisplay(x) {
  let numberString = String(x) || '0';

  if (numberString.length > MAX_NUMBER_LENGTH) {
    numberString = numberString.slice(0, MAX_NUMBER_LENGTH);
  }

  display.textContent = numberString;
}

// Calculator state

const Mode = Object.freeze({
  Start: 'start',
  FirstOperand: 'firstOperand',
  Operator: 'operator',
  SecondOperand: 'secondOperand'
});

const state = {
  mode: Mode.Start,
  operand1: '',
  operand2: '',
  operator: null
}

function resetState() {
  state.mode = Mode.Start;
  state.operand1 = '';
  state.operand2 = '';
  state.operator = null;
}

function logState() {
  console.log('***');
  console.log(state.mode);
  console.log(state.operand1);
  console.log(state.operand2);
  console.log(state.operator);
}

// Mapping from operators and functions to display text

const BinaryOperator = Object.freeze({
  Add: { fn: add, label: '+' },
  Subtract: { fn: subtract, label: '-' },
  Multiply: { fn: multiply, label: '*' },
  Divide: { fn: divide, label: '/'} ,
});

const UnaryOperator = Object.freeze({
  Negate: { fn: negate, label: '+/-' },
  Percent: { fn: percent, label: '%' },
});

const GeneralFunction = Object.freeze({
  Clear: { label: 'AC' },
  Equal: { label: '=' }
});

// Binary operator buttons

const binaryOperatorButtons = document.querySelectorAll('.binary-operator')

binaryOperatorButtons.forEach((button) => {
  const op = button.dataset.op;

  button.textContent = BinaryOperator[op].label;

  button.addEventListener('click', (e) => {
    switch (state.mode) {
      case Mode.Start:
        // Start with zero.
        state.operand1 = '0';
        state.operator = op;
        state.mode = Mode.Operator;
        break;
      case Mode.FirstOperand:
        // Finished first operand and waiting for second.
        state.operator = op;
        state.mode = Mode.Operator;
        break;
      case Mode.Operator:
        // Overwrite last operator.
        state.operator = op;
        break;
      case Mode.SecondOperand:
        // Calculate using last operator.
        let x = Number(state.operand1);
        let y = Number(state.operand2);
        let result = BinaryOperator[state.operator].fn(x, y);
        
        // Update display.
        state.operand1 = String(result);
        updateDisplay(state.operand1);

        // Update operator.
        state.operator = op;
        state.mode = Mode.Operator;
        break;
    }
  });
})

// Unary operator buttons

const unaryOperatorButtons = document.querySelectorAll('.unary-operator')

unaryOperatorButtons.forEach((button) => {
  const op = button.dataset.op;

  button.textContent = UnaryOperator[op].label;

  button.addEventListener('click', (e) => {
    switch (state.mode) {
      case Mode.Start:
        // Operand is zero - nothing to do
        break;
      case Mode.FirstOperand: {
        let x = Number(state.operand1);
        let result = UnaryOperator[op].fn(x);
        state.operand1 = String(result);
        updateDisplay(state.operand1);
        break;
      }
      case Mode.Operator:
        break;
      case Mode.SecondOperand: {
        let x = Number(state.operand2);
        let result = UnaryOperator[op].fn(x);
        state.operand2 = String(result);
        updateDisplay(state.operand2);
        break;
      }
    }
  });
})

// General function buttons

const generalFunctionButtons = document.querySelectorAll('.general-function')

generalFunctionButtons.forEach((button) => {
  const op = button.dataset.op;

  button.textContent = GeneralFunction[op].label;

  button.addEventListener('click', (e) => {
    switch (GeneralFunction[op]) {
      case GeneralFunction.Clear:
        resetState();
        updateDisplay(state.operand1);
        break;
      case GeneralFunction.Equal:
        switch (state.mode) {
          case Mode.Start:
            break;
          case Mode.FirstOperand:
            break;
          case Mode.Operator:
            break;
          case Mode.SecondOperand:
            // Calculate using current operator.
            let x = Number(state.operand1);
            let y = Number(state.operand2);
            let result = BinaryOperator[state.operator].fn(x, y);
            
            // Update display.
            state.operand1 = String(result);
            updateDisplay(state.operand1);
            break;
        }
        break;
    }
  });
})

const digitButtons = document.querySelectorAll('.digit')

digitButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    let digit = e.target.textContent;
    switch (state.mode) {
      case Mode.Start:
        state.operand1 = digit;
        state.mode = Mode.FirstOperand;
        updateDisplay(state.operand1);
        break;
      case Mode.FirstOperand:
        state.operand1 += digit;
        updateDisplay(state.operand1);
        break;
      case Mode.Operator:
        state.operand2 = digit;
        state.mode = Mode.SecondOperand;
        updateDisplay(state.operand2);
        break;
      case Mode.SecondOperand:
        state.operand2 += digit;
        updateDisplay(state.operand2);
        break;
    }
  });
})
