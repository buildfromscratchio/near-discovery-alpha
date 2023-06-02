import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Custom401Page from "../pages/errorPages/Custom401Page";
import { Box, CircularProgress } from "@mui/material";

export default function accessController(props) {
  const { loadingCheck, user } = useContext(AuthContext);

  return loadingCheck ? (
    <Box
      sx={{
        height: "100dvh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress size={64} thickness={5} />
    </Box>
  ) : user?.role === props.requiredRole ? (
    props.children
  ) : (
    <Custom401Page />
  );
}
