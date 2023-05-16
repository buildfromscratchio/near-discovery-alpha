import React, { useEffect, useState, createContext } from "react";
import { useHistory } from "react-router-dom";
import { useAccount } from "near-social-vm";
import { useSnackbar } from "notistack";
import httpClient from "../libs/httpClient";

export const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const nearUser = useAccount();

  const [loadingCheck, setLoadingCheck] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const [user, setUser] = useState();
  const [role, setRole] = useState();
  const [token, setToken] = useState();

  const [showDialog, setShowDialog] = useState(false);

  // const saveAuth = async (value) => {
  //   setUser(value);
  //   await localStorage.setItem("githubToken", JSON.stringify(value));
  //   setShowDialog(false);
  // };

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

      httpClient()
        .get(`/users/${userId}`)
        .then((res) => {
          const { data } = res;
          console.log(data);

          enqueueSnackbar(
            `Welcom back, ${
              data?.fullName ? data?.fullName : data.nearAccountId
            }`,
            { variant: "success" }
          );

          setLoadingCheck(false);
          saveUserData(data);
          setLoading(false);
          setShowDialog(false);
        })
        .catch((err) => {
          console.log("ERROR from ToggleAuth : ", err);
          enqueueSnackbar("Fail to login.", { variant: "error" });

          logout();
        });
    }
  };

  useEffect(async () => {
    if (nearUser) {
      loginWithNear();
    }
  }, [nearUser]);

  const saveUserData = async (user) => {
    setLoading(true);
    try {
      console.log("Saving user: ", user);
      setUser(user);
      setRole(user.role);
      setToken(user.accessToken);
      setIsAuthenticated(true);

      user.accessToken &&
        (await localStorage.setItem("accessToken", user.accessToken));
      await localStorage.setItem("userId", user._id || user.id);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  //
  //
  // useEffect(() => {
  //   if (!isAuthenticated && nearUser) loginWithNear();
  // }, [nearUser, isAuthenticated]);
  const loginWithNear = async () => {
    const accessToken = await localStorage.getItem("accessToken");
    const userId = await localStorage.getItem("userId");

    if ((nearUser?.accountId && !accessToken) || !userId) {
      setLoading(true);

      httpClient()
        .post(`/auth/near`, { nearAccountId: nearUser.accountId })
        .then((res) => {
          // console.log(res.data);
          const { data } = res;

          enqueueSnackbar(
            `Welcom back, ${
              data?.firstName
                ? data?.firstName + " " + data?.lastName
                : data.nearAccountId
            }`,
            { variant: "success" }
          );

          saveUserData(res.data);
          setLoadingCheck(false);
          setLoading(false);
        })
        .catch((err) => {
          console.log("ERROR from loginWithNear : ", err);
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

    // history.push("/editor");
  };

  return (
    <AuthContext.Provider
      value={{
        loading,

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
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
