import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image, type ImageSource } from "expo-image";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSQLiteContext } from "expo-sqlite";
import { useContext } from "react";
import { AppContext } from "../app/main";


type Props = {
  id: number,
  name: string;
  expire: string;
  quantity: number;
  picture: ImageSource;
  isExpired: boolean;
  
};

export default function Item({ id, name, expire, quantity, picture, isExpired}: Props) {
  /* console.log("Screen Width:", width);
  console.log("Screen Height:", height); */
  //console.log(purchase)
  //console.log(expire)
  
  const {data, setData} = useContext(AppContext)
  const db = useSQLiteContext()
  const deleteStatement = db.prepareSync(
    'DELETE FROM items WHERE id = $id'
  )

  const deleteTask = async (id: any) => {
    try {
      await deleteStatement.executeAsync({$id: id})
      if(data)
      setData(data.filter((item)=> item.id != id))
    } catch (e: any) {
      console.log(e.message)
    }
  }

  return (
    <View style={styles.mainContainer}>
      {isExpired&&<Text style={styles.expireTag}>Expired</Text>}
    <View style={styles.container}>
      
      <Image source={picture} style={styles.imageStyle} contentFit="fill" />
      <View style={styles.textContainer}>
        <Text style={[styles.name]}>{name}</Text>
        <Text style={[styles.text, {color: "#dd510c"}]}>Expires: {expire}</Text>
        <Text style={[styles.text, {color: "#7c8c74"}]}>Quantity: {quantity}</Text>
      </View>
      
      <Pressable style={{justifyContent:"center", }} onPress={()=>deleteTask(id)}><Ionicons name="trash" color="#dd510c" size={24}/></Pressable>
      
      
    </View>
    </View>
  );
}

const shadow = {
  offsetX: 0,
  offsetY: 4,
  blurRadius: 6,
  spreadDistance: "0px",
  color: "rgba(0,0,0,0.10)",
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection:"column",
    backgroundColor: "#ffffff",
    
    boxShadow: [shadow],
    marginTop: "5%",
    borderRadius: 9,
  },

  container: {
    paddingTop: "4%",
    paddingBottom: "4%",
    flexDirection: "row",
  },

  textContainer: {
    marginLeft: 14,
    minWidth: "63%",
  },

  imageStyle: {
    minWidth: "19%",
    minHeight: "9%",
    marginLeft: 12,
    borderRadius: 9,
    
  },
  name: {
    fontFamily: "LexendDeca_700Bold",
    color: "#7c8c74",
    fontSize: 18,
    marginBottom: "2%"

  },
  text: {
    fontFamily: "LexendDeca_600SemiBold",
    fontSize: 14,
  },
  expireTag: {
    fontFamily: "LexendDeca_400Regular",
    fontSize: 11,
    color: "white",
    backgroundColor: "#dd510c",
    margin: "2%",
    marginBottom: "0%",
    textAlign: "center",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    paddingVertical: "0.5%",
    /* borderRadius: 5,
    alignSelf: "flex-start",
    paddingHorizontal: "4%",
    paddingVertical: "1%",
    marginLeft: "3%", */
  },

});
