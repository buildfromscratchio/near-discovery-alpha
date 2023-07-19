import { Box, IconButton, InputBase, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

export default function CustomInput(props) {
  const {
    label,
    required,
    placeholder,
    form,
    error,
    helperText,
    sx: iStyle,
    ...otherProps
  } = props;

  const { theme } = useContext(ThemeContext);

  const labelStyle = {
    color: theme.textColor2,
    fontWeight: 600,
  };

  const inputStyle = {
    color: theme.textColor,
    backgroundColor: theme.backgroundColor,
    minHeight: !otherProps?.rows && 40,
    width: "100%",
    border: `1px ${theme.borderColor} solid`,
    borderRadius: 1,
    pl: 1,
    paddingRight: otherProps?.type === "password" ? 5 : 0,
    ...iStyle,
  };

  console.error = () => {};
  const [showText, setShowText] = useState(false);

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {label && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography variant="p1" sx={labelStyle}>
            {label}
          </Typography>
          {required && (
            <Typography variant="p1" sx={{ ...labelStyle, color: "#bc002d" }}>
              *
            </Typography>
          )}
        </Box>
      )}
      <Box
        sx={{
          position: "relative",
          mt: label ? 0.5 : 0,
        }}
      >
        <InputBase
          sx={inputStyle}
          fullWidth
          placeholder={placeholder || "Enter text here"}
          {...form}
          {...otherProps}
          type={
            otherProps?.type === "password"
              ? showText
                ? "text"
                : "password"
              : otherProps?.type || "text"
          }
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            height: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {otherProps?.type === "password" && (
            <IconButton
              size="small"
              aria-label="toggle password visibility"
              onClick={() => setShowText(!showText)}
              onMouseDown={(event) => event.preventDefault()}
              edge="end"
              style={{ marginRight: 0, aspectRatio: 1 / 1 }}
            >
              {showText ? (
                <VisibilityRoundedIcon />
              ) : (
                <VisibilityOffRoundedIcon />
              )}
            </IconButton>
          )}
        </div>
      </Box>

      <Box sx={{ position: "absolute" }}>
        <Typography
          variant="p"
          sx={{ color: error ? "#bc002d" : theme.textColor3 }}
        >
          {error && "Error: "}
          {helperText}
        </Typography>
      </Box>
    </Box>
  );
}
