import React, { useEffect } from "react";
import PagesContainer from "../components/PagesContainer";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import moment from "moment";
import { ThemeContext } from "../context/ThemeContext";
import { EditorContext } from "../context/EditorContext";
import { useState } from "react";
import { useParams } from "react-router-dom";
import httpClient from "../libs/httpClient";
import { DiffEditor } from "@monaco-editor/react";
import { useNear, CommitButton } from "near-social-vm";
import LoadingPage from "../components/LoadingPage";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router-dom";
import EmptyPage from "../components/EmptyPage";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { stringify } from "querystring";
import { AppContext } from "../context/AppContext";

export default function DiffEditorPage(props) {
  const history = useHistory();
  const near = useNear();
  const { prId } = useParams();

  const { theme } = useContext(ThemeContext);
  const { setSelectedActivity } = useContext(EditorContext);
  const { user } = useContext(AuthContext);
  const { getPrs } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [pr, setPr] = useState();

  const [isMine, setIsMine] = useState(false);

  useEffect(() => {
    setIsMine(pr?.createdBy?._id === user?._id);
  }, [pr, user?._id]);

  useEffect(() => {
    setSelectedActivity("prs");
  }, []);

  useEffect(() => {
    getData();
  }, [prId]);

  const getData = () => {
    setLoading(true);
    httpClient()
      .get(`/pr/${prId}`)
      .then((res) => {
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
  function handleSubmit(data) {
    setLoadingSubmit(true);
    httpClient()
      .put(`/pr/${prId}`, data)
      .then((res) => {
        console.log(res.data);
        if (data.status === "merged")
          document.getElementById("publishButton").click();

        history.replace(`/prs/`);

        getPrs();
        setLoadingSubmit(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingSubmit(false);
      });
  }

  const handleOpenInNewTab = (code) => {
    // Replace 'https://www.example.com' with your desired URL
    const newWindow = window.open(
      "",
      "_blank",
      "width=1200,height=730,location=no,menubar=no,toolbar=no"
    );

    const query = {
      code: JSON.stringify(code),
    };

    if (newWindow) {
      newWindow.location.href = `/preview?` + stringify(query);
    } else {
      console.error("Popup blocked.");
    }
  };

  return !prId ? (
    <PagesContainer {...props}>
      <EmptyPage />
    </PagesContainer>
  ) : (
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
          Code Diff
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          {!isMine ? (
            <>
              <Button
                sx={{
                  backgroundColor: theme.textColor3 + "20",
                  color: theme.buttonColor,
                  paddingInline: 2,
                  borderRadius: 1,
                  fontWeight: 500,
                  textTransform: "none",
                }}
                onClick={() => handleSubmit({ status: "rejected" })}
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
                onClick={() => handleSubmit({ status: "merged" })}
              >
                Marge
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
                onCommit={() => {
                  history.replace("/prs");
                }}
              >
                Publish
              </CommitButton>
            </>
          ) : (
            <Button
              sx={{
                backgroundColor: theme.buttonColor2,
                color: theme.buttonTextColor,
                paddingInline: 2,
                borderRadius: 1,
                fontWeight: 500,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: theme.buttonColor2 + 99,
                },
              }}
              onClick={() => handleSubmit({ isDeleted: true })}
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          backgroundColor: theme.backgroundColor,
          borderBottom: `1px solid ${theme.borderColor}`,
          paddingInline: 1,
          paddingBlock: 2,
        }}
      >
        <Typography variant="h2" sx={{ color: theme.textColor }}>
          {pr?.title}
        </Typography>
        <Typography variant="h6" sx={{ color: theme.textColor }}>
          {pr?.decription}
        </Typography>
        <Typography variant="span" sx={{ color: theme.textColor }}>
          PR created by{" "}
          <span style={{ fontWeight: 600 }}>
            {pr?.createdBy?.name || pr?.createdBy?.userName}
          </span>{" "}
          in <span style={{ fontWeight: 600 }}>{pr?.network}</span> -{" "}
          <span style={{ fontWeight: 600 }}>
            {moment(pr?.createdAt).fromNow()}
          </span>
        </Typography>
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="span" sx={{ color: theme.textColor }}>
                Original -{" "}
                <span style={{ fontWeight: 600 }}>{pr?.fork?.source}</span>
              </Typography>

              <Tooltip title="View Widget">
                <IconButton
                  sx={{ color: theme.buttonColor }}
                  onClick={() => handleOpenInNewTab(pr?.originalCode)}
                >
                  <VisibilityRoundedIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip title="View Widget">
                <IconButton
                  sx={{ color: theme.buttonColor }}
                  onClick={() => handleOpenInNewTab(pr?.updatedCode)}
                >
                  <VisibilityRoundedIcon />
                </IconButton>
              </Tooltip>

              <Typography variant="h6" sx={{ color: theme.textColor }}>
                Changed
              </Typography>
            </Box>
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
