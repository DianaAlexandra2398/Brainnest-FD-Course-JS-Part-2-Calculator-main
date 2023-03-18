let previousValueOnScreen = document.querySelector(".previous-value");
let currentValueOnScreen = document.querySelector(".current-value");
let operator = "";
let previousValue = "";
let currentValue = "";
let operatorFlag = 0;
let operatorAux = "";
let error = "";

//Keyboard support
document.addEventListener("keydown", function(e) {
    let name = e.key;
    if(/[0-9]/.test(name)) {
        handleNumber(name);
        currentValueOnScreen.textContent = currentValue;
    } else if(/[-+*/]/.test(name)) {
        if((currentValueOnScreen.textContent !== "") || (previousValueOnScreen.textContent !== "")) {
            handleOperator(name);
            previousValueOnScreen.textContent = previousValue + " " + operator;
            if((operatorAux === "") && (error === "")) {
                currentValueOnScreen.textContent = currentValue;
            }
        }
    } else if((name === "Enter") || (/[=]/.test(name))) {
        handleEqual();
     } else if(name === "Delete") {
        clearEntry();
    } else if(name === "Backspace") {
        deleteLastDigit();
    } else if((name === ".") || (name === ",")) {
        addDecimal(name);
    } else if(name === "Escape") {
        clearAll();
    }
})

//Click support
document.addEventListener("DOMContentLoaded", function() {
    let clearButton = document.querySelector("#clear-all");
    let clearEntryButton = document.querySelector("#clear-entry");
    let deleteButton = document.querySelector("#delete");
    let equalButton = document.querySelector("#equal");
    let decimalButton = document.querySelector("#decimal");

    let numbers = document.querySelectorAll(".number");
    let operators = document.querySelectorAll(".operator");

    numbers.forEach((number) => number.addEventListener("click", function(e) {
        handleNumber(e.target.textContent);
        currentValueOnScreen.textContent = currentValue;
    }))

    operators.forEach((op) => op.addEventListener("click", function(e) {
        if((currentValueOnScreen.textContent !== "") || (previousValueOnScreen.textContent !== "")) {
            checkDecimal();
            handleOperator(e.target.textContent);
            previousValueOnScreen.textContent = previousValue + " " + operator;
            if((operatorAux === "") && (error === "")) {
                currentValueOnScreen.textContent = currentValue;
            }
        }
    }))

    clearButton.addEventListener("click", function() {
        clearAll();
    })

    clearEntryButton.addEventListener("click", function() {
        clearEntry();
    })

    deleteButton.addEventListener("click", function() {
        deleteLastDigit();
    })

    equalButton.addEventListener("click", function() {
        handleEqual();
    })

    decimalButton.addEventListener("click", function() {
        addDecimal();
    })
})

//Clear the memory
function clearAll() {
    previousValue = "";
    currentValue = "";
    operator = "";
    previousValueOnScreen.textContent = currentValue;
    currentValueOnScreen.textContent = currentValue;
    operatorFlag = 0;
    operatorAux = "";
    error = "";
}

//Clear the second operand
function clearEntry() {
    currentValue = "";
    currentValueOnScreen.textContent = currentValue;
}

//Delete the last digit
function deleteLastDigit() {
    if(currentValue !== "") {
        currentValue = currentValue.toString();
        currentValue = currentValue.slice(0, -1);
        currentValueOnScreen.textContent = currentValue;
    } else if(previousValue !== "") {
        previousValue = previousValue.slice(0, -1);
        currentValueOnScreen.textContent = previousValue;
    } else {
        previousValue = "";
        currentValue = previousValue;
        currentValueOnScreen.textContent = currentValue;
    }
}

//Handle the result button
function handleEqual() {
    if(error !== "") {
        clearAll();
    }

    if((currentValue !== "") && (previousValue !== "")) {
        operate();
        previousValueOnScreen.textContent = "";
        if(error !== "") {
            currentValueOnScreen.textContent = error;
            operator = "";
        } else {
            previousValue = previousValue.toString();
            currentValueOnScreen.textContent = previousValue;
        }
        operatorFlag = 0;
        operatorAux = "";
        currentValue = "";
        previousValue = "";
    }
}

//Handle the number selected
function handleNumber(num) {
    if(error !== "") {
        clearAll();
    }

    if(currentValue.length <= 10) {
        currentValue += num;
    }
}

//Handle the operator selected
function handleOperator(op) {
    if(error !== "") {
        clearAll();
    }

    if(operatorFlag === 0) {
        if(operator === "") {
            operator = op;
            operatorFlag = 1;
        }
    } else {
        operatorAux = op;
    }

    if((currentValue !== "") && (previousValue !== "")) {
        if(currentValue === "0") {
            currentValueOnScreen.textContent = "error";
            previousValue = "";
            operator = "";
            error = "error";
        } else {
            operate();
            currentValueOnScreen.textContent = "";
            if(op !== operator) {
                operator = op;
                currentValue = "";
            }
        }
    } else if((currentValue !== "") && (previousValue === "")) {
        previousValue = currentValue;
        currentValue = "";
        operator = op;
        operatorFlag = 0;
    } else if((currentValue === "") && (previousValue !== "")) {
        if(operatorAux !== "") {
            operator = operatorAux;
        } else {
            if(op !== operator) {
                operator = op;
                currentValue = "";
            }
        }
    } 
}

//Make the calculation
function operate() {
    previousValue = Number(previousValue);
    currentValue = Number(currentValue);

    switch(operator) {
        case "+": 
            previousValue += currentValue;
            if(operatorAux !== "") {
                operator = operatorAux;
            }
            break;

        case "-": 
            previousValue -= currentValue;
            if(operatorAux !== "") {
                operator = operatorAux;
            }
            break;

        case "*": 
            previousValue *= currentValue;
            if(operatorAux !== "") {
                operator = operatorAux;
            }
            break;

        case "/":
            if(currentValue != 0) {
                previousValue /= currentValue;
                if(operatorAux !== "") {
                    operator = operatorAux;
                }
            } else {
                previousValue = "";
                error = "Cannot divide by zero 😕";
            }
            break;

        default:
            return; 
    }
    previousValue = roundNumber(previousValue);
}

//Round the float number to 5th digit
function roundNumber(num) {
    return Math.round(num * 100000) / 100000;
}

//Handle the decimal entry
function addDecimal() {
    if(!currentValue.includes(".")) {
        if(currentValue !== "") {
            currentValue += ".";
            currentValueOnScreen.textContent = currentValue;
        } else {
            currentValue += "0.";
            currentValueOnScreen.textContent = currentValue;
        }
    }
}

//Check if there are any numbers after the decimal point
function checkDecimal() {
    let decimalAux = currentValue.split(".");
    if(decimalAux[1] === "") {
        currentValue = decimalAux[0];
        currentValueOnScreen.textContent = currentValue;
    }
}