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
    numberString = Number(numberString).toExponential(5);
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
  Negate: { fn: negate, label: '+/-', key: 'n' },
  Percent: { fn: percent, label: '%' },
});

const GeneralFunction = Object.freeze({
  Clear: { label: 'AC', key: 'Escape' },
  Equal: { label: '=', key: 'Enter' }
});

// Mapping from keyboard to operators

function makeKeyMap(Operator) {
  return Object.entries(Operator).reduce((map, [name, op]) => {
    const key = op.key || op.label;
    if (key) map[key] = name;
    return map;
  }, {});
}

const BinaryOperatorKeyMap = makeKeyMap(BinaryOperator);
const UnaryOperatorKeyMap = makeKeyMap(UnaryOperator);
const GeneralFunctionKeyMap = makeKeyMap(GeneralFunction);

// Binary operator buttons

let activeBinaryOperatorButton = null;

function clearActiveBinaryOperatorButton() {
  if (activeBinaryOperatorButton) {
    activeBinaryOperatorButton.classList.remove('active-binary-operator');
    activeBinaryOperatorButton = null;
  }
}

const binaryOperatorButtons = document.querySelectorAll('.binary-operator')

binaryOperatorButtons.forEach((button) => {
  const op = button.dataset.op;

  button.textContent = BinaryOperator[op].label;

  button.addEventListener('click', (e) => {
    clearActiveBinaryOperatorButton();

    // Make this button active.
    button.classList.add('active-binary-operator');
    activeBinaryOperatorButton = button;
  
    switch (state.mode) {
      case Mode.Start:
        // Assume we already have a first operand (which may be 0).
        state.operand1 = state.operand1 || '0';
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
    clearActiveBinaryOperatorButton();

    const updateOperand = (operand) => {
      let x = Number(state[operand]);
      let result = UnaryOperator[op].fn(x);
      state[operand] = String(result);
      updateDisplay(state[operand]);
    };
  
    switch (state.mode) {
      case Mode.Start:
      case Mode.FirstOperand: {
        updateOperand('operand1');
        break;
      }
      case Mode.Operator:
        break;
      case Mode.SecondOperand: {
        updateOperand('operand2');
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
    clearActiveBinaryOperatorButton();

    switch (GeneralFunction[op]) {
      case GeneralFunction.Clear:
        resetState();
        updateDisplay(state.operand1);
        break;
      case GeneralFunction.Equal:
        switch (state.mode) {
          case Mode.Start:
          case Mode.FirstOperand:
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

            // Reset rest of state.
            state.mode = Mode.Start;
            state.operand2 = '';
            state.operator = null;
            break;
        }
        break;
    }
  });
})

// Digit buttons

const digitButtons = document.querySelectorAll('.digit')

digitButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    clearActiveBinaryOperatorButton();

    let digit = e.target.textContent;

    const setFirstDigit = (operand, mode) => {
      state[operand]= digit;
      state.mode = Mode[mode];
      updateDisplay(state[operand]);
    };

    const addDigit = (operand) => {
      state[operand] += digit;
      updateDisplay(state[operand]);   
    };

    switch (state.mode) {
      case Mode.Start:
        setFirstDigit('operand1', 'FirstOperand');
        break;
      case Mode.FirstOperand:
        addDigit('operand1');
        break;
      case Mode.Operator:
        setFirstDigit('operand2', 'SecondOperand');
        break;
      case Mode.SecondOperand:
        addDigit('operand2');
        break;
    }
  });
})

// Zero button

const zeroButton = document.querySelector('.zero')

zeroButton.addEventListener('click', (e) => {
  clearActiveBinaryOperatorButton();

  let zero = '0';

  switch (state.mode) {
    case Mode.Start:
      state.operand1 = zero;
      updateDisplay(state.operand1);
      break;
    case Mode.FirstOperand:
      state.operand1 += zero;
      updateDisplay(state.operand1);
      break;
    case Mode.Operator:
      state.operand2 = zero;
      state.mode = Mode.SecondOperand;
      updateDisplay(state.operand2);
      break;
    case Mode.SecondOperand:
      state.operand2 += zero;
      updateDisplay(state.operand2);
      break;
  }
});

// Decimal button

const decimalButton = document.querySelector('.decimal')

decimalButton.addEventListener('click', (e) => {
  clearActiveBinaryOperatorButton();

  let decimal = '.';

  const setDecimal = (operand, mode) => {
    state[operand]= '0.';
    state.mode = Mode[mode];
    updateDisplay(state[operand]);
  };

  const addDecimal = (operand) => {
    if (!state[operand].includes(decimal)) {
      state[operand] += decimal;
      updateDisplay(state[operand]);
    }
  };

  switch (state.mode) {
    case Mode.Start:
      setDecimal('operand1', 'FirstOperand');
      break;
    case Mode.FirstOperand:
      addDecimal('operand1');
      break;
    case Mode.Operator:
      setDecimal('operand2', 'SecondOperand');
      break;
    case Mode.SecondOperand:
      addDecimal('operand2');
      break;
  }
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

  // Zero
  if (key === '0') {
    zeroButton.click();
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
  const shortenOperand = (operand) => {
    if (state[operand].length > 0) {
      state[operand] = state[operand].slice(0, -1);
      updateDisplay(state[operand]);
    }
  };

  switch (state.mode) {
    case Mode.Start:
      break;
    case Mode.FirstOperand:
      shortenOperand('operand1');
      break;
    case Mode.Operator:
      break;
    case Mode.SecondOperand:
      shortenOperand('operand2');
      break;
  }
});
