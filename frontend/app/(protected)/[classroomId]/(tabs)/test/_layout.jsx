import { Tabs } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useWindowDimensions } from 'react-native';
import Colors from '../../../../../styles/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TestsLayout() {
    const { width } = useWindowDimensions();
    const isLargeScreen = width > 821;

    return (
            isLargeScreen ? (
                <Tabs
                    initialRouteName="createTest"
                    screenOptions={{
                        tabBarPosition: 'top',
                        headerShown: false,
                        tabBarIcon: () => null,
                        tabBarStyle: {
                            backgroundColor: Colors.secondaryColor,
                        },
                        tabBarActiveTintColor: Colors.primaryColor,
                        tabBarInactiveTintColor: Colors.white,
                    }}
                >
                    <Tabs.Screen name="createTest" options={{ title: 'Tests' }} />
                    <Tabs.Screen name="correctionsTest" options={{ title: 'Corrections' }} />
                    <Tabs.Screen name="publishedTest" options={{ title: 'Published' }} />
                    <Tabs.Screen name="draftTest" options={{ title: 'Drafts' }} />
                    <Tabs.Screen name="[testId]" options={{ href: null }} />
                </Tabs>
            ) : (
                <Drawer
                    screenOptions={{
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: Colors.secondaryColor,
                        },
                        headerTintColor: Colors.white,
                        headerTitleStyle: {
                            fontSize: 18,
                            fontWeight: '600',
                            color: Colors.white,
                        },
                        drawerStyle: {
                            backgroundColor: Colors.secondaryColor,
                        },
                        drawerActiveTintColor: Colors.primaryColor,
                        drawerInactiveTintColor: Colors.white,
                        drawerLabelStyle: {
                            fontSize: 15,
                            fontWeight: '500',
                        },
                        drawerActiveBackgroundColor: 'rgba(251, 123, 1, 0.12)',
                        drawerContentContainerStyle : {
                            // paddingTop : 0
                        },
                    }}
                >
                    <Drawer.Screen name="createTest" options={{ title: 'Create Test' }} />
                    <Drawer.Screen name="correctionsTest" options={{ title: 'Corrections' }} />
                    <Drawer.Screen name="publishedTest" options={{ title: 'Published' }} />
                    <Drawer.Screen name="draftTest" options={{ title: 'Drafts' }} />
                    <Drawer.Screen
                        name="[testId]"
                        options={{
                            drawerItemStyle: { display: 'none' },
                        }}
                    />
                </Drawer>
            )
    )
}
