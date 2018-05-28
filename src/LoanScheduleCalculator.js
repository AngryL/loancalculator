import React, { Component } from "react";
import "./App.css";
import { Finance } from "financejs";
import CalculatorInputs from "./CalculatorInputs";
import CalculatorOutput from "./CalculatorOutput";

let finance = new Finance();

const inputKeys = [
  "loanAmount",
  "monthlyPayment",
  "interestRate",
  "numberOfMonths",
  "loanPayDay"
];

const initialState = {
  isSimple: false,
  calculatorInputs: {
    loanAmount: 9500,
    monthlyPayment: 0,
    interestRate: 15,
    numberOfMonths: 15,
    // Date the loan was issued
    loanDate: formatDate(new Date()),
    // Day of the month loan must be paid
    loanPayDay: 15
  },
  calculatorOutput: [
    {
      month: 0,
      payDay: 0,
      startingBalance: 0,
      interest: 0,
      principal: 0,
      endingBalance: 0,
      totalInterest: 0
    }
  ],
  isCalculatedFirst: false,
  isValid: true,
  errorMessage: "აღნიშნული მონაცემებით სესხის დათვლა შეუძლებელია."
};

class LoanScheduleCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }


  reverseIsSimple = () => {
    this.setState({ isSimple: !this.state.isSimple });
    console.log("მარტივი");
  };

  // Updates state when the date input is filled. 
  updateDate = e => {
    let value = e.target.value;
    let calculatorInputs = this.state.calculatorInputs;
    calculatorInputs.loanDate = value;
    this.setState({
      calculatorInputs: calculatorInputs,
      isCalculatedFirst: false
    });
  };

  // Key - corresponding element into the current state for the given input
  // MODIFIES: updates the state according to the given input
  updateInputs = (input, key) => {
    let amount = Number(input.target.value);
    let currentCalculatorInputs = this.state.calculatorInputs;
    inputKeys.forEach(inputKey => {
      if (key === inputKey) {
        currentCalculatorInputs[key] = amount;
      }
    });
    this.setState({
      calculatorInputs: currentCalculatorInputs,
      isCalculatedFirst: false
    });
  };

  // Creates table for the loan calculator
  calculateOutput = () => {
    let that = this;
    let currentInputs = this.state.calculatorInputs;
    if (!this.checkCurrentInputs(currentInputs, this.state.isSimple)) {
      this.setState({ calculatorOutput: initialState.calculatorOutput });
      return {};
    }
    let monthlyPayment = this.getPMT();
    let items = createTableItems(currentInputs.numberOfMonths);

    function createTableItems(number) {
      let array = [];
      for (let i = 0; i < number; i++) {
        array.push(9);
      }
      return array;
    }

    for (let i = 0; i < currentInputs.numberOfMonths; i++) {
      items[i] = this.getNextItem(i, items[i - 1]);
    }

    console.log(items);

    this.setState({ calculatorOutput: items });

    return items;
  };

  // Checks if inputs are valid, returns boolean
  checkCurrentInputs = (currentInputs, simple) => {
    let isValid = true;
    if (!checkSimpleAndDate()) {
      isValid = false;
    }

    this.setState({ isValid: isValid });

    return isValid;

    function checkSimpleAndDate() {
      let checkSimple =
        currentInputs.loanAmount > 0 &&
        currentInputs.interestRate > 0 &&
        currentInputs.numberOfMonths > 0 &&
        currentInputs.numberOfMonths % 1 === 0;
      let checkDate =
        currentInputs.loanPayDay > 0 && currentInputs.loanPayDay < 31 && currentInputs.loanPayDay % 1 === 0;

      console.log(checkSimple, checkDate);

      return simple ? checkSimple : checkSimple && checkDate;
    }
  };

  // Takes Current month number and the object generated previously with this function.
  // Getnerates the next item for the calculator output.
  getNextItem = (currentMonthNumber, previousMonth) => {
    let currentInputs = this.state.calculatorInputs;
    let monthlyPayment = this.getPMT();
    let month = currentMonthNumber + 1;
    let startingBalance = previousMonth
      ? previousMonth.endingBalance
      : currentInputs.loanAmount;
    let interest = startingBalance * currentInputs.interestRate / 12 / 100;
    let principal = monthlyPayment - interest;
    let endingBalance = startingBalance - principal;
    let totalInterest = previousMonth
      ? previousMonth.totalInterest + interest
      : interest;
    let payDay = formatDate(getNextPayDay(this.state.isCalculatedFirst));
    this.setState({ isCalculatedFirst: true });
    return {
      month: month,
      payDay: payDay,
      startingBalance: startingBalance,
      interest: interest,
      principal: principal,
      endingBalance: endingBalance,
      totalInterest: totalInterest
    };

    function getNextPayDay(isCalculatedFirst) {
      let loanDate = new Date(Date.parse(currentInputs.loanDate));
      // Day of month loan is going to be paid
      let loanPayDay = currentInputs.loanPayDay;
      checkIfCalculatedFirst();
      loanDate.setDate(loanPayDay);
      console.log(loanDate);
      checkHolidays();
      return loanDate;

      function checkIfCalculatedFirst() {
        if (!isCalculatedFirst && loanPayDay < loanDate.getDate()) {
          loanDate.setMonth(loanDate.getMonth() + currentMonthNumber + 1);
        } else {
          loanDate.setMonth(loanDate.getMonth() + currentMonthNumber);
        }
      }

      function checkHolidays() {
        let day = loanDate.getDay();
        switch (day) {
          case 0:
            loanDate.setDate(loanPayDay + 1);
            break;
          case 6:
            loanDate.setDate(loanPayDay + 2);
        }
      }
    }
  };

  getPMT = () => {
    let currentInputs = this.state.calculatorInputs;
    let monthlyPayment = -finance.PMT(
      currentInputs.interestRate / 12 / 100,
      currentInputs.numberOfMonths,
      currentInputs.loanAmount
    );
    if (!currentInputs.interestRate) {
      return currentInputs.loanAmount / currentInputs.numberOfMonths;
    }
    currentInputs.monthlyPayment = monthlyPayment;
    this.setState({ calculatorInputs: currentInputs });
    return monthlyPayment;
  };

  render() {
    return (
      <div className="Calculator">
        <header className="Calculator-header">
          <h1 className="App-title">სესხის გრაფიკის კალკულატორი</h1>
        </header>

        <CalculatorInputs
          inputs={this.state.calculatorInputs}
          onUpdateInput={this.updateInputs}
          onUpdateDate={this.updateDate}
          calculateOutput={this.calculateOutput}
          isSimple={this.state.isSimple}
          isValid={this.state.isValid}
          errorMessage={this.state.errorMessage}
        />
        <CalculatorOutput
          calculatorOutput={this.state.calculatorOutput}
          isSimple={this.state.isSimple}
        />
        <button onClick={this.reverseIsSimple}> მარტივი </button>
      </div>
    );
  }
}

function formatDate(date) {
  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  let year = date.getFullYear();
  let dateString = `${year}-${month}-${day}`;
  return dateString;
}

export default LoanScheduleCalculator;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
export function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}
