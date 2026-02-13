import { Pressable, StyleSheet, Text, View, TextInput, FlatList, Platform } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Colors from "../../../../../styles/Colors"
import { AntDesign } from "react-native-vector-icons"
import InputModal from "../../../../../src/components/modals/InputModal"
import api from "../../../../../util/api";
import { router, useFocusEffect, useGlobalSearchParams } from 'expo-router'
import Test from '../../../../../src/components/StudentTest'
import StudentTest from '../../../../../src/components/StudentTest'

export default function CreatedTestList() {

    const [allPublishedTests, setPublishedTest] = useState([]);
    const { classroomId } = useGlobalSearchParams();

    const [search, setSearch] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("ALL");
    const [showFilters, setShowFilters] = useState(false);

    const filteredTests = useMemo(() => {
        return allPublishedTests
            .filter(t =>
                t.testTitle.toLowerCase().includes(search.toLowerCase())
            )
            .filter(t => {

                if (selectedFilter === "NEW") {
                    return t.attemptCount === 0 && t.maximumAttempts > 0;
                }

                if (selectedFilter === "REMAINING") {
                    return t.remainingAttempts > 0;
                }

                if (selectedFilter === "FINISHED") {
                    return t.remainingAttempts === 0 && t.maximumAttempts > 0;
                }

                return true;
            });

    }, [allPublishedTests, search, selectedFilter]);

    useFocusEffect(
        useCallback(() => {
            getAllPublishedTests(setPublishedTest, classroomId);
        }, [classroomId])
    );

    return (
        <View style={{ flex: 1 }}>
    
            {/* Search + Filter Icon */}
            <View style={styles.searchRow}>
                <TextInput
                    placeholder="Search tests"
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                />
    
                <Pressable onPress={() => setShowFilters(!showFilters)}>
                    <AntDesign name="filter" size={22} color="black" />
                </Pressable>
            </View>
    
            {/* Dropdown Menu */}
            {showFilters && (
                <View style={styles.dropdownMenu}>
                    <Pressable
                        style={styles.menuItem}
                        onPress={() => {
                            setSelectedFilter("NEW");
                            setShowFilters(false);
                        }}
                    >
                        <Text>New</Text>
                    </Pressable>
    
                    <Pressable
                        style={styles.menuItem}
                        onPress={() => {
                            setSelectedFilter("REMAINING");
                            setShowFilters(false);
                        }}
                    >
                        <Text>Remaining</Text>
                    </Pressable>
    
                    <Pressable
                        style={styles.menuItem}
                        onPress={() => {
                            setSelectedFilter("FINISHED");
                            setShowFilters(false);
                        }}
                    >
                        <Text>Finished</Text>
                    </Pressable>
    
                    <Pressable
                        style={styles.menuItem}
                        onPress={() => {
                            setSelectedFilter("ALL");
                            setShowFilters(false);
                        }}
                    >
                        <Text>All</Text>
                    </Pressable>
                </View>
            )}
    
            {/* List */}
            <FlatList
                data={filteredTests}
                keyExtractor={(item) => item.testId.toString()}
                renderItem={({ item }) => <StudentTest data={item} />}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No tests found</Text>
                }
            />
    
        </View>
    );
    

}



async function getAllPublishedTests(setPublishedTest, classroomId) {
    console.log("called")
    let status;
    try {
        const result = await api.get(`/studenttest/getStudentTests`, {

            headers: {
                'X-ClassroomId': classroomId
            }
        });
        if (result?.status == 200) {
            setPublishedTest(result.data);
            console.log(result.data);
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
    searchRow: {
        padding: 16,
        backgroundColor: Colors.white,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
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
        paddingHorizontal: 20
    },
    

})