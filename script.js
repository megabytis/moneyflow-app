"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// MONEYFLOW APP

// Data
const account1 = {
  owner: "Prabhanjan Sahoo",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2023-04-01T10:17:24.185Z",
    "2024-05-08T14:11:59.604Z",
    "2025-05-26T17:01:17.194Z",
    "2025-07-02T23:36:17.929Z",
    "2025-07-10T10:51:36.790Z",
  ],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Suryanarayan Acharya",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  movementsDates: [
    "2020-02-14T08:22:45.120Z",
    "2021-03-05T16:30:12.845Z",
    "2022-04-18T11:45:33.210Z",
    "2023-06-09T13:15:47.532Z",
    "2024-08-22T09:30:21.763Z",
    "2024-09-15T14:55:10.421Z",
    "2025-1-30T18:20:05.317Z",
    "2025-07-11T11:30:21.540Z",
  ],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Karan Samal",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  movementsDates: [
    "2019-09-05T12:10:30.450Z",
    "2020-10-12T15:42:18.720Z",
    "2022-01-15T10:30:45.120Z",
    "2024-03-22T14:25:33.890Z",
    "2024-09-30T11:15:22.540Z",
    "2025-05-11T16:40:10.230Z",
    "2025-06-09T13:15:47.532Z",
    "2025-07-12T06:36:17.929Z",
  ],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Arpita Pradhan",
  movements: [430, 1000, 700, 50, 90],
  movementsDates: [
    "2020-01-03T09:12:45.320Z",
    "2020-02-20T13:25:10.750Z",
    "2024-04-15T17:30:22.410Z",
    "2025-07-06T10:45:33.120Z",
    "2025-07-12T14:15:47.890Z",
  ],
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

// showing every money according to this Intl format
const formatCurrency = (money) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(money);
};

// Updating 'movements' div
const updatingMovements = function (acc, isSorted = false) {
  // here i've passed soted by default 'false'
  // 1st removing previous display movements, if present any
  containerMovements.innerHTML = "";

  // now combining movements with Dates to sync both
  const combinedDatesMovements = acc.movements.map((movs, index) => ({
    move: movs,
    moveDates: acc.movementsDates.at(index),
  }));

  // SORTING
  if (isSorted) combinedDatesMovements.sort((a, b) => a.move - b.move);

  // adding Movements
  combinedDatesMovements.forEach(function (obj, index) {
    const { move, moveDates } = obj;
    let depositOrWithdrawl = move > 0 ? "deposit" : "withdrawal";

    // adding Date
    const date = new Date(moveDates);

    // Format the display text
    const displayDate = formatMovementDate(date);

    // Helper function to format the date display
    function formatMovementDate(date) {
      const now = new Date();
      const secondsPassed = (now - date) / 1000;
      const daysPassed = Math.floor(secondsPassed / (60 * 60 * 24));
      const weeksPassed = Math.floor(daysPassed / 7);
      const monthsPassed = Math.floor(daysPassed / 30);
      const yearsPassed = Math.floor(daysPassed / 365);

      if (secondsPassed < 60) return "Just now";
      if (secondsPassed < 3600)
        return `${Math.floor(secondsPassed / 60)} minutes ago`;
      if (secondsPassed < 86400)
        return `${Math.floor(secondsPassed / 3600)} hours ago`;
      if (daysPassed === 0) return "Today";
      if (daysPassed === 1) return "Yesterday";
      if (daysPassed <= 7) return `${daysPassed} days ago`;
      if (weeksPassed <= 4)
        return `${weeksPassed} week${weeksPassed === 1 ? "" : "s"} ago`;
      if (monthsPassed < 12)
        return `${monthsPassed} month${monthsPassed === 1 ? "" : "s"} ago`;
      return `${yearsPassed} year${yearsPassed === 1 ? "" : "s"} ago`;
    }

    const htmlElement = `
        <div class="movements__row">
          <div class="movements__type movements__type--${depositOrWithdrawl}">
            ${index + 1} ${depositOrWithdrawl}
          </div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formatCurrency(move.toFixed(2))}</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", htmlElement);
  });
}; // i'm gonna call this when user will click 'login' button & after credentials match

// Now setting Currentbalance
let storage4LebelBal;
const settingCurrentBal = (acc) => {
  storage4LebelBal = acc.movements.reduce(
    (valsSum, currentVal) => valsSum + currentVal
  );
  labelBalance.textContent = `${formatCurrency(storage4LebelBal)}`;
};

// Now setting total IN, OUT & INTEREST i.e. total deposits, withdrawl & interest user get :)
// Displaying summary
const summary = (acc) => {
  // IN
  const totalDeposits = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, curr) => acc + curr);

  labelSumIn.textContent = `${formatCurrency(totalDeposits)}`;

  // OUT
  const totalWithdrawl = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, curr) => acc + curr);

  labelSumOut.textContent = `${formatCurrency(Math.abs(totalWithdrawl))}`;
  // here Math.abs() will remove the -ve sign from withdrawl

  // INTEREST
  const totalInterest = acc.movements
    .filter((mov) => mov > 0)
    .map((price) => (price * acc.interestRate) / 100)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = `${formatCurrency(
    parseFloat(totalInterest.toFixed(2))
  )}`;
  // here i've used parsseFloat(). toFixed() methods to display interest money upto a fixed decimal point
};

const updateEverything = () => {
  // Displaying movements
  updatingMovements(loginAcc);

  // Displaying Current balance
  settingCurrentBal(loginAcc);

  // Displaying Summary
  summary(loginAcc);
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

  // Updating date & time in front page
  // const date = new Date();
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // const hour = date.getHours();
  // const min = date.getMinutes();
  // const sec = date.getSeconds();
  // labelDate.textContent = `${day}/${month}/${year} , ${hour}:${min}:${sec}`;
  // --------OR-----------(by using Intl)
  labelDate.textContent = new Intl.DateTimeFormat("en-IN").format(new Date());

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

  // add transfer Dates
  loginAcc.movementsDates.push(new Date());
  findAccount.movementsDates.push(new Date());

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

  setTimeout(function () {
    const inputtedAmount = Number(inputLoanAmount.value);

    if (
      inputtedAmount > 0 &&
      loginAcc.movements.some((move) => move >= inputtedAmount * 0.1)
    ) {
      loginAcc.movements.push(inputtedAmount);
    }

    // add taking loan Date
    loginAcc.movementsDates.push(new Date());

    // clearing input field
    inputLoanAmount.value = "";

    //  Then again update the UI
    updateEverything();
  }, 5000);
});

// 🔵 SORT button
let isSorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(90);
  updatingMovements(loginAcc, !isSorted);
  isSorted = !isSorted;
});
