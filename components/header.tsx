import { View, Text, StyleSheet } from "react-native"
import React from "react"
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
    title: string;
}



export default function Header({ title }: Props) {

    const insets = useSafeAreaInsets()

    return (
        <>
            <View style={{
                backgroundColor: "#7c8c74",
                width: "100%",
                height: insets.top + insets.bottom,
            }}></View>
            <View style={styles.container}>
                <Text style={styles.text} >{title}</Text>
                
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#7c8c74",
        width: "100%",
        height: "8%",
        paddingTop: "3%",

    },
    text: {
        textAlign: "center",
        fontFamily: "LexendDeca_600SemiBold",
        color: "#ffffff",
        fontSize: 18,


    },
})