import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

const Container = styled("div")`
  position: relative;
  display: inline-block;
`;

const SelectedItem = styled("button")`
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

const DownCaret = styled.span`
  height: 1em;
  position: absolute;
  right: 0.2em;
`;

const UpCaret = styled(DownCaret)``;

function CustomSelect({options, uniqueId, label}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const containerRef = useRef();
  const selectItemsRef = useRef();
  const selectedItemRef = useRef();
  const itemRefs = [];
  const activeItemRef = useCallback(() => 
    itemRefs.find(item => item.innerHTML === selectedOption), 
    [itemRefs, selectedOption]
  );
  const activeItemRefIndex = useCallback(() => 
    itemRefs.findIndex(item => item.innerHTML === selectedOption), 
    [itemRefs, selectedOption]
  );

  //set dropdown button width equal to width of listbox underneath
  useEffect(() => {
    selectItemsRef.current.style.display = '';
    selectedItemRef.current.style.width = `${selectItemsRef.current.offsetWidth}px`;
    selectItemsRef.current.style.display = 'none';
  },[selectItemsRef])

  //set aria-activedescendant of listbox to currently selected item
  useEffect(() => {
    selectItemsRef.current.setAttribute('aria-activedescendant', activeItemRef?.id);
  },[selectedOption, activeItemRef])

  //close listbox on click outside of component
  useEffect(() => {
    const handleMouseDown = e => {
      if (!(containerRef.current.contains(e.target)))
        setIsOpen(false);
    }
    if(isOpen) {
      window.addEventListener("mousedown", handleMouseDown);
    }
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  },[isOpen])

  //when listbox is open, focus on it and scroll to active item
  useEffect(() => {
    if(isOpen) {
      selectItemsRef.current.focus();
      scrollToItem(activeItemRef());
    }
  },[isOpen, activeItemRef])

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  }

  const onOptionClicked = value => e => {
    setSelectedOption(value);
    scrollToItem(e.target);
  }

  const scrollToItem = item => {
    if (selectItemsRef.current.scrollHeight <= selectItemsRef.current.clientHeight)
      return;
    let scrollBottom = selectItemsRef.current.clientHeight + selectItemsRef.current.scrollTop;
    let elementBottom = item.offsetTop + item.offsetHeight;
    if (elementBottom > scrollBottom)
      selectItemsRef.current.scrollTop = elementBottom - selectItemsRef.current.clientHeight;
    else if (item.offsetTop < selectItemsRef.current.scrollTop)
      selectItemsRef.current.scrollTop = item.offsetTop;
  }

  const handleEscape = e => {
    setIsOpen(false);
    selectedItemRef.current.focus();
  }

  const handleEnter = e => {
    e.preventDefault();
    toggleIsOpen();
    selectedItemRef.current.focus();
  }

  const handleArrowUp = e => {
    e.preventDefault();
    let prevItem = itemRefs[activeItemRefIndex() - 1];
    if(prevItem) {
      setSelectedOption(prevItem.innerHTML);
      scrollToItem(prevItem);
    }
  }

  const handleArrowDown = e => {
    e.preventDefault();
    let nextItem = itemRefs[activeItemRefIndex() + 1];
    if(nextItem) {
      setSelectedOption(nextItem.innerHTML);
      scrollToItem(nextItem);
    }
  }

  //keydown event listener for dropdown button and listbox
  const onSelectKeyDown = (() => {
    const keyListenerMap = new Map([
      ['Escape', handleEscape],
      ['Enter', handleEnter],
      ['ArrowUp', handleArrowUp],
      ['ArrowDown', handleArrowDown]
    ])
    return e => {
      let handler = keyListenerMap.get(e.key);
      return handler && handler(e);
    }
  })();

  return (
    <>
      <span id={`custom-select-label-${uniqueId}`}>{label}</span>
      <Container ref={containerRef}>
        <SelectedItem id={`selected_item_${uniqueId}`}
                      tabIndex='0'
                      onClick={toggleIsOpen}
                      onKeyDown={onSelectKeyDown}
                      aria-expanded={isOpen ? true : false}
                      aria-labelledby={`custom-select-label-${uniqueId} selected_item_${uniqueId}`}
                      aria-haspopup='listbox'
                      ref={selectedItemRef}>
          {selectedOption}
          {isOpen ? (
            <UpCaret>&#9650;</UpCaret>
          ) : (
            <DownCaret>&#9660;</DownCaret>
          )}
        </SelectedItem>
        <SelectItems role='listbox'
                    aria-labelledby={`custom-select-label-${uniqueId}`}
                    tabIndex='-1'
                    style={{display: !isOpen && 'none'}}
                    onKeyDown={onSelectKeyDown}
                    ref={selectItemsRef}>
          {options.map((option, index) => (
            <SelectItem id={`select-item-${uniqueId}${index}`}
                        role='option'
                        onClick={onOptionClicked(option)}
                        key={index}
                        aria-selected={option === selectedOption}
                        ref={ref => itemRefs[index] = ref}>
              {option}
            </SelectItem>
          ))}
        </SelectItems>
      </Container>
    </>
  )
}

export default CustomSelect;
