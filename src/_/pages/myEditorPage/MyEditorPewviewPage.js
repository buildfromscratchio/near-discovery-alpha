import React, { useState, useEffect } from "react";
import useLocalStorage from "use-local-storage";
import { useCallback } from "react";
import { Box } from "@mui/material";
import { ThemeContext } from "../../context/ThemeContext";
import { useContext } from "react";
import { Widget } from "near-social-vm";
import { isJSON } from "./MyEditorContext";

export default function MyEditorPewviewPage() {
  const { theme } = useContext(ThemeContext);
  const [lastPath, setLastPath] = useLocalStorage("lastPath", "");
  const [code, setCode] = useState("");

  const [urlCode, setUrlCode] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window?.location?.search);
    const codeParam = urlParams?.get("code");

    if (codeParam) {
      // Decode the URI component if needed
      const decodedCode = decodeURIComponent(codeParam);
      setUrlCode(isJSON(decodedCode));
    }
  }, []);

  // Memoized function to update code based on lastPath.name
  const updateCodeFromLocalStorage = useCallback(() => {
    const key = lastPath.name;
    // const storedCode = localStorage.getItem(key);
    const storedCode = isJSON(localStorage.getItem(key));

    if (storedCode !== code) {
      setCode(storedCode);
    }
  }, [lastPath, code]);

  // Effect to run the update function when lastPath changes
  useEffect(() => {
    if (urlCode) return;
    updateCodeFromLocalStorage();
  }, [updateCodeFromLocalStorage]);

  // Memoized storage change handler
  const storageChangeHandler = useCallback(
    (event) => {
      if (event.key === lastPath.name) {
        updateCodeFromLocalStorage();
      }
    },
    [lastPath.name, updateCodeFromLocalStorage]
  );

  // Effect to monitor changes in local storage
  useEffect(() => {
    if (urlCode) return;

    // Listen for storage change events
    window.addEventListener("storage", storageChangeHandler);

    return () => {
      // Clean up the event listener when component unmounts
      window.removeEventListener("storage", storageChangeHandler);
    };
  }, [storageChangeHandler]);

  console.log(urlCode);

  return (
    <Box
      className="containerCSS"
      sx={{
        // height: "100vh",
        minHeight: 700,
        // height: "calc(100vh - 25px)",
        height: "100vh",
        width: "100%",
        backgroundColor: theme.ui,
      }}
    >
      <Box
        className="contentCSS"
        style={{
          backgroundColor: theme.backgroundColor,

          display: "flex",
          justifyContent: "flex-start",
          //   alignItems: "flex-start",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <Widget code={urlCode ? urlCode : code} props={{ theme: theme }} />
      </Box>
    </Box>
  );
}
