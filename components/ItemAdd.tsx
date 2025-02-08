import {
  Text,
  TextInput,
  Modal,
  View,
  Pressable,
  StyleSheet,
  Platform,
  Keyboard,
  Linking,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useContext, useState } from "react";
import { BlurView } from "expo-blur";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSQLiteContext } from "expo-sqlite";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DateTime } from "luxon";
import { AppContext } from "../app/main";

type Props = {
  isVisible: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ItemAdd({ isVisible, setVisibility }: Props) {
  const pd = DateTime.now();
  const { data, setData } = useContext(AppContext);
  const [expirationDate, setExpirationDate] = useState<DateTime<true> | DateTime<false>>(pd);
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState<null | string>(null);
  const [showEDatePicker, setShowEDatePicker] = useState(false);
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();

  const insertStatement = db.prepareSync(
    "INSERT INTO items (name, quantity, expire, picture) VALUES ($name, $quantity, $expire, $picture)"
  );

  const addFoodItem = async () => {
    try {
      
      const ed = expirationDate;

      if (foodName && quantity && image) {
        if (!Number(quantity)) {
          Alert.alert("Please enter a valid Quantity");
          return;
        }

        if (pd === ed) {
          Alert.alert("Purchase and Expiration Date can't be same");
          return;
        }

        if (pd > ed) {
          Alert.alert("Food Item is already Expired!!");
          return;
        }
      } else {
        Alert.alert("Please fill all the required fields!");
        return;
      }

      //schedule notification reminders
      
      const result = await insertStatement.executeAsync({
        $name: foodName,
        $quantity: quantity,
        $expire: ed.toSQLDate(),
        $picture: image,
      });

      //clear the modal screen
      setExpirationDate(pd);
      setFoodName("");
      setQuantity("");
      setImage(null);
      setShowEDatePicker(false);
      setVisibility(false);
      if (data)
        setData([
          ...data,
          {
            id: result.lastInsertRowId,
            name: foodName,
            expire: ed.toSQLDate() as string,
            quantity: Number(quantity),
            picture: image,
          },
        ]);
      //await fetch();
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const onEDChange = (event: any, selectedDate: any) => {
    setShowEDatePicker(false);
    if (event.type === "dismissed") {
      return;
    }

    if (selectedDate) setExpirationDate(DateTime.fromJSDate(selectedDate));
  };

  const pickImageAsync = async (type: string) => {
    try {
      let func;
      if (type === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status === "denied") {
          // If denied, show an alert with option to open settings
          Alert.alert(
            "Camera Permission Required",
            "Please enable camera access in settings to use this feature.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Go to Settings", onPress: () => Linking.openSettings() },
            ]
          );
          return;
        }
        func = ImagePicker.launchCameraAsync;
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status === "denied") {
          // If denied, show an alert with option to open settings
          Alert.alert(
            "Photos and Videos Permission Required",
            "Please enable Photos access in settings to use this feature.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Go to Settings", onPress: () => Linking.openSettings() },
            ]
          );
          return;
        }
        func = ImagePicker.launchImageLibraryAsync;
      }
      let result = await func({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 1,
        allowsMultipleSelection: false,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      } else {
        Alert.alert("You did not select any image.");
      }
    } catch (e: any) {
      console.log(e.message);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setVisibility(!isVisible)}
    >
      <Pressable
        style={{ flex: 1 }}
        onPress={() => {
          if (Keyboard.isVisible()) {
            Keyboard.dismiss();
            return;
          }
          setVisibility(false);
        }}
      >
        <BlurView
          style={styles.modalContainer}
          intensity={15}
          experimentalBlurMethod="dimezisBlurView"
        >
          <Pressable
            style={{
              width: "90%",
              justifyContent: "center",
              paddingTop: Platform.OS === "ios" ? insets.top : 0,
            }}
            onPress={() => {
              
              if (Keyboard.isVisible()) {
                Keyboard.dismiss();
                return;
              }
            }}
          >
            <View style={styles.modalView}>
              <Text style={styles.addFoodText}>Add Food Item</Text>
              <Text style={styles.textLabels}>Item Name</Text>
              <TextInput
                style={[styles.textInput, {}]}
                inputMode="text"
                cursorColor="black"
                value={foodName}
                onChangeText={setFoodName}
              />
              <Text style={styles.textLabels}>Quantity</Text>
              <TextInput
                style={[styles.textInput, {}]}
                inputMode="numeric"
                cursorColor="black"
                value={quantity}
                onChangeText={setQuantity}
              />

              <View
                style={{
                  flexDirection: "row",
                  marginTop: "3%",
                  marginLeft: "1%",
                }}
              >
                <View style={{ width: "46%" }}>
                  <Text style={styles.textLabels}>Expiration Date</Text>

                  <Pressable onPress={() => setShowEDatePicker(true)}>
                    {!showEDatePicker && (
                      <Text
                        style={[
                          styles.textLabels,
                          styles.textInput,
                          {
                            paddingTop: "5%",
                            paddingBottom: "5%",
                            paddingLeft: "5%",
                            paddingRight: "5%",
                          },
                        ]}
                      >
                        {expirationDate.toSQLDate()}
                      </Text>
                    )}
                  </Pressable>
                  {showEDatePicker && (
                    <DateTimePicker
                      value={expirationDate.toJSDate()}
                      mode="date"
                      display="compact"
                      onChange={onEDChange}
                      style={{ right: "4%" }}
                    />
                  )}
                </View>
              </View>

              <Text style={styles.textLabels}>Image</Text>
              {image ? (
                <View style={styles.imageView}>
                  <Image
                    source={{ uri: image }}
                    contentFit="fill"
                    style={{
                      width: "20%",
                      height: "100%",
                      marginLeft: "2%",
                      marginTop: "3%",
                      borderRadius: 8,
                    }}
                  />
                  <Pressable
                    style={{ marginTop: "8%", marginLeft: "4%" }}
                    onPress={() => setImage(null)}
                  >
                    <Ionicons name="trash" color="#dd510c" size={30} />
                  </Pressable>
                </View>
              ) : (
                <View style={styles.imageView}>
                  <Pressable
                    style={styles.imageButtons}
                    onPress={() => pickImageAsync("library")}
                  >
                    <Text
                      style={{
                        fontFamily: "LexendDeca_600SemiBold",
                        fontSize: 12,
                      }}
                    >
                      Choose from device
                    </Text>
                  </Pressable>
                  <Pressable style={styles.imageButtons}>
                    <Text
                      style={{
                        fontFamily: "LexendDeca_600SemiBold",
                        fontSize: 12,
                      }}
                      onPress={() => pickImageAsync("camera")}
                    >
                      Capture now
                    </Text>
                  </Pressable>
                </View>
              )}
              <Pressable
                style={styles.saveButton}
                onPress={() => {
                  addFoodItem();
                }}
              >
                <Text
                  style={{
                    fontFamily: "LexendDeca_600SemiBold",
                    fontSize: 18,
                    color: "white",
                  }}
                >
                  Save
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </BlurView>
      </Pressable>
    </Modal>
  );
}

