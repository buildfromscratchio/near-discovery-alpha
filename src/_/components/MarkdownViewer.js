import { Paper, Typography } from "@mui/material";

import Markdown from "markdown-to-jsx";
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function MarkdownViewer({ src }) {
  const { theme } = useContext(ThemeContext);

  // const HeadingsTag = ({ children, ...props }) => (
  //   <Typography variant={props.id} {...props}>
  //     {children}
  //   </Typography>
  // );
  // const TableTag = ({ children, ...props }) => (
  //   <Table
  //     component={Paper}
  //     sx={{
  //       backgroundColor: theme.backgroundColor,

  //       // boxShadow: `0px 0px 2px rgba(0,0,0,.25)`,
  //       boxShadow: `none`,
  //       outline: `1px ${theme.borderColor} solid`,
  //       outlineOffset: -1,
  //       borderRadius: 1,
  //       overflow: "hidden",
  //     }}
  //     {...props}
  //   >
  //     {children}
  //   </Table>
  // );
  // const TableHeadTag = ({ children, ...props }) => (
  //   <TableHead {...props}>{children}</TableHead>
  // );
  // const TableBodyTag = ({ children, ...props }) => (
  //   <TableBody {...props}>{children}</TableBody>
  // );
  // const TableRowTag = ({ children, ...props }) => (
  //   <TableRow {...props}>{children}</TableRow>
  // );
  // const TableCellTag = ({ children, ...props }) => (
  //   <TableCell {...props}>{children}</TableCell>
  // );

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

  return src ? (
    <Markdown
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
        },
      }}
    >
      {src}
    </Markdown>
  ) : (
    <div />
  );
}
