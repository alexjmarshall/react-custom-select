import React, { useEffect, useState, useRef, createRef } from 'react';
import styled from 'styled-components';

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
  height: 7em;
  overflow: auto;
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
  &[aria-selected="true"] {
    background-color: #b0f2ff;
  }
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
  const selectItemsRef = useRef();
  const selectedItemRef = useRef();
  // let activeItemRef = useRef();
  const itemRefs = useRef([]);
  if (itemRefs.current.length !== options.length) {
    itemRefs.current = Array(options.length).fill().map((_, i) => itemRefs.current[i] || createRef());
  }
  // useEffect(() => {
  //   console.log(selectedOption)
  //   const activeItemRef = itemRefs.current.find(item => item.current.getAttribute('aria-selected') === 'true');
    
  // },[selectedOption]);
  useEffect(() => {
    if(isOpen) {
      //focus on selectItems, set aria-selected and activedescendant to selectedOption
      const activeItemRef = itemRefs.current.find(item => item.current.getAttribute('aria-selected') === 'true');
      console.log(activeItemRef);
      // activeItemRef.current.setAttribute('aria-active', true);
      selectItemsRef.current.setAttribute('aria-activedescendant', activeItemRef.current.id);
      selectItemsRef.current.focus();
    }
  },[isOpen])

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  }

  const onOptionClicked = value => e => {
    setSelectedOption(value);
    // let clickedItem = e.target;
    // selectItemsRef.current.setAttribute('aria-activedescendant', clickedItem.id);
    // selectedItemRef.current.focus();
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
          const firstItemElm = e.target.nextElementSibling.children[0]; // todo put this logic in JSX?
          firstItemElm.focus();
        }
        else if(selectedItemIndex < options.length - 1)
            items[selectedItemIndex + 1].click();
        break;
      default:
    }
  }

  const onSelectItemsKeyDown = (e) => { //TODO scroll if active option not visible
    const activeItemRef = itemRefs.current.find(item => item.current.innerHTML === selectedOption);
    const activeItemRefIndex = itemRefs.current.indexOf(activeItemRef);
    switch(e.key) {
      case 'Enter':
        e.preventDefault();
        activeItemRef.current.click();
        toggleIsOpen();
        break;
      case 'Escape':
        setIsOpen(false);
        selectedItemRef.current.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        let prevItem = itemRefs.current[activeItemRefIndex - 1];
        if(prevItem) {
          activeItemRef.current.setAttribute('aria-selected', false);
          prevItem.current.setAttribute('aria-selected', true);
          setSelectedOption(prevItem.current.innerHTML);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        let nextItem = itemRefs.current[activeItemRefIndex + 1];
        if(nextItem) {
          activeItemRef.current.setAttribute('aria-selected', false);
          nextItem.current.setAttribute('aria-selected', true);
          setSelectedOption(nextItem.current.innerHTML);
        }
        break;
      default:
    }
  }

  return (
    <>
    <span id={`custom-select-label-${uniqueId}`}>Choose a fruit: </span> {/* TODO style component? */}
    <CustomSelectContainer>
      <SelectedItem id={`selected_item_${uniqueId}`} tabIndex='0' aria-expanded={isOpen ? true : false} onClick={toggleIsOpen} onKeyDown={onSelectedKeyDown}
                    aria-labelledby={`custom-select-label-${uniqueId} selected_item_${uniqueId}`} aria-haspopup='listbox' ref={selectedItemRef}>
        {selectedOption}
        {isOpen ? (
          <UpCaret src='https://icongr.am/fontawesome/caret-up.svg?size=128&color=currentColor' alt='up-caret'></UpCaret>
        ) : (
          <DownCaret src='https://icongr.am/fontawesome/caret-down.svg?size=128&color=currentColor' alt='down-caret'></DownCaret>
        )}
      </SelectedItem>
        <SelectItems role='listbox' aria-labelledby={`custom-select-label-${uniqueId}`} tabIndex='-1' style={{display: !isOpen && 'none'}} ref={selectItemsRef} onKeyDown={onSelectItemsKeyDown}>
          {options.map((option, index) => (
            <SelectItem id={`select-item-${uniqueId * (index + 1)}`} ref={itemRefs.current[index]} aria-selected={option === selectedOption} role='option' tabIndex='0' onClick={onOptionClicked(option)} key={index}>
              {option}
            </SelectItem>
          ))}
        </SelectItems>
    </CustomSelectContainer>
    </>
  );
}

export default CustomSelect;
