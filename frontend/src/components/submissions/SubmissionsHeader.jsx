import { View, Text, StyleSheet, Pressable, Platform, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
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

    console.log(performanceChartData)

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>

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
                    <AppMediumText style={{ fontSize: 16 }}>To be grade</AppMediumText>
                </Pressable>
                <Pressable
                    style={[styles.menuItem, selected == 'EVALUATED' && styles.selectedItem]}
                    onPress={() => {
                        setSelected("EVALUATED");
                    }}
                >
                    <AppMediumText style={{ fontSize: 16 }}>Completed</AppMediumText>
                </Pressable>
            </View>

            <AppBoldText style={{ fontSize: 18 }} >{testName}</AppBoldText>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                <Profile name={data.name} email={data.email} />
                <TouchableOpacity style={styles.button}

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
                    style={{ alignItems: 'center' }}

                >
                    <View style={{ backgroundColor: '#fff'  , borderRadius: 16 }}>

                        <AppSemiBoldText style={{textAlign : 'center' , fontSize : 20 , marginVertical : 15 }}>Performance { testName ? "in" : '' }  {testName}</AppSemiBoldText>

                        <AppSemiBoldText
                            style={{
                                transform: [{ rotate: '-90deg' }],
                                textAlign: 'center',
                                fontWeight: '600',
                                fontSize: 16,
                                width : width - (width/100 * 97.4),
                                marginTop : (height / 100 * 60)/2.25,
                                position : 'absolute',
                                zIndex : 100,
                                // height : 100,
                            }}
                        >Marks</AppSemiBoldText>
                        <View style={{ marginBottom: -100 }}>
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
                                width={width / 100 * 70}
                                height={height / 100 * 60}
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
                                marginTop: 5,
                                fontWeight: "bold"
                            }}
                        >Attempts</AppSemiBoldText>
                    </View>
                </Modal>
            </Portal>

        </View>
    )
}

const styles = StyleSheet.create({
    menu: {
        paddingTop: 20,
        flexDirection: "row",
        backgroundColor: Colors.bgColor,
        paddingBottom: 20,
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
    }

})