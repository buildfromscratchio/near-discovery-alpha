import React from "react";
import { useAccount, Widget } from "near-social-vm";
// import { NavigationWrapper } from "../../components/navigation/alpha/NavigationWrapper";
import { ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";

export default function BuildspacePage(props) {
  const { dark } = useContext(ThemeContext);
  const { accountId } = useAccount();

  // console.log(widgetSrc);

  return (
    <div>
      {/* <NavigationWrapper {...props} /> */}

      <Widget
        src="saidulbadhon.near/widget/s3.buildspace.home"
        props={{
          theme: dark,
          accountId: accountId,
          logOut: props.logOut,
        }}
      />
    </div>
  );
}
