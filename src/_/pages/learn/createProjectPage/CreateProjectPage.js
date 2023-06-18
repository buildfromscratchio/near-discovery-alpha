import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import React from "react";
import Activitybar from "../../../components/Activitybar";
import { Allotment } from "allotment";
import VerticalCodePreview from "../../../components/VerticalCodePreview";
import { useEffect } from "react";
import { useContext } from "react";
import { EditorContext as OurEditorContext } from "../../../context/EditorContext";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import MDEditor from "@uiw/react-md-editor";

import { useState } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import CustomInput from "../../../components/custom/CustomInput";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import httpClient from "../../../libs/httpClient";
import { useHistory, useParams } from "react-router-dom";
import EmptyPage from "../../../components/EmptyPage";
import { useSnackbar } from "notistack";
import CustomDropzone from "../../../components/custom/CustomDropzone";
import slugify from "../../../libs/slugify";
import addToObject from "../../../libs/addToObject";
import deletePhoto from "../../../libs/deletePhoto";
import uploadPhoto from "../../../libs/uploadPhoto";

export default function CreateProjectPage(props) {
  const { projectSlug } = useParams();
  const history = useHistory();
  const { theme } = useContext(ThemeContext);
  const { selectedActivity, setSelectedActivity } =
    useContext(OurEditorContext);

  const [loading, setLoading] = useState(false);

  const [coverArt, setCoverArt] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState([]);

  const [selectedSection, setSelectedSection] = useState();

  useEffect(() => {
    setSelectedActivity("learn");
  }, []);
  useEffect(() => {
    if (projectSlug) {
      getData();
    }
  }, [projectSlug]);

  const [selectedProject, setSelectedProject] = useState();
  const getData = () => {
    httpClient()
      .get(`/learn/${projectSlug}`)
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
        setSelectedProject(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSubmit = (status) => {
    coverArt?.length > 0
      ? handleUploadPhoto(status)
      : handleCreateOrUpdate("", status);
  };

  const handleUploadPhoto = async (status) => {
    // console.log("handleUploadPhoto");
    await uploadPhoto(coverArt[0], `learn/${slugify(name)}/coverArt`)
      .then((data) => {
        setLoading(false);
        console.log(data);
        handleCreateOrUpdate(data, status);
      })
      .catch((err) => {
        console.error("Error uploading photos: ", err);
        setLoading(false);
        // Handle the error here
      });
  };

  const handleCreateOrUpdate = (coverArtURL, status) => {
    let data = {
      name,
      description,
      sections,
      status,
    };

    if (coverArt?.length > 0) {
      data = addToObject(data, "coverArt", coverArtURL);
    } else if (selectedProject?.coverArt) {
      console.log("Please select", selectedProject.coverArt);
      data = addToObject(data, "coverArt", selectedProject.coverArt);
    }

    console.log("handleCreateOrUpdate Data : ", status);

    setLoading(true);

    if (projectSlug) {
      httpClient()
        .put(`/learn/${projectSlug}`, data)
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
              selectedProject={selectedProject}
              loading={loading}
              coverArt={coverArt}
              setCoverArt={setCoverArt}
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
              projectSlug={projectSlug}
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
  selectedProject,
  loading,
  coverArt,
  setCoverArt,
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
  projectSlug,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { theme } = useContext(ThemeContext);

  function handleDelete(url) {
    deletePhoto(selectedProject?.coverArt)
      .then((data) => {
        setLoading(true);

        httpClient()
          .put(`/learn/${projectSlug}`, { coverArt: "" })
          .then((res) => {
            console.log(res);
            setStore(res.data);
            setLoading(false);
            enqueueSnackbar(`Image deleted successfully`, {
              variant: "success",
            });
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
            // enqueueSnackbar(err?.response?.data?.message, { variant: "error" });
          });
      })
      .catch((err) => {
        console.log(err, err.stack);
      });
  }

  return (
    <Box
      sx={{
        // minHeight: "100vh",
        // maxHeight: "100%",
        height: "max(100vh, 700px)",
        overflowY: "hidden",
      }}
    >
      <Box
        sx={{
          borderRadius: 0.5,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          height: "100%",
          overflowY: "auto",
          paddingBottom: 3,
          p: 1,
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

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              disabled={name?.length < 1 || description?.length < 1}
              sx={{
                backgroundColor: theme.buttonColor + 33,
                color: theme.buttonColor,
                textTransform: "none",

                paddingX: 3,
                height: 35,

                transition: "all .2s ease-in-out",
                "&:hover": {
                  opacity: 0.75,
                  backgroundColor: theme.buttonColor + 66,
                  color: theme.buttonColor,
                },
                "&:disabled": {
                  backgroundColor: theme.textColor3 + 33,
                  color: theme.textColor3,
                },
              }}
              onClick={() => onSubmit("draft")}
            >
              Draft
            </Button>

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
              onClick={() => onSubmit("publish")}
            >
              {loading
                ? "Loading..."
                : selectedProject?.status === "publish"
                ? "Update"
                : "Publish"}
            </Button>
          </Box>
        </Box>

        <Divider />

        <CustomDropzone
          label="Cover Art"
          maxFiles={1}
          maxSize={50}
          value={coverArt}
          setValue={(e) => {
            console.log(e);
            setCoverArt(e);
          }}
          oldFiles={selectedProject?.coverArt && [selectedProject?.coverArt]}
          // fileToDelete={handleDelete}
          fileToDelete={(e) => handleDelete(e)}
        />

        <CustomInput
          label="Name"
          placeholder="Enter project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ backgroundColor: theme.ui }}
        />

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
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",

                  borderTopLeftRadius: index === 0 ? 3 : 0,
                  borderTopRightRadius: index === 0 ? 3 : 0,
                  borderBottomLeftRadius:
                    index === sections?.length - 1 ? 3 : 0,
                  borderBottomRightRadius:
                    index === sections?.length - 1 ? 3 : 0,
                  borderBottom:
                    index === sections?.length - 1
                      ? "none"
                      : `1px ${theme.borderColor} solid`,

                  backgroundColor:
                    selectedSection?.localId === section?.localId
                      ? `${theme?.buttonColor}22 !important`
                      : theme.backgroundColor,
                }}
              >
                <Button
                  sx={{
                    textTransform: "none",
                    width: "100%",

                    p: 1,

                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                  onClick={() => {
                    setSelectedSection(
                      section?.localId === selectedSection?.localId
                        ? {}
                        : section
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

                <IconButton
                  sx={{ color: theme.buttonColor2 }}
                  onClick={() => {
                    setSections((e) =>
                      e.filter((x) => x.name !== section.name)
                    );
                  }}
                >
                  <DeleteRoundedIcon
                    fontSize="small"
                    sx={{ color: theme.buttonColor2 }}
                  />
                </IconButton>
              </Box>
            ))}
          </Box>
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
