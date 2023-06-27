import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";
import WidgetViewHeader from "./WidgetViewHeader";

import { Widget } from "near-social-vm";
import { Allotment } from "allotment";
import { EditorContext } from "../../../../context/EditorContext";
import EditorConsole from "../EditorConsole";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";

export default function WidgetViewContainer({
  showWebsiteView,
  loading,

  parsedWidgetProps,
  renderCode,
  handlePreviewButton,
  handleSaveDraftButton,
  handleForkButton,

  publishWidgetButton,
}) {
  const { theme, light, dark } = useContext(ThemeContext);
  const { showConsole, setShowConsole, logs } = useContext(EditorContext);

  const [allowTheming, setAllowTheming] = useState(true);

  return (
    <>
      <Allotment sx={{ height: "100vh" }} defaultSizes={[300, 100]} vertical>
        <Allotment.Pane
          key="websiteView"
          visible={showWebsiteView}
          minSize={300}
          preferredSize="40%"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: theme.ui,
              flex: 1,
              height: "calc(100vh - 25px)",
              minHeight: 700,
              // color: "#FFF",
            }}
          >
            <WidgetViewHeader
              loading={loading}
              //
              allowTheming={allowTheming}
              setAllowTheming={setAllowTheming}
              //
              onRunButtonClick={handlePreviewButton}
              onSaveButtonClick={handleSaveDraftButton}
              onForkButtonClick={handleForkButton}
              publishWidgetButton={publishWidgetButton}
            />

            {renderCode ? (
              <Box
                sx={{
                  flex: 1,
                  p: 1,
                  pt: 0,
                  height: "100%",

                  backgroundColor: theme.ui,
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    height: "100%",
                    // bgcolor: allowTheming ? theme.ui : "#FFF",
                    bgcolor: allowTheming ? light.ui : dark.ui,
                    overflowX: "auto",
                    paddingBottom: "50px",
                  }}
                >
                  <Widget
                    code={renderCode}
                    props={{
                      ...parsedWidgetProps,
                      theme: allowTheming ? light : dark,
                    }}
                  />
                </Box>
              </Box>
            ) : (
              <div
                style={{
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: allowTheming ? light.ui : dark.ui,
                }}
                onClick={handlePreviewButton}
              ></div>
            )}
          </Box>
        </Allotment.Pane>

        <Allotment.Pane
          // preferredSize={showConsole ? 300 : 50}
          // minSize={50}
          visible={showWebsiteView && showConsole}
        >
          <EditorConsole />
        </Allotment.Pane>
      </Allotment>
      {!showConsole && (
        <Box
          sx={{
            borderTop: `1px solid ${theme.borderColor}`,
            position: "absolute",
            bottom: 0,
            paddingInline: 1,
            height: 50,
            minHeight: 50,
            backgroundColor: theme.backgroundColor,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",

            cursor: "pointer",
          }}
          onClick={() => setShowConsole(true)}
        >
          <Typography
            variant="h6"
            sx={{ color: theme.textColor2, width: "100%" }}
          >
            {`Console ${logs?.length > 0 ? `(${logs?.length})` : ""}`}
          </Typography>

          <Tooltip title="Open Console">
            <IconButton>
              <KeyboardArrowUpRoundedIcon sx={{ fill: theme.textColor }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </>
  );
}
