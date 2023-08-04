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
import {
  CustomAccordion,
  CustomAccordionDetails,
  CustomAccordionSummary,
} from "../custom/CustomAccordion";
import { MyEditorContext } from "../../pages/myEditorPage/MyEditorContext";
import { AppContext } from "../../context/AppContext";

export default function DiffSidebar() {
  const { prId } = useParams();
  const { theme } = useContext(ThemeContext);
  const { prs, setPrs, loadingPrs, getPrs, hasSeen, setHasSeen } =
    useContext(AppContext);

  useEffect(() => {
    getPrs();
  }, []);

  useEffect(() => {
    if (prs?.openedPullRequests?.length > 0 && !hasSeen) handleSeen();
  }, [prs, hasSeen]);

  const [loadingSeen, setLoadingSeen] = useState(false);

  const handleSeen = () => {
    setHasSeen(true);
    setLoadingSeen(true);
    const ids = prs?.openedPullRequests?.map((pr) => pr._id);

    httpClient()
      .post("/pr/seen", { ids })
      .then((res) => {
        setLoadingSeen(false);

        const newPrs = prs?.openedPullRequests?.map((pr) => {
          pr.seen = true;
          return pr;
        });

        // setPrs(newPrs);

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
        <CustomAccordion>
          <CustomAccordionSummary
            aria-controls="panel2d-content"
            id="panel2d-header"
            sx={{ backgroundColor: theme.backgroundColor }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
              Open Pull Requests
            </Typography>
          </CustomAccordionSummary>
          <CustomAccordionDetails sx={{ backgroundColor: theme.ui }}>
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
            ) : prs?.openedPullRequests?.length > 0 ? (
              prs?.openedPullRequests?.map((pr, index) => (
                <PrItem key={index} pr={pr} theme={theme} prId={prId} />
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  py: 5,
                }}
              >
                <Typography
                  variant="p1"
                  sx={{ color: theme.textColor3, fontWeight: 500 }}
                >
                  You don't have any open pull requests
                </Typography>
              </Box>
            )}
          </CustomAccordionDetails>
        </CustomAccordion>

        <CustomAccordion>
          <CustomAccordionSummary
            aria-controls="panel2d-content"
            id="panel2d-header"
            sx={{ backgroundColor: theme.backgroundColor }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
              All Pull Requests
            </Typography>
          </CustomAccordionSummary>
          <CustomAccordionDetails sx={{ backgroundColor: theme.ui }}>
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
            ) : prs?.myPullRequests?.length <= 0 ? (
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
              prs?.myPullRequests?.map((pr, index) => (
                <PrItem key={index} pr={pr} theme={theme} prId={prId} />
              ))
            )}
          </CustomAccordionDetails>
        </CustomAccordion>
      </Box>
    </Box>
  );
}

const PrItem = ({ pr, theme, prId }) => {
  return (
    <Link
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

          backgroundColor: prId === pr?._id ? theme.buttonColor + 11 : theme.ui,
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
            variant="p"
            fontWeight={500}
            sx={{ color: theme.textColor2, lineHeight: 1.5 }}
          >
            {(pr?.title || pr?.fork?.title)?.substring(0, 17) + "..."}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Typography
              variant="p1"
              sx={{
                color: theme.textColor3,
                textAlign: "left",
                fontWeight: 500,
              }}
            >
              {`${
                pr?.createdBy?.name ||
                pr?.createdBy?.userName ||
                pr?.originalOwner
              } | 
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
  );
};
