import { Box } from "@mui/material";
import React, { useContext, useState } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";
import WidgetViewHeader from "./WidgetViewHeader";

import { Widget } from "near-social-vm";
import { Allotment } from "allotment";
import { EditorContext } from "../../../../context/EditorContext";
import EditorConsole from "../EditorConsole";

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
  const { showConsole, setShowConsole } = useContext(EditorContext);

  const [allowTheming, setAllowTheming] = useState(true);

  //   <Allotment.Pane
  //   key="websiteView"
  //   snap
  //   visible={showWebsiteView}
  //   minSize={300}
  //   preferredSize="40%"
  // >
  // </Allotment.Pane>

  return (
    <Allotment
      maxSize="40%"
      sx={{ height: "100vh" }}
      defaultSizes={[300, 100]}
      vertical
    >
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

      <Allotment.Pane snap visible={showConsole}>
        <EditorConsole />
      </Allotment.Pane>
    </Allotment>
  );
}
