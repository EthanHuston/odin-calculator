//Globals
let operandOne = "";
let operandTwo = "";
let currentOperator = null;
let shouldResetCurrent = false;
let currentScreenText = "0";

//UI Elements
const allDigits = document.querySelectorAll(".digit");
const allOperators = document.querySelectorAll(".operator");
const clearBtn = document.querySelector("#clear-btn");
const deleteBtn = document.querySelector("#delete-btn");
const pointBtn = document.querySelector("#point");
const equalsBtn = document.querySelector("#equals");
const lastOpScreen = document.querySelector("#last-operation-screen");
const currOpScreen = document.querySelector("#current-operation-screen");

//Listeners
window.addEventListener("keydown", handleKeyboardInput);
equalsBtn.addEventListener("click", evaluate);
clearBtn.addEventListener("click", clear);
pointBtn.addEventListener("click", addPoint);
deleteBtn.addEventListener("click", deleteLast);

allDigits.forEach((button) => {
  button.addEventListener("click", () => {
    addDigit(button.textContent);
  });
});

allOperators.forEach((button) => {
  button.addEventListener("click", () => {
    setOperator(button.textContent);
  });
});

//Functions
function addDigit(digit) {
  if (shouldResetCurrent || currOpScreen.textContent === "0") {
    resetCurrentScreen();
  }
  currentScreenText += digit;
  if (currentScreenText.length > 16) {
    currOpScreen.textContent = Number(currentScreenText).toExponential(2);
  } else {
    currOpScreen.textContent = currentScreenText;
  }
}
function addPoint() {
  if (shouldResetCurrent) resetCurrentScreen();
  if (currentScreenText === "") {
    currentScreenText = "0";
    currOpScreen.textContent = currentScreenText;
  }
  if (currentScreenText.includes(".")) return;
  currentScreenText += ".";
  currOpScreen.textContent = currentScreenText;
}

//Sets the current operator and operands, updates screens, and evaluates if needed
function setOperator(operator) {
  if (currentOperator !== null) {
    evaluate();
  }
  operandOne = currOpScreen.textContent;
  currentOperator = operator;
  lastOpScreen.textContent = `${operandOne} ${currentOperator}`;
  shouldResetCurrent = true;
}

//Evaluates the current function if applicable
function evaluate() {
  if (currentOperator === null || shouldResetCurrent) return;
  if (currentOperator == "/" && currentScreenText === "0") {
    clear();
    currOpScreen.textContent = "ERROR DIVIDE BY 0";
    shouldResetCurrent = true;
    return;
  }
  operandTwo = currentScreenText;
  //Complete operation with rounding and convert back to string
  currentScreenText = String(
    Math.round(operate(currentOperator, operandOne, operandTwo) * 1000) / 1000
  );

  //Checks length and converts to scientific notation if needed
  if (currentScreenText.length > 16) {
    currOpScreen.textContent = Number(currentScreenText).toExponential(2);
  } else {
    currOpScreen.textContent = currentScreenText;
  }

  lastOpScreen.textContent = `${operandOne} ${currentOperator} ${operandTwo}`;
  currentOperator = null;
  shouldResetCurrent = true;
}

//Resets current operation screen to prep for fresh number
function resetCurrentScreen() {
  currOpScreen.textContent = "";
  currentScreenText = "";
  shouldResetCurrent = false;
}

//Clears the calculator screens as though reloading the page
function clear() {
  operandOne = "";
  operandTwo = "";
  currentOperator = null;
  currOpScreen.textContent = "0";
  lastOpScreen.textContent = "";
}

//Deletes the last character in stream
function deleteLast() {
  if (currentScreenText === "0") return;
  if (currentScreenText.length <= 1) {
    currentScreenText = "0";
    currOpScreen.textContent = currentScreenText;
  } else {
    currentScreenText = currentScreenText.slice(
      0,
      currentScreenText.length - 1
    );

    if (currentScreenText.length > 16) {
      currOpScreen.textContent = Number(currentScreenText).toExponential(2);
    } else {
      currOpScreen.textContent = currentScreenText;
    }
  }
}

function handleKeyboardInput(e) {
  if (Number(e.key) >= 0 && Number(e.key) <= 9) addDigit(e.key);
  if (e.key === ".") addPoint();
  if (e.key === "=" || e.key === "Enter") evaluate();
  if (e.key === "Backspace" || e.key === "Delete") deleteLast();
  if (e.key === "Escape") clear();
  if (
    e.key === "+" ||
    e.key === "-" ||
    e.key === "*" ||
    e.key === "x" ||
    e.key === "/"
  )
    setOperator(convertOperator(e.key));
}

function convertOperator(keyInput) {
  if (keyInput === "/") return "/";
  if (keyInput === "*" || keyInput === "x") return "x";
  if (keyInput === "-") return "-";
  if (keyInput === "+") return "+";
}

//Operate method takes the numbers and operator and calls the correct function
function operate(operator, num1, num2) {
  switch (operator) {
    case "+":
      return add(num1, num2);
    case "-":
      return subtract(num1, num2);

    case "x":
      return multiply(num1, num2);

    case "/":
      return divide(num1, num2);

    default:
      console.error("Unknown operation!");
      break;
  }
}

//Adds two given numbers together and returns
function add(num1, num2) {
  return Number(num1) + Number(num2);
}

//Subtracts two given numbers together and returns
function subtract(num1, num2) {
  return Number(num1) - Number(num2);
}

//Multiplies two given numbers together and returns
function multiply(num1, num2) {
  return Number(num1) * Number(num2);
}

//Divides two given numbers together and returns
function divide(num1, num2) {
  return Number(num1) / Number(num2);
}
