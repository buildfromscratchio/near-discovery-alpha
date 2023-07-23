import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import CustomButton from "../components/custom/CustomButton";
import { ThemeContext } from "../context/ThemeContext";
import CustomInput from "../components/custom/CustomInput";
import httpClient from "../libs/httpClient";
import { EditorContext } from "../context/EditorContext";

import { useCache, useNear } from "near-social-vm";

export default function CreatePullRequestDialog({ open, setOpen }) {
  const cache = useCache();
  const near = useNear();

  const { theme } = useContext(ThemeContext);
  const { forked, code } = useContext(EditorContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const getOriginalCode = () => {
    return new Promise((resolve, reject) => {
      const code = cache.socialGet(near, forked?.source);
      if (code) {
        resolve(code);
      } else {
        setTimeout(() => {
          getOriginalCode().then((code) => {
            resolve(code);
          });
        }, 250);
      }
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const originalCode = await getOriginalCode();

    const data = {
      fork: forked?._id,
      originalOwner: forked?.originalOwner,
      title,
      description,
      originalCode,
      updatedCode: code,
      network: forked?.network,
    };

    console.log("forked : ", forked, data);

    httpClient()
      .post("/pr", data)
      .then((res) => {
        setLoading(false);
        console.log(res);
        setOpen(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        setOpen(false);
      });
  };

  return (
    <>
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
            Create a pull request
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
          <CustomInput
            label="Title"
            placeholder="Enter pr title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <CustomInput
            label="Description"
            placeholder="Enter pr description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline={true}
            minRows={5}
            maxRows={7}
          />
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
            loading={loading}
            disabled={loading || title?.length <= 3}
            sx={{
              textTransform: "none",
              fontWeight: 500,

              color: "#FFF",
              backgroundColor:
                loading || title?.length <= 3
                  ? theme.buttonColor + 33
                  : theme.buttonColor,
              padding: "5px 30px",
              borderRadius: 0.5,
            }}
            onClick={() => handleSubmit()}
          >
            Create
          </CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
