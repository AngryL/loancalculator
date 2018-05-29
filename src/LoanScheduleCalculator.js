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
  calculatedCount: 0,
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
      calculatorInputs: calculatorInputs
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
      calculatorInputs: currentCalculatorInputs
    });
  };

  // Creates table for the loan calculator
  calculateOutput = () => {
    let currentInputs = this.state.calculatorInputs;

    // If the inputs are invalid, stop the execution
    if (!this.checkCurrentInputs(currentInputs, this.state.isSimple)) {
      this.setState({ calculatorOutput: initialState.calculatorOutput });
      return {};
    }

    let firstOutput = this.calculateTheFirst();
    let restOutput = this.calculateTheRest(
      firstOutput,
      this.state.calculatorInputs.numberOfMonths
    );

    console.log("The Rest Output is: ");
    console.log(restOutput);

    this.setState({
      calculatorOutput: restOutput
    });
  };

  // Calculates the first output for the array
  calculateTheFirst = () => {
    let firstOutput = this.getNextItem(0, undefined, false);
    return firstOutput;
  };

  // Returns the complete array of items for the calculator output.
  calculateTheRest = (firstOutput, numberOfMonths) => {
    let restOutput = [firstOutput];

    // Add Items to the restOutput array
    for (let i = 1; i < numberOfMonths; i++) {
      let nextItem = this.getNextItem(i, restOutput[i - 1], true);
      restOutput.push(nextItem);
    }

    return restOutput;
  };

  // Takes Current month number and the object generated previously with this function.
  // Getnerates the next item for the calculator output.
  getNextItem = (currentMonthNumber, previousMonth, isCalculatedFirst) => {
    let currentInputs = this.state.calculatorInputs;

    let nextPayDate = formatDate(
      getNextPayDate(isCalculatedFirst, currentInputs)
    );
    let monthlyPayment = this.getPMT(currentInputs);
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

    if (!isCalculatedFirst) {
      let daysDifference = PayDateLoanDate();
      // Total interest for days elapsed from the loan date.
      let interestFromLoanDateToPayDay = interest * 12 / 365 * daysDifference;

      interest += interestFromLoanDateToPayDay;
      totalInterest += interestFromLoanDateToPayDay;
      console.log(interestFromLoanDateToPayDay);
    } else {
    }

    return {
      month: month,
      payDay: nextPayDate,
      startingBalance: startingBalance,
      interest: interest,
      principal: principal,
      endingBalance: endingBalance,
      totalInterest: totalInterest
    };

    function PayDateLoanDate() {
      let loanDate = new Date(Date.parse(currentInputs.loanDate));
      let payDayx = new Date(Date.parse(nextPayDate));
      let differenceInDays = (payDayx - loanDate) / (60 * 60 * 24 * 1000);
      console.log(`PayDay - Loan Date: " + ${payDayx}
      Current Loan Date: ${currentInputs.loanDate}, Date Object: ${loanDate}

      Next Loan Date: ${nextPayDate}, Date Object: ${payDayx}

      Difference between them: ${(payDayx - loanDate) / (60 * 60 * 24 * 1000)}

      isCalculatedFirst:

      `);

      return differenceInDays;
    }

    function getNextPayDate(isCalculatedFirst, currentInputs) {
      let loanDate = new Date(Date.parse(currentInputs.loanDate));
      // Day of month loan is going to be paid
      let loanPayDay = currentInputs.loanPayDay;
      comparePayDateLoanDates();
      loanDate.setDate(loanPayDay);
      checkHolidays();
      return loanDate;

      // If pay day is less, than day of month the loan is given, increment month by 1
      function comparePayDateLoanDates() {
        if (!isCalculatedFirst && loanPayDay < loanDate.getDate()) {
          loanDate.setMonth(loanDate.getMonth() + currentMonthNumber);
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
        currentInputs.loanPayDay > 0 &&
        currentInputs.loanPayDay < 31 &&
        currentInputs.loanPayDay % 1 === 0;

      console.log(checkSimple, checkDate);

      return simple ? checkSimple : checkSimple && checkDate;
    }
  };

  getPMT = (currentInputs) => {
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
