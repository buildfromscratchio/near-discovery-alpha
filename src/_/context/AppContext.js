import React, { useEffect, useState, createContext } from "react";
import { useLocation, useHistory } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const location = useLocation();
  const history = useHistory();

  const [isUnrestrictedRoute, setIsUnrestrictedRoute] = useState(false);

  useEffect(() => {
    const match = ["/auth", "/s3", "/c", "/learn"];

    const data = match?.filter((url) => {
      return location.pathname.includes(url);
    });

    setIsUnrestrictedRoute(
      data?.length > 0 ? true : false || (location.pathname === "/" && true)
    );
  }, [location.pathname]);

  useEffect(() => {
    // const currentURL = location.pathname + location.search + location.hash;
    const currentURL = location.hash;
    if (currentURL.startsWith("#")) {
      const urlWithoutHash = currentURL.slice(1); // Remove the first character ('#').

      // Replace the URL in the browser's history without the hash
      history.push(urlWithoutHash);
    }
  }, [location]);

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
