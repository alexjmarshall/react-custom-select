import React, { useState } from 'react';
import styled from 'styled-components';

const CustomSelectContainer = styled("div")`
  position: relative;
  display: inline-block;
  width: 8rem;
  border: 1px solid black;
`;

const SelectSelected = styled("div")`
  padding: 0 0.2rem 0.2rem 0.2rem;
`;

const SelectItems = styled("div")`
  position: absolute;
  width: 8rem;
  background: #ffffff;
  border: 1px solid black;
  margin-left: -1px;
  background-color: white;
`;

const SelectItem = styled("div")`
  padding: 0 0.2rem;
`;

const DownCaret = styled.img`
  height: 1rem;
  position: absolute;
  right: 0.2rem;
`;

const UpCaret = styled(DownCaret)``;

function CustomSelect({options}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

//   const options = ["banana", "apple", "orange", "cherry"];
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const onOptionClicked = value => () => {
    setSelectedOption(value);
    setIsOpen(false);
    console.log(selectedOption);
  };

  return (
    <CustomSelectContainer>
      <SelectSelected onClick={toggleIsOpen}>
        {selectedOption || "Choose a fruit"}
        {isOpen ? (
          <UpCaret src="https://icongr.am/fontawesome/caret-up.svg?size=128&color=currentColor" alt="up-caret"></UpCaret>
        ) : (
          <DownCaret src="https://icongr.am/fontawesome/caret-down.svg?size=128&color=currentColor" alt="down-caret"></DownCaret>
        )}
      </SelectSelected>
      {isOpen && (
        <SelectItems>
          {options.map(option => (
            <SelectItem onClick={onOptionClicked(option)} key={Math.random()}>
              {option}
            </SelectItem>
          ))}
        </SelectItems>
      )}
    </CustomSelectContainer>
  );
}

export default CustomSelect;
