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
  const onOptionClicked = value => () => {
    setSelectedOption(value);
    setIsOpen(false);
  };
  const selectedItemIndex = options.indexOf(selectedOption);
  const onSelectKeyDown = e => {
    const firstItemElm = e.target.nextElementSibling.children[0];
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
        if(!isOpen && selectedItemIndex > 0) {
          let prevItemIndex = selectedItemIndex - 1;
          items[prevItemIndex].click(options[prevItemIndex]);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if(isOpen)
          firstItemElm.focus();
        else if(selectedItemIndex < options.length - 1) {
            let nextItemIndex = selectedItemIndex + 1;
            items[nextItemIndex].click(options[nextItemIndex]);
        }
        break;
      default:
    }
  }

  return (
    <CustomSelectContainer>
      <SelectedItem tabIndex='0' onClick={toggleIsOpen} onKeyDown={onSelectKeyDown}>
        {selectedOption || 'Choose a fruit'}
        {isOpen ? (
          <UpCaret src='https://icongr.am/fontawesome/caret-up.svg?size=128&color=currentColor' alt='up-caret'></UpCaret>
        ) : (
          <DownCaret src='https://icongr.am/fontawesome/caret-down.svg?size=128&color=currentColor' alt='down-caret'></DownCaret>
        )}
      </SelectedItem>
        <SelectItems style={{display: !isOpen && 'none'}}>
          {options.map(option => (
            <SelectItem tabIndex='0' onClick={onOptionClicked(option)} key={Math.random()}>
              {option}
            </SelectItem>
          ))}
        </SelectItems>
    </CustomSelectContainer>
  );
}

export default CustomSelect;
