import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {
  Box,
  ButtonBase,
  Fade,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { LearnContext } from "../../context/LearnContext";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { Link } from "react-router-dom";

export default function LearnSidebar() {
  const { theme } = useContext(ThemeContext);
  const { projects, selectedItem, setSelectedItem, selectedProject, goBack } =
    useContext(LearnContext);

  return (
    <>
      <Box
        sx={{
          backgroundColor: theme.backgroundColor,
          height: "100%",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            height: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            paddingInline: 1,
            borderBottom: `1px solid ${theme.borderColor}`,
            backgroundColor: theme.backgroundColor,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Fade in={selectedItem?.projectId} mountOnEnter unmountOnExit>
              <IconButton
                onClick={() => {
                  goBack();
                }}
              >
                <ArrowBackRoundedIcon sx={{ color: theme.textColor }} />
              </IconButton>
            </Fade>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                color: theme.textColor,
                textAlign: "left",
              }}
            >
              {selectedProject?.name || "Learn"}
            </Typography>
          </Box>

          <Box>
            <Tooltip title="Add Project">
              <Link to="/learn/create">
                <IconButton>
                  <AddCircleOutlineRoundedIcon
                    sx={{ fontSize: "1.25rem", fill: theme.textColor3 }}
                  />
                </IconButton>
              </Link>
            </Tooltip>
          </Box>
        </Box>

        {selectedProject?.name ? (
          <Box>
            <Box sx={{ px: 1, color: theme.textColor }}>
              <div
                className="dangerousStyle"
                // style={{ color: theme.textColor }}
                dangerouslySetInnerHTML={{
                  __html: selectedProject?.discription,
                }}
              />
              {/* <Widget
              src="saidulbadhon.near/widget/LearnPage.Markdown"
              props={{ text: selectedProject?.discription, theme: theme }}
            /> */}
            </Box>

            {selectedProject?.sections?.map((section, index) => (
              <ButtonBase
                key={index}
                sx={{
                  width: "100%",
                  borderTop:
                    index === 0 ? `1px ${theme.borderColor} solid` : "none",
                  borderBottom: `1px ${theme.borderColor} solid`,
                  height: 50,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 1,
                  py: 1,

                  backgroundColor:
                    selectedItem?.sectionId === section?._id
                      ? theme.ui2
                      : theme.ui,
                  "&:hover": {
                    backgroundColor: theme.ui2,
                    cursor: "pointer",
                  },
                }}
                onClick={async () => {
                  let state = {
                    projectId: selectedItem?.projectId,
                    sectionId:
                      selectedItem?.sectionId === section?._id
                        ? ""
                        : section?._id,
                  };

                  setSelectedItem(state);
                  await localStorage.setItem(
                    "selectedProject",
                    JSON.stringify(state)
                  );
                }}
              >
                <Typography
                  variant="p"
                  sx={{
                    fontWeight: 500,
                    color: theme.textColor,
                    textAlign: "left",
                  }}
                >
                  {section?.name}
                </Typography>

                <ChevronRightRoundedIcon />
              </ButtonBase>
            ))}
          </Box>
        ) : (
          <Box>
            {projects?.map((project) => (
              <ButtonBase
                sx={{
                  width: "100%",
                  borderBottom: `1px ${theme.borderColor} solid`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  px: 1,
                  py: 1,

                  backgroundColor:
                    selectedItem?.projectId === project?._id
                      ? theme.ui2
                      : theme.ui,
                  "&:hover": {
                    backgroundColor: theme.ui2,
                    cursor: "pointer",
                  },
                }}
                onClick={async () => {
                  let state = {
                    projectId:
                      selectedItem?.projectId === project?._id
                        ? ""
                        : project?._id,
                    sectionId: "",
                  };

                  setSelectedItem(state);
                  await localStorage.setItem(
                    "selectedProject",
                    JSON.stringify(state)
                  );
                }}
              >
                <Typography
                  variant="p"
                  sx={{
                    fontWeight: 600,
                    color: theme.textColor,
                    textAlign: "left",
                  }}
                >
                  {project?.name}
                </Typography>
                <Typography
                  variant="p1"
                  sx={{
                    fontWeight: 400,
                    color: theme.textColor3,
                    fontSize: "1rem",
                  }}
                >
                  {project?.sections.length} section
                </Typography>
              </ButtonBase>
            ))}
          </Box>
        )}
      </Box>

      {/* <AddLearnProjectDialog
        open={showAddLearnProjectDialog}
        setOpen={setShowAddLearnProjectDialog}
      /> */}
    </>
  );
}
