import React from "react";
import {
  //  useAccount,
  Widget,
} from "near-social-vm";
import { useParams } from "react-router-dom";
// import { NavigationWrapper } from "../../components/navigation/alpha/NavigationWrapper";
// import { ThemeContext } from "../context/ThemeContext";
// import { useContext } from "react";

export default function EmbedPage(props) {
  // const { theme } = useContext(ThemeContext);
  const { widgetSrc } = useParams();
  // const { accountId } = useAccount();

  // console.log(widgetSrc);

  return (
    <div>
      {/* <NavigationWrapper {...props} /> */}

      <Widget
        src={widgetSrc}
        // props={{
        //   theme,
        //   accountId: accountId,
        //   logOut: props.logOut,
        // }}
      />
    </div>
  );
}
