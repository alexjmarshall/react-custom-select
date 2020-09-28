import React from 'react';
import CustomSelect from './CustomSelect';

function App() {
  const options1 = ["banana", "apple", "orange", "cherry"]
  const options2 = ["mango", "watermelon", "kiwi", "pear"]

  return (
      <CustomSelect options={options1} uniqueId={Math.floor(Math.random() * 100) + 1}></CustomSelect>
  );
}

export default App;
