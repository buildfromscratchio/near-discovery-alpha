import React, { useContext, useEffect, useMemo, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";

import { ThemeContext } from "../../context/ThemeContext";
import formatBytes from "../../libs/formatBytes";

export default function CustomDropzone(props) {
  const {
    label,
    required,
    value: files,
    setValue: setFiles,
    maxFiles = 5,
    maxSize = 4,

    oldFiles,
    fileToDelete,
  } = props;

  const { enqueueSnackbar } = useSnackbar();
  const { theme, accent } = useContext(ThemeContext);

  const onDrop = (acceptedFiles) => {
    if (files?.length >= maxFiles) {
      enqueueSnackbar(`Can not add more then ${maxFiles} images`, {
        variant: "error",
      });

      return;
    }

    let filteredFiles = acceptedFiles.filter((newObj) => {
      if (
        files.some(
          (existingObj) =>
            existingObj.size === newObj.size && existingObj.name === newObj.name
        )
      ) {
        enqueueSnackbar(`Skipping duplicate file: ${newObj.name}`, {
          variant: "warning",
        });

        return false;
      } else {
        return true;
      }
    });
    setFiles((e) => [...e, ...filteredFiles]);
  };

  const onDropRejected = (err) => {
    console.log(err);
    let errors = [];

    err?.map((item) => {
      errors?.push(item?.errors[0]?.message);
    });

    const uniqueErrors = [...new Set(errors)];
    uniqueErrors?.map((i) => {
      enqueueSnackbar(i, {
        variant: "error",
      });
    });
  };

  const { getInputProps, getRootProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        "image/*": [],
      },
      onDrop,
      onDropRejected,
      // multiple: maxFiles?.length > 1 ? true : false, // Allow multiple file uploads
      multiple: true, // Allow multiple file uploads
      // maxSize: 4194304, // 4MB
      maxSize: 52428800, // 50MB
      // maxSize: maxSize * 1024 * 1024, // 4MB
      maxFiles: maxFiles - files?.length, // Set the maximum number of files
    });
  const style = useMemo(
    () => ({
      ...baseStyle,
      backgroundColor: theme.backgroundColor,
      borderColor: theme.borderColor,
      ...(isFocused ? { borderColor: accent?.blue } : {}),
      ...(isDragAccept ? { borderColor: accent?.green } : {}),
      ...(isDragReject ? { borderColor: accent?.red } : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 0.5, gap: 0.5 }}>
        <Typography
          variant="p1"
          fontWeight={600}
          sx={{ color: theme.textColor2 }}
        >
          {label}
        </Typography>
        {/* {required && (
          <Typography variant="p1" fontWeight={600} sx={{ color: "#bc002d" }}>
            *
          </Typography>
        )} */}
      </Box>

      <Box>
        <Box {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <Typography variant="p1" align="center" fontWeight={400}>
            Drag &apos;n&apos; drop images here, or click to select images.{" "}
            <br />( Max {maxFiles} file{maxFiles > 1 && "s"}, Size: 50MB each,
            Type: PNG, JPG )
          </Typography>
        </Box>

        <Box>
          {files?.length > 0 && (
            <Box sx={{ pt: 0.5 }}>
              <Typography variant="p" sx={{ color: theme.textColor3 }}>
                Files
              </Typography>
              <Box
                sx={{
                  borderRadius: 1,
                  overflow: "hidden",
                  mt: 0.5,
                  border: `1px ${theme.borderColor} solid`,
                }}
              >
                {files?.map((file, index) => (
                  <FileItem
                    key={index}
                    file={file}
                    curIndex={index}
                    filesLength={files.length}
                    onClick={() =>
                      setFiles((e) => e.filter((f) => f.name !== file.name))
                    }
                  />
                ))}
              </Box>
            </Box>
          )}

          {oldFiles && oldFiles?.length > 0 && (
            <Box sx={{ pt: 0.5 }}>
              <Typography variant="p1" sx={{ color: theme.textColor3 }}>
                Current Files
              </Typography>
              <Box
                sx={{
                  borderRadius: 1,
                  overflow: "hidden",
                  mt: 0.5,
                  border: `1px ${theme.borderColor} solid`,
                }}
              >
                {oldFiles?.map((file, index) => (
                  <FileItem
                    key={index}
                    file={file}
                    curIndex={index}
                    filesLength={oldFiles.length}
                    onClick={() => fileToDelete(file)}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

const FileItem = ({ file, curIndex, filesLength, onClick }) => {
  const { theme } = useContext(ThemeContext);

  const [image, setImage] = useState("");

  useEffect(() => {
    // console.log("file : ", file);
    // if (typeof file === "Blob") {
    if (file.size > 100) {
      handleImageUpload(file);
    }
  }, []);

  function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      setImage(event.target.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <Box
      key={file?.path || file}
      sx={{
        backgroundColor: theme.backgroundColor,
        borderBottom:
          curIndex !== filesLength - 1
            ? `1px ${theme.borderColor} solid`
            : "none",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Box
        sx={{
          pl: "6px",
          pr: 0.5,
          py: 0.5,

          padding: "4px 4px 4px 6px",

          display: "flex",
          alignItems: "center",
          gap: 1,

          width: "calc(100% - 40px)",
        }}
      >
        <img
          style={{ height: 40, width: 40, objectFit: "cover", borderRadius: 4 }}
          src={image || file}
          alt={file?.name}
        />
        <Box>
          <Typography
            // className="max1Lines"
            sx={{ color: theme.textColor }}
            variant="h6"
            fontWeight={500}
          >
            {/* Name: {file?.name || `file_${curIndex + 1}`} */}
            Name:{" "}
            {file?.name || (typeof file === "string" && file.split("/").pop())}
          </Typography>

          {file?.size && (
            <Typography variant="p" sx={{ color: theme.textColor3 }}>
              Size: {formatBytes(file?.size)}
            </Typography>
          )}
        </Box>
      </Box>

      <IconButton onClick={onClick}>
        <CloseRoundedIcon />
      </IconButton>
    </Box>
  );
};

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderStyle: "dashed",
  borderRadius: 4,
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};
