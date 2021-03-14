import * as React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { DrawerItems } from "react-navigation-drawer";
import { Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import firebase from "firebase";
import db from "../config";

export default class CustomSideBarMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      image: "#",
      userId: firebase.auth().currentUser.email,
      name: "",
      docId: "",
    };
  }

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!cancelled) {
      this.setState({
        image: uri,
      });
      this.uploadImage(uri, this.state.userId);
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);
    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({
          image: url,
        });
      })
      .catch((error) => {
        this.setState({
          image: "#",
        });
      });
  };

  getUserProfile = () => {
    db.collection("users")
      .where("username", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            name: doc.data().first_name + " " + doc.data().last_name,
          });
        });
      });
  };

  componentDidMount() {
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{ flex: 0.5, alignItems: "center", backgroundColor: "green" }}
        >
          <Avatar
            rounded
            source={{
              uri: this.state.image,
            }}
            size="xlarge"
            onPress={() => {
              this.selectPicture();
            }}
            containerStyle={styles.imageContainer}
            showEditButton
          />
          <Text style={{ fontWeight: "100", fontSize: 23, paddingTop: 10 }}>
            {this.state.name}
          </Text>
        </View>
      <View style={styles.container}>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props} />
        </View>
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              this.props.navigation.navigate("SignupLoginScreen");
              firebase.auth().signOut();
            }}
          >
            <Text style={styles.text}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerItemsContainer: {
    flex: 0.8,
  },
  logoutButton: {
    height: 60,
    width: "100%",
    padding: 10,
    justifyContent: "center",
  },
  logoutContainer: {
    flex: 0.2,
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
  },
  imageContainer: {
    // width: "40%",
    // height: "20%",
    margin: 30,
    marginLeft: 20,
    marginBottom: 15,
  },
});
