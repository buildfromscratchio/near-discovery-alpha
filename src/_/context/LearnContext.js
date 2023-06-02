import React, { useState, createContext, useEffect } from "react";
import httpClient from "../libs/httpClient";

export const LearnContext = createContext();

export const LearnContextProvider = (props) => {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState();

  const [selectedItem, setSelectedItem] = useState({
    projectId: "",
    sectionId: "",
  });

  const [selectedProject, setSelectedProject] = useState();
  const [selectedSection, setSelectedSection] = useState();

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

  useEffect(() => {
    loadSelectedProject();
  }, []);
  const loadSelectedProject = async () => {
    let data = await localStorage.getItem("selectedProject");
    setSelectedItem(JSON.parse(data));
  };

  useEffect(() => {
    if (selectedItem?.projectId) {
      setSelectedProject(
        projects?.find((p) => p?._id === selectedItem.projectId)
      );
    }
    if (selectedItem?.sectionId && selectedProject) {
      setSelectedSection(
        selectedProject?.sections?.find(
          (s) => s?._id === selectedItem.sectionId
        )
      );
    }
  }, [selectedItem, selectedProject]);

  const goBack = () => {
    let state = {
      projectId: "",
      sectionId: "",
    };

    setSelectedProject({});
    setSelectedSection({});

    setSelectedItem(state);
    localStorage.setItem("selectedProject", JSON.stringify(state));
  };

  return (
    <LearnContext.Provider
      value={{
        loading,
        projects,
        setProjects,

        selectedItem,
        setSelectedItem,
        //
        selectedProject,
        setSelectedProject,
        selectedSection,
        setSelectedSection,
        //
        goBack,
      }}
    >
      {props.children}
    </LearnContext.Provider>
  );
};

export default LearnContextProvider;
