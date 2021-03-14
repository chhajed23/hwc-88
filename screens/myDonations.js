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

export default class MyDonations extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      allDonations: [],
      donorName: "",
    };
    this.requestRef = null;
  }

  getAllDonations = () => {
    this.requestRef = db.collection("all_donations").where("donor_id" ,'==', this.state.userId)
    .onSnapshot((snapshot)=>{
      var allDonations = []
      snapshot.docs.map((doc) =>{
        var donation = doc.data()
        donation["doc_id"] = doc.id
        allDonations.push(donation)
      });
      this.setState({
        allDonations : allDonations
      });
    })
  };

  sendBook = (bookDetails) => {
    console.log(bookDetails)
    if (bookDetails.request_status === "Object Sent") {
      var requestStatus = "Donor Interested";
      db.collection("all_donations").doc(bookDetails.doc_id).update({
        request_status: "Donor Interested",
      });
      this.sendNotification(bookDetails, requestStatus);
    } else {
      var requestStatus = "Object Sent";
      db.collection("all_donations").doc(bookDetails.doc_id).update({
        request_status: "Object Sent",
      });
      this.sendNotification(bookDetails, requestStatus);
    }
  };

  getDonorDetail = (userId) => {
    db.collection("users")
      .where("username", "==", userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            donorName: doc.data().first_name + " " + doc.data().last_name,
          });
        });
      });
  };

  sendNotification = (bookDetails, requestStatus) => {
    console.log(bookDetails)
    console.log(requestStatus)
    var requestId = bookDetails.request_id;
    var donorId = bookDetails.donor_id;
    db.collection("all_notifications")
      .where("request_id", "==", requestId)
      .where("donor_id", "==", donorId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = "";
          if (requestStatus === "Object Sent") {
            message = this.state.donorName + " sent you book.";
          } else {
            message =
              this.state.donorName +
              " has shown interest in donating the book.";
          }
          db.collection("all_notifications").doc(doc.id).update({
            message: message,
            notification_status: "unread",
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };

  componentDidMount() {
    this.getDonorDetail(this.state.userId);
    this.getAllDonations();
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
        subtitle={
          "Requested By: " +
          item.requested_by +
          "\nStatus: " +
          item.request_status
        }
        titleStyle={{ color: "black", fontWeight: "bold" }}
        leftElement={<Icon name="book" type="font-awesome" color="#696969" />}
        rightElement={
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  item.request_status === "Object Sent" ? "green" : "blue",
              },
            ]}
            onPress={() => {
              this.sendBook(item);
            }}
          >
            <Text style={{ color: "#ffff" }}>
              {item.request_status === "Object Sent" ? "Object Sent" : " Send Object"}
            </Text>
          </TouchableOpacity>
        }
        bottomDivider
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="My  Donations" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.allDonations.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}> List of all Book Donations</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allDonations}
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
