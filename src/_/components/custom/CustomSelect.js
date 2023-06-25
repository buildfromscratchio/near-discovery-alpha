import { Box, Typography } from "@mui/material";
import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

export default function CustomSelect(props) {
  const {
    label,
    required,
    form,
    error,
    helperText,
    sx: iStyle,

    selectInputRef,

    ...otherProps
  } = props;

  const { theme } = useContext(ThemeContext);

  const labelStyle = {
    color: theme.textColor2,
    fontWeight: 600,
  };

  const style = {
    control: (baseStyles, status) => ({
      ...baseStyles,
      // minWidth: 175,
      minWidth: 100,
      backgroundColor: iStyle?.backgroundColor || theme.backgroundColor,
      borderColor: status.isFocused ? "grey" : "red",
      border: "none",
      outline: "none",
      border: `1px ${theme.borderColor} solid`,
      "&:hover": {
        border: `1px ${theme.borderColor} solid`,
      },
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected
        ? theme.buttonColor
        : isFocused
        ? theme.buttonColor + 11
        : theme.buttonTextColor,
      color: isSelected ? theme.buttonTextColor : theme.textColor2,
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    placeholder: (provided) => ({
      ...provided,
      color: "#a0a5b2",
      fontWeight: 300,
      fontSize: 15,
    }),
  };
  return (
    <Box sx={{ position: "relative", width: "100%", ...iStyle }}>
      {label && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
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

      {otherProps?.isCreatable ? (
        <CreatableSelect
          ref={selectInputRef}
          styles={style}
          name={label}
          menuPortalTarget={process.browser && document.querySelector("body")}
          {...otherProps}
        />
      ) : (
        <Select
          ref={selectInputRef}
          styles={style}
          name={label}
          menuPortalTarget={process.browser && document.querySelector("body")}
          {...otherProps}
        />
      )}

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
