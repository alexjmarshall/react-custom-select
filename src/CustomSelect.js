import React, { useEffect, useState, useRef } from 'react';
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
  const findActiveItem = () => itemRefs.find(item => item.getAttribute('aria-selected') === 'true')

  useEffect(() => {
    selectItemsRef.current.style.display = '';
    selectedItemRef.current.style.width = `${selectItemsRef.current.offsetWidth}px`;
    selectItemsRef.current.style.display = 'none';
  },[])

  useEffect(() => {
    let activeItemRef = findActiveItem();
    activeItemRef && selectItemsRef.current.setAttribute('aria-activedescendant', activeItemRef.id);
  },[selectedOption])

  useEffect(() => {
    const handleMouseDown = e => {
      if (!(containerRef.current.contains(e.target)))
        setIsOpen(false);
    }
    if(isOpen) {
      selectItemsRef.current.focus();
      let activeItemRef = findActiveItem();
      scrollToItem(activeItemRef);
      window.addEventListener("mousedown", handleMouseDown);
    }
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  },[isOpen])

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  }

  const onOptionClicked = value => e => {
    setSelectedOption(value);
    scrollToItem(e.target);
  }

  const onSelectedKeyDown = e => {
    const selectedIndex = options.indexOf(selectedOption);
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
        if(!isOpen && selectedIndex > 0)
          setSelectedOption(options[selectedIndex - 1]);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if(selectedIndex < options.length - 1)
          setSelectedOption(options[selectedIndex + 1]);
        break;
      default:
    }
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

  const onSelectItemsKeyDown = e => {
    const activeItemRefIndex = itemRefs.findIndex(item => item.innerHTML === selectedOption);
    const activeItemRef = itemRefs[activeItemRefIndex];
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
        let prevItem = itemRefs[activeItemRefIndex - 1];
        if(prevItem) {
          setSelectedOption(prevItem.innerHTML);
          scrollToItem(prevItem);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        let nextItem = itemRefs[activeItemRefIndex + 1];
        if(nextItem) {
          setSelectedOption(nextItem.innerHTML);
          scrollToItem(nextItem);
        }
        break;
      default:
    }
  }

  return (
    <>
    <span id={`custom-select-label-${uniqueId}`}>{label}</span>
    <Container ref={containerRef}>
      <SelectedItem id={`selected_item_${uniqueId}`}
                    tabIndex='0'
                    onClick={toggleIsOpen}
                    onKeyDown={onSelectedKeyDown}
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
                    onKeyDown={onSelectItemsKeyDown}
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
