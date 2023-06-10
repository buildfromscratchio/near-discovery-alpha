import React, { useState, useEffect } from "react";
import PagesContainer from "../../../components/PagesContainer";
import { Box, Button, IconButton, Skeleton, Typography } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import httpClient from "../../../libs/httpClient";
import ProjectItem from "./_components/ProjectItem";
import { EditorContext } from "../../../context/EditorContext";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { AuthContext } from "../../../context/AuthContext";
import CustomButton from "../../../components/custom/CustomButton";
import { Link } from "react-router-dom";

export default function LearnPage(props) {
  const { selectedActivity, setSelectedActivity } = useContext(EditorContext);
  const { theme, bp } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState();

  useEffect(() => {
    setSelectedActivity("");
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);

    httpClient()
      .get("/learn")
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
        console.log("LearnContextProvider : ", res.data);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <PagesContainer {...props}>
      <Box
        className="containerCSS"
        style={{
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Box className="contentCSS">
          <Box
            sx={{
              pt: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box>
              <Typography variant="h3" sx={{ color: theme.textColor }}>
                Learn
              </Typography>
              <Typography variant="p1" sx={{ color: theme.textColor2 }}>
                Curated list of resources to learn programming.
              </Typography>
            </Box>

            {["admin", "super"].includes(user?.role) && (
              <Link to="/learn/create">
                <CustomButton
                  sx={{
                    borderRadius: 1,
                    pr: 2,
                    pl: 1,
                    gap: 0.5,
                  }}
                >
                  <AddRoundedIcon sx={{ color: theme.buttonTextColor }} />
                  <Typography
                    variant="p1"
                    sx={{ textTransform: "none", color: theme.buttonTextColor }}
                  >
                    Add Project
                  </Typography>
                </CustomButton>
              </Link>
            )}
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                loading || projects?.length > 0
                  ? bp
                    ? "1fr"
                    : "repeat(auto-fill, minmax(250px, 1fr))"
                  : "1fr",
              // gridTemplateRows: projects?.length <= 0 ? "1fr" : "1fr 1fr 1fr",
              gap: 2,
              paddingTop: 2,
              width: "100%",
            }}
          >
            {loading ? (
              Array.from(new Array(12)).map((item, index) => (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={350}
                  sx={{ mb: "1px", borderRadius: 1 }}
                />
              ))
            ) : projects?.length > 0 ? (
              projects?.map((project) => (
                <ProjectItem project={project} getData={getData} />
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 300,
                }}
              >
                <Typography sx={{ color: theme.textColor3 }}>
                  Projects has not been added.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </PagesContainer>
  );
}
