import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

//TODO em vs. rem

const CustomSelectContainer = styled("div")`
  position: relative;
  display: inline-block;
  width: 8em;
`;

const SelectedItem = styled("button")`
  width: inherit;
  height: inherit;
  padding: 0.2em;
  display: inline-block;
  border: 1px solid black;
  margin: 0;
  text-decoration: none;
  background: #ffffff;
  font-family: sans-serif;
  font-size: 1em;
  cursor: pointer;
  border-radius: 0;
  text-align: left;
`;

const SelectItems = styled("ul")`
  margin: 0;
  padding 0;
  list-style: none;
  position: absolute;
  width: 8em;
  background: #ffffff;
  border: 1px solid black;
  border-top-width: 0;
  box-sizing: border-box;
`;

const SelectItem = styled("li")`
  padding: 0.2em;
  cursor: pointer;
`;

const DownCaret = styled.img`
  height: 1em;
  position: absolute;
  right: 0.2em;
`;

const UpCaret = styled(DownCaret)``;

function CustomSelect({options, uniqueId}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const selectItemsRef = useRef(null);

  useEffect(() => console.log(selectedOption),[selectedOption]);

  const toggleIsOpen = () => setIsOpen(!isOpen);

  const onOptionClicked = value => e => {
    setSelectedOption(value);
    setIsOpen(false);
    console.log(selectItemsRef.current);
    let clickedItem = e.target;
    // clickedItem.setAttribute('aria-selected', true); // TODO this is not persistent
    // let otherItems = getElementSiblings(e.target);
    // otherItems.forEach(item => item.setAttribute('aria-selected', false));
    // let selectedElm = e.target.parentElement.previousElementSibling;
    selectItemsRef.current.setAttribute('aria-activedescendant', clickedItem.id);
    // selectItemsRef.current.focus(); // TODO use refs to programmatically manage focus
  };

  const getElementSiblings = (elm) => {
    let sibs = [];
    let sib = elm.parentElement.firstChild;
    while(sib) {
      sib !== elm && sibs.push(sib);
      sib = sib.nextElementSibling;
    }
    return sibs;
  }

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
          const firstItemElm = e.target.nextElementSibling.children[0]; // todo put this logic in JSX?
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
        let selectedElm = e.target.parentElement.previousElementSibling; // TODO use Refs instead
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
    <>
    <span id={`custom-select-label-${uniqueId}`}>Choose a fruit: </span> {/* TODO style component? */}
    <CustomSelectContainer>
      <SelectedItem id={`selected_item_${uniqueId}`} tabIndex='0' aria-expanded={isOpen ? true : false} onClick={toggleIsOpen} onKeyDown={onSelectedKeyDown}
                    aria-labelledby={`custom-select-label-${uniqueId} selected_item_${uniqueId}`} aria-haspopup='listbox'>
        {selectedOption}
        {isOpen ? (
          <UpCaret src='https://icongr.am/fontawesome/caret-up.svg?size=128&color=currentColor' alt='up-caret'></UpCaret>
        ) : (
          <DownCaret src='https://icongr.am/fontawesome/caret-down.svg?size=128&color=currentColor' alt='down-caret'></DownCaret>
        )}
      </SelectedItem>
        <SelectItems role='listbox' aria-labelledby={`custom-select-label-${uniqueId}`} tabIndex='-1' style={{display: !isOpen && 'none'}} ref={selectItemsRef}>
          {options.map((option, index) => (
            <SelectItem id={`select-item-${uniqueId * (index + 1)}`} rol='option' tabIndex='0' aria-selected={option === selectedOption} onClick={onOptionClicked(option)} key={index} onKeyDown={onItemKeyDown}>
              {option}
            </SelectItem>
          ))}
        </SelectItems>
    </CustomSelectContainer>
    </>
  );
}

export default CustomSelect;
