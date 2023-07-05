import {
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

import { useAccount } from "near-social-vm";

import { ThemeContext } from "../../../../context/ThemeContext";
import { EditorContext } from "../../../../context/EditorContext";
import { useState } from "react";
import { useSnackbar } from "notistack";

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
}) {
  const { showLiveCodePreview, setShowLiveCodePreview } =
    useContext(EditorContext);

  const { theme } = useContext(ThemeContext);

  // console.log(
  //   "pathname : ",
  //   pathname.substring(pathname.indexOf("/editor/") + 8)
  // );

  // console.warn = () => {};

  // // const [loading, setLoading] = useState(false);
  // const handlePostInGithub = () => {
  //   // setLoading(true);

  //   httpClient()
  //     .get("/github")
  //     .then((res) => {
  //       // setProjects(res.data);
  //       // setLoading(false);

  //       // console.log("handlePostInGithub : ", res.data);
  //     })
  //     .catch((err) => {
  //       // console.log(err);
  //       // setLoading(false);
  //     });
  // };

  return (
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

        {/* <Tooltip
          title={`Live Preview: ${showLiveCodePreview ? "On" : "Off"}`}
          placement="bottom"
        >
          <IconButton
            sx={{ color: theme.buttonTextColor }}
            onClick={() => setShowLiveCodePreview((e) => !e)}
          >
            <VisibilityRoundedIcon
              sx={{
                fill: showLiveCodePreview
                  ? theme.buttonColor
                  : theme.textColor2,
              }}
            />
          </IconButton>
        </Tooltip> */}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* <Tooltip title="Upload to Github" placement="bottom">
          <IconButton onClick={() => handlePostInGithub()}>
            <GitHubIcon sx={{ fontSize: "1.25rem", fill: theme.textColor2 }} />
          </IconButton>
        </Tooltip> */}

        {loading && <CircularProgress thickness={6} size={18} />}

        {/* <Tooltip title="Preview Widget" placement="bottom">
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
        </Tooltip> */}

        <div
          style={{
            width: 1.5,
            height: 25,
            marginInline: 8,
            backgroundColor: theme.borderColor,
          }}
        />
        {/*  <Tooltip title="Fork Widget" placement="bottom">
          <IconButton
            sx={{ color: theme.textColor2 }}
            onClick={onForkButtonClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              fill={theme.textColor2}
              width=".8em"
              height=".8em"
            >
              <path d="M80 128a48 48 0 100-96 48 48 0 100 96zm80-48c0 38.7-27.5 71-64 78.4V192c0 26.5 21.5 48 48 48h160c26.5 0 48-21.5 48-48v-33.6c-36.5-7.4-64-39.7-64-78.4 0-44.2 35.8-80 80-80s80 35.8 80 80c0 38.7-27.5 71-64 78.4V192c0 44.2-35.8 80-80 80h-64v81.6c36.5 7.4 64 39.7 64 78.4 0 44.2-35.8 80-80 80s-80-35.8-80-80c0-38.7 27.5-71 64-78.4V272h-64c-44.2 0-80-35.8-80-80v-33.6C27.5 151 0 118.7 0 80 0 35.8 35.8 0 80 0s80 35.8 80 80zm64 304a48 48 0 100 96 48 48 0 100-96zM416 80a48 48 0 10-96 0 48 48 0 1096 0z"></path>
            </svg>
           
              <ForkRightRoundedIcon sx={{ fill: theme.textColor2 }} /> 
            
          </IconButton>
        </Tooltip>*/}

        {/* <Tooltip title="Publish Widget" placement="bottom">
          <IconButton sx={{ color: theme.textColor2 }}>
            <PublicRoundedIcon
              sx={{ fill: theme.textColor2, fontSize: "1rem" }}
            />
          </IconButton>
        </Tooltip> */}
        {/* <Tooltip title="Open in a new tab" placement="bottom">
          <IconButton sx={{ color: theme.textColor2 }}>
            <OpenInNewRoundedIcon
              sx={{ fill: theme.textColor2, fontSize: "1rem" }}
            />
          </IconButton>
        </Tooltip> */}
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
        {/* <ActivityButton
          icon={<VerticalSplitRoundedIcon sx={{ fill: theme.textColor4 }} />}
          label="showWebsite"
          onClick={() => setShowWebsiteView((e) => !e)}
        /> */}

        <div
          style={{
            width: 1.5,
            height: 25,
            marginInline: 8,
            backgroundColor: theme.borderColor,
          }}
        />
        {publishWidgetButton}
      </Box>
    </Box>
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
      <Tooltip title="Toggle Responsive Preview" placement="bottom">
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

  // const { pathname } = useLocation();
  const { accountId } = useAccount();

  const { theme } = useContext(ThemeContext);
  const { lastPath, filesDetails, files } = useContext(EditorContext);

  const widgetSrc = `${accountId}/widget/${lastPath?.name}`;

  const [isDraft, setIsDraft] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    const { codeChangesPresent, isDraft } =
      filesDetails.get(lastPath?.name) || {};

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

            <a href={`https://near.social/#/${widgetSrc}`} target="_blank">
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
