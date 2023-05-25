import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import UserAvatar from "@muhzi/react-native-user-avatar";
import { FontAwesome5 } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";

export default class HeaderWithTextAndAvatar extends Component {
  render() {
    return (
      <View style={styles.header}>
        {/* Header */}
        <View style={styles.rowSection}>
          <TouchableOpacity style={styles.headerBehave}>
            <SimpleLineIcons
              name={this.props.iconName}
              size={this.props.iconSize}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBehave}>
            <UserAvatar
              initialName={this.props.username}
              fontSize={15}
              size={40}
              rounded={true}
              backgroundColors={["#4B7BE5"]}
            />
          </TouchableOpacity>
        </View>
        {/* End of Header */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    width: "100%",
    height: 80,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "white",
    zIndex: 1000,
    elevation: 1000,
  },
  rowSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  headerBehave: {
    padding: 20,
  },
});
