import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import ChatPage from "./Pages/ChatPage";
import HomePage from "./Pages/HomePage";

function App() {
  console.log("APP");
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
