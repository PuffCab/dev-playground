"use client";
import React, { useEffect, useState } from "react";

function SelectMenu() {
  const [selectedText, setSelectedText] = useState("");
  useEffect(() => {
    document.addEventListener("selectionchange", () => {
      // console.log("select", document.getSelection());
      const currentSelection = document.getSelection();
      const text = currentSelection?.toString();
      setSelectedText(text);
      //   console.log("select", document.getSelection()?.toString());
    });

    return () => {};
  }, []);

  return (
    <div>
      Selected text: <strong>{selectedText}</strong>
    </div>
  );
}

export default SelectMenu;
