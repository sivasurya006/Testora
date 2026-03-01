import { Pressable, StyleSheet, Text, View, TextInput, FlatList, Platform, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Colors from "../../../../../styles/Colors"
import { AntDesign } from "react-native-vector-icons"
import InputModal from "../../../../../src/components/modals/InputModal"
import api from "../../../../../util/api";
import { router, useFocusEffect, useGlobalSearchParams } from 'expo-router'
import Test from '../../../../../src/components/StudentTest'
import StudentTest from '../../../../../src/components/StudentTest'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import LoadingScreen from '../../../../../src/components/LoadingScreen'
import { ActivityIndicator } from 'react-native-paper'
import { AppMediumText } from '../../../../../styles/fonts'
import { Ionicons } from '@expo/vector-icons'

const { width } = Dimensions.get('window');


export default function StudentTestLists() {

    const [allPublishedTests, setPublishedTest] = useState([]);
    const { classroomId } = useGlobalSearchParams();
    const [search, setSearch] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const filteredTests = useMemo(() => {
        return allPublishedTests
            .filter(t =>
                t.testTitle.toLowerCase().includes(search.toLowerCase())
            )
            .filter(t => {

                if (selectedFilter === "new") {
                    return t.attemptCount === 0 && t.maximumAttempts === 0;
                }

                if (selectedFilter === "remaining") {
                    return t.attemptCount != 0 && t.attemptCount != t.maximumAttempts;
                }

                if (selectedFilter === "finished") {
                    return t.remainingAttempts === 0 && t.maximumAttempts > 0;
                }
                if (selectedFilter === "attempted") {
                    return t.attemptCount === 0 && t.maximumAttempts > 0;

                }

                if (selectedFilter === "all") {
                    return true;
                }

                return true;
            });

    }, [allPublishedTests, search, selectedFilter]);

    console.log("hi", classroomId);
    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const fetch = async () => {
                setLoading(true);
                await getAllPublishedTests(setPublishedTest, classroomId);
                if (isActive) setLoading(false);
            };
            fetch();
            return () => { isActive = false; };
        }, [classroomId])
    );

    console.log("FlatList Data:", filteredTests);

    return (
        <>

            <StatusBar style="dark" translucent backgroundColor={Colors.bgColor} />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgColor }} edges={['top']}>

                <View style={styles.menu}>
                    <Pressable
                        style={[styles.menuItem, selectedFilter == 'all' && styles.selectedItem]}
                        onPress={() => {
                            setSearch("");
                            setSelectedFilter("all");
                            setShowFilters(false);
                        }}
                    >
                        <AppMediumText style={{ fontSize: 16 }}>All</AppMediumText>
                    </Pressable>
                    <Pressable
                        style={[styles.menuItem, selectedFilter == 'new' && styles.selectedItem]}
                        onPress={() => {
                            setSearch("");
                            setSelectedFilter("new");
                            setShowFilters(false);
                        }}
                    >
                        <AppMediumText style={{ fontSize: 16 }}>New</AppMediumText>
                    </Pressable>

                    <Pressable
                        style={[styles.menuItem, selectedFilter == 'remaining' && styles.selectedItem]}
                        onPress={() => {
                            setSearch("");

                            setSelectedFilter("remaining");
                            setShowFilters(false);
                        }}
                    >
                        <AppMediumText style={{ fontSize: 16 }}>Attempted</AppMediumText>
                    </Pressable>

                    <Pressable
                        style={[styles.menuItem, selectedFilter == 'finished' && styles.selectedItem]}
                        onPress={() => {
                            setSearch("");
                            setSelectedFilter("finished");
                            setShowFilters(false);
                        }}
                    >

                        <AppMediumText style={{ fontSize: 16 }}>Finished</AppMediumText>
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

                    filteredTests.length == 0 ? (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            {isLoading ? (
                                <ActivityIndicator size="large" color={Colors.primaryColor} />
                            ) : (
                                <AppMediumText style={styles.emptyText}>
                                    No tests available
                                </AppMediumText>
                            )}
                        </View>
                    ) : (
                        <FlatList

                            data={filteredTests}
                            extraData={filteredTests}
                            keyExtractor={(item) => item.testId.toString()}
                            renderItem={({ item }) => {
                                console.log("Rendering item:", item);
                                return <StudentTest data={item} />;
                            }} />
                    )
                }
            </SafeAreaView>
        </>
    );


}



async function getAllPublishedTests(setPublishedTest, classroomId) {
    console.log("called", classroomId)
    let status;
    try {
        const result = await api.get(`/studenttest/getStudentTests`, {

            headers: {
                'X-ClassroomId': classroomId
            }
        });
        if (result?.status == 200) {
            setPublishedTest(result.data.reverse());
            console.log("published ", result.data);
        } else {

            console.log(`can't fetch created classrooms`);
        }
    } catch (err) {
        console.log(err)
    }
}


const styles = StyleSheet.create({

    emptyText: {
        fontSize: 20,
        color: "black"
    },
    menu: {
        marginTop: 20,
        flexDirection: "row",
        backgroundColor: Colors.bgColor,
        // borderBottomWidth : 1,
        paddingBottom: 10,
        // borderBottomColor : Colors.dimBg ,
        marginBottom: 20,
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
        paddingHorizontal: 20,
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