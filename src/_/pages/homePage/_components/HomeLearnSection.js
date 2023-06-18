import React, { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { Box, ButtonBase, Skeleton, Typography } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import httpClient from "../../../libs/httpClient";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { Link } from "react-router-dom";
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
      .get("/learn")
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
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
            Learn with nearPad
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
            Near Web3 and Blockchain with the NEAR community.
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

// <Link to={`/learn/${project?.slug || project?._id}`}>
//   <ButtonBase
//     sx={{
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       gap: 16,
//       width: "100%",
//       borderRadius: 3,
//       zIndex: 1070,
//       background: "#fff",
//       border: "1px solid #eceef0",
//       boxShadow:
//         "0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)",
//       overflow: "hidden",
//       padding: 2,

//       transition: "all 0.2s ease-in-out",

//       "&:hover *": {
//         fill: theme.buttonColor,
//       },
//     }}
//   >
//     <Box sx={{ display: "flex", flexDirection: "column" }}>
//       <Typography
//         variant="p"
//         sx={{
//           fontWeight: 600,
//           color: theme.textColor,
//           textAlign: "left",
//         }}
//       >
//         {project?.name}
//       </Typography>
//       <Typography
//         variant="p1"
//         sx={{
//           fontWeight: 400,
//           color: theme.textColor3,
//           fontSize: "1rem",
//           textAlign: "left",
//         }}
//       >
//         {project?.sections.length} section
//       </Typography>
//     </Box>

//     <InsertLinkIcon
//       sx={{ transition: "all 0.2s ease-in-out" }}
//     />
//   </ButtonBase>
// </Link>
