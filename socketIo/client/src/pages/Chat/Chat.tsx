import { FormEvent, RefObject, useEffect, useRef, useState } from "react";
import "./Chat.css";
import { socket } from "../../config/socket";
type Message = { message: string; author: string };
const Chat = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  // console.log("isConnected :>> ", isConnected);
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = document.querySelector("form");
    const formData = new FormData(form!);
    const message = formData.get("message");
    console.log("message :>> ", message);

    // socket.timeout(5000).emit("chat message", message, () => {
    //   console.log("message sent");
    //   console.log("socket :>> ", socket);
    // });
    socket.timeout(1000).emit("chat message", message, () => {
      console.log("message sent");
      console.log("socket :>> ", socket);
    });
    // messages.scrollTop = messages.scrollHeight;
  };

  //! with one useEffect . see pros and cons. here he handle the connection in a component with 2 buttons and the state variable
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function getMessages(
      message: string,
      serverOffset: string,
      author: string
    ) {
      // console.log("message getMessages :>> ", message);
      setMessages((previous) => [
        ...previous,
        { message: message, author: author },
      ]);
      // console.log("socket.auth :>> ", socket.auth);
      socket.auth.serverOffset = serverOffset;

      scrollToBottom();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat message", getMessages);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat message", getMessages);
    };
  }, []);
  //! #######

  //! With 2 useEffects, one to just connect the server another one to , and we connect and disconnect .
  // useEffect(() => {
  //   // no-op if the socket is already connected
  //   socket.connect();

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // useEffect(() => {
  //   function getMessages(value: string) {
  //     setMessages((previous) => [...previous, value]);
  //   }

  //   socket.on("chat message", getMessages);

  //   return () => {
  //     socket.off("chat message", getMessages);
  //   };
  // }, [messages]);
  //! ###########

  //! scroll to bottom
  //#region
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  //#endregion
  return (
    <div className="chat-body">
      <p id="chat-status" className={isConnected ? "on" : "off"}>
        Chat Status: {isConnected ? "online" : "offline"}
      </p>
      <ConnectionManager />
      <section id="chat">
        {/* <Messages messages={messages} messagesEndRef={messagesEndRef} /> */}
        {console.log("messages", messages[1])}
        {messages &&
          messages.map((msg, index) => {
            return <ChatMessage msg={msg} key={index} />;
          })}
        <div ref={messagesEndRef}></div>
        <form id="form" onSubmit={sendMessage}>
          <input
            type="text"
            name="message"
            id="message"
            placeholder="Type a message"
            autoCapitalize="on"
            autoComplete="off"
            autoCorrect="on"
          />
          <button id="button-send" type="submit">
            Send
          </button>
        </form>
      </section>
    </div>
  );
};

export default Chat;

function ConnectionManager() {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </>
  );
}

function Messages({
  messages,
  messagesEndRef,
}: {
  messages: Message[];
  messagesEndRef: RefObject<HTMLDivElement | null>;
}) {
  console.log("messages :>> ", messages);
  return (
    <ul id="messages">
      {messages.map((msg, index) => (
        <li key={index}>
          {msg.author} --- {msg.message}
        </li>
      ))}
      <div ref={messagesEndRef}></div>
    </ul>
  );
}

function ChatMessage({ msg }: { msg: Message }) {
  console.log("msg :>> ", msg);
  return (
    <li>
      {msg.author} --- {msg.message}
    </li>
  );
}
