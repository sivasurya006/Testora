import { View, StyleSheet, Pressable, Platform, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../../styles/Colors';
import { AppBoldText, AppMediumText, AppSemiBoldText } from '../../../styles/fonts';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { router, useGlobalSearchParams } from 'expo-router';
import Profile from '../Profile';
import { Modal, Portal } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';


export default function SubmissionsHeader({ data, selected, setSelected, performanceChartData }) {


    const params = useGlobalSearchParams();
    const testName = params.title;
    const [performanceModalVisible, setPerformanceModalVisible] = useState(false);

    const { width, height } = useWindowDimensions();
    const isMobile = width < 900;
    const chartWidth = Math.max(260, Math.min(width - (isMobile ? 40 : 140), 900));
    const chartHeight = Math.max(240, Math.min(height * (isMobile ? 0.45 : 0.55), 420));

    return (
        <View style={[
            styles.root,
            {
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'stretch' : 'center',
                rowGap: isMobile ? 10 : 0,
            }
        ]}>

            <View style={[styles.leftSection, isMobile && styles.leftSectionMobile]}>
                <View style={styles.menu}>
                    <View style={{ justifyContent: 'center', marginRight: 10 }} >
                        <TouchableOpacity onPress={() => {
                            router.push({
                                pathname: '[classroomId]/test',
                                params: {
                                    classroomId: params.classroomId
                                }
                            })
                        }}>
                            <Feather name='arrow-left' size={24} />
                        </TouchableOpacity>
                    </View>
                    <Pressable
                        style={[styles.menuItem, selected == 'SUBMITTED' && styles.selectedItem]}
                        onPress={() => {
                            setSelected("SUBMITTED");
                        }}
                    >
                        <AppMediumText style={{ fontSize: isMobile ? 14 : 16 }}>To be grade</AppMediumText>
                    </Pressable>
                    <Pressable
                        style={[styles.menuItem, selected == 'EVALUATED' && styles.selectedItem]}
                        onPress={() => {
                            setSelected("EVALUATED");
                        }}
                    >
                        <AppMediumText style={{ fontSize: isMobile ? 14 : 16 }}>Completed</AppMediumText>
                    </Pressable>
                </View>

                <AppBoldText numberOfLines={1} style={[styles.testName, { fontSize: isMobile ? 16 : 18 }]} >
                    {testName}
                </AppBoldText>
            </View>

            <View style={[styles.rightSection, isMobile && styles.rightSectionMobile]}>
                <Profile name={data.name} email={data.email} />
                <TouchableOpacity style={[styles.button, isMobile && styles.buttonMobile]}

                    onPress={() => setPerformanceModalVisible(true)}
                >
                    <MaterialIcons name='query-stats' size={16} color={'white'} />
                    <AppMediumText style={{ color: Colors.white }} >Performance</AppMediumText>
                </TouchableOpacity>
            </View>


            <Portal>
                <Modal
                    visible={performanceModalVisible}
                    onDismiss={() => setPerformanceModalVisible(false)}
                    style={styles.modalOverlay}

                >
                    {
                        performanceChartData?.markData?.length == 0 ? (
                            <View style={styles.emptyAttemptCard} >
                                <AppSemiBoldText style={{ textAlign: 'center', flex: 1 }} >No Attempts taken</AppSemiBoldText>
                            </View>
                        ) : (
                            <View style={[styles.chartCard, { width: chartWidth + 24 }]}>

                                <AppSemiBoldText style={{ textAlign: 'center', fontSize: 20, marginVertical: 15 }}>Performance {testName ? "in" : ''}  {testName}</AppSemiBoldText>
                                <View style={{ marginBottom: isMobile ? 0 : -30 }}>
                                    <LineChart
                                        bezier
                                        data={
                                            {
                                                labels: performanceChartData.labels,
                                                datasets: [
                                                    {
                                                        data: performanceChartData.markData
                                                    }
                                                ],
                                            }
                                        }
                                        width={chartWidth}
                                        height={chartHeight}
                                        chartConfig={{
                                            backgroundGradientFrom: "#fff",
                                            backgroundGradientTo: "#fff",
                                            decimalPlaces: 0,
                                            color: () => "#2196F3",
                                            labelColor: () => "#333",
                                            // marginBottom:0,

                                        }}
                                        style={{
                                            // marginVertical: 8,
                                            borderRadius: 16,
                                            // margin : 'auto',
                                            // marginBottom:0,
                                            // padding : -10
                                        }}
                                        // withDots = {false}
                                        withInnerLines={false}
                                        fromZero={true}
                                    // onDataPointClick={(data) => {

                                    // }}
                                    />
                                </View>
                                <AppSemiBoldText
                                    style={{
                                        textAlign: "center",
                                        marginTop: 8,
                                        fontWeight: "bold"
                                    }}
                                >Attempts</AppSemiBoldText>
                            </View>

                        )
                    }
                </Modal>
            </Portal>

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: Colors.bgColor,
    },
    leftSection: {
        flex: 1,
        minWidth: 260,
    },
    leftSectionMobile: {
        width: '100%',
    },
    menu: {
        paddingTop: 8,
        flexDirection: "row",
        backgroundColor: Colors.bgColor,
        paddingBottom: 8,
        flexWrap: 'wrap',
        ...(Platform.OS == 'web' ? {
            paddingLeft: 10
        } : {})
    },
    active: {
        backgroundColor: Colors.primaryColor
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    selectedItem: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.primaryColor
    },
    testName: {
        paddingHorizontal: 10,
        marginTop: 4,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginLeft: 12,
    },
    rightSectionMobile: {
        width: '100%',
        justifyContent: 'space-between',
        marginLeft: 0,
        marginTop: 4,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: Colors.primaryColor,
        marginHorizontal: 4,
        gap: 10
    },
    buttonMobile: {
        marginHorizontal: 0,
    },
    modalOverlay: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyAttemptCard: {
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 12,
        minWidth: 220,
        minHeight: 120,
    },
    chartCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingBottom: 12,
    }

})
