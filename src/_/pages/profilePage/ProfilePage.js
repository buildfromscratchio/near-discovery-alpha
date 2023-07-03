import React, { useEffect, useState } from "react";
import PagesContainer from "../../components/PagesContainer";
import { Widget } from "near-social-vm";
import { Box } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { EditorContext } from "../../context/EditorContext";
import "./ProfilePage.css";
// import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function ProfilePage(props) {
  const { accountId } = useParams();

  const { theme } = useContext(ThemeContext);
  const { Widgets, setSelectedActivity } = useContext(EditorContext);

  // const location = useLocation();
  // const [accountId, setAccountId] = useState("");

  // useEffect(() => {
  //   const searchParams = new URLSearchParams(location.search);
  //   const accountId = searchParams.get("accountId");
  //   setAccountId(accountId);

  //   console.log(accountId);
  // }, [location]);

  useEffect(() => {
    setSelectedActivity("profile");
  }, []);

  return (
    <PagesContainer {...props}>
      <Box
        sx={{
          wdith: "100%",
          display: "flex",
          justifyContent: "center",
          height: "calc(100vh - 25px)",
          overflowY: "auto",
          backgroundColor: theme.ui,
        }}
      >
        <Box
          sx={{
            maxWidth: 1250,
            width: "100%",
            my: 4,
            mb: 2,
            px: 2,
          }}
        >
          <Widget src={Widgets?.profilePageMain} props={{ theme, accountId }} />
        </Box>
      </Box>
    </PagesContainer>
  );
}
