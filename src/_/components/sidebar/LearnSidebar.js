import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {
  Box,
  ButtonBase,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Link } from "react-router-dom";

export default function LearnSidebar(props) {
  const { project, selectedSection, setSelectedSection, loading } = props;

  const { theme } = useContext(ThemeContext);

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
          gap: 1,
          paddingInline: 1,
          borderBottom: `1px solid ${theme.borderColor}`,
          backgroundColor: theme.backgroundColor,

          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Link to="/learn">
          <IconButton>
            <ArrowBackRoundedIcon sx={{ color: theme.textColor }} />
          </IconButton>
        </Link>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            color: theme.textColor,
            textAlign: "left",
            cursor: "pointer",
          }}
          onClick={() => setSelectedSection()}
        >
          {project?.name}
        </Typography>
      </Box>
      <Box>
        {/* <MarkdownViewer src={project?.description} /> */}

        {loading
          ? Array.from(new Array(5)).map((item, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="100%"
                height={50}
                sx={{ mb: "1px" }}
              />
            ))
          : project?.sections?.map((section, index) => (
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
                    selectedSection?._id === section?._id
                      ? theme.ui2
                      : theme.ui,
                  "&:hover": {
                    backgroundColor: theme.ui2,
                    cursor: "pointer",
                  },
                }}
                onClick={() => setSelectedSection(section)}
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
    </Box>
  );
}
