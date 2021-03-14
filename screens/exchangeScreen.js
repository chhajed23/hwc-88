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
import firebase from "firebase";
import MyHeader from "../components/myHeader";

import db from "../config";

export default class BookRequestScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      bookName: "",
      reasonForRequest: "",
      requestId: "",
      requestedBookName: "",
      bookStatus: "",
      docId: "",
      userDocId: "",
      isBookRequestActive: false,
    };
  }
  createUniqueId = () => {
    return Math.random().toString(36).substring(7);
  };

  addRequest = async (bookName, reasonForRequest) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();
    db.collection("exchange_object").add({
      user_Id: userId,
      object_name: bookName,
      reason_for_request: reasonForRequest,
      request_id: randomRequestId,
      object_status: "requested",

      date: firebase.firestore.FieldValue.serverTimestamp(),
    });
    await this.getBookRequest();
    db.collection("users")
      .where("username", "==", userId)
      .get()

      .then((snapshot) => {
        snapshot.forEach((doc1) => {
          db.collection("users").doc(doc1.id).update({
            isBookRequestActive: true,
          });
        });
      });
    this.setState({
      bookName: "",
      reasonForRequest: "",
    });
    return Alert.alert("Object Requested Successfully");
  };

  getBookRequest = () => {
    var bookRequest = db
      .collection("exchange_object")
      .where("user_Id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().object_status !== "received") {
            this.setState({
              requestId: doc.data().request_id,
              requestedBookName: doc.data().object_name,
              bookStatus: doc.data().object_status,
              docId: doc.id,
            });
          }
        });
      });
  };

  getIsBookRequestActive = () => {
    db.collection("users")
      .where("username", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          this.setState({
            isBookRequestActive: doc.data().isBookRequestActive,
            userDocId: doc.id,
          });
        });
      });
  };

  receivedBooks = (bookName) => {
    var userId = this.state.userId;
    var requestId = this.state.requestId;
    db.collection("received_objects").add({
      user_id: userId,
      object_name: bookName,
      request_id: requestId,
      object_status: "received",
    });
  };

  updateBookRequestStatus = () => {
    db.collection("exchange_object").doc(this.state.docId).update({
      object_status: "received",
    });
    db.collection("users")
      .where("username", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc1) => {
          db.collection("users").doc(doc1.id).update({
            isBookRequestActive: false,
          });
        });
      });
  };

  sendNotification = () => {
    db.collection("users")
      .where("username", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;
          var lastName = doc.data().last_name;
          var message = name + " " + last_name + " received the object";
          db.collection("all_notifications")
            .where("request_id", "==", this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donor_id;
                var bookName = doc.data().object_name;
                message += " " + bookName;
                db.collection("all_notifications").add({
                  targeted_user_id: donorId,
                  message: message,
                  notification_status: "unread",
                  object_name: bookName,
                });
              });
            });
        });
      });
  };

  componentDidMount() {
    this.getBookRequest();
    this.getIsBookRequestActive();
  }

  render() {
    console.log(this.state.isBookRequestActive);
    if (this.state.isBookRequestActive === true) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={{
              borderColor: "orange",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text>Object Name</Text>
            <Text>{this.state.requestedBookName}</Text>
          </View>

          <View
            style={{
              borderColor: "orange",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text>Object Status</Text>
            <Text>{this.state.bookStatus}</Text>
          </View>

          <TouchableOpacity
            style={{
              borderColor: "orange",
              borderWidth: 1,
              alignSelf: "center",
              alignItems: "center",
              width: 360,
              height: 30,
              marginTop: 30,
            }}
            onPress={() => {
              this.sendNotification();
              this.updateBookRequestStatus();
              this.receivedBooks(this.state.requestedBookName);
            }}
          >
            <Text>I received the object!!</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <MyHeader title="Request Object" navigation={this.props.navigation} />

          <KeyboardAvoidingView style={styles.keyboardStyles}>
            <TextInput
              style={styles.formTextInput}
              placeholder="Enter Object Name"
              value={this.state.bookName}
              onChangeText={(text) => {
                this.setState({
                  bookName: text,
                });
              }}
            />

            <TextInput
              style={styles.formTextInput}
              placeholder="Why do you need the Object??"
              value={this.state.reasonForRequest}
              multiline={true}
              numberOfLines={8}
              onChangeText={(text) => {
                this.setState({
                  reasonForRequest: text,
                });
              }}
            />

            <TextInput
              style={styles.formTextInput}
              placeholder="What is the Currency of the Product ?"
              // value={this.state.currency}
              maxLength={10}
              // onChangeText={(text) => {
              //   this.setState({
              //     currency: text,
              //   });
              // }}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.addRequest(
                  this.state.bookName,
                  this.state.reasonForRequest
                );
              }}
            >
              <Text>Request</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "#ff5645",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#56fabc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20,
  },
  keyboardStyles: { flex: 1, justifyContent: "center", alignItems: "center" },
});
