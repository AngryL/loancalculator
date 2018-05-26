import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LoanCalculator from './LoanCalculator';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<LoanCalculator />, document.getElementById('root'));
registerServiceWorker();
