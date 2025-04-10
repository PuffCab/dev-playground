import { io } from "socket.io-client";

//! generate random user
//#region
const getUserName = () => {
  //what we should do here: send the cookie, check the cookie to see if it is a real user...etc... validation
  // console.log("object :>> ", new Date().getSeconds());
  const activeUser = localStorage.getItem("userName");
  // console.log("activeUser :>> ", activeUser);
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
//#endregion
const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:5000";

// const socket = io(URL);
const socket = io(URL, {
  auth: {
    serverOffset: 0, //customProperty
    // token: "some token",
    // userName: "test user",
    author: getUserName(),
  },
});
// const socket = io(URL, { autoConnect: false });

export { socket };
