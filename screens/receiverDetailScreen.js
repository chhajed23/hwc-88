import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Card, Header, Icon } from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import ExchangeScreen from "./exchangeScreen";

export default class ReceiverDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      receiverId: this.props.navigation.getParam("details")["user_Id"],
      bookName: this.props.navigation.getParam("details")["object_name"],
      requestId: this.props.navigation.getParam("details")["request_id"],
      reasonForRequest: this.props.navigation.getParam("details")[
        "reason_for_request"
      ],
      receiverName: "",
      receiverContact: "",
      receiverAddress: "",
      receiverRequestDocId: "",
      userName: "",
    };
  }

  getReceiverDetails = () => {
    db.collection("users")
      .where("username", "==", this.state.receiverId)
      .get()
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          this.setState({
            receiverName: doc.data().first_name,
            receiverContact: doc.data().contact_number,
            receiverAddress: doc.data().address,
            receiverName: doc.data().first_name,
          });
        });
      });

    db.collection("exchange_object")
      .where("request_Id", "==", this.state.requestId)
      .get()
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          this.setState({
            receiverRequestDocId: doc.id,
          });
        });
      });
  };

  updateBookStatus = () => {
    db.collection("all_donations").add({
      object_name: this.state.bookName,
      request_id: this.state.requestId,
      requested_by: this.state.receiverName,
      donor_id: this.state.userId,
      request_status: "Donor Interested",
    });
  };

  getUserDetail = (userId) => {
    db.collection("users")
      .where("username", "==", userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            userName: doc.data().first_name + " " + doc.data().last_name,
          });
        });
      });
  };

  addNotification = () => {
    var message =
      this.state.userName + " has shown interest in donating the object.";
    db.collection("all_notifications").add({
      targeted_user_id: this.state.receiverId,
      donor_id: this.state.userId,
      request_id: this.state.requestId,
      object_name: this.state.bookName,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notification_status: "unread",
      message: message,
    });
  };

  componentDidMount() {
    this.getReceiverDetails();
    this.getUserDetail(this.state.userId);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.1 }}>
          <Header
            leftComponent={
              <Icon
                name="arrow-left"
                type="feather"
                color="#ff56fe"
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              />
            }
            centerComponent={{
              text: "Donate Objects",
              style: { color: "#56f123", fontSize: 15, fontWeight: "bold" },
            }}
            backgroundColor="#ff65ff"
          />
        </View>
        <View style={{ flex: 0.3 }}>
          <Card title={"Object Information"} titleStyle={{ fontSize: 15 }}>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Name:{this.state.bookName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Reason:{this.state.reason_for_request}
              </Text>
            </Card>
          </Card>
        </View>
        <View style={{ flex: 0.3 }}>
          <Card title={"Receiver Information"} titleStyle={{ fontSize: 15 }}>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Name:{this.state.receiverName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Contact:{this.state.receiverContact}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Address:{this.state.receiverAddress}
              </Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {this.state.receiverId != this.state.userId ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.updateBookStatus(),
                  this.addNotification(),
                  this.props.navigation.navigate("MyDonations");
              }}
            >
              <Text>I Want to Donate</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 80,
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "orange",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 16,
  },
});
