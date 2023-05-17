import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { Box, Button, Divider, Typography } from "@mui/material";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { Link } from "react-router-dom";
import OpenCollaborationDialog from "./OpenCollaborationDialog";
import { useState } from "react";

export default function CollaborationsSidebar() {
  const { theme } = useContext(ThemeContext);
  const [showOpenCollaborationDialog, setShowOpenCollaborationDialog] =
    useState();

  return (
    <>
      <div>
        <div
          style={{
            height: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingInline: 10,
            borderBottom: `1px solid ${theme.borderColor}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 500, color: theme.textColor }}
          >
            Collaborations
          </Typography>
        </div>

        <Box>
          <Box
            style={{
              margin: "8px 8px 8px 8px",
            }}
          >
            <Typography
              variant="p1"
              style={{
                fontWeight: 500,
                color: theme.textColor3,
              }}
            >
              Session Details:
            </Typography>
          </Box>

          <Box>
            <Divider />
            <Button
              sx={{
                p: 1,
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
                textAlign: "left",
                color: theme.textColor2,
                textTransform: "none",
                display: "flex",
                gap: 1,
              }}
              onClick={() => setShowOpenCollaborationDialog((e) => !e)}
            >
              <Box
                sx={{
                  backgroundColor: theme.textColor3 + 11,
                  color: theme.textColor3,
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <PlayArrowRoundedIcon />
              </Box>

              <Typography
                variant="p"
                fontWeight={500}
                sx={{ color: theme.textColor2, lineHeight: 1.5 }}
              >
                Join Collaboration Session
              </Typography>
            </Button>
            <Divider />

            <Link
              to={`/collaborations/${[...Array(15)]
                .map(() => Math.random().toString(36)[2])
                .join("")}`}
            >
              <Button
                sx={{
                  p: 1,
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                  textAlign: "left",
                  color: theme.textColor2,
                  textTransform: "none",
                  display: "flex",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: theme.textColor3 + 11,
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <PersonAddRoundedIcon
                    fontSize="small"
                    sx={{ fill: theme.textColor3 }}
                  />
                </Box>
                <Typography
                  variant="p"
                  fontWeight={500}
                  sx={{ color: theme.textColor2, lineHeight: 1.5 }}
                >
                  Start Collaboration Session
                </Typography>
              </Button>
            </Link>

            <Divider />

            <Button
              sx={{
                p: 1,
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
                textAlign: "left",
                color: theme.textColor3,
                textTransform: "none",
                display: "flex",
                gap: 1,
              }}
              disabled={true}
            >
              <Box
                sx={{
                  backgroundColor: theme.textColor3 + 11,
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LockRoundedIcon
                  sx={{ fill: theme.textColor3 + 99, fontSize: "1rem" }}
                />
              </Box>

              <Typography
                variant="p"
                fontWeight={500}
                sx={{ color: theme.textColor3 + 99, lineHeight: 1.5 }}
              >
                Start read-only Collaboration Session
              </Typography>
            </Button>
            <Divider />
          </Box>
        </Box>
      </div>

      <OpenCollaborationDialog
        open={showOpenCollaborationDialog}
        setOpen={setShowOpenCollaborationDialog}
      />
    </>
  );
}
