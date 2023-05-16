import {
  Avatar,
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import DiamondRoundedIcon from "@mui/icons-material/DiamondRounded";
import { stringify } from "querystring";

export default function HomeHeader(props) {
  const { theme, bp } = useContext(ThemeContext);
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 999,
        width: "100%",
        minHeight: 60,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "90vw",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: bp ? "column" : "row",
          pt: bp ? 2 : 0,
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DiamondRoundedIcon
            sx={{ fill: theme.textColor4, fontSize: "1.8rem" }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* <Link to="editor" style={{ textDecoration: "none" }}>
            <HeaderButton>Editor</HeaderButton>
          </Link>

          <Link to="learn" style={{ textDecoration: "none" }}>
            <HeaderButton>Learn</HeaderButton>
          </Link>

          <Link to="#" style={{ textDecoration: "none" }}>
            <HeaderButton>Documentation</HeaderButton>
          </Link> */}

          {isAuthenticated ? (
            <Avatar
              src={user?.avatar}
              alt={user?.fullName || user?.nearAccountId}
            />
          ) : (
            <HeaderMenu {...props} />
          )}
        </Box>
      </Box>
    </Box>
  );
}

const HeaderMenu = (props) => {
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
    scope: "user:email",
  };

  return (
    <Box sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
      <Button
        // onMouseOver={handleClick}
        onClick={handleClick}
        // size="small"
        sx={{
          borderRadius: 1,
          px: 2,
          backgroundColor: theme.buttonColor + 11,
          color: theme.buttonColor,
          border: "none",
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
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
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
              right: 30,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
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
