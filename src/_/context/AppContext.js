import React, { useEffect, useState, createContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import httpClient from "../libs/httpClient";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const location = useLocation();
  const history = useHistory();

  // URL without hash and restricted routes
  const [isUnrestrictedRoute, setIsUnrestrictedRoute] = useState(false);
  useEffect(() => {
    const match = ["/auth", "/s3", "/c", "/learn", "/playground"];

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
  // URL without hash and restricted routes

  // Fork and PRs section
  const [prs, setPrs] = useState();
  const [hasSeen, setHasSeen] = useState(false);
  const [loadingPrs, setLoadingPrs] = useState(false);
  const [forked, setForked] = useState(undefined);
  const token = localStorage.getItem("accessToken");

  const checkIsForked = async (lastPath) => {
    if (!token) return;

    setForked(undefined);
    httpClient()
      .get(`/fork/${lastPath?.name}`)
      .then((res) => {
        console.log("checkIsForked : res.data : ", res.data);
        if (res.data?._id) {
          setForked(res.data);
        } else {
          setForked(undefined);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffect(() => {
  //   setLoadingPrs(true);
  // }, []);

  useEffect(() => {
    if (!token) return;

    const intervalId = setInterval(() => {
      // Your code logic here
      getPrs();

      // Be sure to clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }, 30000); // 30 seconds in milliseconds
  }, []);

  const getPrs = () => {
    httpClient()
      .get("/pr")
      .then((res) => {
        setPrs(res.data);

        setLoadingPrs(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingPrs(false);
      });
  };
  // Fork and PRs section

  return (
    <AppContext.Provider
      value={{
        // restricted routes
        isUnrestrictedRoute,

        // Fork section
        forked,
        setForked,
        checkIsForked,
        prs,
        setPrs,
        hasSeen,
        setHasSeen,
        loadingPrs,
        getPrs,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
