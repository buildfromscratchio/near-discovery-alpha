import React, { useContext, useEffect, useState } from "react";
import { useAccountId, useNear, useCache } from "near-social-vm";
import { ThemeContext } from "../../../../context/ThemeContext";
import {
  Box,
  Button,
  ButtonBase,
  Chip,
  Fade,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import FileIcon from "../../../FileIcon";
import { EditorContext } from "../../../../context/EditorContext";
import createFileTree from "../../../../libs/createFileTree";
import { TreeItem, TreeView } from "@mui/lab";
import LabelWithFileIcon from "../../../LabelWithFileIcon";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function MyWidgets({ loadFile }) {
  const near = useNear();
  const cache = useCache();
  const accountId = useAccountId();

  const { theme } = useContext(ThemeContext);

  const [myWidgets, setMyWidgets] = useState([]);
  const [projectFiles, setProjectFiles] = useState([]);

  const getData = () => {
    let widget = `${accountId}/widget/*`;

    const code = cache.socialGet(
      near,
      widget,
      false,
      undefined,
      undefined,
      getData
    );
    setMyWidgets(code);
  };

  useEffect(() => {
    if (myWidgets) {
      let widgets = [];

      Object.keys(myWidgets)?.map((name) => {
        widgets.push({ type: "widget", name });
      });

      setProjectFiles([]);
      if (widgets.length > 0) {
        setProjectFiles(createFileTree(widgets));
      }
    }
  }, [myWidgets]);

  const [expanded, setExpanded] = useState([]);
  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };
  console.log("My widgets expanded : ", expanded);

  function getNodeIds(objArray) {
    const nodeIds = [];
    if (Array.isArray(objArray)) {
      // Iterate through each object in the array
      for (const obj of objArray) {
        // If the object has a "nodeId" property, add it to the nodeIds array
        if (typeof obj === "object" && obj.hasOwnProperty("nodeId")) {
          nodeIds.push(obj.nodeId);
        }
        // If the object has a "children" array, recursively call the function on it and merge the results
        if (Array.isArray(obj.children) && obj.children.length > 0) {
          nodeIds.push(...getNodeIds(obj.children));
        }
      }
    }
    return nodeIds;
  }
  const [hasCalledOnce, setHasCalledOnce] = useState(false);
  useEffect(() => {
    if (projectFiles?.length > 0 && !hasCalledOnce) {
      setExpanded(getNodeIds(projectFiles));
      setHasCalledOnce(true);
    }
  }, [projectFiles]);

  return (
    <>
      {/* MY WIDGETS SEECTION - NOT EDITING... */}
      {accountId && (
        <Accordion
          // defaultExpanded
          onClick={() => {
            if (myWidgets.length <= 0) {
              getData();
            }
          }}
        >
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
                    loadFile={loadFile}
                  />
                </TreeView>
              </>
            ) : (
              <ButtonBase
                sx={{
                  fontSize: 14,
                  textTransform: "none",
                  width: "100%",
                  py: 4,
                }}
                onClick={() => getData()}
              >
                Click here to see all widgets
              </ButtonBase>
            )}
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
}

const CustomTreeView = ({ file, loadFile }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div>
      {file?.children?.map((item, index) => {
        const isWidget = item?.type === "widget";
        const isSelected = false;

        return (
          <TreeItem
            sx={{
              backgroundColor:
                isWidget && isSelected ? theme.buttonColor + "26" : theme.ui,
            }}
            key={index}
            nodeId={item?.nodeId || item.name}
            label={
              <LabelWithFileIcon
                item={{
                  ...item,
                  name: isWidget
                    ? item?.name.slice(item?.name?.lastIndexOf(".") + 1)
                    : item.name,
                }}
                isWidget={isWidget}
                handleOpenFile={() => loadFile(item?.name)}
              />
            }
          >
            {item?.children?.length > 0 && (
              <CustomTreeView file={item} loadFile={loadFile} />
            )}
          </TreeItem>
        );
      })}
    </div>
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
