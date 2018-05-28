import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import LoanScheduleCalculator from "./LoanScheduleCalculator";

class Application extends React.Component {
  render() {
    return (
      <div className="Calculators">
        <LoanScheduleCalculator />
      </div>
    );
  }
}

ReactDOM.render(<Application />, document.getElementById("root"));
registerServiceWorker();
