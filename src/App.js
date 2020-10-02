import React from 'react';
import CustomSelect from './CustomSelect';

function App() {
  const options = ["banana","apple","orange","cherry","mango","watermelon","kiwi","pear"];

  return (
    <CustomSelect options={options} label={'Choose a fruit: '} uniqueId={Math.ceil(Math.random() * 100)}></CustomSelect>
  );
}

export default App;
