import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { Avatar, Box, Typography } from "@mui/material";
import { CollaborationContext } from "./CollaborationContext";

export default function CollaborationSidebar() {
  const { theme } = useContext(ThemeContext);
  const { memberList } = useContext(CollaborationContext);

  return (
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
          Collaboration
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
            Connected Users:
          </Typography>
        </Box>
        {memberList?.map((item, index) => (
          <Box
            key={index}
            sx={{
              mb: "1px",
              display: "flex",
              alignItems: "center",
              backgroundColor: theme.ui2,
              gap: 1,
              p: 1,
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: item.color + 33,
                color: item.color,
              }}
              src={item.avatar}
            />
            <Typography
              variant="p1"
              fontWeight={500}
              sx={{ color: theme.textColor }}
            >
              {item.fullName}
            </Typography>
            {/* {JSON.stringify(user)} */}
          </Box>
        ))}
      </Box>
    </div>
  );
}
