import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "@mui/material";
import ThemeContextProvider, { theme } from "./_/context/ThemeContext";
import EditorContextProvider from "./_/context/EditorContext";
import { SnackbarProvider } from "notistack";

if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <SnackbarProvider>
    <ThemeContextProvider>
      <ThemeProvider theme={theme}>
        <EditorContextProvider>
          <App />
        </EditorContextProvider>
      </ThemeProvider>
    </ThemeContextProvider>
  </SnackbarProvider>
);
