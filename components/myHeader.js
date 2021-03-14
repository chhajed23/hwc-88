import * as React from "react";
import { Header, Icon } from "react-native-elements";

const MyHeader = (props) => {
  return (
    <Header
      centerComponent={{
        text: props.title,
        style: { color: "blue", fontSize: 20, fontWeight: "bold" },
      }}
      backgroundColor="#eaff23"
    />
  );
};
export default MyHeader;
