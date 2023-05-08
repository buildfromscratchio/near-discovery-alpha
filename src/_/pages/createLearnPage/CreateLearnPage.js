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

export default function CreateLearnPage(props) {
  const { selectedActivity, setSelectedActivity } = useContext(EditorContext);
  const { selectedItem, selectedSection } = useContext(LearnContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!selectedActivity) setSelectedActivity("learn");
  }, [selectedSection]);

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
            {/* LearnSidebar */}
            <SetupProjectSection
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
            />
          </Allotment.Pane>

          <Allotment.Pane
            minSize={200}
            visible={selectedItem?.sectionId?.length > 0 ? true : false}
          >
            <AddSectionView />
          </Allotment.Pane>

          <VerticalCodePreview initialCode="return (<div><h1>Hello World</h1></div>)" />
        </Allotment>
      </Box>
    </Box>
  );
}

const SetupProjectSection = ({
  name,
  setName,
  description,
  setDescription,
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Box
      sx={{
        // border: `1px ${theme.borderColor} solid`,
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
    </Box>
  );
};

const AddSectionView = () => {
  return (
    <Box
      sx={{
        // border: `1px ${theme.borderColor} solid`,
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
    </Box>
  );
};
