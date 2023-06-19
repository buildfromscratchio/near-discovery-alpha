import React from "react";
import HomeHeader from "./homePage/_components/HomeHeader";
import { Box } from "@mui/material";
import VerticalCodePreview from "../components/VerticalCodePreview";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { EditorContext } from "../context/EditorContext";
import { useState } from "react";

export default function PlaygroundPage(props) {
  const { theme, bp } = useContext(ThemeContext);
  const { NetworkId } = useContext(EditorContext);

  const [code, setCode] = useState("");

  return (
    <Box>
      <HomeHeader {...props} sx={{ backgroundColor: theme.backgroundColor }} />

      <Box
        sx={{
          width: "100%",
          //   maxWidth: 1250,

          marginTop: "60px",
          height: "calc(100vh - 60px)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            border: `1px ${theme.borderColor} solid`,
            // boxShadow: `0 0 10px rgba(0,0,0,0.1)`,
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
    </Box>
  );
}
