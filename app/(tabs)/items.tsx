import {StyleSheet, Pressable, FlatList, ActivityIndicator, View } from "react-native";
import Header from "@/components/header";
import Item from "@/components/Item";
import ItemAdd from "@/components/ItemAdd";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useContext, useEffect, useState } from "react";
import { Suspense } from "react";
import { DateTime } from "luxon";
import { AppContext } from "../main";





export default function Items() {

  //const db = useSQLiteContext();
  const [showAddItem, setShowAddItem] = useState<boolean>(false);
  const {data} = useContext(AppContext)
  const now = DateTime.now()

  useEffect(()=> {
    //fetch()
  }, [data])

  
  
  
  


  return (
    <View style={styles.container} >
      <Header title="Your Items" />
      {showAddItem&& <ItemAdd isVisible={showAddItem} setVisibility={setShowAddItem}/>}
      <Suspense fallback={<ActivityIndicator/>}>
      
      <FlatList
        data={data}
        style={{width:"90%"}}
        renderItem={({ item }) => (
          <Item
            id={item.id}
            name={item.name}
            expire={item.expire}
            quantity={item.quantity}
            picture={{uri: item.picture}}
            isExpired={DateTime.fromSQL(item.expire)<=now}
          />
        )}
      />
      
      </Suspense>
      <Pressable
        style={styles.addButton}
        onPress={()=> setShowAddItem(!showAddItem)}
      >
        <FontAwesome name="plus" color="#ffffff" size={35} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: "center",
    backgroundColor: "#e5ebdd",
    paddingBottom: "7%",
  },

  addButton: {
    width: 60,
    height: 60,
    backgroundColor: "#64cc74",
    borderRadius: "100%",
    paddingLeft: 16,
    paddingTop: 12,
    left: "35%",
    top: "2%",
  },
});