const shadow = {
  offsetX: 0,
  offsetY: 4,
  blurRadius: 6,
  spreadDistance: "2px",
  color: "rgba(0,0,0,0.10)",
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.07)",
  },
  modalView: {
    backgroundColor: "#f2f2f2",
    borderRadius: 9,
    boxShadow: [shadow],
  },

  addFoodText: {
    fontFamily: "LexendDeca_600SemiBold",
    fontSize: 18,
    color: "#7c8c74",
    margin: "3%",
  },
  textLabels: {
    fontFamily: "LexendDeca_400Regular",
    color: "#9ca895",
    marginLeft: "3%",
    marginTop: "4%",
  },

  textInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 9,
    borderColor: "#d3d3d3",
    margin: "3%",
    marginBottom: "0%",
    padding: "2.5%",
    fontFamily: "LexendDeca_400Regular",
  },

  imageView: {
    flexDirection: "row",
    height: "15%",
  },

  imageButtons: {
    backgroundColor: "#9ca895",
    marginLeft: "3%",
    marginTop: "2%",
    borderRadius: 8,
    height: "70%",
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
  },

  saveButton: {
    backgroundColor: "#64cc74",
    height: "9%",
    width: "21%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: "2%",
    marginRight: "5%",
    borderRadius: 8,
  },
});
