import React, { useContext, useEffect, useState } from "react";
import { useAccountId, useNear, useCache } from "near-social-vm";
import { ThemeContext } from "../../../../../context/ThemeContext";
import { Box, ButtonBase, IconButton, Typography } from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import FileIcon from "../../../../../components/FileIcon";
import createFileTree from "../../../../../libs/createFileTree";
import { TreeItem, TreeView } from "@mui/lab";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MyEditorContext } from "../../../MyEditorContext";

function findWidgets(obj) {
  let widgets = [];
  if (obj.type === "widget") {
    widgets.push(obj?.name);
  }
  if (Array.isArray(obj.children)) {
    for (let i = 0; i < obj.children?.length; i++) {
      const childWidgets = findWidgets(obj.children[i]);
      widgets = widgets.concat(childWidgets);
    }
  }
  return widgets;
}

function findItemsByName(name, arr, path = []) {
  let result = [];
  arr.forEach((item) => {
    if (item.name === name) {
      result.push({ item, path });
    }
    if (item.children) {
      const childPath = path.concat({ nodeId: item.nodeId, name: item.name });
      result = result.concat(findItemsByName(name, item.children, childPath));
    }
  });
  return result;
}
//

export default function MyWidgets({
  loadFile,
  projectFiles: openWidgetsFilesList,
  //
  openWidgetsExpanded,
  setOpenWidgetsExpanded,
  openWidgetsSelected,
  setOpenWidgetsSelected,
}) {
  const near = useNear();
  const cache = useCache();
  const accountId = useAccountId();

  const { theme } = useContext(ThemeContext);

  const { myWidgets } = useContext(MyEditorContext);

  const [projectFiles, setProjectFiles] = useState([]);

  useEffect(() => {
    if (myWidgets && Object.keys(myWidgets)?.length) {
      let widgets = [];

      Object.keys(myWidgets)?.map((name) => {
        widgets.push({ type: "widget", name });
      });

      setProjectFiles([]);
      if (widgets?.length > 0) {
        setProjectFiles(createFileTree(widgets));
      }
    }
  }, [myWidgets]);

  const [expanded, setExpanded] = useState([]);
  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  return (
    <>
      {/* MY WIDGETS SEECTION - NOT EDITING... */}
      {accountId && (
        <Accordion defaultExpanded>
          <AccordionSummary
            aria-controls="panel2d-content"
            id="panel2d-header"
            sx={{ backgroundColor: theme.backgroundColor }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
              My Widgets
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: theme.ui }}>
            {myWidgets ? (
              <>
                <TreeView
                  aria-label="multi-select"
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<ChevronRightIcon />}
                  expanded={expanded}
                  onNodeToggle={handleToggle}
                >
                  <CustomTreeView
                    file={{ children: projectFiles }}
                    openWidgetsFilesList={openWidgetsFilesList}
                    loadFile={loadFile}
                    //
                    openWidgetsExpanded={openWidgetsExpanded}
                    setOpenWidgetsExpanded={setOpenWidgetsExpanded}
                    openWidgetsSelected={openWidgetsSelected}
                    setOpenWidgetsSelected={setOpenWidgetsSelected}
                  />
                </TreeView>
              </>
            ) : (
              <ButtonBase
                disabled={true}
                sx={{
                  fontSize: 14,
                  textTransform: "none",
                  width: "100%",
                  py: 4,
                }}
                onClick={() => getData()}
              >
                {/* Click here to see all widgets */}
                Please publish a widget to see it here
              </ButtonBase>
            )}
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
}

const CustomTreeView = ({
  file,
  openWidgetsFilesList,
  loadFile,
  openWidgetsExpanded,
  setOpenWidgetsExpanded,
  openWidgetsSelected,
  setOpenWidgetsSelected,
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div>
      {file?.children?.map((item, index) => {
        const isWidget = item?.type === "widget" ? true : false;
        const isSelected = false;

        // console.log(item?.name, " - ", item?.type === "widget" ? true : false);

        return (
          <TreeItem
            sx={{
              backgroundColor:
                isWidget && isSelected ? theme.buttonColor + "26" : theme.ui,
            }}
            key={index}
            nodeId={item?.nodeId || item.name}
            // label={
            //   <LabelWithFileIcon
            //     item={{
            //       ...item,
            //       name: isWidget
            //         ? item?.name.slice(item?.name?.lastIndexOf(".") + 1)
            //         : item.name,
            //     }}
            //     isWidget={true}
            //     handleOpenFile={() => loadFile(item?.name)}
            //     handleOpenFolder={() => console.log(item)}
            //   />
            // }
            label={
              <CustomLabel
                isWidget={isWidget}
                parentNodeId={file?.nodeId}
                item={item}
                openWidgetsFilesList={openWidgetsFilesList}
                loadFile={loadFile}
                openWidgetsExpanded={openWidgetsExpanded}
                setOpenWidgetsExpanded={setOpenWidgetsExpanded}
                openWidgetsSelected={openWidgetsSelected}
                setOpenWidgetsSelected={setOpenWidgetsSelected}
              />
            }
          >
            {item?.children?.length > 0 && (
              <CustomTreeView
                file={item}
                openWidgetsFilesList={openWidgetsFilesList}
                loadFile={loadFile}
                openWidgetsExpanded={openWidgetsExpanded}
                setOpenWidgetsExpanded={setOpenWidgetsExpanded}
                openWidgetsSelected={openWidgetsSelected}
                setOpenWidgetsSelected={setOpenWidgetsSelected}
              />
            )}
          </TreeItem>
        );
      })}
    </div>
  );
};

const CustomLabel = ({
  loadFile,
  isWidget,
  parentNodeId,
  item,
  openWidgetsFilesList,
  //
  openWidgetsExpanded,
  setOpenWidgetsExpanded,
  openWidgetsSelected,
  setOpenWidgetsSelected,
}) => {
  const { theme } = useContext(ThemeContext);

  // isWidget ? (
  //   `W: ${item?.name.slice(item?.name?.lastIndexOf(".") + 1)}`
  // ) :

  const handleClick = () => {
    const widgets = findWidgets(item);

    Promise.all(
      widgets?.map((widget) => {
        loadFile(widget);
      })
    );

    // if (item.nodeId) {
    //   setOpenWidgetsExpanded((e) => [...e, item.nodeId]);
    // } else if (parentNodeId) {
    //   setOpenWidgetsExpanded((e) => [...e, parentNodeId]);
    // }
    // openWidgetsSelected={openWidgetsSelected}

    // openWidgetsFilesList

    // const
    // const find = openWidgetsFilesList.find

    let newArray = [];
    let itemToSelect;

    let result = findItemsByName(
      widgets[widgets?.length - 1],
      openWidgetsFilesList
    );

    result?.map((r) => {
      itemToSelect = r.item.name;

      // newArray.push(r.item?.name);
      r?.path?.map((p) => {
        newArray.push(p.nodeId);
      });
    });

    // console.log("openWidgetsFilesList : ", newArray);

    setOpenWidgetsExpanded((prevItems) => [
      ...new Set([...prevItems, ...newArray]),
    ]);

    // console.log(
    //   "Calling  setOpenWidgetsExpanded from myWidgets with new array of ",
    //   newArray
    // );

    // setOpenWidgetsSelected(widgets[widgets.length - 1]);
    setOpenWidgetsSelected(itemToSelect);
    // console.log("itemToSelect : ", itemToSelect);
    // console.log("openWidgetsSelected: ", openWidgetsSelected);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      onClick={() => isWidget && handleClick()}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 1,
        }}
      >
        <FileIcon type={item?.type} />

        <Typography
          sx={{
            ml: 0,
            fontWeight: 400,
            color: theme.textColor2,
            paddingBlock: "2.5px",
            textTransform: "none",
            fontSize: ".9rem",
            textAlign: "left",
            wordBreak: "break-all",
          }}
          className="max1Lines"
        >
          {/* {item?.name} */}
          {item?.name.slice(item?.name?.lastIndexOf(".") + 1)}
        </Typography>
      </Box>

      {!isWidget && (
        <IconButton
          size="small"
          sx={{ p: 0, m: 0 }}
          onClick={() => handleClick()}
        >
          <AddCircleRoundedIcon
            fontSize="small"
            sx={{
              fill: theme.textColor3 + 33,
              minHeight: 16,
              height: 16,
              minWidth: 16,
              width: 16,
            }}
          />
        </IconButton>
      )}
    </Box>
  );
};

