import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Animated,
} from "react-native";

import React, { Component, useRef } from "react";
import { useState, useEffect } from "react";
import AntDesign from "../node_modules/@expo/vector-icons/AntDesign";
import axios from "axios";
import TabContainer from "../components/TabContainer";

const CONTAINER_HEIGHT = 80;

const CalendarScreen = () => {
  // currentDate:  lưu trữ ngày hiện tại và được khởi tạo ban đầu bằng đối tượng Date mới
  const [currentDate, setCurrentDate] = useState(new Date());
  // selectedDate lưu trữ ngày được chọn (nếu có) và được khởi tạo ban đầu bằng giá trị null
  const [selectedDate, setSelectedDate] = useState(null);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  {
    /* xác định các ngày được chọn và hiện tại daysOfWeek để hiển thị thứ của các ngày
  isToday và isSelected được sử dụng để xác định xem ngày đó có phải là ngày hiện tại
  hoặc được chọn không, từ đó định dạng style của các phần tử trong danh sách.*/
  }
  const renderDay = ({ item }) => {
    const date = new Date(currentDate);
    const dayOfWeek = date.getDay();

    const diff = item - dayOfWeek;
    date.setDate(currentDate.getDate() + diff);
    const isToday = currentDate.getDate() === date.getDate();
    const isSelected =
      selectedDate && selectedDate.getDate() === date.getDate();

    const data = [{ key: "1", value: "he thong thong tin" }];
    return (
      // hiển thị thứ và ngày tương ứng
      <TouchableOpacity
        //   setSelectedDate để cập nhật giá trị
        onPress={() => {
          // Lấy danh sách công việc từ backend dựa trên ngày được chọn
          fetchTasks(date).then((tasks) => setTasks(tasks));
          setSelectedDate(date);
        }}
        style={[
          styles.dayContainer,
          isToday && styles.today,
          isSelected && styles.selected,
        ]}
      >
        <Text
          style={[
            styles.dayText,
            isToday && styles.todayText,
            isSelected && styles.selectedText,
          ]}
        >
          {daysOfWeek[item]}
        </Text>
        <Text
          style={[
            styles.dateText,
            isToday && styles.todayText,
            isSelected && styles.selectedText,
          ]}
        >
          {date.getDate()}
        </Text>
      </TouchableOpacity>
    );
  };

  //Task
  const [task, setTasks] = useState([]);

  const renderTask = ({ item }) => {
    return (
      <View style={styles.taskContainer}>
        <View style={styles.taskFrame}>
          <Text style={styles.taskName}>{item.name}</Text>
          <Text style={styles.taskTime}>
            {formatTime(item.startTime)} - {formatTime(item.endTime)}
          </Text>
        </View>
      </View>
    );
  };

  // Header Animation
  const scrollY = useRef(new Animated.Value(0)).current;
  const offsetAnim = useRef(new Animated.Value(0)).current;
  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollY.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: "clamp",
      }),
      offsetAnim
    ),
    0,
    CONTAINER_HEIGHT
  );

  var _clampedScrollValue = 0;
  var _offsetValue = 0;
  var _scrollValue = 0;
  useEffect(() => {
    scrollY.addListener(({ value }) => {
      const diff = value - _scrollValue;
      _scrollValue = value;
      _clampedScrollValue = Math.min(
        Math.max(_clampedScrollValue * diff, 0),
        CONTAINER_HEIGHT
      );
    });
    offsetAnim.addListener(({ value }) => {
      _offsetValue = value;
    });
  }, []);

  const headerTranslate = clampedScroll.interpolate({
    inputRange: [0, CONTAINER_HEIGHT],
    outputRange: [0, -CONTAINER_HEIGHT],
    extrapolate: "clamp",
  });
  // End of header animation

  return (
    <TabContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled
        style={{ backgroundColor: "white", flex: 100 }}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
      >
        <Animated.View
          style={[
            styles.header,
            { transform: [{ translateY: headerTranslate }] },
          ]}
        >
          <View style={styles.row}>
            {/* Button: back to previous screen */}
            {/* <TouchableOpacity>
            <AntDesign
              name="left"
              size={30}
              style={styles.arrowIcon}
            ></AntDesign>
          </TouchableOpacity> */}
            {/* Title */}
            <Text style={styles.title}>Schedule</Text>
          </View>
        </Animated.View>

        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            {/* Layout calendar */}
            <View style={{ flex: 30, backgroundColor: "white" }}>
              <View style={styles.container}>
                <FlatList
                  horizontal={true} //Đặt flatList theo chiều ngang
                  showsHorizontalScrollIndicator={false} //Ẩn thanh cuộn ngang
                  data={[0, 1, 2, 3, 4, 5, 6]}
                  renderItem={renderDay}
                  keyExtractor={(item) => item.toString()} //Trích xuất khóa duy nhất cho mỗi phần tử trong dnah sách
                />
              </View>
            </View>
            <View style={styles.line}></View>

            {/* Layout hiển thị các task trong ngày đc chọn trên calendar */}
            <View style={{ flex: 70, backgroundColor: "white" }}>
              {/* <FlatList
              data={task}
              renderItem={renderTask}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={true}
            ></FlatList> */}

              <View style={styles.container1}>
                <Text style={styles.textInInsertBox}>8:00AM</Text>
                <View style={styles.taskBox}>
                  <Text style={styles.textInTaskBox}>Continue Project</Text>
                  <Text style={styles.timeInTaskBox}>8:00AM - 10:00AM</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </TabContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    width: "100%",
    height: CONTAINER_HEIGHT,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "white",
    zIndex: 1000,
    elevation: 1000,
  },

  arrowIcon: {},

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 45,
    marginHorizontal: 20,
  },

  image: {
    height: 225,
    width: 225,
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 20,
  },

  title: {
    marginLeft: "auto",
    marginRight: "auto",
    color: "#363942",
    fontSize: 27,
    fontWeight: "bold",

    // fontStyle
  },

  taskBox: {
    backgroundColor: "#F5F5F5",
    // marginVertical: 10,
    marginTop: 5,
    marginBottom: 10,
    height: 55,
    borderRadius: 10,
    shadowColor: "gray",
    marginLeft: 15,
    marginRight: 15,
  },

  textInInsertBox: {
    fontSize: 16,
    // fontFamily: "Poppins",
    marginBottom: 20,
    marginTop: 10,
    marginLeft: 15,
    // marginRight: "auto",
  },

  textInTaskBox: {
    fontSize: 16,
    // fontFamily: "Poppins",
    marginBottom: 0,
    marginTop: 5,
    marginLeft: 15,
    marginRight: 130,
  },

  timeInTaskBox: {
    fontSize: 13,
    // fontFamily: "Poppins",
    marginBottom: 5,
    marginTop: 5,
    marginLeft: 15,
    marginRight: "auto",
    color: "gray",
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 100,
    marginBottom: 20,
  },

  container1: {
    flexDirection: "row",
    // justifyContent: "space-around",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 20,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },

  taskName: {
    color: "#333",
    fontSize: 15,
  },

  dayContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#fff",
    width: 43,
    height: 43,
  },

  dayText: {
    fontSize: 10,
    // fontWeight: "bold",
    color: "#333",
  },

  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },

  today: {
    color: "white",
    backgroundColor: "#4B7BE5",
  },

  line: {
    marginTop: 10,
    marginBottom: 20,
    width: 300,
    height: 2,
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "#777D84",
  },

  selected: {
    borderWidth: 2,
    borderColor: "#4B7BE5",
  },

  selectedText: {
    color: "black",
  },

  todayText: {
    color: "white",
  },

  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  taskFrame: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 10,
    paddingVertical: 5,
  },

  taskName: {
    fontWeight: "bold",
  },

  taskTime: {
    marginTop: 5,
    fontSize: 10
  },
});

// function formatTime(date) {
//   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// }

function fetchTasks(date) {
  const formattedDate = formatDate(date);
  const url = `https://example.com/tasks?date=${formattedDate}`;
  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => console.error(error));
}

function formatDate(date) {
  // Định dạng ngày thành chuỗi "yyyy-mm-dd"
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default CalendarScreen;
