import { View, TextInput, StyleSheet, Dimensions, Pressable, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { use, useState } from 'react'
import Colors from '../../../../../styles/Colors';
import { AppMediumText, AppSemiBoldText } from '../../../../../styles/fonts';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import CreatedTestList from '../../../../../src/screens/CreatedTestList';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import StudentSubmissionScreen from '../../../../../src/screens/Submissions';


const { width } = Dimensions.get('window')

export default function Test() {

    const [selected, setSelected] = useState('all');
    const [search, setSearch] = useState('');
    const [isCreateTestModalVisible, setCreateTestModalVisible] = useState(false);


    const { width } = useWindowDimensions();
    const isSmallScreen = width < 768;

    return (
        <>
            <StatusBar style="light" translucent />
            <SafeAreaView style={styles.container} edges={['']}>
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
                        <AppMediumText style={{ fontSize: 16 }}>Submission</AppMediumText>
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

                    <View
                        style={[
                            styles.actionContainer,
                            isSmallScreen && {
                                width: '100%',
                                marginTop: 15,
                                justifyContent: 'space-between',
                            }
                        ]}
                    >
                        <View style={styles.searchContainer}>

                            <Ionicons name="search" size={18} color={Colors.dimBg} />

                            <TextInput
                                placeholder={selected == 'correction' ? "Search Students..." : "Search Tests..."}
                                placeholderTextColor={Colors.dimBg}
                                value={search}
                                onChangeText={setSearch}
                                style={styles.searchInput}
                            />
                        </View>
                        <View>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => setCreateTestModalVisible(true)}
                            >
                                <AntDesign name="plus" size={16} color={Colors.white} />
                                <AppSemiBoldText style={styles.addButtonText}>Create</AppSemiBoldText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {
                    selected === 'correction' ? (
                        <StudentSubmissionScreen search={search} />
                    ) : (
                        <CreatedTestList filter={selected} search={search} setCreateTestModalVisible={setCreateTestModalVisible} isCreateTestModalVisible={isCreateTestModalVisible} />
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
    emptyText: {
        fontSize: 20,
        color: "black"
    },
    menu: {
        paddingTop: 20,
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: Colors.bgColor,
        paddingBottom: 20,
        // width : '100%'
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginLeft: 'auto'
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
        borderWidth: 2,
        borderColor: Colors.secondaryColor + '30',
        flex:1

    },

    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: Colors.secondaryColor,
        outlineWidth: 0,
        height: 38,
    },

    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryColor,
        paddingHorizontal: 12,
        height: 40,
        borderRadius: 8,
        alignSelf: 'flex-end'
    },

    addButtonText: {
        color: Colors.white,
        marginLeft: 6,
        fontSize: 14,
    },
})