// const CheckItem

// const MyWidgetsItem = ({ label, onClick }) => {
//   const { theme } = useContext(ThemeContext);
//   const { files } = useContext(EditorContext);

//   const [isSelected, setIsSelected] = useState(false);

//   useEffect(() => {
//     const xs = files.find((file) => file.name === label);

//     setIsSelected(xs ? true : false);
//   }, [files]);

//   return (
//     <Box
//       sx={{
//         position: "relative",
//         display: "flex",
//         alignItems: "center",
//         width: "100%",
//         backgroundColor: isSelected ? theme.ui2 : theme.ui,

//         // backgroundColor: theme.ui,
//         "&:hover": {
//           backgroundColor: theme.ui2,
//           cursor: "pointer",
//         },
//       }}
//     >
//       <ButtonBase
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           px: 2,
//           py: 0.5,
//           width: "100%",

//           zIndex: 5,
//         }}
//         disabled={isSelected}
//         onClick={() => onClick()}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 1,
//           }}
//         >
//           <FileIcon type="widget" />

//           {/* <Tooltip title={label}> */}
//           <Typography
//             variant="p"
//             sx={{
//               ml: 0,
//               fontWeight: 400,
//               color: theme.textColor2,
//               paddingBlock: "2.5px",
//               textTransform: "none",
//               fontSize: ".9rem",
//               textAlign: "left",
//               wordBreak: "break-all",
//             }}
//             className="max1Lines"
//           >
//             {label}
//           </Typography>
//           {/* </Tooltip> */}
//         </Box>
//       </ButtonBase>
//     </Box>
//   );
// };

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
