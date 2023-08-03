import React, { useContext, useState } from "react";
import { Box, Chip, Fade, IconButton, Typography } from "@mui/material";
import FileIcon from "./FileIcon";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

import { ThemeContext } from "../context/ThemeContext";
import ConfirmDialog from "../dialogs/ConfirmDialog";

export default function LabelWithFileIcon({
  item,
  labelStyle,
  style,
  renameFile,
  //
  isWidget,
  isSelected,
  isDraft,
  codeChangesPresent,
  //
  handleOpenFile,
  handleRenameFile,
  handleRemoveFile,
  handleOpenFolder,
}) {
  const { theme } = useContext(ThemeContext);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          ...style,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7.5,
            width: "100%",
          }}
          onClick={() => handleOpenFile()}
        >
          <FileIcon type={item?.type} />

          <Typography
            variant="body2"
            sx={{
              ml: 0,
              fontWeight: 400,
              color: theme.textColor2,
              paddingBlock: "2.5px",
              textTransform: "none",
              fontSize: ".9rem",
              textAlign: "left",
              wordBreak: "break-all",
              ...labelStyle,
            }}
            className="max1Lines"
          >
            {/* {`${item.name}.${item.type}`} */}
            {item.name}
          </Typography>

          {isWidget && isDraft && (
            <Chip
              label="Draft"
              sx={{
                opacity: 0.75,
                backgroundColor: "#ffdf0033",
                color: theme?.name === "dark" ? "#ffdf00" : theme.textColor,
                fontSize: 12,
                mr: 1,
                fontSize: 10,
                height: 18,

                pointerEvents: "none",
              }}
              size="small"
            />
          )}
        </div>
        <Box sx={{ display: "flex", gap: 1 }}>
          {isWidget && isSelected && (
            <Fade in={isSelected}>
              <IconButton
                size="small"
                sx={{ padding: "3px", margin: 0 }}
                onClick={handleRenameFile}
              >
                <DriveFileRenameOutlineRoundedIcon
                  sx={{
                    fontSize: "1rem",
                    fill: theme.textColor3 || "rgba(255,255,255,.75)",
                  }}
                />
              </IconButton>
            </Fade>
          )}
          {handleRemoveFile && (
            <IconButton
              size="small"
              sx={{
                padding: "3px",
                margin: 0,
                color:
                  isWidget && isSelected
                    ? theme.textColor3
                    : theme.textColor3 + 33,
                transition: "all .2s ease-in-out",
                "&:hover": {
                  color: isSelected ? theme.textColor3 : theme.textColor3 + 99,
                },
              }}
              onClick={() => {
                if (isDraft === true || codeChangesPresent === true) {
                  setShowConfirmDialog(true);
                } else {
                  handleRemoveFile();
                }
              }}
            >
              <CancelRoundedIcon sx={{ fontSize: "1rem" }} />
            </IconButton>
          )}
        </Box>
      </div>

      <ConfirmDialog
        open={showConfirmDialog}
        setOpen={setShowConfirmDialog}
        onClick={() => handleRemoveFile()}
        label={`Remove widget`}
        description={`Are you sure you want to remove "${item?.name}"?`}
      />

      {/* <RenameDialog
        // open={showEditButton}
        // setOpen={setShowEditButton}
        // item={item}

        key={`rename-modal-${item.name}`}
        show={showEditButton}
        name={item.name}
        onRename={(newName) => renameFile(newName)}
        onHide={() => setShowEditButton(false)}
      /> */}
    </>
  );
}
