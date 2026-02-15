import { Stack, Tabs, router, useGlobalSearchParams } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import Colors from '../../../../../../styles/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppMediumText, fonts } from '../../../../../../styles/fonts';

export default function TestsLayout() {
    // const { width } = useWindowDimensions();
    // const isLargeScreen = width > 821;
    const { classroomId } = useGlobalSearchParams();

    return (
        <Stack
            screenOptions={({ route }) => ({
                headerTitle: route.params?.title ?? 'Test Details',
                headerBackVisible: false,
                headerTitleStyle: {
                    fontFamily: fonts.medium
                },
                headerStyle: {
                    backgroundColor: Colors.bgColor
                },
                headerLeft: () => (
                    <Pressable
                        onPress={() => router.push({
                            pathname: '/[classroomId]/(tabs)/test/',
                            params: { classroomId },
                        })}
                        style={{ paddingHorizontal: 15 }}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={Colors.primary || 'black'}
                        />
                    </Pressable>
                ),
                headerRight: () => (
                    <Pressable
                        onPress={() =>
                            router.push({
                                pathname: '/[classroomId]/(tabs)/test/preview',
                                params: { classroomId }
                            })}
                        style={({ hovered }) => [
                            styles.button,
                            hovered && styles.hovered, 
                        ]}
                    >
                        <Ionicons name="eye" size={20} color={Colors.white} />
                        <AppMediumText style={styles.buttonText}>Preview</AppMediumText>
                    </Pressable>
                ),
            })}
        />

    );

    // return (
    //     isLargeScreen ? (
    //         <Tabs
    //             initialRouteName="createTest"
    //             screenOptions={{
    //                 tabBarPosition: 'top',
    //                 headerShown: false,
    //                 tabBarIcon: () => null,
    //                 tabBarStyle: {
    //                     backgroundColor: Colors.secondaryColor,
    //                 },
    //                 tabBarLabelStyle : {
    //                     fontSize: 16,
    //                     fontFamily : fonts.semibold,
    //                     textDecorationLine : 'underline'
    //                 },
    //                 tabBarActiveTintColor: Colors.white,
    //                 tabBarInactiveTintColor: Colors.lightFont,
    //             }}
    //         >
    //             <Tabs.Screen name="createTest" options={{ title: 'Tests' }} />
    //             <Tabs.Screen name="correctionsTest" options={{ title: 'Corrections' }} />
    //             <Tabs.Screen name="publishedTest" options={{ title: 'Published' }} />
    //             <Tabs.Screen name="draftTest" options={{ title: 'Drafts' }} />
    //             <Tabs.Screen name="[testId]" options={{ href: null }} />
    //         </Tabs>
    //     ) : (
    //         <Drawer
    //             screenOptions={{
    //                 headerShown: true,
    //                 headerStyle: {
    //                     backgroundColor: Colors.secondaryColor,
    //                 },
    //                 headerTintColor: Colors.white,
    //                 headerTitleStyle: {
    //                     fontSize: 18,
    //                     fontWeight: '600',
    //                     color: Colors.white,
    //                 },
    //                 drawerStyle: {
    //                     backgroundColor: Colors.secondaryColor,
    //                 },
    //                 drawerActiveTintColor: Colors.primaryColor,
    //                 drawerInactiveTintColor: Colors.white,
    //                 drawerLabelStyle: {
    //                     fontSize: 15,
    //                     fontWeight: '500',
    //                 },
    //                 drawerActiveBackgroundColor: 'rgba(251, 123, 1, 0.12)',
    //             }}
    //         >
    //             <Drawer.Screen name="createTest" options={{ title: 'Create Test' }} />
    //             <Drawer.Screen name="correctionsTest" options={{ title: 'Corrections' }} />
    //             <Drawer.Screen name="publishedTest" options={{ title: 'Published' }} />
    //             <Drawer.Screen name="draftTest" options={{ title: 'Drafts' }} />
    //             <Drawer.Screen
    //                 name="[testId]"
    //                 options={({ route }) => ({
    //                     title: route.params?.title || 'Test Details',
    //                     drawerItemStyle: { display: 'none' },
    //                     // headerRight: () => (
    //                     //     <Pressable onPress={() => {
    //                     //         router.replace({
    //                     //             pathname: '/[classroomId]/test/createTest',
    //                     //             params: {
    //                     //                 classroomId : route.params?.classroomId,
    //                     //             },
    //                     //         });
    //                     //     }} style={{ padding: 6 , marginRight : 20 }}>
    //                     //         <Ionicons name="arrow-back" size={24} color={Colors.white} />
    //                     //     </Pressable>
    //                     // )


    //                 })}

    //             />
    //         </Drawer>
    //     )
    // )

}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryColor,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginHorizontal : 20
    },
    hovered: {
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    buttonText: {
        marginLeft: 6,
        color: Colors.white,
        fontFamily: fonts.medium,
        fontSize: 16,
    },
});
