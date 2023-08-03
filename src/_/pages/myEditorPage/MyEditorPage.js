import { Box } from "@mui/material";
import { ThemeContext } from "../../context/ThemeContext";

import React, { useContext, useEffect, useState, useCallback } from "react";

import ReactGA from "react-ga4";

import { Widget, useAccountId } from "near-social-vm";

import { EditorContext } from "../../context/EditorContext";
import EditorContainer from "../../components/EditorContainer";
import { MyEditorContext, isJSON } from "./MyEditorContext";
import { Allotment } from "allotment";
import Activitybar from "../../components/Activitybar";
import MyEditorSidebar from "./_components/myEditorSidebar/MyEditorSidebar";
import WidgetViewContainer from "./_components/widgetViewContainer/WidgetViewContainer";
import { EditorTabs } from "./libs/editorInterfaces";
import useLocalStorage from "use-local-storage";
import Tabsbar from "./_components/Tabsbar";

export default function MyEditorPage(props) {
  const accountId = useAccountId();

  const { theme, dark, editorFontSize, bp } = useContext(ThemeContext);

  const { selectedActivity, setSelectedActivity } = useContext(EditorContext);

  const { updateCode, code, setCode, lastPath, setMetadata, showPreview } =
    useContext(MyEditorContext);

  const [tab, setTab] = useState(EditorTabs.Editor);
  const [widgetProps, setWidgetProps] = useLocalStorage("widgetProps", "{}");

  useEffect(() => {
    setSelectedActivity("widgets");
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  const widgetPath = `${accountId}/${lastPath?.type}/${lastPath?.name}`;

  const reformatProps = useCallback(
    (props) => {
      try {
        const formattedProps = JSON.stringify(JSON.parse(props), null, 2);
        setWidgetProps(formattedProps);
      } catch (e) {
        console.log("JSON : ", e);
      }
    },
    [setWidgetProps]
  );

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
      }}
    >
      <Activitybar {...props} />

      <Box sx={{ flex: 1 }}>
        <Allotment
          maxSize="100%"
          vertical={bp}
          // vertical={true}
          defaultSizes={[75, 200, 200]}
        >
          <Allotment.Pane
            key="activityBar"
            snap
            visible={selectedActivity?.length > 0 ? true : false}
            preferredSize={300}
            minSize={100}
            maxSize={450}
          >
            <MyEditorSidebar />
          </Allotment.Pane>

          <Allotment.Pane minSize={300}>
            <Box sx={{ flex: 1 }}>
              <Tabsbar
                widgets={props?.widgets}
                Tab={EditorTabs}
                tab={tab}
                setTab={setTab}
              />

              <Box
                sx={{
                  height: "calc(100vh - 75px)",
                  minHeight: 750,
                  backgroundColor: theme.ui,
                }}
              >
                {(tab === EditorTabs.Editor && (
                  <EditorContainer
                    // This is for props
                    theme={theme.name === "dark" ? "vs-dark" : "light"}
                    options={{
                      minimap: { enabled: false },
                      wordWrap: "on",
                      fontSize: editorFontSize || "16px",
                    }}
                    value={code}
                    // path={`${accountId}/${lastPath?.type}/${lastPath?.name}`}
                    path={widgetPath}
                    defaultLanguage="javascript"
                    onChange={(code) => {
                      setCode(code);
                      updateCode(lastPath, code, "Editor");
                    }}
                    // wrapperProps={{
                    //   onBlur: () => reformat(path, code),
                    // }}
                  />
                )) ||
                  (tab === EditorTabs.Props && (
                    <EditorContainer
                      // This is for Component
                      theme={theme.name === "dark" ? "vs-dark" : "light"}
                      options={{
                        minimap: { enabled: false },
                        wordWrap: "on",
                        fontSize: editorFontSize || "16px",
                      }}
                      value={widgetProps}
                      defaultLanguage="json"
                      onChange={(props) => setWidgetProps(props)}
                      wrapperProps={{
                        onBlur: () => reformatProps(widgetProps),
                      }}
                    />
                  )) ||
                  (tab === EditorTabs.Metadata && (
                    <Box
                      sx={{
                        padding: "8px 16px",
                      }}
                    >
                      <Widget
                        src={props.widgets.widgetMetadataEditor}
                        // key={`metadata-editor-${jpath}`}
                        key={`metadata-editor-${JSON.stringify(lastPath)}`}
                        props={{
                          widgetPath,
                          onChange: setMetadata,
                          theme,
                        }}
                        // props={useMemo(
                        //   () => ({
                        //     widgetPath,
                        //     onChange: setMetadata,
                        //     theme: theme,
                        //   }),
                        //   [widgetPath]
                        // )}
                      />
                    </Box>
                  ))}
              </Box>
            </Box>
          </Allotment.Pane>

          {/* {!showPreview && ( */}
          <Allotment.Pane
            key="websiteView"
            visible={showPreview}
            minSize={300}
            preferredSize="40%"
            // snap
          >
            <WidgetViewContainer
              // parsedWidgetProps={JSON.parse(widgetProps)}
              parsedWidgetProps={isJSON(widgetProps) || {}}
              requestSignIn={props.requestSignIn}
            />
          </Allotment.Pane>
          {/* )} */}
        </Allotment>
      </Box>
    </Box>
  );
}
