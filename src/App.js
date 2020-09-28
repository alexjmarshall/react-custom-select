import React, {Fragment} from 'react';
import CustomSelect from './CustomSelect';

function App() {
  const options1 = ["banana", "apple", "orange", "cherry"]
  const options2 = ["mango", "watermelon", "kiwi", "pear"]

  return (
    <Fragment>
      <CustomSelect options={options1}></CustomSelect>
      <CustomSelect options={options2}></CustomSelect>
    </Fragment>
  );
}

export default App;
