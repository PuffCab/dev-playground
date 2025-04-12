"use client";
import React, { useEffect, useState } from "react";
import { Bot } from "lucide-react";

type RectangleSelection = {
  x: number;
  y: number;
  width: number;
  height: number;
};
type SelectionStates = "not-selecting" | "selecting" | "text-selected";

function SelectMenu() {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectionState, setSelectionState] =
    useState<SelectionStates>("not-selecting");
  console.log("selectionState :>> ", selectionState);
  const [selectionPosition, setSelectionPosition] =
    useState<RectangleSelection>();

  const tooltipSyle = {
    transform: `translate3d(${selectionPosition?.x}px, ${selectionPosition?.y}px, 0)`,
  };

  const handleSelectionStart = () => {
    setSelectionState("selecting");
    setSelectedText(null);
  };
  const handleSelectionStop = () => {
    //1. grab the active seletion
    const currentSelection = document.getSelection();

    if (!currentSelection) return; //to avoid optional chaining
    //2. grab the text selected
    const text = currentSelection.toString();

    if (!text) {
      setSelectionState("not-selecting");
      setSelectedText(null);
      return;
    } //to avoid grabbing those values if we dont have a text selected
    //3. Get the rectangle position
    const selectedTextRectangle = currentSelection
      .getRangeAt(0)
      .getBoundingClientRect();
    //4. setting states
    setSelectedText(text);
    const halfRectWidth = selectedTextRectangle.width / 2;
    setSelectionPosition({
      x: selectedTextRectangle.left + halfRectWidth - 40,
      y: selectedTextRectangle.top + window.scrollY - 30,
      width: selectedTextRectangle.width,
      height: selectedTextRectangle.height,
    });
    setSelectionState("text-selected");
  };

  function handleSendToChat() {
    if (!selectedText) return;

    const message = `"${encodeURIComponent(selectedText)}"`; //use of encodeURIComponent to convert to string certain characters
    const URL = `http://localhost:3000/chatbot?text=${message}`;
    window.open(URL, "chatbot action", "width=550, height=550");
  }

  useEffect(() => {
    document.addEventListener("selectstart", handleSelectionStart);
    document.addEventListener("mouseup", handleSelectionStop);

    return () => {
      document.removeEventListener("selectstart", handleSelectionStart);
      document.removeEventListener("mouseup", handleSelectionStop);
    };
  }, []);
  console.log("rectangle", selectionPosition);
  return (
    <div>
      {selectedText && selectionPosition && (
        <p
          className="absolute -top-2 left-0 w-[80px] h-[30px] bg-black text-white rounded m-0"
          style={tooltipSyle}
        >
          <button
            className="flex w-full h-full justify-between items-center px-2"
            onClick={handleSendToChat}
          >
            <span className="text-xs">ask AI</span>
            <Bot className="w-5 h-5" />
          </button>
        </p>
      )}
    </div>
  );
}

export default SelectMenu;
