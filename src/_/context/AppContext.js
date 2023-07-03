import React, { useEffect, useState, createContext } from "react";
import { useLocation } from "react-router-dom";
import LoadingPage from "../components/LoadingPage";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const { pathname } = useLocation();

  const [isUnrestrictedRoute, setIsUnrestrictedRoute] = useState(false);

  useEffect(() => {
    const match = ["/auth", "/s3", "/c"];

    const data = match?.filter((url) => {
      return pathname.includes(url);
    });

    setIsUnrestrictedRoute(
      data?.length > 0 ? true : false || (pathname === "/" && true)
    );
  }, [pathname]);

  return (
    <AppContext.Provider
      value={{
        isUnrestrictedRoute,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
