import {
  Button,
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect } from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import PhonelinkRoundedIcon from "@mui/icons-material/PhonelinkRounded";
import LightModeIcon from "@mui/icons-material/LightMode";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

import { useAccount } from "near-social-vm";

import { ThemeContext } from "../../../../context/ThemeContext";
import { EditorContext } from "../../../../context/EditorContext";
import { useState } from "react";
import { useSnackbar } from "notistack";
import CreatePullRequestDialog from "../../../../dialogs/CreatePullRequestDialog";
import { MyEditorContext } from "../../MyEditorContext";
import ReactGA from "react-ga4";

export default function WidgetViewHeader({
  loading,

  allowTheming,
  setAllowTheming,

  onRunButtonClick,
  // onSaveButtonClick,
  onForkButtonClick,

  publishWidgetButton,

  //

  viewBox,
  setViewBox,

  requestSignIn,
}) {
  const { accountId } = useAccount();

  // const { showLiveCodePreview, setShowLiveCodePreview } =
  //   useContext(EditorContext);

  const {
    forked,
    filesDetails,

    path,
    lastPath,

    PublishDraftAsMainButton,
    PublishButton,

    setShowPreview,
  } = useContext(MyEditorContext);

  const { theme } = useContext(ThemeContext);

  const [showCreatePullRequestDialog, setShowCreatePullRequestDialog] =
    useState(false);

  const handleOpenInNewTab = () => {
    // Replace 'https://www.example.com' with your desired URL
    const newWindow = window.open(
      "",
      "_blank",
      "width=1200,height=730,location=no,menubar=no,toolbar=no"
    );

    if (newWindow) {
      newWindow.location.href = "/preview";
    } else {
      console.error("Popup blocked.");
    }
  };
  return (
    <>
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
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="h6"
            sx={{ color: theme.textColor2, width: "100%" }}
          >
            Preview
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <Tooltip title="Upload to Github" placement="bottom">
          <IconButton onClick={() => handlePostInGithub()}>
            <GitHubIcon sx={{ fontSize: "1.25rem", fill: theme.textColor2 }} />
          </IconButton>
        </Tooltip> */}

          {loading && <CircularProgress thickness={6} size={18} />}

          {/* <Tooltip title="Run" placement="bottom">
            <IconButton
              sx={{
                color: theme.buttonColor,
                "&:hover": {
                  backgroundColor: theme.buttonColor + 66,
                },
              }}
              onClick={onRunButtonClick}
            >
              <PlayArrowRoundedIcon
                sx={{ fontSize: "1.75rem", fill: theme.buttonColor }}
              />
            </IconButton>
          </Tooltip>

          <Tooltip title="Toggle Live Preview" placement="bottom">
            <IconButton onClick={() => setShowLiveCodePreview((e) => !e)}>
              {showLiveCodePreview ? (
                <VisibilityRoundedIcon
                  sx={{
                    fill: theme.textColor2,
                    fontSize: "1.25rem",
                  }}
                />
              ) : (
                <VisibilityOffRoundedIcon
                  sx={{
                    fill: theme.textColor2,
                    fontSize: "1.25rem",
                  }}
                />
              )}
            </IconButton>
          </Tooltip>

          <div
            style={{
              width: 1.5,
              height: 25,
              marginInline: 8,
              backgroundColor: theme.borderColor,
            }}
          /> */}

          <Tooltip title="Open preview in new tab" placement="bottom">
            <IconButton
              onClick={() => {
                handleOpenInNewTab();

                setShowPreview(false);
              }}
            >
              <OpenInNewRoundedIcon
                sx={{
                  fill: theme.textColor2,
                  fontSize: "1.25rem",
                }}
              />
            </IconButton>
          </Tooltip>

          <div
            style={{
              width: 1.5,
              height: 25,
              marginInline: 8,
              backgroundColor: theme.borderColor,
            }}
          />

          <Tooltip title="Toggle Theme" placement="bottom">
            <IconButton onClick={() => setAllowTheming((e) => !e)}>
              {allowTheming ? (
                <DarkModeIcon
                  sx={{
                    fill: theme.textColor2,
                    fontSize: "1.25rem",
                  }}
                />
              ) : (
                <LightModeIcon
                  sx={{
                    fill: theme.textColor2,
                    fontSize: "1.25rem",
                  }}
                />
              )}
            </IconButton>
          </Tooltip>

          <MultiViewMenu viewBox={viewBox} setViewBox={setViewBox} />

          <OpenInNewTabMenu />

          <div
            style={{
              width: 1.5,
              height: 25,
              marginInline: 8,
              backgroundColor: theme.borderColor,
            }}
          />

          {forked && (
            <Tooltip title="Create Pull Request" placement="bottom">
              <IconButton
                onClick={() => setShowCreatePullRequestDialog((e) => !e)}
                sx={{ mr: 1 }}
              >
                <svg
                  fill={theme.buttonColor}
                  width="16px"
                  height="16px"
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M192,96a64,64,0,1,0-96,55.39V360.61a64,64,0,1,0,64,0V151.39A64,64,0,0,0,192,96ZM128,64A32,32,0,1,1,96,96,32,32,0,0,1,128,64Zm0,384a32,32,0,1,1,32-32A32,32,0,0,1,128,448Z" />
                  <path d="M416,360.61V156a92.1,92.1,0,0,0-92-92H304V32a16,16,0,0,0-27.31-11.31l-64,64a16,16,0,0,0,0,22.62l64,64A16,16,0,0,0,304,160V128h20a28,28,0,0,1,28,28V360.61a64,64,0,1,0,64,0ZM384,448a32,32,0,1,1,32-32A32,32,0,0,1,384,448Z" />
                </svg>
              </IconButton>
            </Tooltip>
          )}

          {/* {publishWidgetButton} */}

          {accountId ? (
            filesDetails?.find(
              (item) => item.name === (path?.name || lastPath?.name)
            )?.isDraft ? (
              <PublishDraftAsMainButton />
            ) : (
              <PublishButton />
            )
          ) : (
            <button
              className="btn btn-primary"
              style={{
                backgroundColor: theme.buttonColor,
                paddingInline: 16,
                borderRadius: 4,
                fontWeight: 500,
              }}
              onClick={() => {
                requestSignIn();
                ReactGA.event({
                  category: "SignIn",
                  action: "signin",
                });
              }}
            >
              Connect
            </button>
          )}
        </Box>
      </Box>

      <CreatePullRequestDialog
        open={showCreatePullRequestDialog}
        setOpen={setShowCreatePullRequestDialog}
      />
    </>
  );
}

