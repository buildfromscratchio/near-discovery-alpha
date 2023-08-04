import React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export const CustomAccordion = (props) => {
  return (
    <Accordion defaultExpanded {...props}>
      {props.children}
    </Accordion>
  );
};

export const CustomAccordionSummary = (props) => {
  const { sx: mySx, ...otherProps } = props;
  const { theme } = useContext(ThemeContext);

  return (
    <AccordionSummary
      aria-controls="panel2d-content"
      id="panel2d-header"
      sx={{ backgroundColor: theme.backgroundColor, ...mySx }}
      {...otherProps}
    >
      {props.children}
    </AccordionSummary>
  );
};

export const CustomAccordionDetails = (props) => {
  const { sx: mySx, ...otherProps } = props;
  const { theme } = useContext(ThemeContext);

  return (
    <AccordionDetails
      sx={{ backgroundColor: theme.ui, ...mySx }}
      {...otherProps}
    >
      {props.children}
    </AccordionDetails>
  );
};

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  // border: `1px solid ${theme.palette.divider}`,
  // backgroundColor: "transparent",
  color: "#7e8185",
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon sx={{ fontSize: "0.8rem", fill: "#7e8185" }} />
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "#1a1a1a",
  // backgroundColor:
  //   theme.palette.mode === "dark" ? "#1e1e1e" : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  // backgroundColor: "#262626",
  backgroundColor: "#1e1e1e",
  padding: 0,
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));
