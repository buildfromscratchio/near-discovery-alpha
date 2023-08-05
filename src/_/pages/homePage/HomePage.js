import React, { useContext } from "react";
import { useEffect } from "react";

import HomeFooter from "./_components/HomeFooter";
import { ThemeContext } from "../../context/ThemeContext";
import { useParams } from "react-router-dom";
import ViewPage from "../../../pages/ViewPage";
import HomeHeader from "./_components/HomeHeader";
import HomeEditorContainer from "./_components/HomeEditorContainer";
import HomeTestimonialSection from "./_components/HomeTestimonialSection";
import HomeLearnSection from "./_components/HomeLearnSection";
import { EditorContext } from "../../context/EditorContext";
import NewHomeTopSection from "./_newComponents/NewHomeTopSection";
import NewHomeCTASection from "./_newComponents/NewHomeCTASection";

export default function HomePage(props) {
  const { widgetSrc } = useParams();
  const { theme } = useContext(ThemeContext);
  const { SetNetworkId } = useContext(EditorContext);

  useEffect(() => {
    setEnv();
  }, []);
  const setEnv = () => {
    const environment = localStorage.getItem("environment");

    if (environment !== "mainnet") {
      SetNetworkId("mainnet");
      localStorage.setItem("environment", "mainnet");
      location.reload();

      // console.log("environment === > ", environment);
    }

    // localStorage.setItem("environment", "mainnet");
  };

  return widgetSrc ? (
    <ViewPage {...props} />
  ) : (
    <>
      <HomeHeader {...props} />

      <NewHomeTopSection />

      <NewHomeCTASection />

      {/* <HomeOurPartnersSection /> */}
      <HomeEditorContainer />
      {/* <HomeFeatureSection
        rtl
        title="BOS DevTools"
        description="We're still working out the kinks. Want to help us get ready for
              the prime time? <br/> Join the telegram channel and ask for the private
              beta access."
        image="https://images.unsplash.com/photo-1680695918766-eec8968c7b4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=100"
      /> */}

      {/* <HomeFeatureSection
        title="BOS DevTools"
        description="We're still working out the kinks. Want to help us get ready for
              the prime time? <br/> Join the telegram channel and ask for the private
              beta access."
        rightSideContent={
          <Box
            sx={{
              width: "100%",
              height: 500,
              border: `1px ${theme.borderColor} solid`,
              borderRadius: 0.5,
              overflow: "hidden",
            }}
          >
            <VerticalCodePreview initialCode="return(<div><h1>Hello World</h1></div>)" />
          </Box>
        }
        sxSx={{ gridTemplateColumns: bp ? "1fr" : "1fr 1fr" }}
      />*/}

      <HomeLearnSection />

      {/* <Box className="containerCSS" sx={{ py: 10, backgroundColor: theme.ui }}>
        <Box className="contentCSS">
          <Widget src="near/widget/PeoplePage" />
        </Box>
      </Box>

      <Box
        className="containerCSS"
        sx={{ py: 10, backgroundColor: theme.backgroundColor }}
      >
        <Box className="contentCSS">
          <Widget src="near/widget/ComponentsPage" />
        </Box>
      </Box> */}

      <HomeTestimonialSection sx={{ backgroundColor: theme.backgroundColor }} />

      <HomeFooter />
    </>
  );
}
