const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const inputslider = document.querySelector("[data-lengthSlider]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '`~!@#$%^&*()_-+={[}]|\:;<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");


//set passwordlength
function handleSlider() {
    inputslider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputslider.min;
    const max = inputslider.max;
    inputslider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    console.log("enter in random integer");
    return Math.floor(Math.random() * (max - min)) + min;
   
}

function getRandomNumber() {
    return getRndInteger(0, 9);
}

function getUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function getLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function getSymbol() {
    randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasupper = false;
    let haslower = false;
    let hasnum = false;
    let hassym = false;

    if (uppercaseCheck.checked) hasupper = true;
    if (lowercaseCheck.checked) haslower = true;
    if (numbersCheck.checked) hasnum = true;
    if (symbolsCheck.checked) hassym = true;

    if (hasupper && haslower && (hasnum || hassym) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if ((haslower || hasupper) && (hasnum || hassym) && passwordLength >= 6) {
        setIndicator("red");
    }
    else {
        setIndicator("f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }

    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

}

function shufflePassword(array) {
    //fisher yates method
    for (let i = array.length - 1; i > 0; i--) {

        //for random j
        const j = Math.floor(Math.random() * (i + 1));

        //for swap
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

//eventlistener on slider
inputslider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

//eventlistener on copybtn
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
})


//generate password code
generateBtn.addEventListener('click', () => {
    if (checkCount == 0) {
        return;
    }

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    //lets finnd new password

    password = "";

    // if (uppercaseCheck.checkbox) {
    //     password += getUpperCase();
    // }
    // if (lowercaseCheck.checkbox) {
    //     password += getLowerCase();
    // }
    // if (numbersCheck.checkbox) {
    //     password += getRandomNumber();
    // }
    // if (symbolsCheck.checkbox) {
    //     password += getSymbol();
    // }

    //by functions
    let funcArr = [];

    if (uppercaseCheck.checked) {
        funcArr.push(getUpperCase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(getLowerCase);
    }
    if (numbersCheck.checked) {
        funcArr.push(getRandomNumber);
    }
    if (symbolsCheck.checked) {
        funcArr.push(getSymbol);
    }

    //compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    console.log("COmpulsory adddition done");

    //remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        console.log("enter in remaining addition");
        let randIndex = getRndInteger(0, funcArr.length);
        console.log("randIndex " + randIndex);
        password += funcArr[randIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;

    //cal strength
    calcStrength();

})