const MultiViewMenu = ({ viewBox, setViewBox }) => {
  const { theme } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Responsive Preview" placement="bottom">
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <PhonelinkRoundedIcon
            sx={{ fill: theme.textColor2, fontSize: "1rem" }}
          />
        </IconButton>
      </Tooltip>

      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: "25ch",
            backgroundColor: theme.backgroundColor,
          },
        }}
      >
        <MenuItem
          sx={{
            backgroundColor: viewBox === "" ? theme.textColor3 + 33 : theme.ui,
          }}
          onClick={() => {
            setViewBox("");
            handleClose();
          }}
        >
          <ListItemText sx={{ color: theme.textColor3, fontWeight: 700 }}>
            Default
          </ListItemText>
        </MenuItem>

        <MenuItem
          sx={{
            backgroundColor:
              viewBox === "phone" ? theme.textColor3 + 33 : theme.ui,
          }}
          onClick={() => {
            setViewBox("phone");
            handleClose();
          }}
        >
          <ListItemText sx={{ color: theme.textColor3, fontWeight: 700 }}>
            Mobile <Typography variant="p2">(320X675)</Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem
          sx={{
            backgroundColor:
              viewBox === "tablet" ? theme.textColor3 + 33 : theme.ui,
          }}
          onClick={() => {
            setViewBox("tablet");
            handleClose();
          }}
        >
          <ListItemText sx={{ color: theme.textColor3, fontWeight: 700 }}>
            Tablet <Typography variant="p2">(768X1024)</Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem
          sx={{
            backgroundColor:
              viewBox === "desktop" ? theme.textColor3 + 33 : theme.ui,
          }}
          onClick={() => {
            setViewBox("desktop");
            handleClose();
          }}
        >
          <ListItemText sx={{ color: theme.textColor3, fontWeight: 700 }}>
            Desktop <Typography variant="p2">(1400X800)</Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const OpenInNewTabMenu = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { accountId } = useAccount();

  const { theme } = useContext(ThemeContext);
  const { lastPath, filesDetails, files } = useContext(MyEditorContext);

  const widgetSrc = `${accountId}/widget/${lastPath?.name}`;

  const [isDraft, setIsDraft] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    const { codeChangesPresent, isDraft } =
      filesDetails?.find((item) => item.name === lastPath?.name) || {};

    setIsDraft(isDraft);

    if (isDraft) {
      enqueueSnackbar(
        "Please publish the component before opening in a new tab.",
        {
          variant: "warning",
        }
      );

      return;
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Open in a new tab" placement="bottom">
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <PublicRoundedIcon
            sx={{ fill: theme.textColor2, fontSize: "1rem" }}
          />
        </IconButton>
      </Tooltip>

      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            // maxHeight: 3 * 4.5,
            width: "20ch",

            backgroundColor: theme.backgroundColor,
          },
        }}
      >
        {isDraft ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="p1"
              sx={{
                color: theme.textColor3,
                textAlign: "center",
                padding: "4px 8px",
                fontWeight: 600,
              }}
            >
              Please publish the component before opening in a new tag.
            </Typography>
          </Box>
        ) : (
          <>
            <a href={`https://nearpad.dev/${widgetSrc}`} target="_blank">
              <MenuItem>
                <ListItemText
                  sx={{ color: theme.buttonColor, fontWeight: 700 }}
                >
                  nearpad.dev
                </ListItemText>

                <ListItemIcon style={{ minWidth: 16 }}>
                  <OpenInNewRoundedIcon
                    sx={{ fill: theme.buttonColor, fontSize: "1rem" }}
                  />
                </ListItemIcon>
              </MenuItem>
            </a>

            <a href={`https://near.org/${widgetSrc}`} target="_blank">
              <MenuItem>
                <ListItemText sx={{ color: theme.textColor }}>
                  near.org
                </ListItemText>

                <ListItemIcon style={{ minWidth: 16 }}>
                  <OpenInNewRoundedIcon
                    sx={{ fill: theme.textColor2, fontSize: "1rem" }}
                  />
                </ListItemIcon>
              </MenuItem>
            </a>

            <a href={`https://near.social/${widgetSrc}`} target="_blank">
              <MenuItem>
                <ListItemText sx={{ color: theme.textColor }}>
                  near.social
                </ListItemText>

                <ListItemIcon style={{ minWidth: 16 }}>
                  <OpenInNewRoundedIcon
                    sx={{ fill: theme.textColor2, fontSize: "1rem" }}
                  />
                </ListItemIcon>
              </MenuItem>
            </a>

            <a href={`https://bos.gg/#/${widgetSrc}`} target="_blank">
              <MenuItem>
                <ListItemText sx={{ color: theme.textColor }}>
                  bos.gg
                </ListItemText>

                <ListItemIcon style={{ minWidth: 16 }}>
                  <OpenInNewRoundedIcon
                    sx={{ fill: theme.textColor2, fontSize: "1rem" }}
                  />
                </ListItemIcon>
              </MenuItem>
            </a>
          </>
        )}
      </Menu>
    </>
  );
};
