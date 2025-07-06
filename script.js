"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// MONEYFLOW APP

// Data
const account1 = {
  owner: "Prabhanjan Sahoo",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Suryanarayan Acharya",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Karan Samal",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Arpita Pradhan",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Now trynna extract username from actual name & place those usernames in respective accounts
const addingUserName = (accounts) => {
  accounts.forEach((acc) => {
    // ########### MANUAL METHOD : 1 #################
    // // first making username out of Real Name
    // let usrname = "";
    // for (const letter of acc.owner.split(" ")) {
    //   usrname += letter[0].toLowerCase();
    // }
    // acc.username = usrname;
    // ########### using BIG-CHAIN method : 2 ##########
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((n) => n[0])
      .join("");
  });
};
addingUserName(accounts);

// Updating 'movements' div
const updatingMovements = function (movements, isSorted = false) {
  // here i've passed soted by default 'false'
  // 1st removing previous display movements, if present any
  containerMovements.innerHTML = "";

  // SORTING
  const moves = isSorted ? [...movements].sort((x, y) => x - y) : movements;

  // adding Movements
  moves.forEach(function (value, index) {
    let depositOrWithdrawl = value > 0 ? "deposit" : "withdrawal";

    const htmlElement = `
        <div class="movements__row">
          <div class="movements__type movements__type--${depositOrWithdrawl}">
            ${index} ${depositOrWithdrawl}
          </div>
          <div class="movements__value">₹${value}</div>
        </div>
  `;

    containerMovements.insertAdjacentHTML("afterbegin", htmlElement);
  });
}; // i'm gonna call this when user will click 'login' button & after credentials match

// Now setting Currentbalance
let storage4LebelBal;
const settingCurrentBal = (movements) => {
  storage4LebelBal = movements.reduce(
    (valsSum, currentVal) => valsSum + currentVal
  );
  labelBalance.textContent = `₹${storage4LebelBal}`;
};

// Now setting total IN, OUT & INTEREST i.e. total deposits, withdrawl & interest user get :)
// Displaying summary
const summary = (movements, interestRate) => {
  // IN
  const totalDeposits = movements
    .filter((mov) => mov > 0)
    .reduce((acc, curr) => acc + curr);

  labelSumIn.textContent = `₹${totalDeposits}`;

  // OUT
  const totalWithdrawl = movements
    .filter((mov) => mov < 0)
    .reduce((acc, curr) => acc + curr);

  labelSumOut.textContent = `₹${Math.abs(totalWithdrawl)}`;
  // here Math.abs() will remove the -ve sign from withdrawl

  // INTEREST
  const totalInterest = movements
    .filter((mov) => mov > 0)
    .map((price) => (price * interestRate) / 100)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = `₹${parseFloat(totalInterest.toFixed(2))}`;
  // here i've used parsseFloat(). toFixed() methods to display interest money upto a fixed decimal point
};

const updateEverything = () => {
  // Displaying movements
  updatingMovements(loginAcc.movements);

  // Displaying Current balance
  settingCurrentBal(loginAcc.movements);

  // Displaying Summary
  summary(loginAcc.movements, loginAcc.interestRate);
};

// Now handling all Buttons, let's  :)

// 🔵 LOGIN button
let loginAcc;
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  // First changing welcome messege to login messege
  labelWelcome.textContent = `Log in to get started`;

  loginAcc = accounts.find((acc) => acc.username === inputLoginUsername.value);
  // console.log(loginAcc);

  // Hiding previously setted movements
  containerMovements.innerHTML = "";

  // Displaying UI messege
  if (
    loginAcc.username === inputLoginUsername.value &&
    loginAcc.pin === Number(inputLoginPin.value)
  ) {
    labelWelcome.textContent = `Welcome back, ${loginAcc.owner.split(" ")[0]}`;

    containerApp.style.opacity = 100;
  } else {
    alert(`Invalid username or pin`);
  }

  // now i want user login, pin input field clear after loggin in
  inputLoginUsername.value = inputLoginPin.value = "";

  // update everything
  updateEverything();
});

// 🔵 TRANSFER MONEY button
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();

  // now i'll search for the account of which username have used to transfer money
  let findAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  // if the username to which user is gonna transfer money is INVALID, then show alert
  if (typeof findAccount === "undefined") {
    alert("INVALID USERNAME");
    inputTransferTo.value = inputTransferAmount.value = "";
  }

  if (findAccount.username === inputTransferTo.value) {
    // before transfering money to another account 1st check wheather u've sufficient balance or not
    if (storage4LebelBal >= Number(inputTransferAmount.value)) {
      // i got the account & have sufficient money,
      // now i'll push the money to the user's movements array
      findAccount.movements.push(Number(inputTransferAmount.value));
      loginAcc.movements.push(Number(inputTransferAmount.value) * -1);
    } else {
      alert("Not enough BALANCE 💵");
    }
  }

  // // Then redisplaying updated movements
  // updatingMovements(loginAcc.movements);
  // // ⚠️⚠️ IMPORTANT ⚠️⚠️
  // // so, jadi kichi old html hateiki nuaan add karibaku chanhuchha,
  // // then aga sei entire HTML container ku khali karidia by <name>.innerHTML = ''
  // // then re-update / add kara

  // // Displaying Current balance
  // settingCurrentBal(loginAcc.movements);

  // // Displaying Summary
  // summary(loginAcc.movements, loginAcc.interestRate);
  // --------------or-----------
  // use directly updateEverything() :)
  updateEverything();

  // now i wanna clear the input fields of TRANSFER MONEY section
  inputTransferTo.value = inputTransferAmount.value = "";
  // console.log(Number(inputTransferAmount.value));
});

// 🔵 CLOSE ACCOUNT button
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === loginAcc.username &&
    Number(inputClosePin.value) === loginAcc.pin
  ) {
    const indexOfLoginAccount = accounts.findIndex(
      (acc) => acc.username === loginAcc.username
    );

    // First changing welcome messege to login messege
    labelWelcome.textContent = `Log in to get started`;

    // Now hiding UI
    containerApp.style.opacity = 0;

    // Then now removing user's object from 'accounts' array using it's index number
    accounts.splice(indexOfLoginAccount, 1);
  }

  // Now again getting the Starting page

  inputCloseUsername.value = inputClosePin.value = "";
});

// 🔵 REQUEST LOAN button
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const inputtedAmount = Number(inputLoanAmount.value);

  if (
    inputtedAmount > 0 &&
    loginAcc.movements.some((move) => move >= inputtedAmount * 0.1)
  ) {
    loginAcc.movements.push(inputtedAmount);
  }

  // clearing input field
  inputLoanAmount.value = "";

  //  Then again update the UI
  updateEverything();
});

// 🔵 SORT button
let isSorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(90);
  updatingMovements(loginAcc.movements, !isSorted);
  isSorted = !isSorted;
});
