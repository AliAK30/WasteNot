import { View, Text, StyleSheet } from "react-native"
import React from "react"

type Props = {
    name: string;
    days: number;
}

export default function ItemExpired({ name, days}: Props) {


    return (
        <View style={styles.container}>
            <Text style={styles.text1}>{name}</Text>
            <Text style={styles.text2}>{days} {days===1?"day":"days"} left</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        
        flexDirection: "row",
        paddingTop: "6%",
        borderBottomColor: "#b8bfb1",
        borderBottomWidth: 1,
        paddingBottom: "4%", 

    },
    text1: {
        
        textAlign: "left",
        fontFamily: "LexendDeca_400Regular",
        color: "#9ca895",
        fontSize: 14,
        width: "50%",

    },
    text2: {
        textAlign: "right",
        fontFamily: "LexendDeca_400regular",
        color: "#dd510c",
        fontSize: 14,
        width: "50%",


    },
})