import { useContext } from "react";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { ThemeContext } from "@/src/context";

export default function Custom500Page() {
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
        500
      </Typography>
      <Typography
        variant="h1"
        sx={{
          fontWeight: 700,
          fontSize: "2.5rem",
          color: theme.textColor,
        }}>
        Something bad just happened...
      </Typography>
      <Typography
        variant="h5"
        fontWeight={400}
        textAlign="center"
        sx={{ color: theme.textColor2, maxWidth: 600, py: 3 }}>
        Our servers could not handle your request. Don&apos;t worry, our
        development team was already notified. Try refreshing the page.
      </Typography>

      <Link href="/" style={{ textDecoration: "none" }}>
        <Button
          sx={{
            mt: 2,
            borderRadius: 1,
            fontSize: "1rem",

            textTransform: "none",

            padding: "0.65em 1.5em",
            fontWeight: 600,

            color: theme.buttonTextColor,
            backgroundColor: theme.buttonColor,
          }}>
          Refresh the page
        </Button>
      </Link>
    </Box>
  );
}
