import React from 'react';
import Select from './Select';

function App() {
  const options = ['banana','apple','orange','cherry','mango','watermelon','kiwi','pear'];

  return (
    <Select options={options} label={'Choose a fruit: '} uniqueId={Math.ceil(Math.random() * 100)}></Select>
  );
}

export default App;
