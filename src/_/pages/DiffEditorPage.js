import React, { useEffect } from "react";
import PagesContainer from "../components/PagesContainer";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { EditorContext } from "../context/EditorContext";
import { useState } from "react";
import { useParams } from "react-router-dom";
import httpClient from "../libs/httpClient";
import { useRef } from "react";
import { DiffEditor } from "@monaco-editor/react";
import {
  Widget,
  useCache,
  useNear,
  CommitButton,
  useAccountId,
} from "near-social-vm";
import LoadingPage from "../components/LoadingPage";

export default function DiffEditorPage(props) {
  const near = useNear();
  const { prId } = useParams();

  const { theme } = useContext(ThemeContext);
  const { setSelectedActivity } = useContext(EditorContext);

  const [loading, setLoading] = useState(false);
  const [pr, setPr] = useState();

  useEffect(() => {
    setSelectedActivity("diff");
  }, []);

  useEffect(() => {
    getData();
  }, [prId]);

  const getData = () => {
    setLoading(true);
    httpClient()
      .get(`/pr/${prId}`)
      .then((res) => {
        console.log("GETTING PR : ", res.data);
        setPr(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  //
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  function handleSubmit(status) {
    setLoadingSubmit(true);
    httpClient()
      .put(`/pr/${prId}`, { status })
      .then((res) => {
        console.log(res.data);
        document.getElementById("publishButton").click();
        setLoadingSubmit(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingSubmit(false);
      });
  }

  return (
    <PagesContainer {...props}>
      <Backdrop sx={{ color: "#fff", zIndex: 9999 }} open={loadingSubmit}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box
        sx={{
          paddingInline: 1,
          height: 50,
          minHeight: 50,
          backgroundColor: theme.backgroundColor,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",

          borderBottom: `1px solid ${theme.borderColor}`,
        }}
      >
        <Typography variant="h6" sx={{ color: theme.textColor }}>
          Diff
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            sx={{
              backgroundColor: theme.textColor3 + "20",
              color: theme.buttonColor,
              paddingInline: 2,
              borderRadius: 1,
              fontWeight: 500,
              textTransform: "none",
            }}
            onClick={() => handleSubmit("rejected")}
          >
            Reject
          </Button>

          <Button
            sx={{
              backgroundColor: theme.buttonColor,
              color: theme.buttonTextColor,
              paddingInline: 2,
              borderRadius: 1,
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                backgroundColor: theme.buttonColor + 99,
              },
            }}
            onClick={() => handleSubmit("merged")}
          >
            Marge Code
          </Button>

          <CommitButton
            id="publishButton"
            className={`btn btn-primary`}
            style={{
              backgroundColor: theme.buttonColor,

              paddingInline: 16,
              borderRadius: 4,

              fontWeight: 500,
              display: "none",
            }}
            //
            disabled={!pr?.fork?.source}
            near={near}
            data={{
              widget: {
                [pr?.fork?.componentName]: {
                  "": pr?.updatedCode,
                },
              },
            }}
          >
            Publish
          </CommitButton>
        </Box>
      </Box>

      {loading ? (
        <LoadingPage />
      ) : (
        <Box>
          <Box
            sx={{
              width: "100%",
              height: 50,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: theme.backgroundColor,
              borderBottom: `1px solid ${theme.borderColor}`,
              paddingInline: 1,
            }}
          >
            <Typography variant="h6" sx={{ color: theme.textColor }}>
              Mine
            </Typography>

            <Typography variant="h6" sx={{ color: theme.textColor }}>
              {pr?.createdBy?.name || pr?.createdBy?.userName}
            </Typography>
          </Box>

          <Box sx={{ minHeight: 750, height: "calc(100vh - 125px)" }}>
            <DiffEditor
              // height="90vh"
              language="javascript"
              original={pr?.originalCode}
              modified={pr?.updatedCode}
            />
          </Box>
        </Box>
      )}
    </PagesContainer>
  );
}
