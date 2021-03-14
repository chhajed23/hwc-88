import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Modal,
  ScrollView,
} from "react-native";
import firebase from "firebase";
import db from "../config";

export default class SignupLoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      emailId: "",
      password: "",
      isModalVisible: false,
      first_name: "",
      last_name: "",
      contact_number: "",
      address: "",
      confirm_password: "",
      currencyCode: "",
    };
  }

  showModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isModalVisible}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={{ width: "100%" }}>
            <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
              <Text style={styles.modalTitle}> Registration</Text>
              <TextInput
                style={styles.formTextInput}
                placeholder="First Name"
                maxLength={8}
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
                onChangeText={(text) => {
                  this.setState({
                    address: text,
                  });
                }}
              />

              <TextInput
                style={styles.formTextInput}
                placeholder="Email Address"
                keyboardType="email-address"
                onChangeText={(text) => {
                  this.setState({
                    emailId: text,
                  });
                }}
              />

              <TextInput
                style={styles.formTextInput}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    password: text,
                  });
                }}
              />

              <TextInput
                style={styles.formTextInput}
                placeholder="Confirm Password"
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    confirm_password: text,
                  });
                }}
              />
              <View style={styles.modalBackButton}>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => {
                    this.UsersignUp(
                      this.state.emailId,
                      this.state.password,
                      this.state.confirm_password
                    );
                  }}
                >
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    this.setState({
                      isModalVisible: false,
                    });
                  }}
                >
                  <Text style={{ color: "#ff5722" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  userLogin = async (emailId, password) => {
    if (emailId && password) {
      await firebase
        .auth()
        .signInWithEmailAndPassword(emailId, password)
        .then(() => {
          this.props.navigation.navigate("Home");
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          return Alert.alert(errorCode + " - " + errorMessage);
        });
    }
  };

  UsersignUp = async (emailId, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return Alert.alert("Password does not match\nCheck Your Password.");
    } else {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(emailId, password)
        .then(() => {
          db.collection("users").add({
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            contact_number: this.state.contact_number,
            address: this.state.address,
            username: this.state.emailId,
          });

          return Alert.alert("User Added Successfully", "", [
            {
              text: "Ok",
              onPress: () => {
                this.setState({
                  isModalVisible: false,
                });
              },
            },
          ]);
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          return Alert.alert(errorCode + " - " + errorMessage);
        });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {this.showModal()}
        </View>

        <Text style={styles.title}>Barter System</Text>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboard}
          >
            <TextInput
              style={styles.loginBox}
              placeholder="abc@example.com"
              keyboardType="email-address"
              onChangeText={(text) => {
                this.setState({
                  emailId: text,
                });
              }}
            />

            <TextInput
              style={styles.PasswordloginBox}
              placeholder="Enter Password"
              secureTextEntry={true}
              onChangeText={(text) => {
                this.setState({
                  password: text,
                });
              }}
            />

            <TextInput
              style={styles.currencyloginBox}
              placeholder={"Country currency code"}
              maxLength={8}
              onChangeText={(text) => {
                this.setState({
                  currencyCode: text
                })
              }}
            />

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                this.userLogin(this.state.emailId, this.state.password);
              }}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                this.setState({
                  isModalVisible: true,
                });
              }}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgreen",
  },
  title: {
    marginTop: 25,
    fontSize: 45,
    textAlign: "center",
    fontWeight: "bold",
  },
  keyboard: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    borderWidth: 1.5,
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 50,
  },
  loginBox: {
    backgroundColor: "yellow",
    borderWidth: 2,
    width: 300,
    height: 50,
    padding: 10,
    margin: 8,
  },

  currencyloginBox: {
    backgroundColor: "#FF6347",
    borderWidth: 2,
    width: 300,
    height: 50,
    padding: 10,
    margin: 8,
  },

  PasswordloginBox: {
    backgroundColor: "#40E0D0",
    borderWidth: 2,
    width: 300,
    height: 50,
    padding: 10,
    margin: 8,
  },
  keyboardAvoidingView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    justifyContent: "center",
    fontSize: 30,
    alignItems: "center",
    color: "#ff5722",
    margin: 50,
  },
  modalContainer: {
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginRight: 30,
    marginLeft: 30,
    marginBottom: 80,
    marginTop: 80,
  },
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "#ffab91",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  registerButton: {
    width: 200,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 30,
  },
  registerButtonText: {
    color: "#ff5722",
    fontSize: 15,
    fontWeight: "bold",
  },
  cancelButton: {
    width: 200,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
});
