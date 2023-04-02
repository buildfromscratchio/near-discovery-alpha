import { Box, InputBase, Typography } from "@mui/material";
import React, { useContext, useMemo, useState } from "react";
import { Widget, useNear, useCache, useAccountId } from "near-social-vm";
import { ThemeContext } from "../../../../context/ThemeContext";
import { OverlayTrigger } from "react-bootstrap";
import { Tooltip } from "react-bootstrap";

export default function SearchSidebar({ loadFile }) {
  const near = useNear();
  const cache = useCache();
  const accountId = useAccountId();

  const { theme } = useContext(ThemeContext);
  const [search, setSearch] = useState("");

  const getData = () => {
    let widget = `*/widget/*`;

    const code = cache.socialGet(
      near,
      widget,
      false,
      undefined,
      undefined,
      getData
    );
    console.log("GETTING A CALL IN GET DATA, ", code);
    // setMyWidgets(code);
  };

  // const setter = (e) => {
  //   console.log("SETTING ", e);
  // };

  return (
    <Box sx={{ height: "100%" }}>
      <div
        style={{
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: 10,
          borderBottom: `1px solid ${theme.borderColor}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 500, color: theme.textColor }}
        >
          Search
        </Typography>
      </div>

      <InputBase
        sx={{
          m: 1,
          width: "calc(100% - 16px)",
          paddingBlock: 0.5,
          paddingInline: 1,
          flex: 1,
          borderRadius: 1,
          color: theme.textColor,
          backgroundColor: theme.ui2,
        }}
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* only show if props.widgets.editorComponentSearch is avable*/}

      {/* <Widget src="adminalpha.near/widget/adminalpha.near.ProfileSearch" /> */}

      {/* <Widget
        src="adminalpha.near/widget/TosCheck"
        props={{
          // logOut: props.logOut,
          logOut: () => {},
          tosName: "adminalpha.near/widget/TosContent",
          targetComponent: "mob.near/widget/Editor.ComponentSearch",
          targetProps: useMemo(
            () => ({
              extraButtons: ({ widgetName, widgetPath, onHide }) => (
                <OverlayTrigger
                  placement="auto"
                  overlay={
                    <Tooltip>
                      Open "{widgetName}" component in the editor
                    </Tooltip>
                  }
                >
                  <button
                    className="btn btn-outline-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      loadFile(widgetPath);
                      onHide && onHide();
                    }}
                  >
                    Open
                  </button>
                </OverlayTrigger>
              ),
            }),
            [loadFile]
          ),
        }}
      /> */}
    </Box>
  );
}