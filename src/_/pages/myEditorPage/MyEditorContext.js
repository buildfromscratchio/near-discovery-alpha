import { createTheme } from "@mui/material";
import React, { useState, createContext, useCallback } from "react";
import { useMediaQuery } from "@mui/material";
import { useAccountId, useNear, useCache } from "near-social-vm";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  DefaultEditorCode,
  Filetype,
  StorageDomain,
  StorageType,
} from "./libs/editorInterfaces";
import { useDebouncedCallback } from "use-debounce";
import { useHistory } from "react-router-dom";

export const MyEditorContext = createContext();

export const MyEditorContextProvider = (props) => {
  const near = useNear();
  const cache = useCache();
  const accountId = useAccountId();
  const { widgetSrc } = useParams();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  // widgets array
  const [myWidgets, setMyWidgets] = useState([]);
  const [files, setFiles] = useState([]); // const [openWidgets, setOpenWidgets] = useState([]);
  const [filesDetails, setFilesDetails] = useState(new Map()); // const [openWidgetsDetails, setOpenWidgetsDetails] = useState(new Map());

  // start of current code
  const [lastPath, setLastPath] = useState(undefined);
  const [code, setCode] = useState(undefined);
  const [metadata, setMetadata] = useState(undefined);
  const [codeChangesPresent, setCodeChangesPresent] = useState(false);
  const [path, setPath] = useState(undefined); // THis is the current path

  // const [widgetPath, setWidgetPath] = useState();
  // end of current code

  useEffect(() => {
    if (accountId) {
      loadMyWidgets();
    }
  }, [accountId]);

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

    console.log("myWidgets : ", widgets);
    setMyWidgets(widgets);
  };
  // End of getting my widgets

  // Start of getting open widgets form local storage
  useEffect(() => {
    // Reding Files and Last open files from cache
    cache
      .asyncLocalStorageGet(StorageDomain, { type: StorageType.Files })
      .then((value) => {
        const { files, lastPath } = value || {};
        setFiles(files || []);

        if (widgetSrc) {
          if (widgetSrc === "new") {
            createFileTree(Filetype.Widget);
          } else {
            loadFile(widgetSrc);
            // setWidgetPath(widgetSrc);
          }

          console.log("widgetSrc : ", widgetSrc);
        } else if (lastPath) {
          // setWidgetPath(`${accountId}/${lastPath.type}/${lastPath.name}`);
          setLastPath(lastPath);
          console.log("lastPath : ", lastPath);
          openFile(lastPath);
        }
      });
  }, [cache, widgetSrc]);
  // End of getting open widgets form local storage

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

  // Start of handle file menupolations (create, open, rename, remove)
  // Add to files
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

  const toPath = useCallback((type, nameOrPath) => {
    const name =
      nameOrPath.indexOf("/") >= 0
        ? nameOrPath.split("/").slice(2).join("/")
        : nameOrPath;
    return { type, name };
  }, []);

  // handle create file
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

  // loadFile
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
  const loadFile = useCallback(
    async (nameOrPath) => {
      let widgetSrc =
        nameOrPath.indexOf("/") >= 0
          ? nameOrPath
          : `${accountId}/widget/${nameOrPath}`;

      const widget = `${widgetSrc}/**`;

      const code = await loadCodeFormNear(widget);

      const mainCode = code?.[""];
      const draftCode = code?.branch?.draft?.[""];
      const currentCode = draftCode || mainCode;

      const file = {
        type: Filetype.Widget,
        name:
          nameOrPath?.indexOf("/") >= 0
            ? nameOrPath?.split("/")?.slice(2)?.join("/")
            : nameOrPath,
      };

      console.log("loadFile : ", file, currentCode?.length);

      openFile(file, currentCode);
      setCode(currentCode);
      // setLastPath(path);
    },
    [accountId, openFile, toPath, near, cache]
  );

  // Open File
  const openFile = useCallback(
    (path, code) => {
      setCodeChangesPresent(true);
      setPath(path);
      addToFiles(path);
      setMetadata(undefined);

      if (code !== undefined) {
        updateCode(path, code, "openFile -> has Code");
        setCode(code);

        console.log("openFile -> has Code", path, code?.length);

        // history.replace(`/editorBeta`);

        setLoading(false);
      } else {
        setLoading(true);

        cache
          .asyncLocalStorageGet(StorageDomain, {
            path: path.name,
            type: StorageType.Code,
          })
          .then((value) => {
            const { code } = value || {};
            // setCode(code);

            console.log(
              "openFile -> loading for localStorage: ",
              path,
              code?.length,
              value
            );
            if (code)
              updateCode(path, code, "openFile -> loading for localStorage");
            setCode(code);

            setLoading(false);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    [updateCode, addToFiles]
  );

  // handle create file
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
      setCode(code);
    },
    [path, toPath, updateCode]
  );

  // handle remove file
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

  // End of handle file menupolations (open, rename, remove)

  // updateCode
  const updateCode = useDebouncedCallback(
    (path, thisCode, sender) => {
      console.log(
        sender,
        " : updateCode : ",
        path,
        thisCode && thisCode.slice(0, 50)
      );

      cache.localStorageSet(
        StorageDomain,
        {
          // path: lastPath,
          path: path.name,
          type: StorageType.Code,
        },
        {
          code: thisCode,
          time: Date.now(),
        }
      );
      // if (!code || code?.length <= 0) {
      //   console.log("Ading initial code...");
      //   setCode(thisCode);
      // }

      if (widgetSrc?.length > 0) {
        history.replace(`/myEditor`);
      }
    },
    // Delay in ms
    100
  );

  const value = {
    myWidgets,

    files,
    setFiles,
    filesDetails,
    setFilesDetails,
    lastPath,
    setLastPath,
    path,
    setPath,

    //
    createFile,
    createNewFile,
    openFile,
    loadFile,
    renameFile,
    removeFromFiles,

    updateCode,
    // widgetPath,

    code,
    setCode,
  };

  return (
    <MyEditorContext.Provider value={value}>
      {props.children}
    </MyEditorContext.Provider>
  );
};

export default MyEditorContextProvider;
