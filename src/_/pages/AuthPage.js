import React, { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import httpClient from "../libs/httpClient";
import { useHistory } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import removeUndefinedFromString from "../../utils/removeUndefinedFromString";
import { useSnackbar } from "notistack";

export default function AuthPage() {
  const { push } = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const { saveUserData } = useContext(AuthContext);

  useEffect(() => {
    // After requesting Github access, Github redirects back to your app with a code parameter
    const url = window.location.href;
    const hasCode = url.includes("?code=");

    if (!hasCode) {
      push("/");
      return;
    }

    // If Github API returns the code parameter
    if (hasCode) {
      const newUrl = url.split("?code=");
      // console.log("Login Success, your code is: ", newUrl[1]);

      httpClient()
        .post("/auth/github", { code: newUrl[1] })
        .then((res) => {
          console.log("Login Success, your code is: ", res.data);

          saveUserData(res.data);

          enqueueSnackbar(res.data.fullName || res.data.email, {
            variant: "success",
          });

          push("/");
        })
        .catch((err) => {
          console.log("Login Error, your code is: ", err);
          enqueueSnackbar(
            removeUndefinedFromString(err?.response?.data?.message),
            { variant: "error" }
          );
          push("/");
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
