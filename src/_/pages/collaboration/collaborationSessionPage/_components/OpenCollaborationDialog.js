import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputBase,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";
import CustomButton from "../../../../components/custom/CustomButton";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const pattern =
  /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(:[0-9]{1,5})?(\/[\w.-]*)*\/?$/;

export default function OpenCollaborationDialog({ open, setOpen }) {
  const history = useHistory();
  const { theme } = useContext(ThemeContext);

  const [collaborationId, setCollaborationId] = useState("");

  return (
    <Dialog
      open={open}
      onClose={() => setOpen((e) => !e)}
      fullWidth={true}
      maxWidth="xs"
      PaperProps={{ style: { backgroundColor: theme.ui, borderRadius: 4 } }}
    >
      <DialogTitle sx={{ padding: "16px 16px 16px 16px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 500, color: theme.textColor2 }}
        >
          Start Collaboration
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ padding: "16px" }}>
        {/* <label htmlFor="widget-src-input" className="form-label text-secondary">
          Collaboration ID
        </label> */}

        <InputBase
          sx={{
            width: "100%",
            paddingBlock: 1,
            paddingInline: 2,
            flex: 1,
            borderRadius: 0.5,
            color: theme.textColor,
            backgroundColor: theme.ui2,
          }}
          placeholder={`Collaboration ID`}
          value={collaborationId}
          onChange={(e) => setCollaborationId(e.target.value)}
        />
      </DialogContent>

      <DialogActions sx={{ padding: "0 16px 16px 0", gap: 1 }}>
        <CustomButton
          disabled={collaborationId?.length <= 3}
          sx={{
            textTransform: "none",
            fontWeight: 500,

            color: "#FFF",
            backgroundColor: theme.buttonColor,
            padding: "5px 30px",
            borderRadius: 0.5,
          }}
          onClick={() => {
            if (pattern.test(collaborationId)) {
              location.href = collaborationId;
            } else {
              history.push(`/collaboration/${collaborationId}`);
            }

            setOpen(false);
          }}
        >
          Open
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
