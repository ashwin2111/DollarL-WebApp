import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./Context/ChatProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChatProvider>
    {/*
    Let's connect Frontend and Backend!

    OPPS!,Let's take data from Backend and render in Frontend

    There is an issue, if we want to try to make an API call from Frontend to Backend, 
    it's gives an cros Error.
    If we want to avoid that cros Error we need to provide the "Proxy"
    (like "proxy":"http://127.0.0.1:5000" in package.json) to our Frontend App.

    The Port of our Backend is 5000 and Frontend is 3000, 
    We need to have same Origin, if we want to access our API from Frontend to Backend;

   
    Our App has Multiple Pages
    To achieve Multiple Pages, we need to Install the React Router dom. 
    To User React Router Dom, we need to wrap our whole App by "BrowserRouter"
    */}
    <BrowserRouter>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </ChatProvider>
);
