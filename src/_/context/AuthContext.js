import React, { useEffect, useState, createContext } from "react";
import { useAccount } from "near-social-vm";
import { useSnackbar } from "notistack";
import httpClient from "../libs/httpClient";
import { useHistory, useLocation } from "react-router-dom";
import LoadingPage from "../components/LoadingPage";

export const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const { pathname } = useLocation();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const nearUser = useAccount();

  const [loadingCheck, setLoadingCheck] = useState(true);
  const [loading, setLoading] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const [user, setUser] = useState();

  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) checkAuth();
  }, []);

  const checkAuth = async () => {
    if (isAuthenticated) return;

    setLoadingCheck(true);

    const accessToken = await localStorage.getItem("accessToken");
    const userId = await localStorage.getItem("userId");

    if (!accessToken || !userId) {
      setLoadingCheck(false);
      setIsAuthenticated(false);
      return;
    } else {
      console.log("User exists? ", userId);

      await httpClient()
        .get(`/users/${userId}`)
        .then((res) => {
          const { data } = res;

          setLoadingCheck(false);
          saveUserData(data);
          setLoading(false);
          setShowDialog(false);
        })
        .catch((err) => {
          console.log("ERROR from ToggleAuth : ", err);
          enqueueSnackbar("Fail to login.", { variant: "error" });
          setLoadingCheck(false);

          logout();
        });
    }
  };

  useEffect(() => {
    if (!isAuthenticated && nearUser) {
      loginWithNear();
    }
  }, [nearUser]);

  const saveUserData = async (user) => {
    setLoading(true);
    try {
      setUser(user);
      setIsAuthenticated(true);

      user.accessToken &&
        (await localStorage.setItem("accessToken", user.accessToken));
      await localStorage.setItem("userId", user._id || user.id);
      setShowDialog(false);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const loginWithNear = async () => {
    const accessToken = await localStorage.getItem("accessToken");
    const userId = await localStorage.getItem("userId");

    if (nearUser?.accountId && (!accessToken || !userId)) {
      setLoading(true);
      setLoadingCheck(true);

      httpClient()
        .post(`/auth/near`, { nearAccountId: nearUser.accountId })
        .then((res) => {
          saveUserData(res.data);
          setLoadingCheck(false);
          setLoading(false);

          history.push("/editor");
        })
        .catch((err) => {
          console.log("ERROR from loginWithNear : ", err);
          setLoadingCheck(false);
          enqueueSnackbar("Fail to login with near.", { variant: "error" });
        });
    } else {
      // console.log("Near Key is not available");

      setShowDialog(true);
      setLoadingCheck(false);
      setIsAuthenticated(false);
    }
  };
  //
  //
  // const checkAuth = async () => {
  //   // let data = await localStorage.getItem("githubToken");

  //   let githubToken = await localStorage.getItem("githubToken");

  //   let near_app_wallet_auth_key = await localStorage.getItem(
  //     "near_app_wallet_auth_key"
  //   );

  //   let data = githubToken || near_app_wallet_auth_key;

  //   setUser(JSON.parse(data));

  //   console.log("XD", data);

  //   if (!data) {
  //     setShowDialog(true);
  //   } else {
  //     setShowDialog(false);
  //   }
  // };

  // const requestNearSignIn = useCallback(
  //   (e) => {
  //     e && e.preventDefault();
  //     walletModal.show();
  //     return false;
  //   },
  //   [walletModal]
  // );

  const logout = async () => {
    await localStorage.removeItem("accessToken");
    await localStorage.removeItem("userId");
    setShowDialog(true);
    setUser();
    setIsAuthenticated(false);
    setLoadingCheck(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        loadingCheck,

        isAuthenticated,
        user,
        // saveAuth,
        checkAuth,
        logout,
        //
        showDialog,
        setShowDialog,
        //
        saveUserData,
      }}
    >
      {(loading || loadingCheck) && pathname !== "/" ? (
        <LoadingPage />
      ) : (
        props.children
      )}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
