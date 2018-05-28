import React, { Component } from "react";
import { precisionRound } from "./LoanScheduleCalculator";

function CalculatorOutput(props) {
  let output = props.calculatorOutput;
  let newOutput = output.map(x => {
    return (
      <tr>
        <td>{round(x.month)}</td>
        <td>{x.payDay}</td>
        <td>{round(x.startingBalance)}</td>
        <td>{round(x.interest)}</td>
        <td>{round(x.principal)}</td>
        <td>{round(x.endingBalance)}</td>
        <td>{round(x.totalInterest)}</td>
      </tr>
    );
  });

  let newOutputSimple = output.map(x => {
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

  function checkIfisSimple() {
    if (props.isSimple) {
      return newOutputSimple;
    } else {
      return newOutput;
    }
  }

  function showPayDay() {
    if (!props.isSimple) {
      return <th>გადახდის თარიღი</th>;
    }
  }
  return (
    <div className="CalculatorOutput">
      <table id="CalculatorOutputTable">
        <tr>
          <th>თვე</th>
          {showPayDay()}
          <th>საწყისი ბალანსი</th>
          <th>პროცენტი</th>
          <th>ძირი</th>
          <th>საბოლოო ბალანსი</th>
          <th>სულ გადახდილი პროცენტი</th>
        </tr>
        {checkIfisSimple()}
      </table>
    </div>
  );
  function round(x) {
    return precisionRound(x, 2);
  }
}
export default CalculatorOutput;
