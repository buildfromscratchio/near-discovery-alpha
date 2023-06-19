import React, { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { Box, Skeleton, Typography } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import httpClient from "../../../libs/httpClient";
import ProjectItem from "../../learn/learnPage/_components/ProjectItem";

export default function HomeLearnSection() {
  const { theme } = useContext(ThemeContext);

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);

    httpClient()
      .get("/public/learn")
      .then((res) => {
        console.log(res.data);
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err);
        setLoading(false);
      });
  };

  return (
    <Box
      className="containerCSS"
      sx={{ py: 10, backgroundColor: theme.backgroundColor }}
    >
      <Box className="contentCSS">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Typography
            variant="big"
            sx={{
              fontWeight: 600,
              fontSize: 32,
              lineHeight: 1,
              //   lineHeight: 39,
              color: theme.textColor,
              margin: 0,
            }}
          >
            Learn while you build on nearpad
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 400,
              fontSize: 20,
              //   lineHeight: 24,
              color: theme.textColor2,
              margin: 0,
            }}
          >
            Step-by-step tutorials that teach you how to build and deploy
            decentralized frontend.
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 2,
            pt: 3,
          }}
        >
          {loading
            ? Array.from(new Array(9)).map((item, index) => (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={350}
                  sx={{ mb: "1px", borderRadius: 1 }}
                />
              ))
            : projects?.map((project) => (
                <ProjectItem project={project} getData={getData} />
              ))}
        </Box>
      </Box>
    </Box>
  );
}
