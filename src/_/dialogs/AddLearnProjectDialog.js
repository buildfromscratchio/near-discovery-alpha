import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputBase,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import CustomButton from "../components/custom/CustomButton";
import { ThemeContext } from "../context/ThemeContext";
import { useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Editor } from "@monaco-editor/react";
import MdEditor from "md-editor-rt";

export default function AddLearnProjectDialog({
  open,
  setOpen,
  onClick,
  label,
  description,
}) {
  const { theme } = useContext(ThemeContext);

  const [showSectionDialog, setShowSectionDialog] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [projectDiscription, setProjectDiscription] = useState("");

  const [sections, setSections] = useState([]);

  const styles = {
    inputBase: {
      width: "100%",
      paddingBlock: 0.5,
      paddingInline: 1,
      flex: 1,
      borderRadius: 0.5,
      color: theme.textColor,
      backgroundColor: theme.ui2,
    },
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen((e) => !e)}
        fullWidth={true}
        maxWidth="sm"
        PaperProps={{ style: { backgroundColor: theme.ui, borderRadius: 4 } }}
      >
        <DialogTitle sx={{ padding: "16px 16px 16px 16px" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 500, color: theme.textColor2 }}
          >
            Add Project
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <InputBase
            sx={styles.inputBase}
            placeholder={`Enter project name here`}
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          <InputBase
            sx={styles.inputBase}
            multiline
            rows={4}
            placeholder={`Enter project discription here`}
            value={projectDiscription}
            onChange={(e) => setProjectDiscription(e.target.value)}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ color: theme.textColor2 }}>
              Sections
            </Typography>
            <Button
              sx={{ borderRadius: 0.5, maxWidth: 150 }}
              startIcon={<AddRoundedIcon />}
              onClick={(e) => setShowSectionDialog((e) => !e)}
            >
              Add Sections
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {sections?.length > 0 ? (
              sections?.map((section, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: theme.ui2,
                    paddingBlock: 0.5,
                    paddingInline: 1,
                    borderRadius: 0.5,
                    color: theme.textColor,
                  }}
                >
                  {section.name}
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  py: 2,
                }}
              >
                <Typography
                  variant="p"
                  sx={{ color: theme.textColor3, textAlign: "center" }}
                >
                  Click "Add Sections" to add a new section
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ padding: "0 16px 16px 0", gap: 1 }}>
          <Button
            //   color="error"
            sx={{
              textTransform: "none",
              color: theme.textColor3,
              backgroundColor: theme.textColor3 + 11,
              padding: "5px 20px",
              borderRadius: 0.5,
            }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <CustomButton
            sx={{
              textTransform: "none",
              fontWeight: 500,

              color: "#FFF",
              backgroundColor: theme.buttonColor,
              padding: "5px 30px",
              borderRadius: 0.5,
            }}
            onClick={() => {
              setOpen(false);
            }}
          >
            Add
          </CustomButton>
        </DialogActions>
      </Dialog>

      <AddSectionDialog
        open={showSectionDialog}
        setOpen={setShowSectionDialog}
        sections={sections}
        setSections={setSections}
      />
    </>
  );
}

const AddSectionDialog = ({ open, setOpen, sections, setSections }) => {
  const { theme, editorFontSize } = useContext(ThemeContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");

  const styles = {
    inputBase: {
      width: "100%",
      paddingBlock: 0.5,
      paddingInline: 1,
      flex: 1,
      borderRadius: 0.5,
      color: theme.textColor,
      backgroundColor: theme.ui2,
    },
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen((e) => !e)}
      fullWidth={true}
      maxWidth="sm"
      PaperProps={{ style: { backgroundColor: theme.ui, borderRadius: 4 } }}
    >
      <DialogTitle sx={{ padding: "16px 16px 16px 16px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 500, color: theme.textColor2 }}
        >
          Add Section
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <InputBase
          sx={styles.inputBase}
          placeholder={`Enter project name here`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Box sx={{ width: "100%" }}>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
          >
            <Typography
              variant="h6"
              sx={{ color: theme.textColor2, fontWeight: 600 }}
            >
              Description:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: theme.textColor2,
                fontWeight: 600,
                color: "#bc002d",
              }}
            >
              *
            </Typography>
          </Box>

          <MdEditor
            style={{
              backgroundColor: theme.backgroundColor,
              height: 250,
              borderRadius: 4,
            }}
            toolbars={[]}
            language="en-US"
            preview={false}
            modelValue={description}
            onChange={setDescription}
          />
        </Box>

        {/* <InputBase
          sx={styles.inputBase}
          multiline
          rows={4}
          placeholder={`Enter project discription here`}
          value={discription}
          onChange={(e) => setDiscription(e.target.value)}
        /> */}

        {/* <InputBase
          sx={styles.inputBase}
          multiline
          rows={4}
          placeholder={`Enter project discription here`}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        /> */}

        <Box sx={{ width: "100%", height: 300 }}>
          <Editor
            theme={theme.name === "dark" ? "vs-dark" : "light"}
            options={{
              minimap: { enabled: false },

              wordWrap: "on",
              fontSize: editorFontSize || "16px",
            }}
            defaultLanguage="javascript"
            value={code}
            onChange={(props) => setCode(props)}
            style={{ backgroundColor: "#ff0000" }}
            //   wrapperProps={{ onBlur: () => format(code) }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: "0 16px 16px 0", gap: 1 }}>
        <Button
          //   color="error"
          sx={{
            textTransform: "none",
            color: theme.textColor3,
            backgroundColor: theme.textColor3 + 11,
            padding: "5px 20px",
            borderRadius: 0.5,
          }}
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <CustomButton
          sx={{
            textTransform: "none",
            fontWeight: 500,

            color: "#FFF",
            backgroundColor: theme.buttonColor,
            padding: "5px 30px",
            borderRadius: 0.5,
          }}
          onClick={() => {
            setSections((e) => [...e, { name, discription, code }]);
            setOpen(false);
          }}
        >
          Add
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};
