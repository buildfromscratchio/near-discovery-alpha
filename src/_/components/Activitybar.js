import React, { useContext } from "react";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Groups3RoundedIcon from "@mui/icons-material/Groups3Rounded";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import FeedbackRoundedIcon from "@mui/icons-material/FeedbackRounded";

import camelToNormal from "../libs/camelToNormal";
import { ThemeContext } from "../context/ThemeContext";
import { EditorContext } from "../context/EditorContext";

import DiamondRoundedIcon from "@mui/icons-material/DiamondRounded";
import { Box, ButtonBase, Tooltip } from "@mui/material";

import { Widget, useAccount } from "near-social-vm";
import { AuthContext } from "../context/AuthContext";
import { useHistory, useLocation } from "react-router-dom";

export default function Activitybar(props) {
  const history = useHistory();
  const { accountId } = useAccount();
  const { theme, enableDarkMode, setEnableDarkMode } = useContext(ThemeContext);
  const { setSelectedActivity, Widgets, NetworkId } = useContext(EditorContext);
  const { user, logout } = useContext(AuthContext);

  console.error = () => {};

  return (
    <div
      style={{
        minHeight: "max(calc(100vh - 25px), 700px)",
        height: "100%",

        width: 50,
        backgroundColor: theme.backgroundColor,
        borderRight: `1px ${theme.borderColor} solid`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <ActivityButton
          // disabled
          icon={
            <DiamondRoundedIcon
              sx={{ fill: theme.textColor4, fontSize: "1.8rem" }}
            />
          }
          label=""
          to="/editor"
          onClick={() => {
            history.push("/editor");
            setSelectedActivity((e) => (e === "widgets" ? "" : "widgets"));
          }}
        />

        <ActivityButton
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={theme.textColor4}
              width="1.4em"
              height="1.4em"
            >
              <path
                fillRule="evenodd"
                d="M8.5 0h9L22 4.5v12.068L20.705 18H16v4.568L14.568 24H2.5L1 22.568V7.5L2.5 6H7V1.5L8.5 0zM16 1.5V6h4.5v10.5h-12v-15H16zm3.879 3L17.5 2.121V4.5h2.379zM7 7.5v9.068L8.5 18h6v4.5h-12v-15H7z"
              ></path>
            </svg>
          }
          label="create Component"
          to="/editor"
          onClick={() => {
            history.push("/editor");
            setSelectedActivity((e) => (e === "widgets" ? "" : "widgets"));
          }}
        />

        <ActivityButton
          icon={
            <SearchRoundedIcon
              sx={{ fill: theme.textColor4, fontSize: "1.5rem" }}
            />
          }
          label="search widgets"
          to="/search"
          onClick={() => {
            history.push("/search");
            setSelectedActivity((e) => (e === "search" ? "" : "search"));
          }}
        />

        {/* <ActivityButton
          icon={
            <CellTowerRoundedIcon
              sx={{ fill: theme.textColor4, fontSize: "1.5rem" }}
            />
          }
          label="changeNetwork"
          to="/changeNetwork"
          onClick={() => {
            history.push("/changeNetwork");
            setSelectedActivity((e) =>
              e === "changeNetwork" ? "" : "changeNetwork"
            );
          }}
        /> */}
        <ActivityButton
          icon={
            <MenuBookOutlinedIcon
              sx={{ fill: theme.textColor4, fontSize: "1.5rem" }}
            />
          }
          label="learn"
          to="/learn"
          onClick={() => {
            history.push("/learn");
            setSelectedActivity("");
          }}
        />

        <ActivityButton
          icon={
            <Groups3RoundedIcon
              sx={{ fill: theme.textColor4, fontSize: "1.5rem" }}
            />
          }
          label="collaboration"
          to="/collaborations"
          onClick={() => {
            history.push("/collaborations");
            setSelectedActivity("collaborations");
          }}
        />

        <ActivityButton
          icon={
            <SettingsOutlinedIcon
              sx={{ fill: theme.textColor4, fontSize: "1.5rem" }}
            />
          }
          label="settings"
          onClick={() => {
            history.push("/settings");
            setSelectedActivity((e) => (e === "settings" ? "" : "settings"));
          }}
        />

        <ActivityButton
          icon={
            enableDarkMode ? (
              <LightModeIcon
                sx={{ fill: theme.textColor4, fontSize: "1.5rem" }}
              />
            ) : (
              <DarkModeIcon
                sx={{ fill: theme.textColor4, fontSize: "1.5rem" }}
              />
            )
          }
          label={enableDarkMode ? "Enable Light Mode" : "Enable Dark Mode"}
          onClick={() => {
            setEnableDarkMode(!enableDarkMode);
          }}
        />
      </div>

      <div>
        {accountId && (
          <ActivityButton
            disabled={NetworkId === "testnet" ? true : false}
            icon={
              <Widget
                src={Widgets.activitybarNotificationButton}
                props={{ theme }}
              />
            }
            label="notifications"
            onClick={() => {
              history.push("/notifications");
              setSelectedActivity((e) =>
                e === "notifications" ? "" : "notifications"
              );
            }}
            sx={{ opacity: 1 }}
          />
        )}

        <Tooltip title="BOS - Docs" placement="right">
          <a href="https://docs.near.org/bos" target="_blank">
            <Box
              style={{
                minWidth: 50,
                minHeight: 50,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <HelpRoundedIcon
                sx={{
                  fill: theme.textColor4,
                  fontSize: "1.5rem",
                  opacity: 0.5,
                }}
              />
            </Box>
          </a>
        </Tooltip>

        <Tooltip title="Feedback" placement="right">
          <a
            href="https://components.canny.io/feature-requests"
            target="_blank"
          >
            <Box
              style={{
                minWidth: 50,
                minHeight: 50,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FeedbackRoundedIcon
                sx={{
                  fill: theme.textColor4,
                  fontSize: "1.5rem",
                  opacity: 0.5,
                }}
              />
            </Box>
          </a>
        </Tooltip>

        <ActivityButton
          icon={
            accountId ? (
              <div
                style={{
                  height: 35,
                  width: 35,
                  borderRadius: 20,
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {
                  <Widget
                    src={props.widgets.profileImage}
                    props={{
                      accountId: accountId,
                      className: "d-inline-block",
                    }}
                  />
                }
              </div>
            ) : (
              <img
                height={user?.avatar ? 35 : 20}
                style={{ borderRadius: 20 }}
                src={
                  user?.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="profile-art"
              />
            )
          }
          sx={{ opacity: 1 }}
          label="profile"
          to="/profile"
          onClick={() => {
            history.push("/profile");
            setSelectedActivity((e) => (e === "profile" ? "" : "profile"));
          }}
        />

        {user && (
          <ActivityButton
            icon={
              <LogoutRoundedIcon
                sx={{ fill: theme.textColor4, fontSize: "1.5rem" }}
              />
            }
            label="logout"
            onClick={() => {
              props.logOut();
              logout();
              history.push("/");
            }}
          />
        )}
      </div>
    </div>
  );
}

const ActivityButton = ({ icon, label, to, onClick, sx, disabled }) => {
  const { theme } = useContext(ThemeContext);
  const { selectedActivity, setSelectedActivity } = useContext(EditorContext);
  const { pathname } = useLocation();

  return (
    <Tooltip title={camelToNormal(label)} placement="right" disabled={disabled}>
      <ButtonBase
        disabled={disabled}
        className="buttonBase"
        sx={{
          width: 50,
          height: 50,

          "&:hover": {
            backgroundColor:
              theme.name === "dark"
                ? "rgba(256,256,256,.05)"
                : "rgba(0,0,0,.05)",
          },
          backgroundColor:
            pathname.includes(to) || selectedActivity === label
              ? theme.name === "dark"
                ? "rgba(256,256,256,.05)!important"
                : "rgba(0,0,0,.05)!important"
              : "transparent",
          opacity:
            pathname.includes(to) || selectedActivity === label ? 1 : 0.5,
          ...sx,
        }}
        onClick={() => {
          onClick
            ? onClick()
            : setSelectedActivity((e) => (e === label ? "" : label));
        }}
      >
        {icon}
      </ButtonBase>
    </Tooltip>
  );
};
