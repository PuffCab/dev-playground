# Steps

1. Basic configuration add

   ```js
   const server = createServer(app);
   const io = new Server(server);
   ```

2. Run code

3. Inclide CORS port in socket server

   ```js
   const io = new Server(server, {
     cors: "http://localhost:5173",
   });
   ```

4. Listen to events in server

   ```js
   io.on("connection", () => {
     console.log("a user connected");
   });
   ```

5. in CLIENT create SOCKET in `src/config/socket.ts`

   ```js
   const URL =
     process.env.NODE_ENV === "production"
       ? undefined
       : "http://localhost:5000";

   const socket = io(URL);

   export { socket };
   ```

6. Import `socket` in `App.tsx` : CHECK Nework tab and explain that we establish connection and we see the "user connected" . Point out the arrows direction in `Messages` refer to the bidirectional nature

7. Add `disconect` to

   ```js
   io.on("connection", (socket) => {
     <!-- console.log("a user connected".green); -->
     socket.on("disconnect", () => {
       console.log("user disconnected");
     });
   });
   ```

8. Refresh page and check

9. Add `chat message` event in SERVER

   ```js
   io.on("connection", (socket) => {
   <!-- console.log("a user connected".green); -->

   socket.on("disconnect", () => {
       console.log("user disconnected");
   });
   });

   socket.on("chat message", (message) => {
   console.log("message >>> " + message);
   });
   ```

10. Create send message using FORM

    ```js
    const sendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = document.querySelector("form");
        const formData = new FormData(form!);
        const message = formData.get("message");
        socket.emit("chat message", message, () => {
        });
    };
    ```

11. Open App in different Browser, and check network tab, `payload`, check IDs,and then `messages`

12. BROADCAST message. in SERVER:

    ```js
    io.on("connection", (socket) => {
      socket.on("disconnect", () => {});

      socket.on("chat message", (message) => {
        console.log("message >>> " + message);
        io.emit("chat message", message); //this will broadcast to all users
      });
    });
    ```

13. Client LISTEN message CLIENT

    ```js
    useEffect(() => {
      socket.on("chat message", (value) => {
        console.log("value :>> ", value);
      });

      return () => {};
    }, []);
    ```

14. Improve USEFFECT with cleanup and connection and disconnection and set Messages

    ```js
    useEffect(() => {
      function getMessages(msg: string) {
        setMessages((prev) => {
          return [...prev, { msg: msg }];
        });
      }
      socket.on("chat message", getMessages);

      return () => {
        socket.off("chat message", getMessages);
      };
    }, []);
    ```

15. Render messages . use styles stored in `ChatStyles.css`

    ```js
    //new component
    function ChatMessage({ msg }: { msg: Msg }) {
      console.log("msg :>> ", msg);
      return <li>--- {msg.msg}</li>;
    }
    // in App.tsx
    <ul id="messages">
      {messages &&
        messages.map((msg) => {
          return <ChatMessage msg={msg} />;
        })}
    </ul>;
    ```

16. Recovering after disconection

    ```js
    const io = new Server(server, {
      cors: "http://localhost:5173",
      connectionStateRecovery: {}, //by default are 120000ms (2min)
      // connectionStateRecovery: {
      //   maxDisconnectionDuration:10000 // would wait for 10 seconds (time in ms)
      // }
    });
    ```

17. Handling Disconection

    ```js
    io.on("connection", (socket) => {
      // {.....previous code.....}

      //* Handle disconnection
      socket.on("disconnect", (reason) => {
        console.log(`User ${socket.id} disconnected: ${reason}`);

        // Detect if it's a temporary disconnection
        if (reason === "transport close" || reason === "ping timeout") {
          console.log("The user might reconnect soon...");
        }
      });
      if (socket.recovered) {
        console.log(
          `User ${socket.id} reconnected and recovered their session`
        );
      }
    });
    ```

18. Store Messages in DB

    ```js
    io.on("connection", (socket) => {
      // {...previous code...}

      socket.on("chat message", async (message) => {
        let createdMsg;
        try {
          createdMsg = await MessageModel.create({
            text: message,
            authorID: socket.id,
            postingDate: new Date().getTime(), // ideally a field that autoIncrement itself to use it as a reference
          });
        } catch (error) {
          console.error(error.message);
          return;
        }
        io.emit("chat message", message, createdMsg.postingDate); //we attach the date of the last message inserted.
      });
    });
    ```

19. Add Informationj to Socket.Auth in CLIENT . Log it in the Server

    ```js
    const socket = io(URL, {
      auth: {
        userName: "someName",
        token: "a token",
      },
    });
    ```

20. in CLIENT update messages with serverOffset

    ```js
    function getMessages(msg: string) {
      setMessages((prev) => {
        return [...prev, { msg: msg }];
      });
      socket.auth.serverOffset = serverOffset;
    }
    ```

21. in SERVER we insert `if(!socket.recovered)` and logic to recover messages:

    ```js
    socket.on("chat message", async (message) => {
      //{...previous code....}
      if (!socket.recovered) {
        const serverOffset =
          Number(socket.handshake.auth.serverOffset ?? 0) ?? 0; //transform into number, and if no number, we set it to 0 (recover ALL messages)
        try {
          const recoveredMessages = await MessageModel.find({
            postingDate: { $gt: serverOffset ?? 0 }, //for more security
          });
          recoveredMessages.forEach((msg) => {
            socket.emit("chat message", msg.text, msg.postingDate, msg.author);
          });
        } catch (error) {
          console.error("error", error);
        }
      }
    });
    ```

22. Handling USER . Create function to randomise user in `socket.js`

    ```js
    const getUserName = () => {
      //what we should do here: send the cookie, check the cookie to see if it is a real user...etc... validation
      const activeUser = localStorage.getItem("userName");
      if (activeUser) {
        // console.log("%c active user: " + activeUser);
        return activeUser;
      } else {
        const randomUserName = `user-${new Date().getSeconds()}`;
        // const randomUser = fetch("https://random-data-api.com/api/v2/users");
        localStorage.setItem("userName", randomUserName);
        return randomUserName;
      }
    };

    const socket = io(URL, {
      auth: {
        serverOffset: 0,
        author: getUserName(),
      },
    });
    ```

23. Store author in Message in SERVER and attach to event

    ```js
    socket.on("chat message", async (message) => {
      let createdMsg;
      const author = socket.handshake.auth.author ?? "anonymous";
      try {
        createdMsg = await MessageModel.create({
          text: message,
          authorID: socket.id,
          author: author,
          postingDate: new Date().getTime(),
        });
      } catch (error) {
        console.error(error.message);
        return;
      }
      io.emit("chat message", message, createdMsg.postingDate, author);
    });
    ```

24. Add it to Messages in CLIENT

    ```js
    function getMessages(
      message: string,
      serverOffset: string,
      author: string
    ) {
      setMessages((previous) => [
        ...previous,
        { message: message, author: author },
      ]);
      socket.auth.serverOffset = serverOffset;

      scrollToBottom();
    }
    ```

## Typing indicator:

- Server

```js

```
