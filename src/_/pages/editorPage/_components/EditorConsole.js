import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { EditorContext } from "../../../context/EditorContext";
import { useState } from "react";
import { useEffect } from "react";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { Console, Hook, Unhook } from "console-feed";

export default function EditorConsole() {
  const { theme, light, dark } = useContext(ThemeContext);
  const { showConsole, setShowConsole } = useContext(EditorContext);

  const [logs, setLogs] = useState([]);

  // run once!
  useEffect(() => {
    const hookedConsole = Hook(
      window.console,
      (log) => {
        if (log.data[0] === null) {
          setLogs((currLogs) => [
            ...currLogs,
            { ...log, data: log.data.slice(1) },
          ]);
        }
      },
      false
    );
    return () => Unhook(hookedConsole);
  }, []);

  const clearConsole = () => {
    setLogs([]);
  };

  return (
    <Box sx={{ height: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          paddingInline: 1,
          height: 50,
          minHeight: 50,
          backgroundColor: theme.backgroundColor,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: theme.textColor2, width: "100%" }}
        >
          Console
        </Typography>

        <Tooltip title="Clear Logs">
          <IconButton onClick={() => clearConsole()}>
            <ClearAllIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Close Console">
          <IconButton onClick={() => setShowConsole(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ height: "100%", overflowY: "auto", paddingBottom: "25px" }}>
        <Console logs={logs} variant={theme?.name} />
      </Box>
    </Box>
  );
}
