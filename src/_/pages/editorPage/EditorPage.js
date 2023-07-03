import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import ls from "local-storage";
import prettier from "prettier";
import parserBabel from "prettier/parser-babel";
import { useHistory, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import ReactGA from "react-ga4";
import {
  Widget,
  useCache,
  useNear,
  CommitButton,
  useAccountId,
} from "near-social-vm";
import AddModal from "../../../components/Editor/AddModal";
import CreateModal from "../../../components/Editor/CreateModal";
import { SaveDraftModal } from "../../../components/SaveDraft";

import { Box } from "@mui/material";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

import Activitybar from "../../components/Activitybar";
import WidgetViewContainer from "./_components/widgetViewContainer/WidgetViewContainer";
import EmptyEditorDialog from "../../dialogs/EmptyEditorDialog";
import { EditorContext } from "../../context/EditorContext";

import { ThemeContext } from "../../context/ThemeContext";
import RenameDialog from "../../dialogs/RenameDialog";
import { useDebouncedCallback } from "use-debounce";
import OpenWidgetDialog from "../../dialogs/OpenWidgetDialog";
import Tabsbar from "./_components/Tabsbar";
import Sidebar from "../../components/sidebar/Sidebar";

const StorageDomain = {
  page: "editor",
};

const StorageType = {
  Code: "code",
  Files: "files",
};

const Filetype = {
  Widget: "widget",
  Module: "module",
};

const LsKey = "social.near:v01:";
const EditorLayoutKey = LsKey + "editorLayout:";
const WidgetPropsKey = LsKey + "widgetProps:";

const DefaultEditorCode = "return <div>Hello World</div>;";

const Tab = {
  Editor: "Editor",
  Props: "Props",
  Metadata: "Metadata",
  Widget: "Widget",
};

const Layout = {
  Tabs: "Tabs",
  Split: "Split",
};

export default function EditorPage(props) {
  const { theme, editorFontSize, bp } = useContext(ThemeContext);
  const {
    allowTheming,

    selectedActivity,
    setSelectedActivity,
    showWebsiteView,

    files,
    setFiles,
    filesDetails,
    setFilesDetails,
    lastPath,
    setLastPath,

    calculateGasFee,

    showLiveCodePreview,
  } = useContext(EditorContext);

  const debouncedFunction = useDebouncedCallback(
    () => {
      // Your function here
      if (code) handlePreviewButton();
    },
    // Delay in ms
    500
  );
  // END OF _ CODES

  const { widgetSrc } = useParams();
  const history = useHistory();
  const setWidgetSrc = props.setWidgetSrc;

  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(undefined);
  const [path, setPath] = useState(undefined);
  // const [files, setFiles] = useState(undefined);
  // const [lastPath, setLastPath] = useState(undefined);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showSaveDraftModal, setShowSaveDraftModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [renderCode, setRenderCode] = useState(code);
  const [widgetProps, setWidgetProps] = useState(
    ls.get(WidgetPropsKey) || "{}"
  );
  const [parsedWidgetProps, setParsedWidgetProps] = useState({});
  const [propsError, setPropsError] = useState(null);
  const [metadata, setMetadata] = useState(undefined);
  const [codeChangesPresent, setCodeChangesPresent] = useState(false);
  const [codeOnChain, setCodeOnChain] = useState(null);
  const [draftOnChain, setDraftOnChain] = useState(null);
  // const [filesDetails, setFilesDetails] = useState(new Map());
  const near = useNear();
  const cache = useCache();
  const accountId = useAccountId();

  const [tab, setTab] = useState(Tab.Editor);
  const [layout, setLayoutState] = useState(
    ls.get(EditorLayoutKey) || Layout.Tabs
  );

  const setLayout = useCallback(
    (layout) => {
      ls.set(EditorLayoutKey, layout);
      setLayoutState(layout);
    },
    [setLayoutState]
  );

  useEffect(() => {
    setSelectedActivity("widgets");
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  useEffect(() => {
    setWidgetSrc({
      edit: null,
      view: widgetSrc,
    });
  }, [widgetSrc, setWidgetSrc]);

  const updateCode = useCallback(
    (path, code) => {
      cache.localStorageSet(
        StorageDomain,
        {
          path,
          type: StorageType.Code,
        },
        {
          code,
          time: Date.now(),
        }
      );
      setCode(code);
    },
    [cache, setCode]
  );

  useEffect(() => {
    const widgetSrc = `${accountId}/widget/${widgetName}/**`;
    const fetchCodeAndDraftOnChain = () => {
      const widgetCode = cache.socialGet(
        near,
        widgetSrc,
        false,
        undefined,
        undefined,
        fetchCodeAndDraftOnChain
      );

      setCodeOnChain(widgetCode?.[""]);
      setDraftOnChain(widgetCode?.branch?.draft?.[""]);
    };
    fetchCodeAndDraftOnChain();
  }, [code]);

  useEffect(() => {
    let hasCodeChanged;
    if (draftOnChain) {
      hasCodeChanged = draftOnChain != code;
    } else if (codeOnChain) {
      hasCodeChanged = codeOnChain != code;
    } else {
      // no code on chain
      hasCodeChanged = true;
    }
    setCodeChangesPresent(hasCodeChanged);
  }, [code, codeOnChain, draftOnChain]);

  const checkDrafts = () => {
    files.forEach((f) => {
      if (!f?.name) return;

      const widgetSrc = `${accountId}/widget/${f?.name}/**`;
      const fetchCodeAndDraftOnChain = () => {
        const widgetCode = cache.socialGet(
          near,
          widgetSrc,
          false,
          undefined,
          undefined,
          fetchCodeAndDraftOnChain
        );

        const mainCode = widgetCode?.[""];
        const draft = widgetCode?.branch?.draft?.[""];
        const isDraft = (!draft && !mainCode) || draft;
        const path = f;

        setFilesDetails(
          filesDetails.set(f.name, {
            codeChangesPresent: filesDetails.get(f.name)?.codeChangesPresent,
            isDraft,
          })
        );
      };
      fetchCodeAndDraftOnChain();
    });
  };

  const checkHasCodeChange = () => {
    files.forEach((f) => {
      if (!f?.name) return;

      const widgetSrc = `${accountId}/widget/${f.name}/**`;
      const fetchCodeAndDraftOnChain = () => {
        const widgetCode = cache.socialGet(
          near,
          widgetSrc,
          false,
          undefined,
          undefined,
          fetchCodeAndDraftOnChain
        );

        const mainCode = widgetCode?.[""];

        const draft = widgetCode?.branch?.draft?.[""];
        const path = f;

        cache
          .asyncLocalStorageGet(StorageDomain, {
            path,
            type: StorageType.Code,
          })
          .then(({ code }) => {
            let hasCodeChanged;
            if (draft) {
              hasCodeChanged = draft != code;
            } else if (mainCode) {
              hasCodeChanged = mainCode != code;
            } else {
              // no code on chain
              hasCodeChanged = true;
            }
            setFilesDetails(
              filesDetails.set(f.name, {
                codeChangesPresent: hasCodeChanged,
                isDraft: filesDetails.get(f.name)?.isDraft,
              })
            );
          });
      };
      fetchCodeAndDraftOnChain();
    });
  };

  const checkHasCodeChangeSingleFile = (code) => {
    const widgetSrc = `${accountId}/widget/${widgetName}/**`;
    const fetchCodeAndDraftOnChain = () => {
      const widgetCode = cache.socialGet(
        near,
        widgetSrc,
        false,
        undefined,
        undefined,
        fetchCodeAndDraftOnChain
      );

      const mainCode = widgetCode?.[""];
      const draft = widgetCode?.branch?.draft?.[""];
      let hasCodeChanged;
      if (draft) {
        hasCodeChanged = draft != code;
      } else if (mainCode) {
        hasCodeChanged = mainCode != code;
      } else {
        // no code on chain
        hasCodeChanged = true;
      }
      setFilesDetails(
        filesDetails.set(widgetName, {
          codeChangesPresent: hasCodeChanged,
          isDraft: filesDetails.get(widgetName)?.isDraft,
        })
      );
    };
    fetchCodeAndDraftOnChain();
  };

  useEffect(() => {
    if (!files) {
      return;
    }

    checkDrafts();
    checkHasCodeChange();
  }, [files]);

  useEffect(() => {
    checkHasCodeChangeSingleFile(code);
  }, [code]);

  useEffect(() => {
    ls.set(WidgetPropsKey, widgetProps);
    try {
      const parsedWidgetProps = JSON.parse(widgetProps);
      setParsedWidgetProps(parsedWidgetProps);
      setPropsError(null);
    } catch (e) {
      setParsedWidgetProps({});
      setPropsError(e.message);
    }
  }, [widgetProps]);

  const removeFromFiles = useCallback(
    (path) => {
      // console.log("Removing ", path);
      path = JSON.stringify(path);
      setFiles((files) =>
        files.filter((file) => JSON.stringify(file) !== path)
      );
      setLastPath(path);
    },
    [setFiles, setLastPath]
  );

  const addToFiles = useCallback(
    (path) => {
      if (!path) return;

      const jpath = JSON.stringify(path);
      setFiles((files) => {
        const newFiles = [...files];
        if (!files.find((file) => JSON.stringify(file) === jpath)) {
          newFiles.push(path);
        }
        return newFiles;
      });
      setLastPath(path);
    },
    [setFiles, setLastPath]
  );

  useEffect(() => {
    if (files && lastPath) {
      cache.localStorageSet(
        StorageDomain,
        {
          type: StorageType.Files,
        },
        { files, lastPath }
      );
    }
  }, [files, lastPath, cache]);

  const openFile = useCallback(
    (path, code) => {
      setCodeChangesPresent();
      setPath(path);
      addToFiles(path);
      setMetadata(undefined);
      setRenderCode(null);
      if (code !== undefined) {
        updateCode(path, code);
        // Automatically render the code on first click
        setRenderCode(code);
        setLoading(false);
      } else {
        setLoading(true);
        cache
          .asyncLocalStorageGet(StorageDomain, {
            path,
            type: StorageType.Code,
          })
          .then(({ code }) => {
            // console.log(code);
            updateCode(path, code);
            // Automatically render the code on first click
            setRenderCode(code);
          })
          .finally(() => {
            setLoading(false);
          });
      }

      // if (path) history.push(`/editor/${accountId}/widget/${path.name}`);
    },
    [updateCode, addToFiles]
  );

  const toPath = useCallback((type, nameOrPath) => {
    const name =
      nameOrPath.indexOf("/") >= 0
        ? nameOrPath.split("/").slice(2).join("/")
        : nameOrPath;
    return { type, name };
  }, []);

  const openDraft = useCallback(
    (widgetName) => {
      if (!near) {
        return;
      }
      const widgetSrc = `${accountId}/widget/${widgetName}/branch/draft`;

      const c = () => {
        const draftCode = cache.socialGet(
          near,
          widgetSrc,
          false,
          undefined,
          undefined,
          c
        );
        openFile(toPath(Filetype.Widget, widgetSrc), draftCode || code);
      };

      c();
    },
    [accountId, openFile, toPath, near, cache]
  );

  const loadFile = useCallback(
    (nameOrPath) => {
      if (!near) {
        return;
      }

      let widgetSrc =
        nameOrPath.indexOf("/") >= 0
          ? nameOrPath
          : `${accountId}/widget/${nameOrPath}`;

      const widget = `${widgetSrc}/**`;

      const c = () => {
        const code = cache.socialGet(
          near,
          widget,
          false,
          undefined,
          undefined,
          c
        );

        const mainCode = code?.[""];
        const draftCode = code?.branch?.draft?.[""];
        const currentCode = draftCode || mainCode;

        if (currentCode) {
          // console.log(
          //   "Opening file from loadFile currentCode",

          //   Filetype.Widget,
          //   widgetSrc
          // );
          openFile(toPath(Filetype.Widget, widgetSrc), currentCode);
        }
      };

      c();
    },
    [accountId, openFile, toPath, near, cache]
  );

  const generateNewName = useCallback(
    (type) => {
      for (let i = 0; ; i++) {
        const name = `Untitled-${i}`;
        const path = toPath(type, name);
        path.unnamed = true;
        const jPath = JSON.stringify(path);
        if (!files?.find((file) => file.name === name)) {
          return path;
        }
      }
    },
    [toPath, files]
  );

  const createNewFile = useCallback(
    (type) => {
      const path = generateNewName(type);
      path.unnamed = undefined;
      openFile(path, DefaultEditorCode);
    },
    [generateNewName, openFile]
  );

  const createFile = useCallback(
    (type) => {
      const path = generateNewName(type);
      openFile(path, DefaultEditorCode);
    },
    [generateNewName, openFile]
  );

  const renameFile = useCallback(
    (newName, code) => {
      const newPath = toPath(path.type, newName);
      const jNewPath = JSON.stringify(newPath);
      const jPath = JSON.stringify(path);
      setFiles((files) => {
        const newFiles = files.filter(
          (file) => JSON.stringify(file) !== jNewPath
        );
        const i = newFiles.findIndex((file) => JSON.stringify(file) === jPath);
        if (i >= 0) {
          newFiles[i] = newPath;
        }
        return newFiles;
      });
      setLastPath(newPath);
      setPath(newPath);
      updateCode(newPath, code);
    },
    [path, toPath, updateCode]
  );

  useEffect(() => {
    // Reding Files and Last open files from cache
    setLoading(true);
    cache
      .asyncLocalStorageGet(StorageDomain, { type: StorageType.Files })
      .then((value) => {
        const { files, lastPath } = value || {};
        setFiles(files || []);
        setLastPath(lastPath);
        setLoading(false);
        // console.log("files : ", files, "  lastPath : ", lastPath);
      });
  }, [cache]);

  useEffect(() => {
    if (!near || !files) {
      return;
    }
    if (widgetSrc) {
      if (widgetSrc === "new") {
        createFile(Filetype.Widget);
      } else {
        loadFile(widgetSrc);
      }
      // analytics("edit", {
      //   props: {
      //     widget: widgetSrc,
      //   },
      // });

      setTimeout(function () {
        console.log("Executed after 1 second");
        // history.push(`/editor/`);
        history.replace(`/editor/`);
      }, 1000);

      // history.replace(`/editor/`);
    } else if (path === undefined) {
      if (!loading) {
        if (files.length === 0) {
          createFile(Filetype.Widget);
        } else {
          openFile(lastPath, undefined);
        }
      }
    }

    // console.log({ lastPath }, { files }, { path }, { widgetSrc });
  }, [near, createFile, lastPath, files, path, widgetSrc, openFile, loadFile]);

  const reformat = useCallback(
    (path, code) => {
      try {
        const formattedCode = prettier.format(code, {
          parser: "babel",
          plugins: [parserBabel],
        });
        updateCode(path, formattedCode);
      } catch (e) {
        // console.log(e);
      }
    },
    [updateCode]
  );

  const reformatProps = useCallback(
    (props) => {
      try {
        const formattedProps = JSON.stringify(JSON.parse(props), null, 2);
        setWidgetProps(formattedProps);
      } catch (e) {
        // console.log(e);
      }
    },
    [setWidgetProps]
  );

  const layoutClass = layout === Layout.Split ? "col-lg-6" : "";

  const onLayoutChange = useCallback(
    (e) => {
      const layout = e.target.value;
      if (layout === Layout.Split && tab === Tab.Widget) {
        setTab(Tab.Editor);
      }
      setLayout(layout);
    },
    [setLayout, tab, setTab]
  );

  const widgetName = path?.name?.split("/")[0];
  const widgetPathName = path?.name;
  // const isDraft = path?.name?.split("/")[2] === "draft";

  const widgetPath = `${accountId}/${path?.type}/${path?.name}`;
  const jpath = JSON.stringify(path);

  const createOpenDraftButton = (
    <button
      className="btn btn-primary"
      onClick={(e) => {
        openDraft(widgetName);
      }}
    >
      Open a Draft Version
    </button>
  );

  const publishDraftAsMainButton = (
    <CommitButton
      id="publishDraftAsMainButton"
      className={`btn btn-primary`}
      style={{
        backgroundColor: theme.buttonColor,
        paddingInline: 16,
        borderRadius: 4,

        fontWeight: 500,
      }}
      //
      disabled={!widgetName}
      near={near}
      data={{
        widget: {
          [widgetName]: {
            "": code,
            metadata,
            branch: {
              draft: null,
            },
          },
        },
      }}
    >
      Publish
    </CommitButton>
  );

  const saveDraftButton = (
    <button
      className="btn btn-outline-primary me-2"
      disabled={!widgetName}
      onClick={(e) => {
        e.preventDefault();
        setShowSaveDraftModal(true);
      }}
    >
      Save Version
    </button>
  );
  const handleSaveDraftButton = (e) => {
    e.preventDefault();
    setShowSaveDraftModal(true);
  };

  const PublishButton = () => {
    ReactGA.event({
      category: "Click",
      action: "Publish",
      label: "widgetName",
      value: widgetName,
    });

    return (
      <CommitButton
        id="publishButton"
        className={`btn btn-primary`}
        style={{
          backgroundColor: theme.buttonColor,

          paddingInline: 16,
          borderRadius: 4,

          fontWeight: 500,
        }}
        //
        disabled={!widgetName}
        near={near}
        data={{
          widget: {
            [widgetName]: {
              "": code,
              metadata,
            },
          },
        }}
      >
        Publish
      </CommitButton>
    );
  };

  const renderPreviewButton = (
    <button
      className="btn btn-outline-primary"
      onClick={() => {
        setRenderCode(code);
        ReactGA.event({
          category: "Click",
          action: "Preview",
        });
      }}
    >
      Render Preview
    </button>
  );
  const handlePreviewButton = () => {
    setRenderCode(code);
    calculateGasFee(code);
    // if (layout === Layout.Tabs) {
    //   setTab(Tab.Widget);
    // }
  };

  const openCreateButton = (
    <button
      className="btn btn-success ms-2"
      onClick={() => setShowAddModal(true)}
      style={{
        fontSize: "20px",
        height: "40px",
        lineHeight: "38px",
        paddingTop: "0",
        marginTop: "0",
      }}
    >
      <i className="bi bi-plus"></i>
    </button>
  );

  const renameButton = (
    <button
      className="btn btn-outline-success ms-2"
      style={{ height: "40px" }}
      onClick={() => {
        setShowRenameModal(true);
      }}
    >
      <i className="bi bi-pen"></i>
    </button>
  );

  const openInNewTabButton = (
    <a
      className="btn me-2 btn-outline-secondary"
      style={{ height: "38px" }}
      href={`#/${widgetPath}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Open Component
    </a>
  );

  const forkButton = (
    <button
      className="btn btn-outline-primary me-2"
      onClick={() => {
        const forkName = widgetName + "-fork";
        openFile(toPath(Filetype.Widget, forkName), code);
        ReactGA.event({
          category: "Click",
          action: "Fork",
        });
      }}
    >
      Fork
    </button>
  );
  const handleForkButton = () => {
    const forkName = widgetName + "-fork";
    openFile(toPath(Filetype.Widget, forkName), code);
  };

  const showEditor = !(files?.length === 1 && files[0]?.unnamed === true);
  // const showEditor = false;

  return (
    <>
      {/* Dialog boxs - start */}
      <EmptyEditorDialog
        showEditor={showEditor}
        setShowAddModal={setShowAddModal}
        setShowOpenModal={setShowOpenModal}
        createNewFile={createNewFile}
        Filetype={Filetype}
      />

      <RenameDialog
        key={`rename-modal-${jpath}`}
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
      />
      {/* Dialog boxs - end */}

      <Box
        sx={{
          backgroundColor: theme.ui,
          height: "100vh",
          maxHeight: "calc(100vh - 25px)",
          minHeight: 750,
          width: "100%",

          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <Activitybar {...props} />
        {/* <VsCodeBanner /> */}

        {bp && selectedActivity && (
          <Box
            sx={{
              position: "absolute",
              backgroundColor: "red",
              zIndex: 9999,
              width: "calc(100% - 50px)",
              left: 50,
            }}
          >
            <Sidebar
              appProps={props}
              loadFile={loadFile}
              // For WidgetSidebar
              renameFile={renameFile}
              curPath={path}
              openFile={openFile}
              removeFromFiles={removeFromFiles}
              createFile={createFile}
              handleCreateButton={() => {
                // setShowAddModal(false),
                setShowRenameModal(true);
                createNewFile(Filetype.Widget);
              }}
              setShowRenameModal={setShowRenameModal}
              setShowOpenModal={setShowOpenModal}
              // For ProfileSidebar
              logOut={() => props.logOut()}
              requestSignIn={() => props.requestSignIn()}
            />
          </Box>
        )}

        <Allotment
          maxSize="100%"
          vertical={bp}
          // vertical={true}
          defaultSizes={[75, 200, 100]}
        >
          {!bp && (
            <Allotment.Pane
              key="activityBar"
              snap
              visible={selectedActivity?.length > 0 ? true : false}
              preferredSize={300}
              minSize={100}
              maxSize={450}
            >
              <Sidebar
                appProps={props}
                loadFile={loadFile}
                // For WidgetSidebar
                renameFile={renameFile}
                curPath={path}
                openFile={openFile}
                removeFromFiles={removeFromFiles}
                createFile={createFile}
                handleCreateButton={() => {
                  // setShowAddModal(false),
                  setShowRenameModal(true);
                  createNewFile(Filetype.Widget);
                }}
                setShowRenameModal={setShowRenameModal}
                setShowOpenModal={setShowOpenModal}
                // For ProfileSidebar
                logOut={() => props.logOut()}
                requestSignIn={() => props.requestSignIn()}
              />
            </Allotment.Pane>
          )}

          <Allotment.Pane minSize={300}>
            {/* 
              <Tabsbar
                curPath={path}
                openFile={openFile}
                removeFromFiles={removeFromFiles}
                createFile={createFile}
                handleCreateButton={() => {
                  // setShowAddModal(false),
                  setShowRenameModal(true);
                  createNewFile(Filetype.Widget);
                }}
              /> 
            */}

            <div>
              <Tabsbar
                widgets={props.widgets}
                Tab={Tab}
                tab={tab}
                setTab={setTab}
              />

              <div className={`${tab === Tab.Editor ? "" : "visually-hidden"}`}>
                <div
                  style={{
                    minHeight: 750,
                    height: "calc(100vh - 75px)",
                  }}
                >
                  <Editor
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
                    path={widgetPath}
                    defaultLanguage="javascript"
                    onChange={(code) => {
                      if (showLiveCodePreview) debouncedFunction();
                      updateCode(path, code);
                    }}
                    wrapperProps={{
                      onBlur: () => reformat(path, code),
                    }}
                  />
                </div>
              </div>

              <div className={`${tab === Tab.Props ? "" : "visually-hidden"}`}>
                <div
                  style={{
                    minHeight: 750,
                    height: "calc(100vh - 75px)",
                  }}
                >
                  <Editor
                    // This is for Component
                    theme={theme.name === "dark" ? "vs-dark" : "light"}
                    options={{
                      minimap: {
                        enabled: false,
                      },

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
                </div>
                {/* <div className=" mb-3">^^ Props for debugging (in JSON)</div> */}
                {propsError && (
                  <pre className="alert alert-danger">{propsError}</pre>
                )}
              </div>

              <div
                className={`${
                  tab === Tab.Metadata && props.widgets.widgetMetadataEditor
                    ? ""
                    : "visually-hidden"
                }`}
              >
                <div
                  style={{
                    paddingInline: 16,
                    minHeight: 750,
                    height: "calc(100vh - 75px)",
                  }}
                >
                  <Widget
                    src={props.widgets.widgetMetadataEditor}
                    key={`metadata-editor-${jpath}`}
                    props={useMemo(
                      () => ({
                        widgetPath,
                        onChange: setMetadata,
                      }),
                      [widgetPath]
                    )}
                  />
                </div>
              </div>

              <div
                className={`${
                  tab === Tab.Metadata ? layoutClass : "visually-hidden"
                }`}
              >
                <div style={{ padding: 10 }}>
                  <Widget
                    key={`metadata-${jpath}`}
                    src={props.widgets.widgetMetadata}
                    props={useMemo(
                      () => ({ metadata, accountId, widgetName }),
                      [metadata, accountId, widgetName]
                    )}
                  />
                </div>
              </div>
            </div>
          </Allotment.Pane>

          {showWebsiteView && (
            <WidgetViewContainer
              showWebsiteView={showWebsiteView}
              parsedWidgetProps={parsedWidgetProps}
              renderCode={renderCode}
              loading={loading}
              //
              handlePreviewButton={handlePreviewButton}
              handleSaveDraftButton={handleSaveDraftButton}
              handleForkButton={handleForkButton}
              publishWidgetButton={
                props.signedIn ? (
                  filesDetails.get(widgetName)?.isDraft ? (
                    publishDraftAsMainButton
                  ) : (
                    <PublishButton />
                  )
                ) : (
                  <button
                    className="btn btn-primary"
                    style={{
                      backgroundColor: theme.buttonColor,
                      paddingInline: 16,
                      borderRadius: 4,
                      fontWeight: 500,
                    }}
                    onClick={() => {
                      props.requestSignIn();
                      ReactGA.event({
                        category: "SignIn",
                        action: "signin",
                      });
                    }}
                  >
                    Connect
                  </button>
                )
              }
            />
          )}
        </Allotment>
      </Box>
    </>
  );
}
