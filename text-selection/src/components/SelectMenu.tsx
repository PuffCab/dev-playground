"use client";
import React, { useEffect, useState } from "react";
import { Bot, BotMessageSquare, Twitter } from "lucide-react";
import { transform } from "next/dist/build/swc/generated-native";

type RectangleSelection = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function SelectMenu() {
  const [selectedText, setSelectedText] = useState("");
  const [selectionPosition, setSelectionPosition] =
    useState<RectangleSelection>();

  const tooltipSyle = {
    transform: `translate3d(${selectionPosition?.x}px, ${selectionPosition?.y}px, 0)`,
  };
  useEffect(() => {
    document.addEventListener("selectionchange", () => {
      //1. grab the active seletion
      const currentSelection = document.getSelection();

      if (!currentSelection) return; //to avoid optional chaining
      //2. grab the text selected
      const text = currentSelection.toString();

      if (!text) return; //to avoid grabbing those values if we dont have a text selected
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
    });

    return () => {};
  }, []);
  console.log("rectangle", selectionPosition);
  return (
    <div>
      {selectedText && selectionPosition && (
        <p
          className="absolute -top-2 left-0 w-[80px] h-[30px] bg-black text-white rounded m-0 after:absolute after:top-full after:left-1/2 after:-translate-x-2 after:h-0 after:w-0 after:border-x-[6px] after:border-x-transparent after:border-b-[8px] after:border-b-black after:rotate-180"
          style={tooltipSyle}
        >
          <button className="flex w-full h-full justify-between items-center px-2">
            <span className="text-xs">ask AI</span>
            <Bot className="w-5 h-5" />
          </button>
        </p>
      )}
    </div>
  );
}

export default SelectMenu;
