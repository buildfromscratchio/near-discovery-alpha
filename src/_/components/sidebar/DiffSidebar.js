import React, { useContext } from "react";
import { Box, ButtonBase, Chip, Skeleton, Typography } from "@mui/material";

import { ThemeContext } from "../../context/ThemeContext";
import httpClient from "../../libs/httpClient";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import formattedDate from "../../libs/formattedDate";
import capitalizeWords from "../../libs/capitalizeWords";

export default function DiffSidebar() {
  const { prId } = useParams();
  const { theme } = useContext(ThemeContext);

  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);

    httpClient()
      .get("/pr")
      .then((res) => {
        console.log(res.data);
        setPrs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <Box
      style={{
        minWidth: 250,
        overflowX: "auto",
        height: "calc(100vh - 25px)",
        paddingBottom: 16,
      }}
    >
      <Box
        style={{
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: 10,
          borderBottom: `1px solid ${theme.borderColor}`,
        }}
      >
        <Typography variant="h6" sx={{ color: theme.textColor }}>
          Pull requests
        </Typography>
      </Box>

      <Box
      //  sx={{ containerType: "inline-size" }}
      >
        {loading
          ? Array.from(new Array(10)).map((item, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="100%"
                height={102}
                sx={{ mb: "1px" }}
              />
            ))
          : prs?.map((pr, index) => (
              <Link
                key={index}
                to={`/diff/${pr?._id}`}
                style={{
                  containerType: "normal",
                }}
              >
                <ButtonBase
                  className="prSidebarButton"
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    // height: 50,
                    padding: 1,
                    borderBottom: `1px solid ${theme.borderColor}`,

                    backgroundColor:
                      prId === pr?._id ? theme.buttonColor + 11 : theme.ui,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      variant="p1"
                      fontWeight={500}
                      sx={{ color: theme.textColor2, lineHeight: 1.5 }}
                    >
                      {pr?.title || pr?.fork?.title}
                    </Typography>

                    <Box>
                      <Typography
                        variant="p1"
                        align="left"
                        sx={{
                          color: theme.textColor3,
                          textAlign: "left",
                        }}
                      >
                        {`${
                          pr?.createdBy?.name || pr?.createdBy?.userName
                        } -> ${pr?.originalOwner || pr?.fork?.originalOwner}`}
                      </Typography>
                      {/* <Typography
                        variant="p2"
                        sx={{ color: theme.textColor3, textAlign: "left" }}
                      >
                        {pr?.originalOwner || pr?.fork?.originalOwner}
                        {formattedDate(pr?.createdAt)}
                      </Typography> */}
                    </Box>
                  </Box>

                  <Chip
                    style={{
                      backgroundColor:
                        (pr?.status === "opened" && "#4caf5022") ||
                        (pr?.status === "rejected" && "#f4433622") ||
                        (pr?.status === "merged" && "#3f51b522") ||
                        (pr?.status === "merged" && theme.buttonColor + 22),

                      color:
                        (pr?.status === "opened" && "#4caf50") ||
                        (pr?.status === "rejected" && "#f44336") ||
                        (pr?.status === "merged" && "#3f51b5") ||
                        (pr?.status === "merged" && theme.buttonColor),
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                    size="small"
                    label={capitalizeWords(pr?.status)}
                  />
                </ButtonBase>
              </Link>
            ))}
      </Box>
    </Box>
  );
}
