import { Box, Button, Divider, Typography } from "@mui/material";
import React from "react";
import Activitybar from "../../components/Activitybar";
import { Allotment } from "allotment";
import VerticalCodePreview from "../../components/VerticalCodePreview";
import { useEffect } from "react";
import { useContext } from "react";
import { EditorContext as OurEditorContext } from "../../context/EditorContext";
// import MdEditor from "md-editor-rt";
// import "md-editor-rt/lib/style.css";

import MDEditor from "@uiw/react-md-editor";

import { useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import CustomInput from "../../components/custom/CustomInput";
import { EmptyPage } from "../learnPage/LearnPage";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import httpClient from "../../libs/httpClient";
import { useHistory, useParams } from "react-router-dom";

export default function CreateLearnPage(props) {
  const { projectId } = useParams();
  const history = useHistory();
  const { theme } = useContext(ThemeContext);
  const { selectedActivity, setSelectedActivity } =
    useContext(OurEditorContext);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState([]);

  const [selectedSection, setSelectedSection] = useState();

  useEffect(() => {
    setSelectedActivity("learn");
  }, []);
  useEffect(() => {
    if (projectId) {
      getData();
    }
  }, [projectId]);

  const getData = () => {
    httpClient()
      .get(`/learn/${projectId}`)
      .then((res) => {
        setName(res.data.name);
        setDescription(res.data.description);
        setSections(
          res.data.sections?.map((s) => {
            return {
              code: s.code,
              description: s.description,
              name: s.name,
              localId: s._id,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSubmit = () => {
    const data = {
      name,
      description,
      sections,
    };
    setLoading(true);

    if (projectId) {
      httpClient()
        .put(`/learn/${projectId}`, data)
        .then((res) => {
          setLoading(false);
          console.log(res.data);
          history.push("/learn");
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      httpClient()
        .post("/learn", data)
        .then((res) => {
          setLoading(false);
          console.log(res.data);
          history.push("/learn");
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        backgroundColor: theme.ui,
      }}
    >
      <Activitybar {...props} />

      <Box sx={{ flex: 1 }}>
        <Allotment
          maxSize="100%"
          sx={{ height: "100vh" }}
          defaultSizes={selectedSection?.name ? [100, 200, 200] : [100, 300]}
        >
          <Allotment.Pane minSize={200} visible={selectedActivity === "learn"}>
            <SetupProjectSection
              loading={loading}
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
              //
              sections={sections}
              setSections={setSections}
              //
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              //
              onSubmit={onSubmit}
              projectId={projectId}
            />
          </Allotment.Pane>

          {selectedSection?.localId ? (
            <AddSectionView
              selectedSection={selectedSection}
              sections={sections}
              setSections={setSections}
            />
          ) : (
            <Allotment.Pane minSize={400}>
              <EmptyPage />
            </Allotment.Pane>
          )}
        </Allotment>
      </Box>
    </Box>
  );
}

const AddSectionView = ({ selectedSection, sections, setSections }) => {
  const updateItem = (id, updatedItem) => {
    setSections((prevItems) =>
      prevItems.map((item) => {
        if (item.localId === id) {
          console.log(item, updatedItem, selectedSection.name, id);
          return { ...item, ...updatedItem };
        }

        return item;
      })
    );
  };

  return (
    <Allotment>
      <Allotment.Pane minSize={200}>
        <DetailSection
          selectedSection={selectedSection}
          //
          sections={sections}
          setSections={setSections}
        />
      </Allotment.Pane>

      <VerticalCodePreview
        initialCode={selectedSection?.code}
        code={
          sections?.find((s) => s.localId === selectedSection.localId)?.code
        }
        setCode={(e) => updateItem(selectedSection?.localId, { code: e })}
      />
    </Allotment>
  );
};

const SetupProjectSection = ({
  loading,
  name,
  setName,
  description,
  setDescription,
  //
  sections,
  setSections,
  //
  selectedSection,
  setSelectedSection,
  //
  onSubmit,
  projectId,
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Box
      sx={{
        m: 1,
        borderRadius: 0.5,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: theme.textColor2, fontWeight: 600 }}
        >
          Content
        </Typography>
        <Button
          disabled={name?.length < 1 || description?.length < 1}
          sx={{
            backgroundColor: theme.buttonColor,
            color: theme.buttonTextColor,
            textTransform: "none",

            paddingX: 3,
            height: 35,

            transition: "all .2s ease-in-out",
            "&:hover": {
              opacity: 0.75,
              backgroundColor: theme.buttonColor,
            },

            "&:disabled": {
              backgroundColor: theme.textColor3 + 33,
              color: theme.textColor3,
            },
          }}
          onClick={() => onSubmit()}
        >
          {loading ? "Loading..." : projectId ? "Update" : "Save"}
        </Button>
      </Box>

      <Divider />

      <CustomInput
        label="Name"
        placeholder="Enter project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ backgroundColor: theme.ui }}
      />

      {/* <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography
          variant="p1"
          sx={{ color: theme.textColor2, fontWeight: 500 }}
        >
          Description:
        </Typography>

        <MdEditor
          style={{
            backgroundColor: theme.backgroundColor,
            height: 275,
            borderRadius: 4,
          }}
          toolbars={[]}
          language="en-US"
          preview={false}
          modelValue={description}
          onChange={setDescription}
          placeholder="Enter project description"
        />
      </Box> */}

      <div data-color-mode={theme.name} style={{ padding: 1 }}>
        <Typography
          variant="p1"
          style={{ color: theme.textColor2, fontWeight: 500 }}
        >
          Description:
        </Typography>
        <div style={{ height: 8 }} />
        <MDEditor
          height="300px"
          value={description}
          onChange={setDescription}
          preview="edit"
          // extraCommands={[codePreview, commands.fullscreen]}
          // extraCommands={[codePreview]}
        />
        {/* <MDEditor.Markdown
          source={
            sections?.find((s) => s.localId === selectedSection.localId)?.description
          }
          style={{ whiteSpace: "pre-wrap" }}
        /> */}
      </div>

      <Box>
        <Button
          sx={{
            textTransform: "none",
            backgroundColor: theme.backgroundColor,
            border: `1px ${theme.borderColor} solid`,
            px: 2,
          }}
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={() =>
            setSections((e) => [
              ...e,
              {
                localId:
                  Math.floor(Math.random() * (100000000 - 1000 + 1)) + 1000,
                name: `Step: ${sections?.length + 1}`,
                description: "",
                code: "return <div>Hello World</div>;",
              },
            ])
          }
        >
          Add Section
        </Button>

        <Box sx={{ mt: 1 }}>
          {sections?.map((section, index) => (
            <Button
              key={index}
              sx={{
                textTransform: "none",
                width: "100%",
                backgroundColor:
                  selectedSection?.localId === section?.localId
                    ? `${theme?.buttonColor}22 !important`
                    : theme.backgroundColor,
                p: 1,

                display: "flex",
                justifyContent: "flex-start",

                borderTopLeftRadius: index === 0 ? 3 : 0,
                borderTopRightRadius: index === 0 ? 3 : 0,
                borderBottomLeftRadius: index === sections?.length - 1 ? 3 : 0,
                borderBottomRightRadius: index === sections?.length - 1 ? 3 : 0,
                borderBottom:
                  index === sections?.length - 1
                    ? "none"
                    : `1px ${theme.borderColor} solid`,
              }}
              onClick={() => {
                setSelectedSection(
                  section?.localId === selectedSection?.localId ? {} : section
                );
              }}
            >
              <Typography
                variant="p1"
                sx={{
                  wordBreak: "break-all",
                  textAlign: "left",
                }}
              >
                {index + 1}: {section?.name}
              </Typography>
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const DetailSection = ({
  selectedSection,
  //
  sections,
  setSections,
}) => {
  const { theme } = useContext(ThemeContext);

  const updateItem = (id, updatedItem) => {
    setSections((prevItems) =>
      prevItems.map((item) => {
        if (item.localId === id) {
          console.log(item, updatedItem, selectedSection.name, id);
          return { ...item, ...updatedItem };
        }

        return item;
      })
    );
  };

  return (
    <Box
      sx={{
        m: 1,
        borderRadius: 0.5,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <CustomInput
        label="Name"
        placeholder="Enter project name"
        value={
          sections?.find((s) => s.localId === selectedSection.localId)?.name
        }
        onChange={(e) =>
          updateItem(selectedSection?.localId, { name: e.target.value })
        }
        sx={{ backgroundColor: theme.ui }}
      />

      {/* <CustomInput
        label="Description"
        placeholder="Enter project description"
        value={
          sections?.find((s) => s.localId === selectedSection.localId)?.description
        }
        onChange={(e) =>
          updateItem(selectedSection?.localId, { description: e.target.value })
        }
        sx={{ backgroundColor: theme.ui, height: "100%" }}
        multiline={true}
        rows={15}
      /> */}

      <div data-color-mode={theme.name} style={{}}>
        <Typography
          variant="p1"
          sx={{ color: theme.textColor2, fontWeight: 500, pb: 1 }}
        >
          Description:
        </Typography>
        <div style={{ height: 8 }} />

        <MDEditor
          height="calc(100vh - 115px)"
          value={
            sections?.find((s) => s.localId === selectedSection.localId)
              ?.description
          }
          onChange={(e) =>
            updateItem(selectedSection?.localId, { description: e })
          }
          preview="edit"
          // extraCommands={[codePreview, commands.fullscreen]}
          // extraCommands={[codePreview]}
        />
        {/* <MDEditor.Markdown
          source={
            sections?.find((s) => s.localId === selectedSection.localId)?.description
          }
          style={{ whiteSpace: "pre-wrap" }}
        /> */}
      </div>

      {/* 
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography
            variant="p1"
            sx={{ color: theme.textColor2, fontWeight: 500 }}
          >
            Description:
          </Typography>

          <MdEditor
            style={{
              backgroundColor: theme.backgroundColor,
              height: "max(300px, (calc(100vh - 140px)))",
              borderRadius: 4,
            }}
            toolbars={[]}
            language="en-US"
            preview={false}
            modelValue={
              sections?.find((s) => s.localId === selectedSection.localId)?.description
            }
            onChange={(e) => updateItem(selectedSection?.localId, { description: e })}
            placeholder="Enter project description"
          />
        </Box> 
      */}
    </Box>
  );
};
