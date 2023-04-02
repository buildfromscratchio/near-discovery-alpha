import { Box } from "@mui/material";
import React, { useContext } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";
// import { EditorContext } from "../../../../context/EditorContext";
import WidgetViewHeader from "./WidgetViewHeader";

import { Widget } from "near-social-vm";
// import CustomButton from "../../../../components/custom/CustomButton";

export default function WidgetViewContainer({
  loading,

  parsedWidgetProps,
  renderCode,
  handlePreviewButton,
  handleSaveDraftButton,
  handleForkButton,

  publishWidgetButton,
}) {
  const { theme } = useContext(ThemeContext);
  // const { outputCode } = useContext(EditorContext);

  return (
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
              bgcolor: "#FFF",
              overflowX: "auto",
              paddingBottom: "50px",
            }}
          >
            <Widget code={renderCode} props={parsedWidgetProps} />
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
          }}
          onClick={handlePreviewButton}
        ></div>
      )}
    </Box>
  );
}