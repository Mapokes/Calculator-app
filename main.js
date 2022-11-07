// ===============================================
// THEMES
// ===============================================

const siteBg = document.querySelector("body");
const checkBtn1 = document.getElementById("theme-1");
const checkBtn2 = document.getElementById("theme-2");
const checkBtn3 = document.getElementById("theme-3");

// loads local JSON or creates one, if it doesn't exist, with value - color-theme-1
window.addEventListener("load", () => {
  loadTheme();

  if (themeSetting != "") {
    siteBg.classList.add(themeSetting);
    if (themeSetting == "color-theme-1") {
      themeSelector(checkBtn1);
    } else if (themeSetting == "color-theme-2") {
      themeSelector(checkBtn2);
    } else if (themeSetting == "color-theme-3") {
      themeSelector(checkBtn3);
    }
  } else {
    themeSelector(checkBtn1);
  }
});

// loads local JSON function
function loadTheme() {
  themeSetting = JSON.parse(localStorage.getItem("themeSetting")) || [];
}

// saves themeSetting to local JSON
function saveTheme(chosenTheme) {
  themeSetting = chosenTheme;
  localStorage.setItem("themeSetting", JSON.stringify(themeSetting));
}

// main function for functionality of checkboxes themes (styles, body IDs & JSON saving)
const checkBoxes = document.querySelectorAll(".theme-checkbox");

function themeSelector(clickedCheckbox) {
  checkBoxes.forEach((checkBox) => {
    checkBox.style.pointerEvents = "none";
    checkBox.checked = false;
  });
  clickedCheckbox.style.pointerEvents = "all";
  clickedCheckbox.checked = true;
  siteBg.id = `color-${clickedCheckbox.id}`;

  saveTheme(`color-${clickedCheckbox.id}`);
}

// functionality for each checkbox
checkBoxes.forEach((checkBox) => {
  checkBox.addEventListener("click", () => {
    if (checkBox.id == "theme-1") {
      themeSelector(checkBtn2);
    } else if (checkBox.id == "theme-2") {
      themeSelector(checkBtn3);
    } else if (checkBox.id == "theme-3") {
      themeSelector(checkBtn1);
    }
  });
});

//TODO - INPUT MAX LENGTH
//TODO - number floats

// ===============================================
// CALCULATOR FUNCTIONS
// ===============================================

const calcResult = document.getElementById("calc-result-input");
const calcButtonsNum = document.querySelectorAll(".calc-btn-num");
const calcButtonsOperation = document.querySelectorAll(".calc-btn-operation");
const history = document.getElementById("history");

calcResult.value = "0";
history.textContent = "";
let calcArray = ["", "", "", "", ""];
let result = 0;
let operatorClicked = false;
let enterBtnClicked = false;

// calc num buttons and "." functionalities
calcButtonsNum.forEach((calcButtonNum) => {
  calcButtonNum.addEventListener("click", () => {
    if (((calcArray[0] === "" || calcArray[0] === "0") && calcArray[1] === "") || (enterBtnClicked && !operatorClicked)) {
      if (enterBtnClicked) {
        enterBtnClicked = false;
        history.textContent = "";
      }
      calcResult.value = calcButtonNum.textContent.trim();
      calcArray[0] = calcResult.value;
      if (calcButtonNum.textContent.trim() === ".") {
        calcArray[0] = "0.";
        calcResult.value = calcArray[0];
      }
    } else if (calcArray[0] !== "" && calcArray[1] === "") {
      if (calcButtonNum.textContent.trim() === "." && calcArray[0].includes(".")) {
        return;
      }
      calcResult.value += calcButtonNum.textContent.trim();
      calcArray[0] = calcResult.value;
    } else if (calcArray[2] === "" || calcArray[2] === "0") {
      if (enterBtnClicked) {
        enterBtnClicked = false;
      }
      calcResult.value = calcButtonNum.textContent.trim();
      calcArray[2] = calcResult.value;
      if (calcButtonNum.textContent.trim() === ".") {
        calcArray[2] = "0.";
        calcResult.value = calcArray[2];
      }
    } else if (calcArray[2] !== "") {
      calcResult.value += calcButtonNum.textContent.trim();
      calcArray[2] = calcResult.value;
      if (calcButtonNum.textContent.trim() === "." && calcArray[2].includes(".")) {
        return;
      }
    }
  });
});

