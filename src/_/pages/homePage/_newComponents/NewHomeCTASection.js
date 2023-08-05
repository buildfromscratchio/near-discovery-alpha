import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { useContext } from "react";
import jutsu_logo from "../../../images/jutsu_logo.svg";

export default function NewHomeCTASection() {
  const { theme, bp } = useContext(ThemeContext);

  return (
    <Box sx={{ backgroundColor: theme.backgroundColor }}>
      <Box
        component="section"
        className="containerCSS"
        sx={{
          backgroundColor: theme.ui,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,

          //   paddingTop: 8,
          //   paddingBottom: 16,

          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 148.34,
            height: 148.34,
            right: 55,
            top: 55,
            borderRadius: "50%",

            backgroundColor: "#01E1D3",
          }}
        />
        <Box
          component="section"
          className="contentCSS"
          style={{
            minHeight: "max(100vh, 700px)",
            marginBottom: "50px",
            height: "100%",

            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: bp ? "center" : "flex-start",
              gap: 3,
            }}
          >
            <Typography
              variant="h1"
              style={{
                fontSize: bp ? 24 : 50,
                color: theme.textColor,
                textAlign: bp ? "center" : "left",
              }}
            >
              Think of <span className="gradient-hero-text">Jutsu</span> like
              vercel for on-chain deployment
            </Typography>

            <Typography
              variant="p1"
              sx={{
                color: theme.textColor3,
                fontWeight: 400,
                fontSize: bp ? 14 : 18,
                textAlign: bp ? "center" : "left",
              }}
            >
              <span style={{ fontWeight: 600, color: theme.textColor }}>
                Jutsu
              </span>{" "}
              is your 24/7 digital development ally, seamlessly transforming
              your ideas into innovation with web3 integration
            </Typography>

            <Button
              sx={{
                height: 45,
                maxWidth: 400,
                width: bp ? 300 : "100%",
                borderRadius: 7,
                textTransform: "none",
                fontWeight: 600,

                backgroundColor: "#FFF",
                color: "#000",

                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#FFFFFF99",
                },
              }}
            >
              Launch App
            </Button>
          </Box>
          {!bp && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <img
                style={{
                  width: 350,
                  height: 350,
                }}
                src={jutsu_logo}
                alt="jutsu logo"
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
