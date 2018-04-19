// import React from "react";
// import ReactDOM from "react-dom";
//
// import styles from './index.css';
//
// const App = () => {
//   return (
//     <div className={styles.test}>
//       <p>Settings window</p>
//     </div>
//   );
// };

const newDiv = document.createElement('div');
newDiv.innerHTML = 'Hello settings';

document.getElementById('app').appendChild(newDiv);

// export default App;
//
// ReactDOM.render(<App />, document.getElementById("app"));
