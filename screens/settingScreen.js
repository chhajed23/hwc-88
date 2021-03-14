import * as React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

import firebase from "firebase";
import MyHeader from "../components/myHeader";
import db from "../config";
import { Header } from "react-native/Libraries/NewAppScreen";
import { RFValue } from "react-native-responsive-fontsize";

export default class SettingScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      emailId: "",
      first_name: "",
      last_name: "",
      contact_number: "",
      address: "",
      docId: "",
    };
  }

  getUserDetails = () => {
    var user = firebase.auth().currentUser;
    var email = user.email;
    db.collection("users")
      .where("username", "==", email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            emailId: data.username,
            first_name: data.first_name,
            last_name: data.last_name,
            address: data.address,
            contact_number: data.contact_number,
            docId: doc.id,
          });
        });
      });
  };

  updateUserDetails = () => {
    db.collection("users").doc(this.state.docId).update({
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      address: this.state.address,
      contact_number: this.state.contact_number,
    });
    Alert.alert("Profile Updated Successfully");
  };

  componentDidMount() {
    this.getUserDetails();
  }

  render() {
    return (
      <View style={styles.container}>
        <MyHeader title="Profile Settings" navigation={this.props.navigation} />

        <View style={styles.formContainer}>
          <TextInput
            style={styles.formTextInput}
            placeholder="First Name"
            maxLength={8}
            value={this.state.first_name}
            onChangeText={(text) => {
              this.setState({
                first_name: text,
              });
            }}
          />

          <TextInput
            style={styles.formTextInput}
            placeholder="Last Name"
            maxLength={10}
            value={this.state.last_name}
            onChangeText={(text) => {
              this.setState({
                last_name: text,
              });
            }}
          />

          <TextInput
            style={styles.formTextInput}
            placeholder="Contact Number"
            maxLength={10}
            keyboardType="numeric"
            value={this.state.contact_number}
            onChangeText={(text) => {
              this.setState({
                contact_number: text,
              });
            }}
          />

          <TextInput
            style={styles.formTextInput}
            placeholder="Address"
            multiline={true}
            value={this.state.address}
            onChangeText={(text) => {
              this.setState({
                address: text,
              });
            }}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              this.updateUserDetails();
            }}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6fc0b8",
  },
  formContainer: {
    flex: 0.88,
    justifyContent: "center",
  },

  formTextInput: {
    width: "90%",
    height: RFValue(50),
    padding: RFValue(10),
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "grey",
    marginBottom: RFValue(20),
    marginLeft: RFValue(20),
  },
  saveButton: {
    width: "75%",
    height: RFValue(60),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(50),
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: RFValue(20),
  },

  saveButtonText: {
    fontSize: RFValue(23),
    fontWeight: "bold",
    color: "#fff",
  },
});
