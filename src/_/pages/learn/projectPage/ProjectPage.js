import React, { useState, useEffect, useContext } from "react";
import { Allotment } from "allotment";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import { EditorContext } from "../../../context/EditorContext";
import { ThemeContext } from "../../../context/ThemeContext";
import httpClient from "../../../libs/httpClient";

import Activitybar from "../../../components/Activitybar";
import LearnSidebar from "../../../components/sidebar/LearnSidebar";
import VerticalCodePreview from "../../../components/VerticalCodePreview";
import MarkdownViewer from "../../../components/MarkdownViewer";
import EmptyPage from "../../../components/EmptyPage";

export default function ProjectPage(props) {
  const { projectSlug } = useParams();
  const { selectedActivity, setSelectedActivity } = useContext(EditorContext);

  useEffect(() => {
    if (!selectedActivity) setSelectedActivity("learn");
  }, [selectedSection]);

  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState();
  const [selectedSection, setSelectedSection] = useState();
  const [code, setCode] = useState("");

  useEffect(() => {
    getData();
  }, [projectSlug]);

  const getData = () => {
    setLoading(true);
    // console.log("result: ");
    httpClient()
      .get(`/learn/${projectSlug}`)
      .then((res) => {
        // console.log(res.data);
        setProject(res.data);
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err);
        setLoading(false);
      });
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
      }}
    >
      <Activitybar {...props} />

      <Box sx={{ flex: 1 }}>
        <Allotment
          maxSize="100%"
          sx={{ height: "100vh" }}
          defaultSizes={[100, 200, 200]}
        >
          <Allotment.Pane minSize={200} visible={selectedActivity === "learn"}>
            <LearnSidebar
              loading={loading}
              project={project}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
            />
          </Allotment.Pane>

          <Allotment.Pane
            minSize={200}
            // visible={selectedSection ? true : false}
          >
            <Projectbar project={project} selectedSection={selectedSection} />
          </Allotment.Pane>

          {selectedSection?.code ? (
            <VerticalCodePreview
              initialCode={selectedSection?.code}
              code={code}
              setCode={setCode}
            />
          ) : (
            <Allotment.Pane minSize={200}>
              <EmptyPage />
            </Allotment.Pane>
          )}
        </Allotment>
      </Box>
    </Box>
  );
}

const Projectbar = ({ project, selectedSection }) => {
  const { theme } = useContext(ThemeContext);
  // const {
  //   //  selectedProject, selectedItem, setSelectedItem,
  //   selectedSection,
  // } = useContext(LearnContext);
  // console.log(selectedSection);

  return (
    <Box sx={{ height: "100%", overflowY: "auto", backgroundColor: theme.ui }}>
      <Box
        sx={{
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: 1,
          borderBottom: `1px solid ${theme.borderColor}`,
          backgroundColor: theme.backgroundColor,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 500, color: theme.textColor }}
        >
          {selectedSection?.name || "Description"}
        </Typography>
      </Box>
      <Box>
        <Box sx={{ p: 1 }}>
          {/* <div
            className="dangerousStyle"
            style={{ color: theme.textColor }}
            dangerouslySetInnerHTML={{ __html: selectedSection?.description }}
          /> */}

          {console.log(
            "selectedSection?.description : ",
            selectedSection?.description
          )}
          {selectedSection ? (
            <MarkdownViewer src={selectedSection?.description} />
          ) : (
            <div style={{ color: theme.textColor }}>
              {project?.coverArt && (
                <img
                  style={{
                    width: "100%",
                    maxWidth: 1000,
                    borderRadius: 4,
                    maxHeight: 400,
                    objectFit: "cover",
                  }}
                  src={project?.coverArt}
                  alt={project?.name}
                />
              )}
              {project?.description && (
                <MarkdownViewer src={project?.description} />
              )}
            </div>
          )}
          {/* <Widget
              src="saidulbadhon.near/widget/LearnPage.Markdown"
              props={{ text: selectedSection?.description, theme: theme }}
          /> */}
        </Box>
      </Box>
    </Box>
  );
};
