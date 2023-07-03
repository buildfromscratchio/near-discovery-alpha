import React, { useEffect, useState, createContext, useContext } from "react";
import { useAccount } from "near-social-vm";
import { useSnackbar } from "notistack";
import httpClient from "../libs/httpClient";
import { useHistory } from "react-router-dom";
import LoadingPage from "../components/LoadingPage";
import { AppContext } from "./AppContext";

export const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const { isUnrestrictedRoute } = useContext(AppContext);

  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const nearUser = useAccount();

  const [loadingCheck, setLoadingCheck] = useState(true);
  const [loading, setLoading] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState();

  // useEffect(() => {
  //   console.log("isAuthenticated", JSON.stringify(isAuthenticated));
  // }, [isAuthenticated]);
  // useEffect(() => {
  //   console.log("loadingCheck", JSON.stringify(loadingCheck));
  // }, [loadingCheck]);
  // useEffect(() => {
  //   console.log("loading", JSON.stringify(loading));
  // }, [loading]);

  // console.log("nearUser : ", nearUser);

  useEffect(() => {
    if (!isAuthenticated) checkAuth();
  }, [nearUser]);

  const checkAuth = async () => {
    if (isAuthenticated) return;

    setLoadingCheck(true);

    const accessToken = await localStorage.getItem("accessToken");
    const userId = await localStorage.getItem("userId");

    if (!accessToken || !userId) {
      if (nearUser) {
        console.log("nearUser?.accountId", nearUser);
        loginWithNear();

        return;
      }

      setLoadingCheck(false);
      setIsAuthenticated(false);
      return;
    }

    await httpClient()
      .get(`/users/${userId}`)
      .then((res) => {
        saveUserData(res.data);
      })
      .catch((err) => {
        console.log("ERROR from Check Auth : ", err);
        enqueueSnackbar("Fail to login.", { variant: "error" });
        setLoadingCheck(false);
        setIsAuthenticated(false);

        logout();
      });
  };

  const saveUserData = async (user) => {
    try {
      setLoading(true);

      setIsAuthenticated(true);
      setUser(user);

      user.accessToken &&
        (await localStorage.setItem("accessToken", user.accessToken));
      await localStorage.setItem("userId", user._id || user.id);

      setLoadingCheck(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setLoadingCheck(false);
      setIsAuthenticated(false);
      console.log(err);
    }
  };

  const loginWithNear = async () => {
    // const accessToken = await localStorage.getItem("accessToken");
    // const userId = await localStorage.getItem("userId");
    setLoadingCheck(true);
    // setLoading(true);

    if (nearUser?.accountId) {
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
          setLoading(false);
        });
    } else {
      // console.log("Near Key is not available");

      setLoadingCheck(false);
      setIsAuthenticated(false);
      setLoading(false);
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
        saveUserData,
      }}
    >
      {/* {!isUnrestrictedRoute && (loading || loadingCheck) ? (
        <LoadingPage fullSize={true} />
      ) : (
        props.children
      )} */}
      {!isUnrestrictedRoute && (loading || loadingCheck) && (
        <LoadingPage fullSize={true} />
      )}
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
