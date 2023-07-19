import React from "react";
import httpClient from "../../../../libs/httpClient";
import { useContext } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";
import { AuthContext } from "../../../../context/AuthContext";
import { useSnackbar } from "notistack";
import { useState } from "react";
import {
  Box,
  ButtonBase,
  Chip,
  Fade,
  IconButton,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ConfirmDialog from "../../../../dialogs/ConfirmDialog";
import camelToNormal from "../../../../libs/camelToNormal";
import EventIcon from "@mui/icons-material/Event";
import Person4RoundedIcon from "@mui/icons-material/Person4Rounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import formattedDate from "../../../../libs/formattedDate";

export default function ProjectItem({ project, selectedItem, getData }) {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  // const { getData } = useContext(LearnContext);
  const { enqueueSnackbar } = useSnackbar();
  const [mouseIn, setMouseIn] = useState(false);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const deleteLearn = () => {
    httpClient()
      .delete(`/learn/${project._id}`)
      .then((res) => {
        // console.log(res.data);
        // getData();
        enqueueSnackbar("Project deleted successfully", { variant: "success" });
        getData();
      })
      .catch((err) => {
        // console.log(err);
        enqueueSnackbar("Faild to delete project", { variant: "error" });
      });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          border: `1px ${theme.borderColor} solid`,
          backgroundColor:
            selectedItem?.projectId === project?._id
              ? theme.ui
              : theme.backgroundColor,
          borderRadius: theme.borderRadius,
          height: "100%",

          position: "relative",

          "&:hover": {
            backgroundColor: theme.ui2,
            cursor: "pointer",
          },
        }}
        onMouseEnter={() => setMouseIn(true)}
        onMouseLeave={() => setMouseIn(false)}
      >
        <Link
          to={`/learn/${project.slug || project._id}`}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <ButtonBase
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",

              backgroundClip: "red",

              "&:hover": {
                backgroundColor: theme.ui2,
                cursor: "pointer",
              },
            }}
          >
            <Box sx={{ width: "100%" }}>
              <img
                style={{
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  width: "100%",
                  aspectRatio: 16 / 10,
                  overflow: "hidden",
                  objectFit: "cover",
                }}
                src={
                  project.coverArt ||
                  "https://www.bmd.gov.bd/file/img/nwp/notfound.png"
                }
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  // justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 2,
                  p: 2,
                }}
              >
                {/* <Rating size="small" value={4.75} readOnly /> */}

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 0.5,
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      color: theme.textColor,
                      textAlign: "left",
                      overflowWrap: "break-word",
                      width: "100%",
                    }}
                    className="max2Lines"
                  >
                    {project?.name}
                  </Typography>

                  <Typography
                    variant="p2"
                    sx={{
                      color: theme.textColor3,
                      fontSize: "1rem",
                    }}
                  >
                    {project?.sections.length} section
                    {project?.sections.length > 0 ? "s" : ""}
                  </Typography>
                </Box>

                {/* <Box sx={{ minHeight: 40 }}>
                  <MarkdownViewer
                    src={project?.description}
                    className="max2Lines"
                  />
                </Box> */}

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 0.5,
                  }}
                >
                  <Box>
                    <Person4RoundedIcon sx={{ fill: theme.textColor3 }} />
                    <Typography
                      variant="p2"
                      sx={{
                        color: theme.textColor3,
                        marginLeft: 0.5,
                      }}
                    >
                      {project?.createdBy?.name ||
                        project?.createdBy?.userName ||
                        project?.createdBy?.email}
                    </Typography>
                  </Box>
                  <Box>
                    <EventIcon sx={{ fill: theme.textColor3 }} />
                    <Typography
                      variant="p2"
                      sx={{
                        color: theme.textColor3,
                        marginLeft: 0.5,
                      }}
                    >
                      {formattedDate(project?.createdAt)}
                    </Typography>
                  </Box>
                  <Box>
                    <SchoolRoundedIcon sx={{ fill: theme.textColor3 }} />
                    <Typography
                      variant="p2"
                      sx={{
                        color: theme.textColor3,
                        marginLeft: 0.5,
                      }}
                    >
                      {camelToNormal(project?.level)}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {project?.tags?.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{
                        color: theme.textColor3,
                        backgroundColor: theme.textColor + 11,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                borderTop: `1px solid ${theme.borderColor}`,
                width: "100%",
                p: 2,
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Typography
                variant="p1"
                sx={{
                  fontWeight: 600,
                  color: theme.buttonColor,
                  fontSize: "1rem",
                }}
              >
                {project.status === "publish"
                  ? "Free"
                  : camelToNormal(project.status)}
              </Typography>
            </Box>
          </ButtonBase>
        </Link>

        <Fade in={mouseIn}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              // width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {(user?.role === "admin" ||
              project?.createdBy?._id === user?._id) && (
              <>
                <Box
                  sx={{
                    width: `100%`,
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    p: 1,
                    gap: 1,
                  }}
                >
                  <Link to={`/learn/${project?._id}/edit`}>
                    <IconButton sx={{ color: theme.buttonColor }}>
                      <EditRoundedIcon
                        fontSize="small"
                        sx={{ fill: theme.buttonColor }}
                      />
                    </IconButton>
                  </Link>

                  <IconButton
                    sx={{ color: theme.buttonColor2 }}
                    onClick={() => setShowConfirmDialog(true)}
                  >
                    <DeleteRoundedIcon
                      fontSize="small"
                      sx={{ fill: theme.buttonColor2 }}
                    />
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Box>

      <ConfirmDialog
        open={showConfirmDialog}
        setOpen={setShowConfirmDialog}
        onClick={() => deleteLearn()}
        label={`Delete Project`}
        description={`Are you sure you want to remove this project?`}
      />
    </>
  );
}
