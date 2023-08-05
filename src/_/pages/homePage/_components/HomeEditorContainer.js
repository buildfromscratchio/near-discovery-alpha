import React, { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { Box, Typography } from "@mui/material";
import VerticalCodePreview from "../../../components/VerticalCodePreview";
import { EditorContext } from "../../../context/EditorContext";
import { useState } from "react";

export default function HomeEditorContainer() {
  const { theme, bp } = useContext(ThemeContext);
  const { NetworkId } = useContext(EditorContext);
  const [code, setCode] = useState("");

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // py: bp ? 5 : 20,
        pt: bp ? 5 : 20,
        pb: 5,
        gap: 3,
        backgroundColor: theme.backgroundColor,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          variant="h1"
          sx={{ fontSize: bp ? 28 : 56, color: theme.textColor }}
        >
          Try developing <span className="gradient-hero-text">instantly</span>
        </Typography>

        <Typography
          variant="p"
          textAlign="center"
          sx={{ color: theme.textColor3, maxWidth: 800, width: "100%" }}
        >
          Click and get started by editing the code in the Playground. <br />{" "}
          View your live changes in the preview!!
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: 1250,

          height: 700,
          px: 2,
          mt: 4,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            border: `1px ${theme.borderColor} solid`,
            boxShadow: `0 0 10px rgba(0,0,0,0.1)`,
            borderRadius: 0.5,
            overflow: "hidden",
          }}
        >
          <VerticalCodePreview
            //initialCode="return(<div style={{backgroundColor: props.theme.ui }}><h1 style={{color: props.theme.textColor}}>Hello World</h1></div>)"
            // horizontal={bp ? false : true}
            code={code}
            setCode={setCode}
            horizontal={bp ? false : true}
            initialCode={`
            // User account in near testnet
const accountId = "${
              NetworkId === "testnet"
                ? "storyboard.testnet"
                : "zahidulislam.near"
            }";
// Get data from near social contract
const profile = Social.getr(\`\${accountId}/profile\`);

const { name, description, image } = profile;
// get image from ipfs
const url = image.ipfs_cid && \`https://ipfs.near.social/ipfs/\${image.ipfs_cid}\`;

return (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div style={{ width: "8em", height: "8em" }}>
      <img
        style={{
          maxHeight: 100,
        }}
        src={url}
        alt="profile image"
      />
    </div>

    <h1 style={{ color: props.theme.textColor }}>{profile.name}</h1>
    {profile.description.split("\\n").map((x) => (
      <div>{x}</div>
    ))}
  </div>
);

            `}
          />
        </Box>
      </Box>

      {/* {!bp && (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            position: "relative",
            pr: 15,
          }}
        >
          <Typography
            variant="p"
            fontWeight={600}
            className="max1Lines"
            sx={{
              mt: 3,
              position: "absolute",
              bottom: -20,
              left: "-76.5%",
              py: 1,
              px: 2,
              backgroundColor: theme.backgroundColor,
              color: theme.textColor,
              border: `2px solid ${theme.textColor}`,
              borderRadius: 5,
            }}
          >
            See it on the preview
          </Typography>

          <svg
            width="122"
            height="51"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M114.705 1.102a1 1 0 00-1.414.004l-6.347 6.381a1 1 0 101.418 1.41l5.641-5.672 5.673 5.642a1 1 0 101.41-1.418l-6.381-6.347zM.951 50.518c18.179.377 46.577-.919 70.452-7.663 11.934-3.372 22.819-8.126 30.729-14.78C110.071 21.398 115.029 12.79 115 1.808l-2 .006c.028 10.28-4.58 18.36-12.155 24.73-7.604 6.396-18.183 11.052-29.986 14.386-23.6 6.667-51.774 7.964-69.867 7.589l-.041 2z"
              fill={theme.textColor}
            ></path>
          </svg>
        </Box>
      )} */}
    </Box>
  );
}
