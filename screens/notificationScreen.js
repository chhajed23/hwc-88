import * as React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ListItem, Icon } from "react-native-elements";
import firebase from "firebase";
import MyHeader from "../components/myHeader";
import db from "../config";
import SwipeableFlatlist from '../components/swipeableFlatlist';

export default class NotificationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      allNotifications: [],
    };
    this.notificationRef = null;
  }

  getNotifications = () => {
    this.notificationRef = db
      .collection("all_notifications")
      .where("notification_status", "==", "unread")
      .where("targeted_user_id", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        var allNotifications = [];
        snapshot.docs.map((doc) => {
          var notification = doc.data();
          notification["doc_id"] = doc.id;
          allNotifications.push(notification);
        });
        this.setState({
          allNotifications: allNotifications,
        });
      });
  };

  componentDidMount() {
    this.getNotifications();
    console.log(this.state.allNotifications)
  }
  componentWillUnmount() {
    this.notificationRef();
  }
  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.book_name}
        subtitle={item.message}
        titleStyle={{ color: "black", fontWeight: "bold" }}
        leftElement={<Icon name="book" type="font-awesome" color="#696969" />}
        bottomDivider
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
          <View style={{ flex: 0.1}}>
        <MyHeader title="Notifications" navigation={this.props.navigation} />
        </View>
        <View style={{ flex: 0.9 }}>
          {this.state.allNotifications.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}> You have no Notifications</Text>
            </View>
          ) : (
           <SwipeableFlatlist
           allNotifications={this.state.allNotifications}
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
