import React, { useCallback } from "react";
import PagesContainer from "../../components/PagesContainer";
import { Box, Divider, Typography } from "@mui/material";
import { ThemeContext } from "../../context/ThemeContext";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import prettier from "prettier";
import parserBabel from "prettier/parser-babel";
import ReactGA from "react-ga4";

import {
  Widget,
  useCache,
  useNear,
  CommitButton,
  useAccountId,
} from "near-social-vm";
import { EditorContext } from "../../context/EditorContext";
import EditorContainer from "../../components/EditorContainer";
import { useDebouncedCallback } from "use-debounce";
import { useParams, useHistory } from "react-router-dom";
import { MyEditorContext } from "./MyEditorContext";
import { Allotment } from "allotment";
import Activitybar from "../../components/Activitybar";
import MyEditorSidebar from "./_components/myEditorSidebar/MyEditorSidebar";
import { Filetype } from "./libs/editorInterfaces";

export default function MyEditorPage(props) {
  const { widgetSrc } = useParams();
  const history = useHistory();

  const near = useNear();
  const cache = useCache();
  const accountId = useAccountId();

  const { theme, editorFontSize, bp } = useContext(ThemeContext);

  const { selectedActivity, setSelectedActivity } = useContext(EditorContext);

  const {
    // files,
    // setFiles,
    // lastPath,
    // setLastPath,

    // filesDetails,
    // setFilesDetails,
    updateCode,
    widgetPath,

    code,
    setCode,

    path,
    lastPath,
  } = useContext(MyEditorContext);

  useEffect(() => {
    setSelectedActivity("widgets");
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  // useEffect(() => {
  //   // Reding Files and Last open files from cache
  //   cache
  //     .asyncLocalStorageGet(StorageDomain, { type: StorageType.Files })
  //     .then((value) => {
  //       const { files, lastPath } = value || {};
  //       setFiles(files || []);

  //       if (widgetSrc) {
  //         if (widgetSrc === "new") {
  //           createFileTree(Filetype.Widget);
  //         } else {
  //           loadFile(widgetSrc);
  //           setWidgetPath(widgetSrc);
  //         }
  //       } else if (lastPath) {
  //         setWidgetPath(`${accountId}/${lastPath.type}/${lastPath.name}`);
  //         setLastPath(lastPath);
  //       }
  //     });
  // }, [cache, widgetSrc]);

  // // loadFile
  // const loadCodeFormNear = (path) => {
  //   return new Promise((resolve, reject) => {
  //     const code = cache.socialGet(near, path);
  //     if (code) {
  //       resolve(code);
  //     } else {
  //       setTimeout(() => {
  //         loadCodeFormNear(path).then((code) => {
  //           resolve(code);
  //         });
  //       }, 250);
  //     }
  //   });
  // };
  // const loadFile = async (nameOrPath) => {
  //   let widgetSrc =
  //     nameOrPath.indexOf("/") >= 0
  //       ? nameOrPath
  //       : `${accountId}/widget/${nameOrPath}`;

  //   const widget = `${widgetSrc}/**`;

  //   const code = await loadCodeFormNear(widget);

  //   const mainCode = code?.[""];
  //   const draftCode = code?.branch?.draft?.[""];
  //   const currentCode = draftCode || mainCode;

  //   const file = {
  //     type: Filetype.Widget,
  //     name:
  //       nameOrPath?.indexOf("/") >= 0
  //         ? nameOrPath?.split("/")?.slice(2)?.join("/")
  //         : nameOrPath,
  //   };

  //   openFile(file, currentCode);
  //   setCode(currentCode);
  //   // setLastPath(path);
  // };

  // // Open File
  // const openFile = (path, code) => {
  //   setCodeChangesPresent(true);
  //   setPath(path);
  //   addToFiles(path);
  //   setMetadata(undefined);

  //   if (code !== undefined) {
  //     updateCode(path, code, " openFile Code ");

  //     console.log(" Code form openFile code : ", path, code.length);

  //     // history.replace(`/editorBeta`);

  //     setLoading(false);
  //   } else {
  //     setLoading(true);

  //     cache
  //       .asyncLocalStorageGet(StorageDomain, { path, type: StorageType.Code })
  //       .then((value) => {
  //         const { code } = value || {};
  //         // setCode(code);

  //         console.log("Code form openFile no code : ", path, code.length);
  //         updateCode(path, code, " openFile No Code ");

  //         setLoading(false);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }
  // };

  // useEffect(() => {
  //   if (files && lastPath) {
  //     cache.localStorageSet(
  //       StorageDomain,
  //       {
  //         type: StorageType.Files,
  //       },
  //       { files, lastPath }
  //     );
  //   }
  // }, [files, lastPath, cache]);

  // // updateCode
  // const updateCode = useDebouncedCallback(
  //   (path, code, sender) => {
  //     console.log(sender, "  : updateCode : ", path, code && code.slice(0, 50));

  //     cache.localStorageSet(
  //       StorageDomain,
  //       {
  //         // path: lastPath,
  //         path,
  //         type: StorageType.Code,
  //       },
  //       {
  //         code,
  //         time: Date.now(),
  //       }
  //     );
  //     // if (code?.length <= 1) setCode(code);

  //     if (widgetSrc?.length > 0) {
  //       history.replace(`/myEditor`);
  //     }
  //   },
  //   // Delay in ms
  //   500
  // );

  // // reformat js code
  // const reformat = useCallback(
  //   (path, code) => {
  //     try {
  //       const formattedCode = prettier.format(code, {
  //         parser: "babel",
  //         plugins: [parserBabel],
  //       });
  //       updateCode(path, formattedCode, " reformat ");
  //     } catch (e) {
  //       console.log("Reformet error : ", e);
  //     }
  //   },
  //   [updateCode]
  // );

  // useEffect(() => {
  //   if (lastPath) {
  //     cache
  //       .asyncLocalStorageGet(StorageDomain, {
  //         path: lastPath,
  //         type: StorageType.Code,
  //       })
  //       .then((value) => {
  //         const { code } = value || {};
  //         setCode(code);

  //         // console.log({ code });
  //       });
  //   }
  // }, [cache, lastPath]);

  // const addToFiles = useCallback(
  //   (path) => {
  //     if (!path) return;

  //     const jpath = JSON.stringify(path);
  //     setFiles((files) => {
  //       const newFiles = [...files];
  //       if (!files.find((file) => JSON.stringify(file) === jpath)) {
  //         newFiles.push(path);
  //       }
  //       return newFiles;
  //     });
  //     setLastPath(path);
  //   },
  //   [setFiles, setLastPath]
  // );

  // const toPath = useCallback((type, nameOrPath) => {
  //   const name =
  //     nameOrPath.indexOf("/") >= 0
  //       ? nameOrPath.split("/").slice(2).join("/")
  //       : nameOrPath;
  //   return { type, name };
  // }, []);
  // // handle rename file
  // const renameFile = useCallback(
  //   (newName, code) => {
  //     const newPath = toPath(path.type, newName);
  //     const jNewPath = JSON.stringify(newPath);
  //     const jPath = JSON.stringify(path);
  //     setFiles((files) => {
  //       const newFiles = files.filter(
  //         (file) => JSON.stringify(file) !== jNewPath
  //       );
  //       const i = newFiles.findIndex((file) => JSON.stringify(file) === jPath);
  //       if (i >= 0) {
  //         newFiles[i] = newPath;
  //       }
  //       return newFiles;
  //     });
  //     setLastPath(newPath);
  //     setPath(newPath);
  //     updateCode(newPath, code, "renameFile : ");
  //   },
  //   [path, updateCode]
  // );

  // // handle remove file
  // const removeFromFiles = useCallback(
  //   (path) => {
  //     // console.log("Removing ", path);
  //     path = JSON.stringify(path);
  //     setFiles((files) =>
  //       files.filter((file) => JSON.stringify(file) !== path)
  //     );
  //     setLastPath(path);
  //   },
  //   [setFiles, setLastPath]
  // );

  // // handle create file
  // const generateNewName = useCallback(
  //   (type) => {
  //     for (let i = 0; ; i++) {
  //       const name = `Untitled-${i}`;
  //       const path = toPath(type, name);
  //       path.unnamed = true;
  //       const jPath = JSON.stringify(path);
  //       if (!files?.find((file) => file.name === name)) {
  //         return path;
  //       }
  //     }
  //   },
  //   [toPath, files]
  // );
  // const createNewFile = useCallback(
  //   (type) => {
  //     const path = generateNewName(type);
  //     path.unnamed = undefined;
  //     openFile(path, DefaultEditorCode);
  //   },
  //   [generateNewName, openFile]
  // );
  // const createFile = useCallback(
  //   (type) => {
  //     const path = generateNewName(type);
  //     openFile(path, DefaultEditorCode);
  //   },
  //   [generateNewName, openFile]
  // );

  // // handle check draft
  // useEffect(() => {
  //   if (!files) {
  //     return;
  //   }

  //   checkDrafts();
  //   checkHasCodeChange();
  // }, [files]);

  // const checkDrafts = () => {
  //   files.forEach(async (f) => {
  //     if (!f?.name) return;

  //     const widgetSrc = `${accountId}/widget/${f?.name}/**`;
  //     const widgetCode = await loadCodeFormNear(widgetSrc);

  //     const mainCode = widgetCode?.[""];
  //     const draft = widgetCode?.branch?.draft?.[""];
  //     const isDraft = (!draft && !mainCode) || draft;
  //     const path = f;

  //     setFilesDetails(
  //       filesDetails.set(f.name, {
  //         codeChangesPresent: filesDetails.get(f.name)?.codeChangesPresent,
  //         isDraft,
  //       })
  //     );
  //   });
  // };

  // const checkHasCodeChange = () => {
  //   files.forEach(async (f) => {
  //     if (!f?.name) return;

  //     const widgetSrc = `${accountId}/widget/${f.name}/**`;

  //     const widgetCode = await loadCodeFormNear(widgetSrc);

  //     // console.log(f, "widgetCode : ", widgetCode);

  //     const mainCode = widgetCode?.[""];

  //     const draft = widgetCode?.branch?.draft?.[""];
  //     const path = f;

  //     cache
  //       .asyncLocalStorageGet(StorageDomain, {
  //         path,
  //         type: StorageType.Code,
  //       })
  //       .then(({ code }) => {
  //         let hasCodeChanged;
  //         if (draft) {
  //           hasCodeChanged = draft != code;
  //         } else if (mainCode) {
  //           hasCodeChanged = mainCode != code;
  //         } else {
  //           // no code on chain
  //           hasCodeChanged = true;
  //         }
  //         setFilesDetails(
  //           filesDetails.set(f.name, {
  //             codeChangesPresent: hasCodeChanged,
  //             isDraft: filesDetails.get(f.name)?.isDraft,
  //           })
  //         );
  //       });
  //   });
  // };

  // // const showEditor = !(files?.length === 1 && files[0]?.unnamed === true);
  // const widgetName = path?.name?.split("/")[0];

  return (
    <>
      {/* <EmptyEditorDialog
        showEditor={showEditor}
        setShowAddModal={setShowAddModal}
        setShowOpenModal={setShowOpenModal}
        createNewFile={createNewFile}
        Filetype={Filetype}
      />

      <RenameDialog
        key={`rename-modal-${JSON.stringify(path)}`}
        show={showRenameModal}
        name={path?.name}
        onRename={(newName) => renameFile(newName, code)}
        onHide={() => setShowRenameModal(false)}
      />
      <OpenWidgetDialog
        show={showOpenModal}
        onOpen={(newName) => loadFile(newName)}
        onHide={() => setShowOpenModal(false)}
      />
      <AddModal
        show={showAddModal}
        onOpen={() => (setShowAddModal(false), setShowOpenModal(true))}
        onNew={() => (
          setShowAddModal(false),
          setShowRenameModal(true),
          createNewFile(Filetype.Widget)
        )}
        onHide={() => setShowAddModal(false)}
      />
      <CreateModal
        show={showCreateModal}
        onOpen={(newName) => loadFile(newName)}
        onNew={() => {
          createNewFile(Filetype.Widget);
        }}
        onHide={() => setShowCreateModal(false)}
      />
      <SaveDraftModal
        show={showSaveDraftModal}
        onHide={() => setShowSaveDraftModal(false)}
        near={near}
        widgetPath={widgetPath}
        widgetName={widgetName}
        code={code}
      /> */}

      {/* <PagesContainer {...props}> */}
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
        }}
      >
        <Activitybar {...props} />
        {/* <Box
          sx={{ display: "grid", gridTemplateColumns: "1fr 1px 2fr 1px 2fr" }}
        > */}

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
              <Box sx={{ height: "calc(100vh - 75px)", minHeight: 750 }}>
                <EditorContainer
                  // This is for props
                  theme={theme.name === "dark" ? "vs-dark" : "light"}
                  options={{
                    minimap: {
                      enabled: false,
                    },
                    wordWrap: "on",
                    fontSize: editorFontSize || "16px",
                  }}
                  value={code}
                  // path={widgetPath}
                  path={
                    path?.name
                      ? `${accountId}/${path?.type}/${path?.name}`
                      : `${accountId}/${lastPath?.type}/${lastPath?.name}`
                  }
                  defaultLanguage="javascript"
                  onChange={(code) => {
                    // {
                    //   type: Filetype.Widget,
                    //   name:
                    //     widgetPath?.indexOf("/") >= 0
                    //       ? widgetPath?.split("/")?.slice(2)?.join("/")
                    //       : widgetPath,
                    // },
                    updateCode(
                      path,
                      code,

                      "Editor"
                    );
                  }}
                  // wrapperProps={{
                  //   onBlur: () => reformat(path, code),
                  // }}
                />
              </Box>
            </Allotment.Pane>

            <Allotment.Pane>
              <Box>c</Box>
            </Allotment.Pane>
          </Allotment>
        </Box>
      </Box>
    </>
  );
}
