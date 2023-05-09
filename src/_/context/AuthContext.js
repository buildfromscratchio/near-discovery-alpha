import React, { useEffect, useState, createContext } from "react";
import { useHistory } from "react-router-dom";
import { useAccount } from "near-social-vm";

export const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const account = useAccount();

  const history = useHistory();
  const [showDialog, setShowDialog] = useState(false);

  const [uesr, setUser] = useState();

  let requestNearSignIn;

  const saveAuth = async (value) => {
    setUser(value);
    await localStorage.setItem("githubToken", JSON.stringify(value));
    setShowDialog(false);
  };

  useEffect(() => {
    checkAuth();
  }, [account]);

  const checkAuth = async () => {
    // let data = await localStorage.getItem("githubToken");

    let githubToken = await localStorage.getItem("githubToken");

    let near_app_wallet_auth_key = await localStorage.getItem(
      "near_app_wallet_auth_key"
    );

    let data = githubToken || near_app_wallet_auth_key;

    setUser(JSON.parse(data));

    console.log("XD", data);

    if (!data) {
      setShowDialog(true);
    } else {
      setShowDialog(false);
    }
  };

  // const requestNearSignIn = useCallback(
  //   (e) => {
  //     e && e.preventDefault();
  //     walletModal.show();
  //     return false;
  //   },
  //   [walletModal]
  // );

  const logout = async () => {
    await localStorage.removeItem("githubToken");
    setShowDialog(true);
    setUser();
    history.push("/editor");
  };

  return (
    <AuthContext.Provider
      value={{
        uesr,
        saveAuth,
        checkAuth,
        requestNearSignIn,
        logout,
        //
        showDialog,
        setShowDialog,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
