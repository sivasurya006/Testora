import { Tabs } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useWindowDimensions } from 'react-native';

export default function TestsLayout() {
    const { width } = useWindowDimensions();
    const isLargeScreen = width > 821;

    return isLargeScreen ? (
        <Tabs initialRouteName='createTest' screenOptions={{ tabBarPosition: 'top', headerShown: false, tabBarIcon: () => null }}>
            <Tabs.Screen name="createTest" options={{ title: 'Create Test' }} />
            <Tabs.Screen name="correctionsTest" options={{ title: 'Corrections' }} />
            <Tabs.Screen name="publishedTest" options={{ title: 'Published' }} />
            <Tabs.Screen name="draftTest" options={{ title: 'Drafts' }} />
            <Tabs.Screen name='[testId]' options={{ href: null }} />
        </Tabs>
    ) : (
        <Drawer>
            <Drawer.Screen name="createTest" options={{ title: 'Create Test' }} />
            <Drawer.Screen name="correctionsTest" options={{ title: 'Corrections' }} />
            <Drawer.Screen name="publishedTest" options={{ title: 'Published' }} />
            <Drawer.Screen name="draftTest" options={{ title: 'Drafts' }} />
            <Drawer.Screen
                name='[testId]'
                options={{
                    drawerItemStyle: { display: 'none' },
                    headerShown: false
                }}
            />
        </Drawer>
    );
}
