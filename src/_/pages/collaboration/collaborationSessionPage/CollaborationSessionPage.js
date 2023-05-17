import React, { useContext, useCallback, useEffect } from "react";
import PagesContainer from "../../../components/PagesContainer";
import { Box } from "@mui/material";
import { ThemeContext } from "../../../context/ThemeContext";
import { Allotment } from "allotment";
import LearnPageHeader from "../../learnPage/_components/LearnPageHeader";
import prettier from "prettier";
import parserBabel from "prettier/parser-babel";
import { Widget } from "near-social-vm";

import MonacoEditor from "@monaco-editor/react";
import { CollaborationContext } from "./_components/CollaborationContext";
import { EditorContext } from "../../../context/EditorContext";
import { useState } from "react";
import { useParams } from "react-router-dom";
import OpenCollaborationDialog from "./_components/OpenCollaborationDialog";

export default function CollaborationPage(props) {
  const { currentChannel } = useParams();

  const { theme, editorFontSize } = useContext(ThemeContext);
  const { setSelectedActivity } = useContext(EditorContext);
  const { code, onChange } = useContext(CollaborationContext);
  const [showOpenCollaborationDialog, setShowOpenCollaborationDialog] =
    useState();

  useEffect(() => {
    if (!currentChannel) {
      setShowOpenCollaborationDialog(true);
    }
  }, [currentChannel]);

  useEffect(() => {
    setSelectedActivity("collaboration");
  }, []);

  useEffect(() => {
    if (code?.length > 0) format(code);
  }, []);

  const format = useCallback(
    (code) => {
      try {
        const formattedCode = prettier.format(code, {
          parser: "babel",
          plugins: [parserBabel],
        });

        onChange(formattedCode);
      } catch (e) {
        console.log(e);
      }
    },
    [code]
  );

  return (
    <>
      <PagesContainer {...props}>
        <Allotment defaultSizes={[100, 100]}>
          <Allotment.Pane priority={2}>
            <LearnPageHeader title="Code" />

            <MonacoEditor
              theme={theme.name === "dark" ? "vs-dark" : "light"}
              options={{
                minimap: { enabled: false },

                wordWrap: "on",
                fontSize: editorFontSize || "16px",
              }}
              defaultLanguage="javascript"
              value={code}
              onChange={onChange}
            />
          </Allotment.Pane>

          <Allotment.Pane priority={1} style={{ flex: 1, height: "100vh" }}>
            <LearnPageHeader title="Preview" />
            <Box
              sx={{
                flex: 1,
                p: 1,
                paddingBottom: 7,
                bgcolor: theme.ui,
                color: theme.textColor,
                height: "100%",
                overflowY: "auto",
              }}
            >
              <Widget code={code} props={{ theme }} />
            </Box>
          </Allotment.Pane>
        </Allotment>
      </PagesContainer>

      <OpenCollaborationDialog
        open={showOpenCollaborationDialog}
        setOpen={setShowOpenCollaborationDialog}
      />
    </>
  );
}
