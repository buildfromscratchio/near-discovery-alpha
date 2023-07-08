import { Box, IconButton, Paper, Typography } from "@mui/material";

import Markdown from "markdown-to-jsx";
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { useSnackbar } from "notistack";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
// import { sanitizeGutenberg } from "sanitize-html";
import * as sanitizeHtml from "sanitize-html";

export default function MarkdownViewer({ className, src }) {
  const { enqueueSnackbar } = useSnackbar();
  const { theme } = useContext(ThemeContext);

  const H1Tag = ({ children, ...props }) => (
    <Typography
      {...props}
      variant="h1"
      sx={{
        color: theme?.textColor,

        display: "block",
        marginTop: "0.67em",
        marginBBottom: "0.67em",
        marginLeft: 0,
        marginRight: 0,
        fontWeight: "bold",
      }}
    >
      {children}
    </Typography>
  );
  const H2Tag = ({ children, ...props }) => (
    <Typography
      {...props}
      variant="h2"
      sx={{
        color: theme?.textColor2,

        display: "block",
        marginTop: "0.83em",
        marginBottom: "0.415em",
        marginLeft: 0,
        marginRight: 0,
        fontWeight: "bold",
      }}
    >
      {children}
    </Typography>
  );
  const H3Tag = ({ children, ...props }) => (
    <Typography
      {...props}
      variant="h3"
      sx={{
        color: theme?.textColor2,

        display: "block",
        marginTop: "1em",
        marginBottom: ".25em",
        marginLeft: 0,
        marginRight: 0,
        fontWeight: "bold",
      }}
    >
      {children}
    </Typography>
  );
  const H4Tag = ({ children, ...props }) => (
    <Typography
      {...props}
      variant="h4"
      sx={{
        color: theme?.textColor2,

        display: "block",
        marginTop: "1.33em",
        marginBottom: "0.3325em",
        marginLeft: 0,
        marginRight: 0,
        fontWeight: "bold",
      }}
    >
      {children}
    </Typography>
  );
  const H5Tag = ({ children, ...props }) => (
    <Typography
      {...props}
      variant="h5"
      sx={{
        color: theme?.textColor2,

        display: "block",
        marginTop: "1.67em",
        marginBottom: "0.4175em",
        marginLeft: 0,
        marginRight: 0,
        fontWeight: "bold",
      }}
    >
      {children}
    </Typography>
  );
  const H6Tag = ({ children, ...props }) => (
    <Typography
      {...props}
      variant="h6"
      sx={{
        color: theme?.textColor2,

        display: "block",
        fontSize: ".67em",
        marginTop: "2.33em",
        marginBottom: "0.5825em",
        marginLeft: 0,
        marginRight: 0,
        fontWeight: "bold",
      }}
    >
      {children}
    </Typography>
  );
  const PTag = ({ children, ...props }) => (
    <Typography
      {...props}
      variant="p1"
      sx={{ color: theme?.textColor2, mb: 1, fontWeight: 400 }}
    >
      {children}
    </Typography>
  );
  const SpanTag = ({ children, ...props }) => (
    <Typography
      {...props}
      variant="p1"
      sx={{ color: theme?.textColor, mb: 1, fontWeight: 400 }}
    >
      {children}
    </Typography>
  );

  const TableTag = ({ children, ...props }) => (
    <table
      component={Paper}
      sx={{
        backgroundColor: theme.backgroundColor,

        // boxShadow: `0px 0px 2px rgba(0,0,0,.25)`,
        boxShadow: `none`,
        outline: `1px ${theme.borderColor} solid`,
        outlineOffset: -1,
        borderRadius: 1,
        overflow: "hidden",
      }}
      {...props}
    >
      {children}
    </table>
  );
  const TableHeadTag = ({ children, ...props }) => (
    <thead {...props}>{children}</thead>
  );
  const TableBodyTag = ({ children, ...props }) => (
    <tbody {...props}>{children}</tbody>
  );
  const TableRowTag = ({ children, ...props }) => (
    <tr {...props}>{children}</tr>
  );
  const TableCellTag = ({ children, ...props }) => (
    <td {...props}>{children}</td>
  );
  const PreTag = ({ children, ...props }) => {
    console.log(children?.props?.children);

    const onCopyButtonClick = async () => {
      try {
        // await navigator.clipboard.writeText(`<Widget src="${textToCopy}" />`);
        await navigator.clipboard.writeText(children?.props?.children);

        enqueueSnackbar("Code copied to clipboard!", { variant: "success" });
      } catch (error) {
        enqueueSnackbar("Failed to copy text: ", { variant: "error" });
      }
    };

    return (
      <Box
        className="markdown_pre_container"
        sx={{
          borderRadius: 1,
          position: "relative",
          my: 1,

          "& .BlasSal": {
            backgroundColor: `${theme.backgroundColor} !important`,
            margin: "0px !important",
            borderRadius: "4px !important",
            border: `1px ${theme.borderColor} solid !important`,
          },
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={() => onCopyButtonClick()}
        >
          <ContentCopyRoundedIcon sx={{ fill: theme.textColor2 }} />
        </IconButton>

        <SyntaxHighlighter
          {...props}
          language="jsx"
          style={theme.name === "dark" ? vscDarkPlus : vs}
          className="BlasSal"
        >
          {children?.props?.children}
        </SyntaxHighlighter>
      </Box>
    );
  };
  const UlTag = ({ children, ...props }) => (
    <ul
      {...props}
      style={{
        backgroundColor: theme.backgroundColor,
        paddingBlock: 8,
        borderRadius: 4,
        marginBlock: 4,
      }}
    >
      {children}
    </ul>
  );
  const LiTag = ({ children, ...props }) => (
    <li {...props} style={{ color: theme.textColor2 }}>
      {children}
    </li>
  );

  return src ? (
    <Markdown
      className={className}
      style={{ textAlign: "left" }}
      options={{
        wrapper: "article",
        forceWrapper: false,
        overrides: {
          h1: { component: H1Tag },
          h2: { component: H2Tag },
          h3: { component: H3Tag },
          h4: { component: H4Tag },
          h5: { component: H5Tag },
          h6: { component: H6Tag },
          p: { component: PTag },
          span: { component: SpanTag },
          table: { component: TableTag },
          thead: { component: TableHeadTag },
          tbody: { component: TableBodyTag },
          tr: { component: TableRowTag },
          th: { component: TableCellTag },
          td: { component: TableCellTag },
          pre: { component: PreTag },
          ul: { component: UlTag },
          li: { component: LiTag },
        },
      }}
    >
      {/* {src} */}
      {sanitizeHtml(src || "")}
    </Markdown>
  ) : (
    <div />
  );
}
