import { TreeItem, TreeView } from "@mui/lab";
import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { ThemeContext } from "../../../../../context/ThemeContext";
import ConfirmDialog from "../../../../../dialogs/ConfirmDialog";
import LabelWithFileIcon from "../../../../../components/LabelWithFileIcon";
import { MyEditorContext } from "../../../MyEditorContext";
// import findParentsNodeByName from "../../../../libs/FindParentsNodeByName";
// import ConfirmDialog from "../../../../dialogs/ConfirmDialog";

const findParentsNodeByName = (nodes, widgetName, parentIds = []) => {
  // console.log("Calling findParentsNodeByName()");

  for (const node of nodes) {
    if (node.name === widgetName && node.type === "widget") {
      return [...parentIds, node.nodeId];
    }

    if (node.children && node.children?.length > 0) {
      const result = findParentsNodeByName(node.children, widgetName, [
        ...parentIds,
        node.nodeId,
      ]);
      if (result) {
        return result;
      }
    }
  }

  return null;

  // if (node.name === widgetName && node.type === "widget") {
  //   return [...parentIds, node.nodeId];
  // }

  // if (node.children && node.children?.length > 0) {
  //   for (const child of node.children) {
  //     const result = findParentsNodeByName(child, widgetName, [
  //       ...parentIds,
  //       node.nodeId,
  //     ]);

  //     console.log("result : ", result);
  //     if (result) {
  //       return result;
  //     }
  //   }
  // }

  // return null;
};

function getWidgets(node, widgetsArray) {
  if (node.type === "widget") {
    // widgetsArray.push({ name: node.name, type: "widget" });
    widgetsArray.push({ type: "widget", name: node.name });
  }

  if (node.children && node.children?.length > 0) {
    for (let child of node.children) {
      getWidgets(child, widgetsArray);
    }
  }
}

export default function OpenWidgets({
  projectFiles,
  setShowRenameModal,
  // createFile,
  // openFile,
  // curPath,
  // filesDetails,
  // removeFromFiles,
  //
  openWidgetsExpanded,
  setOpenWidgetsExpanded,

  openWidgetsSelected,
  setOpenWidgetsSelected,
}) {
  const {
    lastPath,
    createFile,
    filesDetails,
    removeFromFiles,

    lastPath: curPath,
  } = useContext(MyEditorContext);

  const handleToggle = (event, nodeIds) => {
    setOpenWidgetsExpanded(nodeIds);
  };

  // console.log("openWidgetsSelected : ", openWidgetsSelected);
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

  const [hasCalledOnce, setHasCalledOnce] = useState(false);

  useEffect(() => {
    if (!hasCalledOnce && projectFiles?.length > 0 && lastPath?.name) {
      // console.log(
      //   "Calling setOpenWidgetsSelected for the first time ",
      //   lastPath?.name,
      //   " - openWidgetsExpanded : ",
      //   openWidgetsExpanded,

      //   " - projectFiles  : ",
      //   projectFiles,
      //   " findParentsNodeByName : ",
      //   findParentsNodeByName(projectFiles, lastPath?.name)
      // );

      const nodeIds = findParentsNodeByName(projectFiles, lastPath?.name);

      if (nodeIds) {
        const newNodeids = nodeIds.filter((x) => x !== undefined);
        setOpenWidgetsExpanded((e) => [...e, ...newNodeids]);
      }

      // console.log(
      //   "OpenWidget > UseEffect > lastPath : ",
      //   lastPath?.name,
      //   " : nodeIds :  ",
      //   nodeIds
      // );

      // setTimeout(function () {
      //   console.log("Executed after 1 second");
      //   // history.push(`/editor/`);
      //   // history.replace(`/editor/`);
      // }, 2000);
      setOpenWidgetsSelected(lastPath?.name);

      // setTimeout(function () {
      //   console.log("Executed after 1 second");
      // setOpenWidgetsSelected(lastPath?.name);
      // }, 1000);
    }
  }, [lastPath, projectFiles]);

  const handleNodeSelect = (event, nodeId) => {
    // console.log("handleNodeSelect : ", nodeId);
    //
    // console.log("calling handleNodeSelect : and nodeId is : ", nodeId);
    setOpenWidgetsSelected(nodeId);
    //
    // setOpenWidgetsSelected([3]);
  };

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // const handleButtonClick = () => {
  //   setOpenWidgetsSelected("2");
  // };

  return (
    openWidgetsSelected && (
      <Box>
        {/* {lastPath?.name} - {openWidgetsSelected}
        <button onClick={() => setOpenWidgetsSelected("Untitled-1")}>
          Cghnagads{" "}
        </button> */}
        <TreeView
          aria-label="multi-select"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          expanded={openWidgetsExpanded}
          onNodeToggle={handleToggle}
          //
          selected={openWidgetsSelected}
          // selected="build.followersList"
          onNodeSelect={handleNodeSelect}
        >
          <CustomTreeView
            file={{ children: projectFiles }}
            setShowRenameModal={setShowRenameModal}
            createFile={createFile}
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
    )
  );
}

const CustomTreeView = ({
  file,
  createFile,
  curPath,
  filesDetails,
  setShowRenameModal,
  removeFromFiles,

  showConfirmDialog,
  setShowConfirmDialog,
}) => {
  const { theme } = useContext(ThemeContext);
  const { files, openFile } = useContext(MyEditorContext);

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
          filesDetails?.find((item) => item.name === widgetName) || {};

        const handleOpenFile = () => {
          if (!isWidget) return;

          // console.log(fileFromItem);
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
            if (files?.length > 1)
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
