import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    console.log("Home Page");
    if (user) navigate("/chats");
  }, [navigate]);
  return (
    <Container maxW="xl" centerContent>
      {/*
        it helps us to keep our app very responsive
  */}
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="lpx"
      >
        {/*IT works as a div*/}
        <Text fontSize="4xl" fontFamily="work sans" textAlign="center">
          Dollar L WebApp
        </Text>
      </Box>
      <Box
        bg="white"
        w="100%"
        p={4}
        color="black"
        borderRadius="lg"
        borderWidth="lpx"
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width={"50%"}>Login </Tab>
            <Tab width={"50%"}>Sign Up </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
