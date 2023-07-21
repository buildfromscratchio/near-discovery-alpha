import React, { useState, createContext, useEffect } from "react";
import httpClient from "../libs/httpClient";

export const EditorContext = createContext();

export const EditorContextProvider = (props) => {
  const [showWebsiteView, setShowWebsiteView] = useState(true);
  const [showLiveCodePreview, setShowLiveCodePreview] = useState(true);
  const [showConsole, setShowConsole] = useState(false);
  const [logs, setLogs] = useState([]);

  const [selectedActivity, setSelectedActivity] = useState("");

  const [code, setCode] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [filesDetails, setFilesDetails] = useState(new Map());
  const [lastPath, setLastPath] = useState(undefined);

  // useEffect(() => {
  //   console.log({
  //     files,
  //     filesDetails,
  //     lastPath,
  //   });
  // }, [files, filesDetails, lastPath]);

  useEffect(() => {
    setLogs([]);

    if (lastPath) {
      checkIsForked();
    }
  }, [lastPath]);

  const [curFileGasFee, setCurFileGasFee] = useState(0);
  const calculateGasFee = (code) => {
    const size = new Blob([code]).size;

    const inKb = size / 1024;
    const inNEAR = inKb / 100;

    setCurFileGasFee({ near: inNEAR, size: inKb });
  };

  // For Search Page
  const [openComponentDetail, setOpenComponentDetail] = useState("");

  //
  const [NetworkId, SetNetworkId] = useState(undefined);

  const setNetworkId = (value) => {
    SetNetworkId(value);
    // console.log("NetworkId === > ", value);

    localStorage.setItem("environment", value);

    location.reload();
  };

  useEffect(() => {
    SetNetworkId(localStorage.getItem("environment") || "mainnet");
  }, []);

  //

  const TestnetWidgets = {
    // image: "eugenethedream/widget/Image",
    // default: "eugenethedream/widget/Welcome",
    // viewSource: "eugenethedream/widget/WidgetSource",
    // widgetMetadataEditor: "eugenethedream/widget/WidgetMetadataEditor",
    // widgetMetadata: "eugenethedream/widget/WidgetMetadata",
    // profileImage: "eugenethedream/widget/ProfileImage",
    // profilePage: "eugenethedream/widget/Profile",
    // profileName: "eugenethedream/widget/ProfileName",
    // notificationButton: "eugenethedream/widget/NotificationButton",
    image: "eugenethedream/widget/Image",
    default: "one.testnet/widget/ActivityPage",
    viewSource: "eugenethedream/widget/WidgetSource",
    widgetMetadataEditor: "eugenethedream/widget/WidgetMetadataEditor",
    widgetMetadata: "eugenethedream/widget/WidgetMetadata",
    profileImage: "eugenethedream/widget/ProfileImage",
    profilePage: "eugenethedream/widget/Profile",
    profileName: "eugenethedream/widget/ProfileName",
    componentsPage: "one.testnet/widget/ComponentsPage",
    peoplePage: "one.testnet/widget/PeoplePage",
    globalSearchPage: "one.testnet/widget/GlobalSearchPage",
    notificationButton: "one.testnet/widget/NotificationButton",
    profilePage: "one.testnet/widget/ProfilePage",
    componentSummary: "one.testnet/widget/ComponentSummary",
    notificationsPage: "one.testnet/widget/NotificationsPage",
    tosCheck: "one.testnet/widget/TosCheck",
    tosContent: "one.testnet/widget/TosContent",
    wrapper: "one.testnet/widget/DIG.Theme",
    wrapper: "one.testnet/widget/DIG.Theme",

    // My
    profilePageSidebar: "saidulbadhon.testnet/widget/ProfileSidebar",
    profilePageMain: "saidulbadhon.testnet/widget/ProfilePage.Main",
    activitybarNotificationButton:
      "saidulbadhon.testnet/widget/Activitybar.NotificationButton",
  };

  const MainnetWidgets = {
    // image: "mob.near/widget/Image",
    // default: "calebjacob.near/widget/ActivityPage",
    // viewSource: "mob.near/widget/WidgetSource",
    // widgetMetadataEditor: "mob.near/widget/WidgetMetadataEditor",
    // widgetMetadata: "mob.near/widget/WidgetMetadata",
    // profileImage: "mob.near/widget/ProfileImage",
    // notificationButton: "mob.near/widget/NotificationButton",
    // profilePage: "mob.near/widget/ProfilePage",
    // profileName: "patrick.near/widget/ProfileName",
    // editorComponentSearch: "mob.near/widget/Editor.ComponentSearch",
    // profileInlineBlock: "mob.near/widget/Profile.InlineBlock",
    image: "mob.near/widget/Image",
    default: "near/widget/ActivityPage",
    viewSource: "mob.near/widget/WidgetSource",
    // widgetMetadataEditor: "mob.near/widget/WidgetMetadataEditor",
    widgetMetadata: "mob.near/widget/WidgetMetadata",
    profileImage: "mob.near/widget/ProfileImage",
    profileName: "patrick.near/widget/ProfileName",
    editorComponentSearch: "mob.near/widget/Editor.ComponentSearch",
    profileInlineBlock: "mob.near/widget/Profile.InlineBlock",
    componentsPage: "near/widget/ComponentsPage",
    peoplePage: "near/widget/PeoplePage",
    globalSearchPage: "chaotictempest.near/widget/Search",
    notificationButton: "near/widget/NotificationButton",
    profilePage: "near/widget/ProfilePage",
    componentSummary: "near/widget/ComponentSummary",
    notificationsPage: "near/widget/NotificationsPage",
    tosCheck: "near/widget/TosCheck",
    tosContent: "adminalpha.near/widget/TosContent",
    wrapper: "near/widget/DIG.Theme",

    // My
    widgetMetadataEditor:
      "saidulbadhon.near/widget/EditorPage.Metadata.WidgetMetadataEditor",
    profilePageSidebar: "saidulbadhon.near/widget/ProfilePage.Sidebar",
    profilePageMain: "saidulbadhon.near/widget/ProfilePage.Main",
    activitybarNotificationButton:
      "saidulbadhon.near/widget/Activitybar.NotificationButton",
  };

  // const [Widgets , setWidgets]  = useState(NetworkId === "testnet" ? TestnetWidgets : MainnetWidgets)

  //

  // Fork and PRs section
  const [prs, setPrs] = useState([]);
  const [loadingPrs, setLoadingPrs] = useState(false);
  const [forked, setForked] = useState(undefined);

  const checkIsForked = () => {
    setForked(undefined);
    httpClient()
      .get(`/fork/${lastPath?.name}`)
      .then((res) => {
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

  useEffect(() => {
    getPrs();
  }, []);

  const getPrs = () => {
    setLoadingPrs(true);

    httpClient()
      .get("/pr")
      .then((res) => {
        console.log(res.data);
        setPrs(res.data);
        setLoadingPrs(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingPrs(false);
      });
  };

  const [loadingSeen, setLoadingSeen] = useState(false);

  const handleSeen = () => {
    setLoadingSeen(true);
    const ids = prs?.map((pr) => pr._id);

    httpClient()
      .post("/pr/seen", { ids })
      .then((res) => {
        setLoadingSeen(false);

        let newPrs = [];

        prs?.map((pr) => {
          pr.seen = true;
          newPrs.push(pr);
        });

        setPrs(newPrs);

        console.log("handleSeen : ", res.data);
      })
      .catch((err) => {
        setLoadingSeen(false);
        console.log(err);
      });
  };

  return (
    <EditorContext.Provider
      value={{
        showWebsiteView,
        setShowWebsiteView,
        //
        showLiveCodePreview,
        setShowLiveCodePreview,
        showConsole,
        setShowConsole,
        logs,
        setLogs,
        //
        code,
        setCode,
        files,
        setFiles,
        filesDetails,
        setFilesDetails,
        lastPath,
        setLastPath,

        curFileGasFee,
        calculateGasFee,
        //
        selectedActivity,
        setSelectedActivity,
        //
        NetworkId,
        SetNetworkId,
        setNetworkId,
        Widgets: NetworkId === "testnet" ? TestnetWidgets : MainnetWidgets,
        // Widgets: TestnetWidgets,

        // For Search Page
        openComponentDetail,
        setOpenComponentDetail,

        // Fork section
        forked,
        prs,
        loadingPrs,
        getPrs,
        handleSeen,
      }}
    >
      {props.children}
    </EditorContext.Provider>
  );
};

export default EditorContextProvider;
