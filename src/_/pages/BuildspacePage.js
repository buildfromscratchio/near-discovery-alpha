import React from "react";
import { useAccount, Widget } from "near-social-vm";
// import { NavigationWrapper } from "../../components/navigation/alpha/NavigationWrapper";
import { ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";

export default function BuildspacePage(props) {
  const { dark } = useContext(ThemeContext);
  const { accountId } = useAccount();
  const { name } = useParams();

  // console.log({ name });

  return (
    <div>
      {/* <NavigationWrapper {...props} /> */}

      <Widget
        src={props?.widgetSrc}
        props={{
          theme: dark,
          accountId: accountId,
          logOut: props.logOut,
          name,
        }}
      />
    </div>
  );
}
