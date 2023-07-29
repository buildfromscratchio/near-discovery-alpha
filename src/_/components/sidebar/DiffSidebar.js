import React, { useContext, useState } from "react";
import { Box, ButtonBase, Chip, Skeleton, Typography } from "@mui/material";
import moment from "moment";

import { ThemeContext } from "../../context/ThemeContext";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import capitalizeWords from "../../libs/capitalizeWords";
import { EditorContext } from "../../context/EditorContext";
import httpClient from "../../libs/httpClient";

export default function DiffSidebar() {
  const { prId } = useParams();
  const { theme } = useContext(ThemeContext);
  const { prs, setPrs, loadingPrs, getPrs } = useContext(EditorContext);

  const [hasSeen, setHasSeen] = useState(false);

  useEffect(() => {
    getPrs();
  }, []);

  useEffect(() => {
    if (prs?.length > 0 && !hasSeen) handleSeen();
  }, [prs, hasSeen]);

  const [loadingSeen, setLoadingSeen] = useState(false);

  const handleSeen = () => {
    setHasSeen(true);
    setLoadingSeen(true);
    const ids = prs?.map((pr) => pr._id);

    httpClient()
      .post("/pr/seen", { ids })
      .then((res) => {
        setLoadingSeen(false);

        const newPrs = prs?.map((pr) => {
          pr.seen = true;
          return pr;
        });

        setPrs(newPrs);

        console.log("newPrs : ", newPrs, prs);
      })
      .catch((err) => {
        setLoadingSeen(false);
        console.log(err);
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

      <Box>
        {loadingPrs ? (
          Array.from(new Array(10)).map((item, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="100%"
              height={59}
              sx={{ mb: "1px" }}
            />
          ))
        ) : prs?.length <= 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              py: 10,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: theme.textColor3, fontWeight: 500 }}
            >
              No pull requests found
            </Typography>
          </Box>
        ) : (
          prs?.map((pr, index) => (
            <Link
              key={index}
              to={`/prs/${pr?._id}`}
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
                    variant="h5"
                    fontWeight={500}
                    sx={{ color: theme.textColor2, lineHeight: 1.5 }}
                  >
                    {(pr?.title || pr?.fork?.title)?.substring(0, 17) + "..."}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Typography
                      variant="p1"
                      align="left"
                      sx={{
                        color: theme.textColor3,
                        textAlign: "left",
                      }}
                    >
                      {`${pr?.createdBy?.name || pr?.createdBy?.userName} | 
                      ${pr?.network} | ${moment(pr?.createdAt).fromNow()}`}
                    </Typography>
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
          ))
        )}
      </Box>
    </Box>
  );
}
