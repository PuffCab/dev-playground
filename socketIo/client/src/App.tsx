import { useState } from "react";

import Chat from "./pages/Chat/Chat";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
function App() {
  const GeneralLayout = () => {
    return (
      <div>
        <NavBar />
        <Outlet />
      </div>
    );
  };
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<GeneralLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/chats" element={<Chat />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
