import React, { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import httpClient from "../libs/httpClient";
import { useHistory, useParams } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

export default function AuthPage() {
  const { push } = useHistory();
  const { code } = useParams();

  const { saveUserData } = useContext(AuthContext);

  useEffect(() => {
    if (!code) {
      push("/");
      return;
    }

    // After requesting Github access, Github redirects back to your app with a code parameter
    const url = window.location.href;
    const hasCode = url.includes("?code=");

    // If Github API returns the code parameter
    if (hasCode) {
      const newUrl = url.split("?code=");
      // console.log("Login Success, your code is: ", newUrl[1]);

      httpClient()
        .post("/auth/github", { code: newUrl[1] })
        .then((res) => {
          console.log("Login Success, your code is: ", res.data);

          saveUserData(res.data);
          push("/");
        })
        .catch((err) => {
          console.log("Login Error, your code is: ", err);
        });
    }
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress thickness={5} />
    </Box>
  );
}
