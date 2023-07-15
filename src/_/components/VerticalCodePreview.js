import React from "react";
import LearnPageHeader from "../pages/learn/learnPage/_components/LearnPageHeader";
import { Allotment } from "allotment";
import { Box } from "@mui/system";

import prettier from "prettier";
import parserBabel from "prettier/parser-babel";

import { Widget } from "near-social-vm";
import { ThemeContext } from "../context/ThemeContext";
import { useContext, useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSnackbar } from "notistack";
import EditorContainer from "./EditorContainer";

export default function VerticalCodePreview({
  initialCode,
  horizontal,
  code,
  setCode,
}) {
  const { theme, editorFontSize } = useContext(ThemeContext);
  const { enqueueSnackbar } = useSnackbar();

  const [myCode, setMyCode] = useState("");

  useEffect(() => {
    if (initialCode?.length > 0) format(initialCode);
  }, [initialCode]);

  const format = useCallback(
    (code) => {
      try {
        const formattedCode = prettier.format(code, {
          parser: "babel",
          plugins: [parserBabel],
        });

        setCode ? setCode(formattedCode) : setMyCode(formattedCode);
      } catch (e) {
        console.log(e);
      }
    },
    [code, myCode]
  );

  const onCopyButtonClick = async () => {
    try {
      // await navigator.clipboard.writeText(`<Widget src="${textToCopy}" />`);
      await navigator.clipboard.writeText(code || myCode);

      enqueueSnackbar("Code copied to clipboard!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to copy text: ", { variant: "error" });
    }
  };

  return (
    <Allotment defaultSizes={[100, 100]} vertical={horizontal ? false : true}>
      <Allotment.Pane priority={2}>
        <LearnPageHeader title="Code" onCopyButtonClick={onCopyButtonClick} />

        <EditorContainer
          theme={theme.name === "dark" ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: false },

            wordWrap: "on",
            fontSize: editorFontSize || "16px",
          }}
          defaultLanguage="javascript"
          value={code || myCode}
          onChange={(props) => setCode(props)}
          wrapperProps={{ onBlur: () => format(code || myCode) }}
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
          <Widget code={code || myCode} props={{ theme }} />
        </Box>
      </Allotment.Pane>
    </Allotment>
  );
}
