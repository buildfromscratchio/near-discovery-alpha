import { useContext } from "react";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { ThemeContext } from "@/src/context";

export default function Custom404Page() {
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
      }}>
      <Typography
        variant="h1"
        sx={{
          fontSize: "12rem",
          fontWeight: 800,
          color: "rgba(0, 0, 0, .1)",
        }}>
        404
      </Typography>
      <Typography
        variant="h1"
        sx={{
          fontWeight: 700,
          fontSize: "2.5rem",
          color: theme.textColor,
        }}>
        Nothing to see here
      </Typography>

      <Typography
        variant="h5"
        fontWeight={400}
        textAlign="center"
        sx={{ color: theme.textColor2, maxWidth: 600, py: 3 }}>
        Page you are trying to open does not exist. You may have mistyped the
        address, or the page has been moved to another URL. If you think this is
        an error contact support.
      </Typography>

      <Link href="/" style={{ textDecoration: "none" }}>
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
          }}>
          Take me back to home page
        </Button>
      </Link>
    </Box>
  );
}
