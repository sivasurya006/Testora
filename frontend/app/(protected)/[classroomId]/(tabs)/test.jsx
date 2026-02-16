import { View, TextInput, StyleSheet, Platform, Dimensions, Pressable } from 'react-native'
import React, { use, useState } from 'react'
import Colors from '../../../../styles/Colors';
import { AppMediumText } from '../../../../styles/fonts';
import { Ionicons } from '@expo/vector-icons';
import CreatedTestList from '../../../../src/screens/CreatedTestList';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';


const { width } = Dimensions.get('window')

export default function Test() {

    const [selected, setSelected] = useState('all');
    const [search, setSearch] = useState('');

    return (
        <>
            <StatusBar style="light" translucent />
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.menu}>
                    <Pressable
                        style={[styles.menuItem, selected == 'all' && styles.selectedItem]}
                        onPress={() => {
                            setSearch("");
                            setSelected("all");
                        }}
                    >
                        <AppMediumText style={{ fontSize: 16 }}>Tests</AppMediumText>
                    </Pressable>
                    <Pressable
                        style={[styles.menuItem, selected == 'correction' && styles.selectedItem]}
                        onPress={() => {
                            setSearch("");
                            setSelected("correction");
                        }}
                    >
                        <AppMediumText style={{ fontSize: 16 }}>Corrections</AppMediumText>
                    </Pressable>

                    <Pressable
                        style={[styles.menuItem, selected == 'published' && styles.selectedItem]}
                        onPress={() => {
                            setSearch("");
                            setSelected("published");
                        }}
                    >
                        <AppMediumText style={{ fontSize: 16 }}>Published</AppMediumText>
                    </Pressable>

                    <Pressable
                        style={[styles.menuItem, selected == 'drafts' && styles.selectedItem]}
                        onPress={() => {
                            setSearch("");
                            setSelected("drafts");
                        }}
                    >
                        <AppMediumText style={{ fontSize: 16 }}>Drafts</AppMediumText>
                    </Pressable>

                    <View style={styles.searchContainer}>

                        <Ionicons name="search" size={18} color={Colors.dimBg} />

                        <TextInput
                            placeholder="Search Tests..."
                            placeholderTextColor={Colors.dimBg}
                            value={search}
                            onChangeText={setSearch}
                            style={styles.searchInput}
                        />
                    </View>
                </View>

                {
                    selected === 'correction' ? (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <AppMediumText>No submissions yet!</AppMediumText>
                        </View>
                    ) : (
                        <CreatedTestList filter={selected} />
                    )
                }
            </SafeAreaView>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: Colors.bgColor
    },

    topBar: {
        // flexDirection: 'row',
        // alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 10,
        gap: 10,
        paddingBottom: 10,
        ...(Platform.OS === 'web' && {
            // maxWidth: 900,
            alignSelf: 'center',
            width: '100%',
        })
    },
    emptyText: {
        fontSize: 20,
        color: "black"
    },
    menu: {
        paddingTop: 20,
        flexDirection: "row",
        backgroundColor: Colors.bgColor,
        // borderBottomWidth : 1,
        paddingBottom: 20,
        // borderBottomColor : Colors.dimBg ,
        flexWrap: 'wrap',
        ...(Platform.OS == 'web' ? {
            paddingLeft: 10
        } : {})
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        backgroundColor: "#fff"
    },

    filterBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: "#eee"
    },

    active: {
        backgroundColor: Colors.primaryColor
    },
    dropdownMenu: {
        position: "absolute",
        top: 70,
        right: 20,
        backgroundColor: "#fff",
        borderRadius: 8,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        paddingVertical: 8,
        zIndex: 100
    },

    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    selectedItem: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.primaryColor
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 38,
        width: '50%',
        // margin: 20,
        marginLeft: 'auto',
        marginRight: 20,
        borderWidth: 2,
        borderColor: Colors.secondaryColor + '30',
        ...(width < 1110 ? {
            width: '90%',
            marginTop: 20,
        } : {}
        )
    },

    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: Colors.secondaryColor,
        outlineWidth: 0,
        height: 38,
    },
})