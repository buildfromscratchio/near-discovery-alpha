import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useLocation } from "react-router-dom";
import { stringify } from "querystring";

export default function LoginDialog({ requestSignIn }) {
  const { pathname } = useLocation();

  const { loadingCheck, showDialog, isAuthenticated } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [allowWithoutLogin, setAllowWithoutLogin] = useState(false);

  useEffect(() => {
    let match = ["/auth", "/s3"];

    const data = match?.filter((url) => {
      return pathname.includes(url);
    });
    console.log({ data, pathname });
    setAllowWithoutLogin(
      data?.length > 0 ? true : false || (pathname === "/" && true)
    );
  }, [pathname]);

  return (
    !isAuthenticated && (
      <Dialog
        open={
          !isAuthenticated && !loadingCheck && showDialog && !allowWithoutLogin
        }
        fullWidth={true}
        maxWidth="xs"
        PaperProps={{
          style: {
            backgroundColor: theme.ui,
            borderRadius: 4,
            zIndex: 0,
            position: "absolute",
          },
        }}
      >
        <DialogTitle sx={{ padding: "16px 16px 16px 16px" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: theme.textColor2,
              textAlign: "center",
            }}
          >
            Sign In
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{
            padding: "16px",
            width: "100%",
            mt: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <GithubButton />
          <NearButton requestSignIn={requestSignIn} />
        </DialogContent>
      </Dialog>
    )
  );
}

const NearButton = ({ requestSignIn }) => {
  const { theme } = useContext(ThemeContext);
  const { setShowDialog } = useContext(AuthContext);

  return (
    <Button
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 45,
        gap: 1,
        textTransform: "none",
        color: theme.textColor,
        borderRadius: 1,

        backgroundColor: theme.textColor,

        "&:hover": {
          backgroundColor: theme.textColor2,
        },
      }}
      onClick={() => {
        requestSignIn();
        setShowDialog(false);
      }}
    >
      <svg
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.0863 0.690491C17.3456 0.690491 16.6578 1.07327 16.2698 1.70252L12.0893 7.88884C11.9531 8.09276 12.0084 8.36759 12.213 8.50336C12.3788 8.61351 12.5981 8.59988 12.7491 8.47041L16.8641 4.91296C16.9325 4.85163 17.0379 4.85787 17.0994 4.92602C17.1273 4.95725 17.1422 4.99758 17.1422 5.03904V16.1771C17.1422 16.269 17.0675 16.3429 16.9752 16.3429C16.9256 16.3429 16.8789 16.3213 16.8476 16.2833L4.40861 1.44242C4.0035 0.965932 3.40865 0.691059 2.78245 0.690491H2.34771C1.1711 0.690491 0.217285 1.64119 0.217285 2.81394V18.5009C0.217285 19.6737 1.1711 20.6244 2.34771 20.6244C3.08843 20.6244 3.77616 20.2416 4.16418 19.6124L8.34472 13.4261C8.48087 13.2221 8.4256 12.9473 8.22101 12.8115C8.05521 12.7014 7.83587 12.715 7.6849 12.8445L3.56989 16.4019C3.50152 16.4633 3.39611 16.457 3.33458 16.3888C3.30665 16.3576 3.29184 16.3173 3.29241 16.2758V5.13502C3.29241 5.04301 3.36705 4.96918 3.45935 4.96918C3.50836 4.96918 3.55565 4.99077 3.58699 5.02881L16.0243 19.8725C16.4293 20.349 17.0242 20.6239 17.6504 20.6244H18.0851C19.2617 20.625 20.2162 19.6748 20.2173 18.5021V2.81394C20.2173 1.64119 19.2629 0.690491 18.0863 0.690491Z"
          fill="white"
        />
      </svg>

      <Typography
        variant="h6"
        sx={{ fontWeight: 500, color: theme.buttonTextColor }}
      >
        Continue with Wallet
      </Typography>
    </Button>
  );
};

const GithubButton = () => {
  const { theme } = useContext(ThemeContext);

  const query = {
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_REDIRECT_URL,
    scope: "user:email",
  };
  return (
    <a
      style={{ textDecoration: "none" }}
      // href={`https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URL}`}
      href={`https://github.com/login/oauth/authorize?${stringify(query)}`}
    >
      <Button
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 45,
          gap: 1,
          textTransform: "none",
          color: theme.textColor,
          borderRadius: 1,

          backgroundColor: theme.textColor,

          "&:hover": {
            backgroundColor: theme.textColor2,
          },
        }}
      >
        <svg aria-label="github" height="20" viewBox="0 0 14 14" width="20">
          <path
            d="M7 .175c-3.872 0-7 3.128-7 7 0 3.084 2.013 5.71 4.79 6.65.35.066.482-.153.482-.328v-1.181c-1.947.415-2.363-.941-2.363-.941-.328-.81-.787-1.028-.787-1.028-.634-.438.044-.416.044-.416.7.044 1.071.722 1.071.722.635 1.072 1.641.766 2.035.59.066-.459.24-.765.437-.94-1.553-.175-3.193-.787-3.193-3.456 0-.766.262-1.378.721-1.881-.065-.175-.306-.897.066-1.86 0 0 .59-.197 1.925.722a6.754 6.754 0 0 1 1.75-.24c.59 0 1.203.087 1.75.24 1.335-.897 1.925-.722 1.925-.722.372.963.131 1.685.066 1.86.46.48.722 1.115.722 1.88 0 2.691-1.641 3.282-3.194 3.457.24.219.481.634.481 1.29v1.926c0 .197.131.415.481.328C11.988 12.884 14 10.259 14 7.175c0-3.872-3.128-7-7-7z"
            fill={theme.buttonTextColor}
            fill-rule="nonzero"
          ></path>
        </svg>

        <Typography
          variant="h6"
          sx={{ fontWeight: 500, color: theme.buttonTextColor }}
        >
          Continue with GitHub
        </Typography>
      </Button>
    </a>
  );
};
