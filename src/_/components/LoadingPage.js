import React, { useContext } from "react";
import { CircularProgress } from "@mui/material";
import { ThemeContext } from "../context/ThemeContext";

export default function LoadingPage({ fullSize, size, thickness, msg }) {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: fullSize ? "100vh" : "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.ui,
      }}
    >
      <CircularProgress
        // style={{ color: theme.buttonColor }}
        size={size || 64}
        thickness={thickness || 5}
      />

      {msg && <p style={{ color: theme.textColor2, marginTop: 20 }}>{msg}</p>}
    </div>
  );
}
