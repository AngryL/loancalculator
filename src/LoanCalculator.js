import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

function CalculatorInputs(props) {
  let inputs = props.inputs;

  function makeInput(key) {
    console.log("MakeInput +" + key + ":" + inputs.key);
    return (
      <input
        type="number"
        value={precisionRound(inputs[key], 2)}
        onChange={e => props.onUpdateInput(e, key)}
      />
    );
  }

  return (
    <div className="CalculatorInputs">
      <form>
        <label>სესხის ოდენობა: {makeInput("loanAmount")}</label>
        <label>ყოველთვიური გადასახადი: {makeInput("monthlyPayment")}</label>
        <label>პროცენტი: {makeInput("interestRate")}</label>
        <label>თვეების რაოდენობა: {makeInput("numberOfMonths")}</label>
      </form>
      <button onClick={props.calculateOutput}>გამოთვლა</button>
    </div>
  );
}

function CalculatorOutput(props) {
  let output = props.calculatorOutput;
  let newOutput = output.map(x => {
    return (
      <tr>
        <td>{round(x.month)}</td>
        <td>{round(x.startingBalance)}</td>
        <td>{round(x.interest)}</td>
        <td>{round(x.principal)}</td>
        <td>{round(x.endingBalance)}</td>
        <td>{round(x.totalInterest)}</td>
      </tr>
    );
  });

  return (
    <div className="CalculatorOutput">
      <table id="CalculatorOutputTable">
        <tr>
          <th>თვე</th>
          <th>საწყისი ბალანსი</th>
          <th>პროცენტი</th>
          <th>ძირი</th>
          <th>საბოლოო ბალანსი</th>
          <th>სულ გადახდილი პროცენტი</th>
        </tr>
        {newOutput}
      </table>
    </div>
  );
  function round(x) {
    return precisionRound(x, 2);
  }
}

class LoanCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calculatorInputs: {
        loanAmount: 0,
        monthlyPayment: 0,
        interestRate: 0,
        numberOfMonths: 0
      },
      calculatorOutput: [{}]
    };
  }

  
  updateInputs = (input, key) => {
    let amount = Number(input.target.value);
    let currentCalculatorInputs = this.state.calculatorInputs;
    console.log("Updating input with amount: " + amount + "Key:" + key);
    switch (key) {
      case "loanAmount":
        currentCalculatorInputs.loanAmount = amount;
        break;
      case "monthlyPayment":
        currentCalculatorInputs.monthlyPayment = amount;
        break;
      case "interestRate":
        currentCalculatorInputs.interestRate = amount;
        break;
      case "numberOfMonths":
        currentCalculatorInputs.numberOfMonths = amount;
        break;
      default:
        console.log("Some error was thrown in the inputs");
    }
    this.setState({
      calculatorInputs: currentCalculatorInputs
    });
  };

  calculateOutput = () => {
    let currentInputs = this.state.calculatorInputs;
    let monthlyPayment = this.getMonthlyPaymentAverage();
    let items = createTableItems(currentInputs.numberOfMonths);

    function createTableItems(number) {
      let array = [];
      for (let i = 0; i < number; i++) {
        array.push(9);
      }
      return array;
    }

    for (let i = 0; i < currentInputs.numberOfMonths; i++) {
      items[i] = getNextItem(i, items[i - 1]);
    }

    function getNextItem(currentMonthNumber, previousMonth) {
      console.log("Calculating next item for month: " + currentMonthNumber);
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
      return {
        month: month,
        startingBalance: startingBalance,
        interest: interest,
        principal: principal,
        endingBalance: endingBalance,
        totalInterest: totalInterest
      };
    }

    console.log(items);

    this.setState({ calculatorOutput: items });

    return items;
  };

  getMonthlyPaymentAverage = () => {
    let monthlyPayment;
    let currentInputs = this.state.calculatorInputs;
    if (!currentInputs.interestRate) {
      return currentInputs.loanAmount / currentInputs.numberOfMonths
    }
    let loanAmount = currentInputs.loanAmount;
    let interestRate = currentInputs.interestRate / 12 / 100;
    let numberOfMonths = currentInputs.numberOfMonths;
    let dividend = interestRate * Math.pow(1 + interestRate, numberOfMonths);
    let divisor = Math.pow(1 + interestRate, numberOfMonths) - 1;
    monthlyPayment = loanAmount * dividend / divisor;
    currentInputs.monthlyPayment = monthlyPayment;
    this.setState({ calculatorInputs: currentInputs });
    return monthlyPayment;
  };

  render() {
    return (
      <div className="Calculator">
        <header className="Calculator-header">
          <h1 className="App-title">სესხის კალკულატორი</h1>
        </header>
        <CalculatorInputs
          inputs={this.state.calculatorInputs}
          onUpdateInput={this.updateInputs}
          calculateOutput={this.calculateOutput}
        />
        <CalculatorOutput
          calculatorOutput={this.state.calculatorOutput}
        />
      </div>
    );
  }
}

export default LoanCalculator;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}