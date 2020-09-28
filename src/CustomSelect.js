import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const CustomSelectContainer = styled("div")`
  position: relative;
  display: inline-block;
  width: 8em;
  border: 1px solid black;
`;

const SelectedItem = styled("div")`
  padding: 0 0.2em 0.2em 0.2em;
`;

const SelectItems = styled("div")`
  position: absolute;
  width: 8em;
  background: #ffffff;
  border: 1px solid black;
  margin-left: -1px;
  background-color: white;
`;

const SelectItem = styled(SelectedItem)``;

const DownCaret = styled.img`
  height: 1em;
  position: absolute;
  right: 0.2rem;
  margin-top: 0.2em;
`;

const UpCaret = styled(DownCaret)``;

function CustomSelect({options}) {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => console.log(selectedOption,[selectedOption]));

  const toggleIsOpen = () => setIsOpen(!isOpen);

  const onOptionClicked = value => e => {
    setSelectedOption(value);
    setIsOpen(false);
    let selectedElm = e.target.parentElement.previousElementSibling;
    selectedElm.focus();
  };

  const selectedItemIndex = options.indexOf(selectedOption);

  const onSelectedKeyDown = e => {
    const items = e.target.nextElementSibling.children;

    switch(e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        toggleIsOpen();
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if(!isOpen && selectedItemIndex > 0)
          items[selectedItemIndex - 1].click();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if(isOpen) {
          const firstItemElm = e.target.nextElementSibling.children[0];
          firstItemElm.focus();
        }
        else if(selectedItemIndex < options.length - 1)
            items[selectedItemIndex + 1].click();
        break;
      default:
    }
  }

  const onItemKeyDown = (e) => {
    switch(e.key) {
      case 'Enter':
        e.preventDefault();
        e.target.click();
        break;
      case 'Escape':
        setIsOpen(false);
        let selectedElm = e.target.parentElement.previousElementSibling;
        selectedElm.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        let prevItem = e.target.previousElementSibling;
        prevItem && prevItem.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        let nextItem = e.target.nextElementSibling;
        nextItem && nextItem.focus();
        break;
      default:
    }
  }

  return (
    <CustomSelectContainer>
      <SelectedItem tabIndex='0' onClick={toggleIsOpen} onKeyDown={onSelectedKeyDown}>
        {selectedOption || 'Choose a fruit'}
        {isOpen ? (
          <UpCaret src='https://icongr.am/fontawesome/caret-up.svg?size=128&color=currentColor' alt='up-caret'></UpCaret>
        ) : (
          <DownCaret src='https://icongr.am/fontawesome/caret-down.svg?size=128&color=currentColor' alt='down-caret'></DownCaret>
        )}
      </SelectedItem>
        <SelectItems style={{display: !isOpen && 'none'}}>
          {options.map(option => (
            <SelectItem tabIndex='0' onClick={onOptionClicked(option)} onKeyDown={onItemKeyDown} key={Math.random()}>
              {option}
            </SelectItem>
          ))}
        </SelectItems>
    </CustomSelectContainer>
  );
}

export default CustomSelect;
