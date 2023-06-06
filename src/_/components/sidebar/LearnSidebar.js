import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {
  Box,
  ButtonBase,
  Fade,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { LearnContext } from "../../context/LearnContext";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import httpClient from "../../libs/httpClient";
import { useSnackbar } from "notistack";
import MarkdownViewer from "../MarkdownViewer";
import { useState } from "react";

export default function LearnSidebar() {
  const { theme } = useContext(ThemeContext);
  const {
    loading,
    projects,
    selectedItem,
    setSelectedItem,
    selectedProject,
    goBack,
  } = useContext(LearnContext);

  const { user } = useContext(AuthContext);

  return (
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
          {user?.role === "admin" && !selectedProject?.name && (
            <Tooltip title="Add Project">
              <Link to="/learn/create">
                <IconButton>
                  <AddCircleOutlineRoundedIcon
                    sx={{ fontSize: "1.25rem", fill: theme.textColor3 }}
                  />
                </IconButton>
              </Link>
            </Tooltip>
          )}
        </Box>
      </Box>

      {selectedProject?.name ? (
        <Box>
          <Box sx={{ px: 1, color: theme.textColor }}>
            {/* <div
              className="dangerousStyle"
              // style={{ color: theme.textColor }}
              dangerouslySetInnerHTML={{
                __html: selectedProject?.discription,
              }}
            /> */}

            <MarkdownViewer src={selectedProject?.discription} />

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
          {loading
            ? Array.from(new Array(10)).map((item, index) => (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={75}
                  sx={{ mb: "1px" }}
                />
              ))
            : projects?.map((project) => (
                <ProjectItem
                  project={project}
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                />
              ))}
        </Box>
      )}
    </Box>
  );
}

const ProjectItem = ({ project, selectedItem, setSelectedItem }) => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const { getData } = useContext(LearnContext);
  const { enqueueSnackbar } = useSnackbar();
  const [mouseIn, setMouseIn] = useState(false);

  const deleteLearn = () => {
    httpClient()
      .delete(`/learn/${project._id}`)
      .then((res) => {
        console.log(res.data);
        getData();
        enqueueSnackbar("Project deleted successfully", { variant: "success" });
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Faild to delete project", { variant: "error" });
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1,
        borderBottom: `1px ${theme.borderColor} solid`,
        backgroundColor:
          selectedItem?.projectId === project?._id ? theme.ui2 : theme.ui,

        "&:hover": {
          backgroundColor: theme.ui2,
          cursor: "pointer",
        },
      }}
      onMouseEnter={() => setMouseIn(true)}
      onMouseLeave={() => setMouseIn(false)}
    >
      <ButtonBase
        disableRipple
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          px: 1,

          "&:hover": {
            backgroundColor: theme.ui2,
            cursor: "pointer",
          },
        }}
        onClick={async () => {
          let state = {
            projectId:
              selectedItem?.projectId === project?._id ? "" : project?._id,
            sectionId: "",
          };

          setSelectedItem(state);
          await localStorage.setItem("selectedProject", JSON.stringify(state));
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

      {user?.role === "admin" && (
        <Fade in={mouseIn}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Link to={`/learn/update/${project?._id}`}>
              <IconButton>
                <EditRoundedIcon
                  fontSize="small"
                  sx={{ fill: theme.buttonColor }}
                />
              </IconButton>
            </Link>

            <IconButton onClick={() => deleteLearn()}>
              <DeleteRoundedIcon
                fontSize="small"
                sx={{ fill: theme.buttonColor2 }}
              />
            </IconButton>
          </Box>
        </Fade>
      )}
    </Box>
  );
};
