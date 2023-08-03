import { Box, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { useEffect } from "react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Console, Hook, Unhook } from "console-feed";
import { MyEditorContext } from "../MyEditorContext";

export default function EditorConsole() {
  const { theme } = useContext(ThemeContext);
  const { setShowConsole, logs, setLogs } = useContext(MyEditorContext);

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
          {`Console ${logs?.length > 0 ? `(${logs?.length})` : ""}`}
        </Typography>

        <Tooltip title="Clear Logs">
          <IconButton onClick={() => clearConsole()}>
            <DeleteRoundedIcon sx={{ fill: theme.textColor }} />
          </IconButton>
        </Tooltip>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 1, backgroundColor: theme.borderColor }}
        />

        <Tooltip title="Close Console">
          <IconButton onClick={() => setShowConsole(false)}>
            <ExpandMoreRoundedIcon sx={{ fill: theme.textColor }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ height: "100%", overflowY: "auto", paddingBottom: "50px" }}>
        <Console logs={logs} variant={theme?.name} />
      </Box>
    </Box>
  );
}
