"use client";
import { useSearchParams } from "next/navigation";
import React from "react";

function Chatbot() {
  const params = useSearchParams();
  const text = params.get("text");
  return (
    <div>
      <h1>This would be the chatbot page</h1>
      <p>The prompt could be something like:</p>
      <p>
        <i>
          Give the translation to japanese, ancient greek and esperanto, as well
          as examples of use using the context provided of the following text:{" "}
        </i>
      </p>
      <p>
        <strong>{text}</strong>
      </p>
    </div>
  );
}

export default Chatbot;
