// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ChatPage = () => {
//   const [chats, setChats] = useState([]); //

//   /*
//     Let's Make Our API call , to render the data from our backend to Frontend.
//     To Fetch , our API, we make a use of Package -> axios
//    */
//   const fetchChats = async () => {
//     const { data } /*Destructing the data */ = await axios.get("/api/chat");
//     setChats(data);
//   };

//   useEffect(() => {
//     /*Hook in react , which runs when the component is render first time*/
//     fetchChats(); /*When this componet is render, this will be called */
//   }, []);
//   return (
//     <div>
//       {/*Writing Js in HTML
//       We are taking the chats and map through it*/}
//       {chats.map((chat) => (
//         <div
//           key={
//             chat._id /* In react, if we are using "map" we are suppose to give "id" each and every child*/
//           }
//         >
//           {chat.chatName}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ChatPage;

import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