// calc operator symbol buttons functionalities
calcButtonsOperation.forEach((calcButtonOperation) => {
  calcButtonOperation.addEventListener("click", () => {
    switch (calcButtonOperation.textContent.trim().toLocaleLowerCase()) {
      case "+":
        operatorHelperFunction();
        calcArray[1] = "+";
        history.textContent = `${Number(calcArray[0])} ${calcArray[1]}`;
        break;

      case "-":
        operatorHelperFunction();
        calcArray[1] = "-";
        history.textContent = `${Number(calcArray[0])} ${calcArray[1]}`;
        break;

      case "x":
        operatorHelperFunction();
        calcArray[1] = "x";
        history.textContent = `${Number(calcArray[0])} ${calcArray[1]}`;
        break;

      case "/":
        operatorHelperFunction();
        calcArray[1] = "/";
        history.textContent = `${Number(calcArray[0])} ${calcArray[1]}`;
        break;

      case "backspace":
        if (operatorClicked && calcArray[2] === "") {
          return;
        } else if (calcArray[2] === "" && !operatorClicked) {
          calcArray[0] = calcArray[0].slice(0, -1);
          if (calcArray[0] === "") {
            calcArray[0] = "0";
          }
          calcResult.value = calcArray[0];
        } else {
          calcArray[2] = calcArray[2].slice(0, -1);
          if (calcArray[2] === "") {
            calcArray[2] = "0";
          }
          calcResult.value = calcArray[2];
        }
        if (enterBtnClicked) {
          calcResult.value = result;
          calcArray[0] = result.toString();
        }
        break;

      case "=":
        if (!enterBtnClicked && !operatorClicked && calcArray[2] === "" && calcArray[4] === "") {
          if (calcArray[0] === "") {
            calcArray[0] = "0";
          }
          result = parseFloat(calcArray[0]);
          calcResult.value = result;
        } else if (!operatorClicked && calcArray[4] !== "") {
          calcArray[1] = calcArray[3];
          calcArray[2] = calcArray[4];
        } else if ((operatorClicked && enterBtnClicked) || (!enterBtnClicked && calcArray[2] === "")) {
          calcArray[2] = calcArray[0];
        }
        if (calcArray[2] === "") {
          history.textContent = `${Number(calcArray[0])} ${calcArray[1]} =`;
        } else {
          history.textContent = `${Number(calcArray[0])} ${calcArray[1]} ${Number(calcArray[2])} =`;
        }
        calculation(calcArray[1]);
        operatorClicked = false;
        enterBtnClicked = true;
        calcResult.value = result;
        calcArray[0] = result.toString();
        calcArray[3] = calcArray[1];
        calcArray[4] = calcArray[2];
        calcArray[1] = "";
        calcArray[2] = "";
        break;

      case "reset":
        calcResult.value = "0";
        calcArray = ["", "", "", "", ""];
        result = 0;
        operatorClicked = false;
        enterBtnClicked = false;
        history.textContent = "";
        break;

      default:
        console.log("Wrong operator");
        break;
    }
  });
});

// calculates result
function calculation(selectedOperator) {
  if (selectedOperator === "+") {
    result = parseFloat(calcArray[0]) + parseFloat(calcArray[2]);
  } else if (selectedOperator === "-") {
    result = parseFloat(calcArray[0]) - parseFloat(calcArray[2]);
  } else if (selectedOperator === "x") {
    result = parseFloat(calcArray[0]) * parseFloat(calcArray[2]);
  } else if (selectedOperator === "/") {
    result = parseFloat(calcArray[0]) / parseFloat(calcArray[2]);
  }
}

// helper function for +, -, *, /
function operatorHelperFunction() {
  if (calcArray[0] === "") {
    calcArray[0] = "0";
  } else if (!enterBtnClicked && operatorClicked && calcArray[2] !== "") {
    calculation(calcArray[1]);
    calcResult.value = result;
    calcArray[0] = result.toString();
    calcArray[2] = "";
  }
  calcResult.value = parseFloat(calcArray[0]);
  operatorClicked = true;
}

// ===============================================
// KEYBOARD FUNCTIONS
// ===============================================

const num0 = document.getElementById("num0");
const num1 = document.getElementById("num1");
const num2 = document.getElementById("num2");
const num3 = document.getElementById("num3");
const num4 = document.getElementById("num4");
const num5 = document.getElementById("num5");
const num6 = document.getElementById("num6");
const num7 = document.getElementById("num7");
const num8 = document.getElementById("num8");
const num9 = document.getElementById("num9");

const additionBtn = document.getElementById("addition-btn");
const subtractBtn = document.getElementById("subtract-btn");
const multiplyBtn = document.getElementById("multiply-btn");
const divideBtn = document.getElementById("divide-btn");
const deleteBtn = document.getElementById("delete-btn");
const comaBtn = document.getElementById("coma-btn");
const resetBtn = document.getElementById("reset-btn");
const enterBtn = document.getElementById("enter-btn");

document.addEventListener("keydown", (e) => {
  if (e.key == 0) {
    num0.click();
  } else if (e.key == 1) {
    num1.click();
  } else if (e.key == 2) {
    num2.click();
  } else if (e.key == 3) {
    num3.click();
  } else if (e.key == 4) {
    num4.click();
  } else if (e.key == 5) {
    num5.click();
  } else if (e.key == 6) {
    num6.click();
  } else if (e.key == 7) {
    num7.click();
  } else if (e.key == 8) {
    num8.click();
  } else if (e.key == 9) {
    num9.click();
  } else if (e.key == "+") {
    additionBtn.click();
  } else if (e.key == "-") {
    subtractBtn.click();
  } else if (e.key == "*") {
    multiplyBtn.click();
  } else if (e.key == "/") {
    divideBtn.click();
  } else if (e.key == "Backspace") {
    deleteBtn.click();
  } else if (e.key == ",") {
    comaBtn.click();
  } else if (e.key == "Delete") {
    resetBtn.click();
  } else if (e.key == "Enter") {
    enterBtn.click();
  }
});
