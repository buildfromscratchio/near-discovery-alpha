import { Box, Button, Divider, Typography } from "@mui/material";
import React from "react";
import Activitybar from "../../components/Activitybar";
import { Allotment } from "allotment";
import VerticalCodePreview from "../../components/VerticalCodePreview";
import { useEffect } from "react";
import { useContext } from "react";
import { EditorContext } from "../../context/EditorContext";
import { LearnContext } from "../../context/LearnContext";
import MdEditor from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import CustomInput from "../../components/custom/CustomInput";
import { EmptyPage } from "../learnPage/LearnPage";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function CreateLearnPage(props) {
  const { selectedActivity, setSelectedActivity } = useContext(EditorContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState([]);

  const [selectedSection, setSelectedSection] = useState();

  useEffect(() => {
    setSelectedActivity("learn");
  }, []);

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
          defaultSizes={selectedSection?.name ? [100, 200, 200] : [100, 300]}
        >
          <Allotment.Pane minSize={200} visible={selectedActivity === "learn"}>
            {/* LearnSidebar */}
            <SetupProjectSection
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
            />
          </Allotment.Pane>

          {/* <AddSectionView /> */}

          {selectedSection?.name ? (
            <AddSectionView {...selectedSection} />
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

const AddSectionView = ({ name, description, code }) => {
  return (
    <Allotment>
      <Allotment.Pane minSize={200}>
        <DetailSection name={name} description={description} />
      </Allotment.Pane>

      <VerticalCodePreview initialCode={code} />
    </Allotment>
  );
};

const SetupProjectSection = ({
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
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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
          }}
        >
          Save
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
      </Box>

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
                name: `Step: ${sections?.length}`,
                discription: "",
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
                  selectedSection === section
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
                setSelectedSection(section === selectedSection ? {} : section);
              }}
            >
              <Typography variant="p1">
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
  name: initialName,
  description: initialDescription,
}) => {
  const { theme } = useContext(ThemeContext);

  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
  }, [initialName, initialDescription]);

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
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ backgroundColor: theme.ui }}
      />

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
          modelValue={description}
          onChange={setDescription}
          placeholder="Enter project description"
        />
      </Box>
    </Box>
  );
};
