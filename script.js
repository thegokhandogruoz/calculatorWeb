// Define the calculator object with initial properties
const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

// Function to handle input of digits
function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    // Check if waiting for the second operand
    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        // Append digit to the display value, handling leading zero
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

// Function to handle input of decimal point
function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        return;
    }
    // Append decimal point if not already present
    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

// Function to highlight the selected operator button
function highlightOperatorButton(selectedOperator) {
    const operatorButtons = document.querySelectorAll('.operator');
    operatorButtons.forEach(button => {
        button.classList.remove('selected');
        if (button.value === selectedOperator) {
            button.classList.add('selected');
        }
    });
}

// Function to handle operators
function handleOperator(nextOperator) {
    const { firstOperand, operator, displayValue } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        // Perform calculation and update display
        const result = calculate(firstOperand, inputValue, operator);
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;

    // Highlight the selected operator button
    highlightOperatorButton(nextOperator);
}

// Function to perform calculations based on operator
function calculate(firstOperand, secondOperand, operator) {
    if (operator == '+') {
        return firstOperand + secondOperand;
    } else if (operator == '-') {
        return firstOperand - secondOperand;
    } else if (operator == '*') {
        return firstOperand * secondOperand;
    } else if (operator == '/') {
        return firstOperand / secondOperand;
    }

    return secondOperand;
}

// Function to reset the calculator to initial state
function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

// Function to update the display with the current calculator state
function updateDisplay() {
    const display = document.querySelector('.calculatorScreen');
    display.value = calculator.displayValue;
}

// Initial display update
updateDisplay();

// Event listener for button clicks
const keys = document.querySelector('.calculatorKeys');
keys.addEventListener('click', event => {
    const { target } = event;
    const { value } = target;

    // Check if the clicked element is a button
    if (!target.matches('button')) {
        return;
    }

    // Handle different button clicks
    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
            handleOperator(value);
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'allClear':
            resetCalculator();
            break;
        default:
            // If the button represents a digit, input the digit
            if (Number.isInteger(parseFloat(value))) {
                inputDigit(value);
            }
    }

    // Update the display after each button click
    updateDisplay();
});
