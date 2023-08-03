import React, { useState, createContext, useContext } from "react";
import { useAccountId, useNear, useCache, CommitButton } from "near-social-vm";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { DefaultEditorCode, Filetype } from "./libs/editorInterfaces";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import { useHistory } from "react-router-dom";
import useLocalStorage from "use-local-storage";

import prettier from "prettier";
import parserBabel from "prettier/parser-babel";
import { ThemeContext } from "../../context/ThemeContext";
import httpClient from "../../libs/httpClient";
import { EditorContext } from "../../context/EditorContext";
import ReactGA from "react-ga4";
import { useSnackbar } from "notistack";

export const MyEditorContext = createContext();

export const MyEditorContextProvider = (props) => {
  const near = useNear();
  const cache = useCache();
  const accountId = useAccountId();
  const { widgetSrc } = useParams();
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();

  const { theme } = useContext(ThemeContext);
  const { NetworkId } = useContext(EditorContext);

  const [loading, setLoading] = useState(false);

  const [showEditor, setShowEditor] = useState(true);
  const [showPreview, setShowPreview] = useState(true);

  // widgets array
  const [myWidgets, setMyWidgets] = useState([]);

  const [code, setCode] = useState(undefined);
  const [renderCode] = useDebounce(code, 500);
  const [metadata, setMetadata] = useState(undefined);
  // const [code, setCode] = useLocalStorage(lastPath?.name, "");

  const [showConsole, setShowConsole] = useState(false);
  const [logs, setLogs] = useState([]);

  const [lastPath, setLastPath] = useLocalStorage("lastPath", "");
  const [openWidgets, setOpenWidgets] = useLocalStorage("openWidgets", []); //const [files, setFiles] = useState([]);
  const [filesDetails, setFilesDetails] = useState([]);

  // const [openWidgetsDetails, setOpenWidgetsDetails] = useState(new Map()); // const [filesDetails, setFilesDetails] = useState(new Map());

  // start of current code
  const [path, setPath] = useState(undefined); // THis is the current path

  // end of current code

  useEffect(() => {
    if (accountId) {
      loadMyWidgets();
    }
  }, [accountId]);

  useEffect(() => {
    if (widgetSrc) {
      if (widgetSrc === "new") {
        createFileTree(Filetype.Widget);
      } else {
        console.log("widgetSrc", widgetSrc);
        // loadFile(widgetSrc);

        loadCodeFormNear(widgetSrc)
          .then((code) => {
            setCode(code);

            const fileToOpen = {
              name: widgetSrc.split("/")[2],
              type: Filetype.Widget,
            };

            localStorage.setItem(fileToOpen?.name, JSON.stringify(code));
            setLastPath(fileToOpen);

            setOpenWidgets((prevData) =>
              prevData.some((item) => item.name === fileToOpen.name)
                ? prevData
                : [...prevData, fileToOpen]
            );

            if (widgetSrc?.length > 0) {
              history.replace(`/myEditor`);
            }
          })
          .catch((err) => {
            console.log("err", err);
          });
      }
    } else if (lastPath) {
      if (lastPath) {
        setLogs([]);
        loadFile(lastPath);
        // console.log("lastPath", lastPath);
      }
    }
  }, [widgetSrc, lastPath]);

  // Start of getting my widgets
  const myWidgetsFormNear = () => {
    return new Promise((resolve, reject) => {
      const code = cache.socialGet(near, `${accountId}/widget/*`);

      if (code) {
        resolve(code);
      } else {
        setTimeout(() => {
          myWidgetsFormNear().then((code) => {
            resolve(code);
          });
        }, 250);
      }
    });
  };
  const loadMyWidgets = async () => {
    const widgets = await myWidgetsFormNear();
    setMyWidgets(widgets);
  };
  // End of getting my widgets

  const loadFile = (path) => {
    // console.log("loadFile", path);
    let alreadyOpenWidget;

    openWidgets?.map((widget) => {
      if (widget?.name === path?.name || widget?.name === path) {
        alreadyOpenWidget = widget;
      }
    });

    if (alreadyOpenWidget) {
      openFile(alreadyOpenWidget);
      // console.log("alreadyOpenWidget", alreadyOpenWidget);
    } else {
      // console.log("else", path, " - ", myWidgets);
      Object.entries(myWidgets)?.map(([key, value]) => {
        if (key === path) {
          const newFile = { name: key, type: Filetype.Widget };

          setCode(value);
          localStorage.setItem(key, JSON.stringify(value));

          setLastPath(newFile);
          setOpenWidgets((e) => [...e, newFile]);
        }
      });
    }
  };

  const loadCodeFormNear = (path) => {
    return new Promise((resolve, reject) => {
      const code = cache.socialGet(near, path);
      if (code) {
        resolve(code);
      } else {
        setTimeout(() => {
          loadCodeFormNear(path).then((code) => {
            resolve(code);
          });
        }, 250);
      }
    });
  };

  const openFile = (path) => {
    // console.log("openFile", path);
    setLastPath(path);

    const c = localStorage.getItem(path?.name) || "";
    const parseC = isJSON(c);

    if (!parseC) {
      setCode(c);
    } else {
      setCode(reformat(parseC) || parseC);
    }
  };

  const createNewFile = () => {
    // console.log("createNewFile");

    const newFile = generateNewName(Filetype.Widget, openWidgets);

    setLastPath(newFile);
    setOpenWidgets((e) => [...e, newFile]);
    localStorage.setItem(newFile?.name, DefaultEditorCode);
  };

  // handle create file
  const renameFile = (newName, code) => {
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
    setCode(code);
  };

  // handle remove file
  const removeFromFiles = (path) => {
    setOpenWidgets((files) => files.filter((file) => file.name !== path?.name));

    localStorage.removeItem(path?.name);
  };

  // Function to get the code from localStorage
  const getCodeFromLocalStorage = (widgetName) => {
    return isJSON(localStorage.getItem(widgetName));
  };

  // Function to categorize open widgets into "My Code" and "Draft Code"
  const categorizeWidgets = () => {
    const categorizedWidgets = openWidgets.map((widget) => {
      const isDraft = !myWidgets.hasOwnProperty(widget.name);
      const codeFromLocalStorage = getCodeFromLocalStorage(widget.name);
      const codeChangesPresent =
        myWidgets[widget.name] !== codeFromLocalStorage;

      return {
        ...widget,
        isDraft,
        codeChangesPresent,
      };
    });

    setLoading(false);

    return categorizedWidgets;
  };

  useEffect(() => {
    setLoading(true);
    const categorizedWidgets = categorizeWidgets();
    setFilesDetails(categorizedWidgets);
    console.log("filesDetails", filesDetails);
  }, [openWidgets, myWidgets]);

  const updateCode = useDebouncedCallback((path, code, label) => {
    setLoading(true);
    localStorage.setItem(path?.name, JSON.stringify(code));

    filesDetails?.map((file) => {
      if (file?.name === path?.name) {
        file.codeChangesPresent = true;
      }
    });

    setFilesDetails(filesDetails);
    setLoading(false);
  }, 500);

  // Handle submit
  const PublishDraftAsMainButton = () => (
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
      // disabled={!widgetName}
      disabled={!(path?.name || lastPath?.name)}
      near={near}
      data={{
        widget: {
          [path?.name || lastPath?.name]: {
            "": code,
            metadata,
            branch: {
              draft: null,
            },
          },
        },
      }}
      onCommit={() => {
        handleAddCmponentAnalysis();
      }}
    >
      Publish
    </CommitButton>
  );

  const PublishButton = () => (
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
      disabled={!(path?.name || lastPath?.name)}
      near={near}
      data={{
        widget: {
          [path?.name || lastPath?.name]: {
            "": code,
            metadata,
          },
        },
      }}
      onCommit={() => {
        handleAddCmponentAnalysis();
      }}
    >
      Publish
    </CommitButton>
  );

  const handleAddCmponentAnalysis = () => {
    httpClient()
      .post("/cmponentAnalysis", {
        source: `${accountId}/widget/${path?.name || lastPath?.name}`,
        network: NetworkId,
      })
      .then((res) => {
        console.log("Analysis Done");
        ReactGA.event({
          category: "Click",
          action: "Publish",
          label: "widgetName",
          value: path?.name || lastPath?.name,
        });
      })
      .catch((err) => {
        console.log("Analysis Faild : ", err);
      });
  };

  const [saveNow, setSaveNow] = useState(false);

  useEffect(() => {
    if (saveNow) {
      handleOnSaveButtonPress();
      setSaveNow(false);
    }
  }, [saveNow]);

  const handleOnSaveButtonPress = () => {
    const myFormet = (code) => {
      try {
        const formattedCode = prettier.format(code, {
          parser: "babel",
          plugins: [parserBabel],
        });

        return formattedCode;
      } catch (e) {
        return { error: e };
      }
    };

    const formattedCode = myFormet(code);
    if (formattedCode.error) {
      enqueueSnackbar(`${formattedCode.error}`, {
        variant: "error",
      });
      return;
    } else {
      enqueueSnackbar("Code reformated.", { variant: "info" });
      setCode(formattedCode);
      updateCode(path, formattedCode);
    }

    // document.getElementById("publishButton")?.click();
    // document.getElementById("publishDraftAsMainButton")?.click();
  };

  // Handle Ctrl+S key defoult begabire
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault(); // Prevent default browser Save action
        console.log("Custom action on Ctrl+S");
        setSaveNow(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const value = {
    loading,
    showEditor,
    setShowEditor,
    showPreview,
    setShowPreview,
    //
    files: openWidgets,
    filesDetails,
    myWidgets,

    code,
    setCode,
    renderCode,
    setMetadata,
    openFile,
    loadFile,
    formatCode: handleOnSaveButtonPress,

    lastPath,
    createNewFile,
    renameFile,
    removeFromFiles,

    updateCode,

    // Logs
    showConsole,
    setShowConsole,
    logs,
    setLogs,

    //
    PublishDraftAsMainButton,
    PublishButton,
  };

  return (
    <MyEditorContext.Provider value={value}>
      {props.children}
    </MyEditorContext.Provider>
  );
};

export default MyEditorContextProvider;

const generateNewName = (type, openWidgets) => {
  for (let i = 0; ; i++) {
    const name = `Untitled-${i}`;

    const path = {
      type,
      name,
      unnamed: undefined,
    };

    if (!openWidgets?.find((file) => file.name === name)) {
      return path;
    }
  }
};

export const reformat = (code) => {
  try {
    const formattedCode = prettier.format(code, {
      parser: "babel",
      plugins: [parserBabel],
    });

    return formattedCode;
    // updateCode(path, formattedCode);
  } catch (e) {
    console.log(e);
  }
};

export const isJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return false;
  }
};
