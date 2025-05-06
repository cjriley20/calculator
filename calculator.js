// Mapping from operators and functions to display text

export const BinaryOperator = {
  Add: { fn: (x, y) => x + y, label: '+' },
  Subtract: { fn: (x, y) => x - y, label: '-' },
  Multiply: { fn: (x, y) => x * y, label: '*' },
  Divide: { fn: (x, y) => y !== 0 ? x / y : 'Error', label: '/' },
};

export const UnaryOperator = {
  Negate: { fn: x => -x, label: '+/-', key: 'n' },
  Percent: { fn: x => x / 100, label: '%' }
};

export const GeneralFunction = Object.freeze({
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

export const BinaryOperatorKeyMap = makeKeyMap(BinaryOperator);
export const UnaryOperatorKeyMap = makeKeyMap(UnaryOperator);
export const GeneralFunctionKeyMap = makeKeyMap(GeneralFunction);

// Calculator 

const Mode = Object.freeze({
  Start: 'start',
  FirstOperand: 'firstOperand',
  Operator: 'operator',
  SecondOperand: 'secondOperand'
});

export class Calculator {
  constructor() {
    this.reset();
  }

  reset() {
    this.mode = Mode.Start;
    this.operand1 = '';
    this.operand2 = '';
    this.operator = null;
  }

  log() {
    console.log('*** Calculator ***');
    console.log(this.mode);
    console.log(this.operand1);
    console.log(this.operand2);
    console.log(this.operator);
  }

  getDisplay() {
    return this.operand2 || this.operand1 || '0';
  }

  evaluate() {
    if (this.mode != Mode.SecondOperand || !this.operator) return;

    const fn = BinaryOperator[this.operator].fn;
    const x = Number(this.operand1);
    const y = Number(this.operand2);

    if (isNaN(x) || isNaN(y)) return;
  
    const result = fn(x, y);

    this.operand1 = String(result);
    this.operand2 = '';
    this.operator = null;
    this.mode = Mode.Start;8
  }

  inputDigit(digit) {
    if (!/^\d$/.test(digit)) return;

    const addDigit = (op) => {
      if (this[op] === '0') {
        this[op] = digit === '0' ? '0' : digit;
      }
      else {
        this[op] += digit;
      }
    }

    switch (this.mode) {
      case Mode.Start:
        this.operand1 = digit;
        this.mode = Mode.FirstOperand;
        break;
      case Mode.FirstOperand:
        addDigit('operand1');
        break;
      case Mode.Operator:
        this.operand2 = digit;
        this.mode = Mode.SecondOperand;
        break;
      case Mode.SecondOperand:
        addDigit('operand2');
        break;
    }
  }

  inputDecimal() {
    const addDecimal = (op) => {
      if (!this[op].includes('.')) {
        this[op] += '.';
      }
    };
  
    switch (this.mode) {
      case Mode.Start:
        this.operand1 = '0.';
        this.mode = Mode.FirstOperand;
        break;
      case Mode.FirstOperand:
        addDecimal('operand1');
        break;
      case Mode.Operator:
        this.operand2 = '0.';
        this.mode = Mode.SecondOperand;
        break;
      case Mode.SecondOperand:
        addDecimal('operand2');
        break;
    }
  }

  inputBinaryOperator(op) {
    if (!BinaryOperator[op]) return;

    switch (this.mode) {
      case Mode.Start:
        this.operand1 = this.operand1 || '0';
        this.operator = op;
        this.mode = Mode.Operator;
        break;
      case Mode.FirstOperand:
        this.operator = op;
        this.mode = Mode.Operator;
        break;
      case Mode.Operator:
        // Overwrite last operator.
        this.operator = op;
        break;
      case Mode.SecondOperand:
        this.evaluate();
        this.operator = op;
        this.mode = Mode.Operator;
        break;
    }
  }

  inputUnaryOperator(op) {
    const fn = UnaryOperator[op].fn;
    if (!fn) return;

    const apply = (operand) => {
      const num = Number(this[operand]);
      if (isNaN(num)) return;
      this[operand] = String(fn(num));
    };
  
    switch (this.mode) {
      case Mode.Start:
      case Mode.FirstOperand: {
        apply('operand1');
        break;
      }
      case Mode.SecondOperand: {
        apply('operand2');
        break;
      }
    }
  }

  backspace() {
    const shorten= (op) => {
      if (this[op].length > 0) {
        this[op] = this[op].slice(0, -1);
      }
    };
  
    switch (this.mode) {
      case Mode.FirstOperand:
        shorten('operand1');
        break;
      case Mode.SecondOperand:
        shorten('operand2');
        break;
    }
  }
}
