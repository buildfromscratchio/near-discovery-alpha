import { IconButton, Paper, Typography } from "@mui/material";

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

export default function MarkdownViewer({ className, src }) {
  const { enqueueSnackbar } = useSnackbar();
  const { theme } = useContext(ThemeContext);

  const HeadingsTag = ({ children, ...props }) => (
    <Typography
      variant={props.id}
      {...props}
      sx={{ color: theme?.textColor2, mb: 1 }}
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

    // <pre
    //   {...props}
    //   style={{
    //     backgroundColor: theme.backgroundColor,
    //     padding: 16,
    //     borderRadius: 4,
    //     position: "relative",
    //   }}
    // >
    return (
      <div
        style={{
          borderRadius: 4,
          position: "relative",
          backgroundColor: "red",
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={() => onCopyButtonClick()}
        >
          <ContentCopyRoundedIcon />
        </IconButton>

        <SyntaxHighlighter
          {...props}
          language="jsx"
          style={theme.name === "dark" ? vscDarkPlus : vs}
        >
          {children?.props?.children}
        </SyntaxHighlighter>
      </div>
    );
  };

  return src ? (
    <Markdown
      className={className}
      style={{ textAlign: "left" }}
      options={{
        wrapper: "article",
        forceWrapper: false,
        overrides: {
          h1: { component: HeadingsTag },
          h2: { component: HeadingsTag },
          h3: { component: HeadingsTag },
          h4: { component: HeadingsTag },
          h5: { component: HeadingsTag },
          h6: { component: HeadingsTag },
          p: { component: HeadingsTag },
          table: { component: TableTag },
          thead: { component: TableHeadTag },
          tbody: { component: TableBodyTag },
          tr: { component: TableRowTag },
          th: { component: TableCellTag },
          td: { component: TableCellTag },
          pre: { component: PreTag },
        },
      }}
    >
      {src}
    </Markdown>
  ) : (
    <div />
  );
}
