import React from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { useContext } from "react";
import { Box, Button, ButtonBase, Typography } from "@mui/material";

export default function NewHomeTopSection() {
  const { theme, bp } = useContext(ThemeContext);

  return (
    <Box
      component="section"
      className="containerCSS"
      sx={{
        backgroundColor: theme.backgroundColor,

        paddingTop: 8,
        paddingBottom: 16,
      }}
    >
      <div className="floating-background-blur-1" />
      <div className="floating-background-blur-2" />
      {/* Section 1 */}
      <Box
        component="section"
        className="contentCSS"
        style={{
          minHeight: "max(calc(100vh - 100px), 700px)",
          marginBottom: "50px",
          height: "100%",

          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 650 }}>
          <Box>
            <Typography
              variant="h1"
              style={{
                fontSize: bp ? 32 : 64,
                color: theme.textColor,
              }}
            >
              Build Web3 apps in
            </Typography>
            <Typography
              className="gradient-hero-text"
              variant="h1"
              style={{
                fontSize: bp ? 32 : 64,
                // color: theme.textColor,
              }}
            >
              30 seconds with AI
            </Typography>
          </Box>

          <Typography
            variant="p"
            style={{
              textAlign: "left",
              fontWeight: 400,
              fontSize: bp ? 16 : 28,
              paddingTop: 16,
              paddingBottom: bp ? 16 : 32,
              color: theme.textColor,
              display: "block",
              maxWidth: "40ch",
            }}
          >
            Drag and drop to make your unstoppable application come alive in
            seconds.
          </Typography>

          <Box
            sx={{
              width: "100%",
              maxWidth: bp ? 250 : 500,
              display: "flex",
              gap: 2,
              flexDirection: bp ? "column" : "row",
            }}
          >
            <Button
              sx={{
                height: 45,
                width: "100%",
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

            <Box
              sx={{
                height: 45,
                width: "100%",
                p: "2px",

                borderRadius: 7,
                background:
                  "linear-gradient(to right,#00a3ff 10.97%,#44bcff 30.57%,#04fff0 84.18%,#00e0d3 113%)",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                sx={{
                  height: 41,
                  width: "100%",
                  borderRadius: 7,
                  textTransform: "none",
                  fontWeight: 500,
                  color: theme.textColor,
                  backgroundColor: theme.ui,
                }}
              >
                Learn More
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Section 2 - build with jutsu */}

      <Box
        component="section"
        className="contentCSS"
        sx={{
          justifyContent: "center",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography
            variant="h1"
            sx={{ color: theme.textColor, fontWeight: 600 }}
          >
            Build with Jutsu
          </Typography>

          <Typography
            variant="p"
            sx={{
              color: theme.textColor3,
              fontWeight: 400,
              maxWidth: 500,
              textAlign: "center",
            }}
          >
            Over +16,000 components to choose from. Drag and drop to build your
            app in seconds.
          </Typography>
        </Box>

        <Box
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: bp ? "1fr" : "repeat(3, 1fr)",
            gridTemplateRows: bp ? "1fr 1fr 1fr 1fr" : "repeat(2, 1fr)",
            gap: 16,
          }}
        >
          <BuildOnJutsuComponentItem
            gridArea={bp ? "1 / 1 / 2 / 2" : "1 / 1 / 2 / 2"}
          />
          <BuildOnJutsuComponentItem
            gridArea={bp ? "2 / 1 / 3 / 2" : "1 / 2 / 2 / 4"}
          />
          <BuildOnJutsuComponentItem
            gridArea={bp ? "3 / 1 / 4 / 2" : "2 / 1 / 3 / 3"}
          />
          <BuildOnJutsuComponentItem
            gridArea={bp ? "4 / 1 / 5 / 2" : "2 / 3 / 3 / 4"}
          />
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Box
            sx={{
              height: 45,
              p: "2px",

              width: "100%",
              maxWidth: 250,

              borderRadius: 7,
              background:
                "linear-gradient(to right,#00a3ff 10.97%,#44bcff 30.57%,#04fff0 84.18%,#00e0d3 113%)",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              sx={{
                height: 41,
                width: "100%",
                borderRadius: 7,
                textTransform: "none",
                fontWeight: 500,
                color: theme.textColor,
                backgroundColor: theme.ui,
              }}
            >
              See all components
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const BuildOnJutsuComponentItem = (gridArea) => {
  const { theme, bp } = useContext(ThemeContext);

  return (
    <ButtonBase
      sx={{
        gridArea: gridArea, // "1 / 1 / 2 / 2",
        width: "100%",
        border: `1px ${theme.borderColor} solid`,
        borderRadius: 2,
        padding: 2,

        display: "flex",
        flexDirection: "column",

        backgroundColor: theme.ui || "#FFFFFF05",
        boxShadow: "0 0 5px rgba(256, 256, 256, 0.05)",

        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: "#FFFFFF11",
          transform: "scale(1.01)",
          color: "#afd5d1",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 200,
          backgroundColor: theme.textColor + "22",
          borderRadius: 1,
          mb: 3,
        }}
      ></Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          alignItems: "flex-start",
          width: "100%",
          gap: 1.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: theme.textColor, fontWeight: 500 }}
        >
          Component
        </Typography>
        <Typography
          variant="p1"
          sx={{ color: theme.textColor2, fontWeight: 400 }}
        >
          This is a description of the component. It too long..
        </Typography>
      </Box>
    </ButtonBase>
  );
};
