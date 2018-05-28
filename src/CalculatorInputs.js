import React, { Component } from "react";
import {precisionRound} from "./LoanScheduleCalculator"

function CalculatorInputs(props) {
    let inputs = props.inputs;
  
    function makeInput(key) {
      let type = key
      return (
        <input
          type={type}
          value={precisionRound(inputs[key], 2)}
          onChange={e => props.onUpdateInput(e, key)}
          min = "0.1"
        />
      );
    }

    function checkIsSimple() {
      if (!props.isSimple) {
        return ( <form>
          <label>
          სესხის აღების თარიღი:
          <input
            type="date"
            value={inputs.loanDate}
            onChange={e => props.onUpdateDate(e)}
          />
        </label>
        <label>გადახდის დღე: {makeInput("loanPayDay")}</label></form>)
      }
    }

    function checkIfValid() {
      if (!props.isValid) {
        console.log("არასწორია")
        return (props.errorMessage)
      } else {
      }
    }
  
    return (
      <div className="CalculatorInputs">
        <form>
          <label>სესხის ოდენობა: {makeInput("loanAmount")}</label>
          <label>ყოველთვიური გადასახადი: {makeInput("monthlyPayment")}</label>
          <label>პროცენტი: {makeInput("interestRate")}</label>
          <label>თვეების რაოდენობა: {makeInput("numberOfMonths")}</label>
        </form>
        {checkIsSimple()}
        <button onClick={props.calculateOutput}>გამოთვლა</button>
        {checkIfValid()}
      </div>
    );
  }
export default CalculatorInputs;