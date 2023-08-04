import {
  Box,
  ButtonBase,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNear } from "near-social-vm";

import { ThemeContext } from "../../../../context/ThemeContext";
import AddModal from "../../../../../components/Editor/AddModal";
import CreateModal from "../../../../../components/Editor/CreateModal";

import MyWidgets from "./_components/MyWidgets";
import OpenWidgets from "./_components/OpenWidgets";
import createFileTree from "../../../../libs/createFileTree";
import RenameDialog from "../../../../dialogs/RenameDialog";
import EmptyEditorDialog from "../../../../dialogs/EmptyEditorDialog";
import OpenWidgetDialog from "../../../../dialogs/OpenWidgetDialog";
import { SaveDraftModal } from "../../../../../components/SaveDraft";
import { Filetype } from "../../libs/editorInterfaces";
import { MyEditorContext } from "../../MyEditorContext";
import {
  CustomAccordion,
  CustomAccordionDetails,
  CustomAccordionSummary,
} from "../../../../components/custom/CustomAccordion";

export default function MyEditorSidebar(
  {
    // loadFile,
    // curPath,
    // openFile,
    // removeFromFiles,
    // createFile,
    // handleCreateButton,
    // setShowRenameModal,
    // setShowOpenModal,
  }
) {
  const near = useNear();
  const { theme } = useContext(ThemeContext);
  // const { files, filesDetails, lastPath } = useContext(EditorContext);

  const {
    loadFile,

    files,
    createNewFile,
    renameFile,
    lastPath: path,
    code,
    widgetName,
    widgetPath,
    createFile,
    removeFromFiles,
  } = useContext(MyEditorContext);

  useEffect(() => {
    files?.map((file) => {
      if (typeof file === "string") {
        removeFromFiles(file);
      }
    });
  }, [files]);

  const [openWidgetsExpanded, setOpenWidgetsExpanded] = useState([]);
  const [openWidgetsSelected, setOpenWidgetsSelected] = useState();

  const [projectFiles, setProjectFiles] = useState([]);

  // Memoize createFileTree function using useCallback
  const memoizedCreateFileTree = useCallback((files) => {
    return createFileTree(files);
  }, []);

  useEffect(() => {
    setProjectFiles([]);
    if (files.length > 0) {
      setProjectFiles(memoizedCreateFileTree(files));
    }
  }, [files, memoizedCreateFileTree]);

  // useEffect(() => { setOpenWidgetsExpanded([3, 2, 1]) }, []);

  //
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showSaveDraftModal, setShowSaveDraftModal] = useState(false);
  //
  return (
    <>
      <div
        style={{
          // height: "100%",
          height: "max(calc(100vh - 25px), 700px)",
          overflowY: "auto",
          paddingBottom: 25,

          backgroundColor: theme.ui,
        }}
      >
        <div
          style={{
            height: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingInline: 10,
            borderBottom: `1px solid ${theme.borderColor}`,
          }}
        >
          <Typography variant="h6" sx={{ color: theme.textColor }}>
            Widgets
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Add new file">
              <IconButton
                onClick={() => {
                  createNewFile(Filetype.Widget);
                  setShowRenameModal(true);
                }}
              >
                <NoteAddRoundedIcon
                  sx={{ fontSize: "1.25rem", fill: theme.textColor3 }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </div>

        {/* EDITING THIS */}

        <CustomAccordion>
          <CustomAccordionSummary
            aria-controls="panel1d-content"
            id="panel1d-header"
            sx={{ backgroundColor: theme.backgroundColor }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
              Open Widgets
            </Typography>
          </CustomAccordionSummary>

          <CustomAccordionDetails sx={{ backgroundColor: theme.ui }}>
            {projectFiles?.length > 0 ? (
              <OpenWidgets
                openWidgetsExpanded={openWidgetsExpanded}
                setOpenWidgetsExpanded={setOpenWidgetsExpanded}
                openWidgetsSelected={openWidgetsSelected}
                setOpenWidgetsSelected={setOpenWidgetsSelected}
                projectFiles={projectFiles}
                setShowRenameModal={setShowRenameModal}
              />
            ) : (
              <ButtonBase
                sx={{
                  fontSize: 14,
                  textTransform: "none",
                  width: "100%",
                  py: 4,
                }}
                onClick={() => {
                  createNewFile(Filetype.Widget);
                  setShowRenameModal(true);
                }}
              >
                You don't have any widgets yet. <br />
                Click here to create one.
              </ButtonBase>
            )}
          </CustomAccordionDetails>
        </CustomAccordion>

        <MyWidgets
          loadFile={loadFile}
          //
          projectFiles={projectFiles}
          openWidgetsExpanded={openWidgetsExpanded}
          setOpenWidgetsExpanded={setOpenWidgetsExpanded}
          openWidgetsSelected={openWidgetsSelected}
          setOpenWidgetsSelected={setOpenWidgetsSelected}
        />
      </div>

      <EmptyEditorDialog
        // showEditor={showEditor}
        showEditor={!(files?.length === 1 && files[0]?.unnamed === true)}
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
      />
    </>
  );
}
