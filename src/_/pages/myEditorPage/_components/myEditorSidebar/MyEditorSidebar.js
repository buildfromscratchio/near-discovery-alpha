import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNear } from "near-social-vm";

import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

import { ThemeContext } from "../../../../context/ThemeContext";
import { EditorContext } from "../../../../context/EditorContext";
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

        <Accordion defaultExpanded>
          <AccordionSummary
            aria-controls="panel1d-content"
            id="panel1d-header"
            sx={{ backgroundColor: theme.backgroundColor }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
              Open Widgets
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: theme.ui }}>
            <OpenWidgets
              openWidgetsExpanded={openWidgetsExpanded}
              setOpenWidgetsExpanded={setOpenWidgetsExpanded}
              openWidgetsSelected={openWidgetsSelected}
              setOpenWidgetsSelected={setOpenWidgetsSelected}
              //
              projectFiles={projectFiles}
              setShowRenameModal={setShowRenameModal}
              // createFile={createFile}
              // openFile={openFile}
              // curPath={curPath}
              // filesDetails={filesDetails}
              // removeFromFiles={removeFromFiles}
            />

            {/* {files?.map((file, index) => {
            // let file = typeof f === "string" ? JSON.parse(f) : f;
            // console.log("filex : ", file, " - ");

            if (!file) {
              console.log("File is undefined " + file);
              return;
            }

            if (typeof file === "string") return;

            if (file?.unnamed) {
              return;
            }

            const jp = file;
            const widgetName = file?.name?.split("/")[0] || "";
            const { codeChangesPresent, isDraft } =
              filesDetails.get(widgetName) || {};

            // console.log({ file });
            return (
              <OpenEditorItem
                key={index}
                item={file}
                codeChangesPresent={codeChangesPresent}
                isDraft={isDraft}
                isSelected={curPath === file}
                // handleClicks
                onClick={() => openFile(file)}
                renameButtonOnClick={() => {
                  setShowRenameModal((e) => !e);
                }}
                removeButtonOnClick={() => {
                  removeFromFiles(file);
                  // if (jp === jpath) {

                  if (jp === curPath) {
                    if (files.length > 1) {
                      console.log("HI FORM FILS ASE ARO>...");
                      openFile(files[index - 1] || files[index + 1]);
                    } else {
                      console.log("HI FORM FILE NAI R>...");
                      createFile(Filetype.Widget);
                    }
                  }
                }}
              />
            );
          })} */}
          </AccordionDetails>
        </Accordion>

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

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  // border: `1px solid ${theme.palette.divider}`,
  // backgroundColor: "transparent",
  color: "#7e8185",
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon sx={{ fontSize: "0.8rem", fill: "#7e8185" }} />
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "#1a1a1a",
  // backgroundColor:
  //   theme.palette.mode === "dark" ? "#1e1e1e" : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  // backgroundColor: "#262626",
  backgroundColor: "#1e1e1e",
  padding: 0,
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));
