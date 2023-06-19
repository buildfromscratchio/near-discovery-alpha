import { TreeItem, TreeView } from "@mui/lab";
import { Box } from "@mui/material";
import React, { useContext, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LabelWithFileIcon from "../../../LabelWithFileIcon";
import { EditorContext } from "../../../../context/EditorContext";
import { ThemeContext } from "../../../../context/ThemeContext";
import ConfirmDialog from "../../../../dialogs/ConfirmDialog";
// import ConfirmDialog from "../../../../dialogs/ConfirmDialog";

function getWidgets(node, widgetsArray) {
  if (node.type === "widget") {
    // widgetsArray.push({ name: node.name, type: "widget" });
    widgetsArray.push({ type: "widget", name: node.name });
  }

  if (node.children && node.children.length > 0) {
    for (let child of node.children) {
      getWidgets(child, widgetsArray);
    }
  }
}

export default function OpenWidgets({
  projectFiles,
  setShowRenameModal,
  createFile,
  openFile,
  curPath,
  filesDetails,
  removeFromFiles,
  //
  openWidgetsExpanded,
  setOpenWidgetsExpanded,

  openWidgetsSelected,
  setOpenWidgetsSelected,
}) {
  const handleToggle = (event, nodeIds) => {
    // console.log("handleToggle setOpenWidgetsExpanded : ", nodeIds);
    setOpenWidgetsExpanded(nodeIds);
  };

  // function getNodeIds(objArray) {
  //   const nodeIds = [];
  //   if (Array.isArray(objArray)) {
  //     // Iterate through each object in the array
  //     for (const obj of objArray) {
  //       // If the object has a "nodeId" property, add it to the nodeIds array
  //       if (typeof obj === "object" && obj.hasOwnProperty("nodeId")) {
  //         nodeIds.push(obj.nodeId);
  //       }
  //       // If the object has a "children" array, recursively call the function on it and merge the results
  //       if (Array.isArray(obj.children) && obj.children.length > 0) {
  //         nodeIds.push(...getNodeIds(obj.children));
  //       }
  //     }
  //   }
  //   return nodeIds;
  // }
  // const [hasCalledOnce, setHasCalledOnce] = useState(false);
  // useEffect(() => {
  //   if (projectFiles?.length > 0 && !hasCalledOnce) {
  //     setOpenWidgetsExpanded(getNodeIds(projectFiles));
  //     setHasCalledOnce(true);
  //   }
  // }, [projectFiles]);

  //

  // useEffect(() => {
  //   console.log(
  //     "openWidgetsSelected, openWidgetsExpanded : ",
  //     openWidgetsSelected,
  //     openWidgetsExpanded
  //   );
  // }, [openWidgetsSelected, openWidgetsExpanded]);

  //

  const handleNodeSelect = (event, nodeId) => {
    // console.log("handleNodeSelect : ", nodeId);
    // setOpenWidgetsSelected(nodeId);
    setOpenWidgetsSelected([3]);
  };

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // const handleButtonClick = () => {
  //   setOpenWidgetsSelected("2");
  // };

  return (
    <Box>
      <TreeView
        aria-label="multi-select"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={openWidgetsExpanded}
        onNodeToggle={handleToggle}
        //
        selected={openWidgetsSelected}
        onNodeSelect={handleNodeSelect}
      >
        <CustomTreeView
          file={{ children: projectFiles }}
          setShowRenameModal={setShowRenameModal}
          createFile={createFile}
          openFile={openFile}
          curPath={curPath}
          filesDetails={filesDetails}
          removeFromFiles={removeFromFiles}
          //
          showConfirmDialog={showConfirmDialog}
          setShowConfirmDialog={setShowConfirmDialog}
        />

        {/* {projectFiles.map((item, index) => (
          <TreeItem
            key={index}
            nodeId={item.id}
            label={
              <LabelWithFileIcon
                item={{ name: item?.name, type: item?.type }}
              />
            }
            onClick={() => {
              if (item.type === "widget") {
                openFile(files?.find((f) => f.name === item.name));
              }
            }}
          >
            {item?.children?.length > 0 && (
              <CustomTreeView file={item} openFile={openFile} />
            )}
          </TreeItem>
        ))} */}
      </TreeView>

      <ConfirmDialog
        open={showConfirmDialog}
        setOpen={setShowConfirmDialog}
        onClick={() => {
          let widgets = [];
          getWidgets(showConfirmDialog, widgets);

          widgets?.map((widget) => {
            // console.log("handleRemoveFile.widgets.widget: ", widget);
            removeFromFiles(widget);
          });
          // console.log("handleRemoveFile.widgets: ", widgets);
        }}
        label={`Remove Folder`}
        description={`Are you sure you want to remove this folder?`}
      />
    </Box>
  );
}

const CustomTreeView = ({
  file,
  createFile,
  openFile,
  curPath,
  filesDetails,
  setShowRenameModal,
  removeFromFiles,

  showConfirmDialog,
  setShowConfirmDialog,
}) => {
  const { theme } = useContext(ThemeContext);
  const { files } = useContext(EditorContext);

  return (
    <div>
      {file?.children?.map((item, index) => {
        if (!item) return;
        if (typeof item === "string") return;
        if (item?.unnamed) return;

        const isWidget = item?.type === "widget";

        const fileFromItem = files?.find((f) => f.name === item.name);
        const isSelected = curPath === fileFromItem;

        const widgetName = fileFromItem?.name?.split("/")[0] || "";

        const { codeChangesPresent, isDraft } =
          filesDetails.get(widgetName) || {};

        const handleOpenFile = () => {
          if (!isWidget) return;
          openFile(fileFromItem);
        };

        const handleRenameFile = () => {
          if (!isWidget) return;
          if (!isSelected) return;

          setShowRenameModal((e) => !e);
        };

        const handleRemoveFile = () => {
          // console.log("handleRemoveFile ==========> : ", item);

          if (item.type === "folder") {
            !showConfirmDialog && setShowConfirmDialog(item);
            // let widgets = [];
            // getWidgets(item, widgets);

            // widgets?.map((widget) => {
            //   console.log("handleRemoveFile.widgets.widget: ", widget);
            //   removeFromFiles(widget);
            // });
            // // console.log("handleRemoveFile.widgets: ", widgets);
          } else {
            // console.log("handleRemoveFile.fileFromItem: ", fileFromItem);
            removeFromFiles(fileFromItem);
            // console.log("handleRemoveFile > fileFromItem", fileFromItem);
          }

          if (fileFromItem === curPath) {
            if (files.length > 1)
              openFile(files[index - 1] || files[index + 1]);
            else createFile("widget");
          }
        };

        return (
          <>
            <TreeItem
              sx={{
                backgroundColor:
                  isWidget && isSelected ? theme.buttonColor + "26" : theme.ui,
              }}
              key={index}
              nodeId={item.nodeId || item.name}
              // nodeId={item.nodeId}
              icon={
                isWidget &&
                codeChangesPresent && (
                  <Box
                    style={{
                      minWidth: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "rgba(255,0,0,.75)",
                    }}
                  />
                )
              }
              label={
                <LabelWithFileIcon
                  item={{
                    ...item,
                    name: isWidget
                      ? item?.name.slice(item?.name?.lastIndexOf(".") + 1)
                      : item.name,
                  }}
                  isWidget={isWidget}
                  isSelected={isSelected}
                  isDraft={isDraft}
                  codeChangesPresent={codeChangesPresent}
                  //
                  handleOpenFile={handleOpenFile}
                  handleRenameFile={handleRenameFile}
                  handleRemoveFile={handleRemoveFile}
                />
              }
              // onClick={() => {
              //   handleOpenFile();
              // }}
            >
              {item?.children?.length > 0 && (
                <CustomTreeView
                  file={item}
                  setShowRenameModal={setShowRenameModal}
                  createFile={createFile}
                  openFile={openFile}
                  curPath={curPath}
                  filesDetails={filesDetails}
                  removeFromFiles={removeFromFiles}
                />
              )}
            </TreeItem>
          </>
        );
      })}
    </div>
  );
};

// const CheckItem
