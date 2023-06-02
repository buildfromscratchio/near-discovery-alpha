import React, { useContext } from "react";
import { Box, Button, Typography } from "@mui/material";
import { ThemeContext } from "../../context/ThemeContext";
import { Link } from "react-router-dom";

export default function Custom401Page({ to }) {
  const { theme } = useContext(ThemeContext);
  return (
    <Box
      style={{
        minHeight: "600px",
        height: "calc(100vh - 60px)",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

        backgroundColor: theme.ui,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: "12rem",
          fontWeight: 800,
          color: "rgba(0, 0, 0, .1)",
        }}
      >
        401
      </Typography>
      <Typography
        variant="h1"
        sx={{
          fontWeight: 700,
          fontSize: "2.5rem",
          color: theme.textColor,
        }}
      >
        Unauthorized
      </Typography>

      <Typography
        variant="h5"
        fontWeight={400}
        textAlign="center"
        sx={{ color: theme.textColor2, maxWidth: 600, py: 3 }}
      >
        401 Unauthorized: Access is denied due to invalid credentials. Please
        provide valid authentication credentials and try again. If you continue
        to have issues, contact{" "}
        <a
          href="mailto: support@dokan.gg"
          style={{
            color: theme.buttonColor,
            fontWeight: 500,
            textDecoration: "underline",
          }}
        >
          support
        </a>
        .
      </Typography>

      <Link to={to || "/"} style={{ textDecoration: "none" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            mt: 2,
            borderRadius: 1,
            fontSize: "1rem",
            textTransform: "none",
            padding: "0.65em 1.5em",
            color: theme.buttonTextColor,
            backgroundColor: theme.buttonColor,

            boxShadow: "none",
            fontWeight: 500,
            textTransform: "none",
            color: "#FFF",
          }}
        >
          Take me back to home page
        </Button>
      </Link>
    </Box>
  );
}
