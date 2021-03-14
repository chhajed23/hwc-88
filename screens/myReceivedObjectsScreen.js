import * as React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ListItem } from "react-native-elements";
import firebase from "firebase";
import MyHeader from "../components/myHeader";
import db from "../config";

export default class MyReceivedObjectScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      receivedBookList: [],
    };
    this.requestRef = null;
  }

  getReceivedBookList = () => {
    this.requestRef = db
      .collection("exchange_object")
      .where("user_id", "==", this.state.userId)
      .where("object_status", "==", "received")
      .onSnapshot((snapshot) => {
        var receivedBookList = snapshot.docs.map((document) => document.data());
        this.setState({
          receivedBookList: receivedBookList,
        });
      });
  };

  componentDidMount() {
    this.getReceivedBookList();
  }
  componentWillUnmount() {
    this.requestRef();
  }
  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.book_name}
        subtitle={item.object_status}
        titleStyle={{ color: "black", fontWeight: "bold" }}
        bottomDivider
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="Received Objects" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.receivedBookList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}> List of all received objects</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.receivedBookList}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
  },
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightblue",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
});
