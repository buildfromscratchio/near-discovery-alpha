import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { stringify } from "querystring";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { Link, useHistory, useLocation } from "react-router-dom";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useEffect } from "react";

export default function HomeHeader(props) {
  const { pathname } = useLocation();

  const { theme, bp, enableDarkMode, setEnableDarkMode } =
    useContext(ThemeContext);
  const { isAuthenticated } = useContext(AuthContext);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // setScrolled(window.scrollY > (bp?.sm ? 230 : window.innerHeight));
    const handleScroll = () => {
      setScrolled(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <AppBar
      color="transparent"
      position="fixed"
      sx={{
        boxShadow: "none",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 75,

        backdropFilter: scrolled ? "blur(16px)" : "none",
        ...props.sx,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          display: "flex",
          justifyContent: "space-between",
          flexDirection: bp ? "column" : "row",
          pt: bp ? 2 : 0,
          gap: 1,
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="98"
            height="32"
            viewBox="0 0 98 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.6602 18.7073C15.6602 20.784 14.8352 22.7756 13.3668 24.244C11.8984 25.7124 9.90675 26.5374 7.83009 26.5374C5.75342 26.5374 3.76181 25.7124 2.29338 24.244C0.824954 22.7756 3.13568e-07 20.784 0 18.7073L4.10077 18.7073C4.10077 19.6964 4.49368 20.6449 5.19306 21.3443C5.89245 22.0437 6.84101 22.4366 7.83009 22.4366C8.81916 22.4366 9.76773 22.0437 10.4671 21.3443C11.1665 20.6449 11.5594 19.6964 11.5594 18.7073H15.6602Z"
              fill={theme.textColor}
            />
            <path
              d="M15.6601 18.7073H11.5586V6.77576H15.6601V18.7073Z"
              fill={theme.textColor}
            />
            <path
              d="M15.6602 6.77572L15.6602 10.8772L0 10.8772L-1.79281e-07 6.77572L15.6602 6.77572Z"
              fill={theme.textColor}
            />
            <path
              d="M4.10147 18.7076H0V15.7247H4.10147V18.7076Z"
              fill={theme.textColor}
            />
            <path
              d="M24.6244 6.90442V18.8937C24.6244 21.1169 25.8418 22.427 27.9988 22.427C30.1559 22.427 31.3601 21.1169 31.3601 18.8937V6.90442H36.2167V19.4098C36.2167 23.6974 32.9613 26.5161 27.9988 26.5161C23.0364 26.5161 19.7678 23.6974 19.7678 19.4098V6.90442H24.6244ZM50.0454 26H45.2021V10.8082H39.697V6.90442H55.5637V10.8082H50.0454V26ZM58.1971 20.5611H62.8288C62.9479 21.9506 64.3373 22.8373 66.3488 22.8373C68.1618 22.8373 69.4057 21.9639 69.4057 20.7067C69.4057 19.648 68.572 19.079 66.3885 18.6423L63.8742 18.1395C60.3806 17.4778 58.5809 15.5722 58.5809 12.5683C58.5809 8.83648 61.5716 6.38833 66.1768 6.38833C70.6496 6.38833 73.7462 8.81001 73.8256 12.3433H69.3395C69.2336 10.9935 67.95 10.0539 66.2429 10.0539C64.5358 10.0539 63.411 10.8612 63.411 12.1316C63.411 13.177 64.2579 13.7857 66.2694 14.1827L68.7308 14.6591C72.5023 15.3869 74.1961 17.094 74.1961 20.1244C74.1961 24.1076 71.1525 26.5161 66.1503 26.5161C61.3202 26.5161 58.2765 24.24 58.1971 20.5611ZM82.7448 6.90442V18.8937C82.7448 21.1169 83.9623 22.427 86.1193 22.427C88.2763 22.427 89.4805 21.1169 89.4805 18.8937V6.90442H94.3371V19.4098C94.3371 23.6974 91.0817 26.5161 86.1193 26.5161C81.1568 26.5161 77.8882 23.6974 77.8882 19.4098V6.90442H82.7448Z"
              fill={theme.textColor}
            />
          </svg>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={() => {
              setEnableDarkMode(!enableDarkMode);
            }}
          >
            {enableDarkMode ? (
              <LightModeIcon
                sx={{ fill: theme.textColor3, fontSize: "1.25rem" }}
              />
            ) : (
              <DarkModeIcon
                sx={{ fill: theme.textColor3, fontSize: "1.25rem" }}
              />
            )}
          </IconButton>

          {/* 
            <Link to="editor" style={{ textDecoration: "none" }}>
              <HeaderButton>Editor</HeaderButton>
            </Link>

            <Link to="#" style={{ textDecoration: "none" }}>
              <HeaderButton>Documentation</HeaderButton>
            </Link>
          */}

          <Link to="/learn" style={{ textDecoration: "none" }}>
            <Button
              sx={{
                textTransform: "none",
                color: theme.textColor,
                "&:hover": {
                  color: theme.buttonColor,
                },
                fontWeight: 400,
              }}
            >
              Learn
            </Button>
          </Link>

          <Link to="/playground" style={{ textDecoration: "none" }}>
            <Button
              sx={{
                textTransform: "none",
                color:
                  pathname === "/playground"
                    ? theme.buttonColor
                    : theme.textColor,
                "&:hover": {
                  color: theme.buttonColor,
                },
                fontWeight: 400,
              }}
            >
              Playground
            </Button>
          </Link>

          <Link to="/docs" style={{ textDecoration: "none" }}>
            <Button
              sx={{
                textTransform: "none",
                color: theme.textColor,
                "&:hover": {
                  color: theme.buttonColor,
                },
                fontWeight: 400,
              }}
            >
              Docs
            </Button>
          </Link>

          {isAuthenticated ? (
            <HeaderMenuForUser {...props} />
          ) : (
            <HeaderMenuForSignup {...props} />
          )}
        </Box>
      </Box>
    </AppBar>
  );
}

const HeaderMenuForUser = (props) => {
  const history = useHistory();

  const { theme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  console.error = () => {};

  return (
    <Box sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
      <IconButton
        // onMouseOver={handleClick}
        onClick={handleClick}
        // size="small"
        sx={{
          color: theme.buttonColor,

          "&:hover": {
            backgroundColor: theme.buttonColor + 22,
          },
        }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar src={user?.avatar} alt={user?.name || user?.nearAccountId} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: `drop-shadow(0px 2px 8px ${theme.textColor + "11"})`,

            backgroundColor: theme.ui,
            border: `1px ${theme.borderColor} solid`,
            mt: 1.5,
            minWidth: 200,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 22,
              width: 10,
              height: 10,
              backgroundColor: theme.ui,
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,

              borderWidth: `1px`,
              borderStyle: `solid`,
              borderTopColor: theme.borderColor,
              borderLeftColor: theme.borderColor,
              borderRightColor: "transparent",
              borderBottomColor: "transparent",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            history.push("/editor");
          }}
          sx={{ display: "flex", gap: 1 }}
        >
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

          <Typography
            variant="p1"
            sx={{ fontWeight: 500, color: theme.textColor }}
          >
            Editor
          </Typography>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => {
            handleClose();

            props.logOut();
            logout();
          }}
          sx={{ display: "flex", gap: 1 }}
        >
          <LogoutRoundedIcon
            sx={{ fill: theme.textColor4, fontSize: "1.5rem" }}
          />

          <Typography
            variant="p1"
            sx={{ fontWeight: 500, color: theme.textColor }}
          >
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};
const HeaderMenuForSignup = (props) => {
  const { theme } = useContext(ThemeContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  console.error = () => {};

  const query = {
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_REDIRECT_URL,
    scope: "user:email,repo",
  };

  return (
    <Box sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
      <Button
        // onMouseOver={handleClick}
        onClick={handleClick}
        // size="small"
        sx={{
          height: 40,
          borderRadius: 7,
          px: 4,
          backgroundColor: "transparent",
          color: theme.textColor,

          border: `2px ${theme.textColor} solid`,

          textTransform: "none",
          textDecoration: "none",

          "&:hover": {
            backgroundColor: theme.buttonColor + 22,
          },
        }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        Login
      </Button>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: `drop-shadow(0px 2px 8px ${theme.textColor + "11"})`,
            mt: 1.5,
            minWidth: 200,
            backgroundColor: theme.ui,
            border: `1px ${theme.borderColor} solid`,

            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 30,
              width: 10,
              height: 10,
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
              backgroundColor: theme.ui,
              borderWidth: `1px`,
              borderStyle: `solid`,
              borderTopColor: theme.borderColor,
              borderLeftColor: theme.borderColor,
              borderRightColor: "transparent",
              borderBottomColor: "transparent",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            props.requestSignIn();
          }}
          sx={{ display: "flex", gap: 1 }}
        >
          <svg
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.0863 0.690491C17.3456 0.690491 16.6578 1.07327 16.2698 1.70252L12.0893 7.88884C11.9531 8.09276 12.0084 8.36759 12.213 8.50336C12.3788 8.61351 12.5981 8.59988 12.7491 8.47041L16.8641 4.91296C16.9325 4.85163 17.0379 4.85787 17.0994 4.92602C17.1273 4.95725 17.1422 4.99758 17.1422 5.03904V16.1771C17.1422 16.269 17.0675 16.3429 16.9752 16.3429C16.9256 16.3429 16.8789 16.3213 16.8476 16.2833L4.40861 1.44242C4.0035 0.965932 3.40865 0.691059 2.78245 0.690491H2.34771C1.1711 0.690491 0.217285 1.64119 0.217285 2.81394V18.5009C0.217285 19.6737 1.1711 20.6244 2.34771 20.6244C3.08843 20.6244 3.77616 20.2416 4.16418 19.6124L8.34472 13.4261C8.48087 13.2221 8.4256 12.9473 8.22101 12.8115C8.05521 12.7014 7.83587 12.715 7.6849 12.8445L3.56989 16.4019C3.50152 16.4633 3.39611 16.457 3.33458 16.3888C3.30665 16.3576 3.29184 16.3173 3.29241 16.2758V5.13502C3.29241 5.04301 3.36705 4.96918 3.45935 4.96918C3.50836 4.96918 3.55565 4.99077 3.58699 5.02881L16.0243 19.8725C16.4293 20.349 17.0242 20.6239 17.6504 20.6244H18.0851C19.2617 20.625 20.2162 19.6748 20.2173 18.5021V2.81394C20.2173 1.64119 19.2629 0.690491 18.0863 0.690491Z"
              fill={theme.textColor}
            />
          </svg>

          <Typography
            variant="p1"
            sx={{ fontWeight: 500, color: theme.textColor }}
          >
            Login with Wallet
          </Typography>
        </MenuItem>

        <Divider />

        <a
          style={{ textDecoration: "none" }}
          // href={`https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URL}&scope=user:email`}
          href={`https://github.com/login/oauth/authorize?${stringify(query)}`}
        >
          <MenuItem onClick={handleClose} sx={{ display: "flex", gap: 1 }}>
            <svg aria-label="github" height="20" viewBox="0 0 14 14" width="20">
              <path
                d="M7 .175c-3.872 0-7 3.128-7 7 0 3.084 2.013 5.71 4.79 6.65.35.066.482-.153.482-.328v-1.181c-1.947.415-2.363-.941-2.363-.941-.328-.81-.787-1.028-.787-1.028-.634-.438.044-.416.044-.416.7.044 1.071.722 1.071.722.635 1.072 1.641.766 2.035.59.066-.459.24-.765.437-.94-1.553-.175-3.193-.787-3.193-3.456 0-.766.262-1.378.721-1.881-.065-.175-.306-.897.066-1.86 0 0 .59-.197 1.925.722a6.754 6.754 0 0 1 1.75-.24c.59 0 1.203.087 1.75.24 1.335-.897 1.925-.722 1.925-.722.372.963.131 1.685.066 1.86.46.48.722 1.115.722 1.88 0 2.691-1.641 3.282-3.194 3.457.24.219.481.634.481 1.29v1.926c0 .197.131.415.481.328C11.988 12.884 14 10.259 14 7.175c0-3.872-3.128-7-7-7z"
                fill={theme.textColor}
                fill-rule="nonzero"
              ></path>
            </svg>

            <Typography
              variant="p1"
              sx={{ fontWeight: 500, color: theme.textColor }}
            >
              Login with GitHub
            </Typography>
          </MenuItem>
        </a>
      </Menu>
    </Box>
  );
};
