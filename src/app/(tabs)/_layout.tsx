import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';




export default function TabLayout(){
    return(
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#ffd33d',
        }}>
            {/*tabIcon tasks*/}
            <Tabs.Screen 
                name="tasks" 
                options={{
                    title: 'Tasks',
                    tabBarIcon : ({color,focused}) => (
                        <MaterialIcons name="task-alt" size={24} color="black" />
                    ),
                    }} 
            />
            
            {/*tabIcon focus*/}
            <Tabs.Screen 
                name="focus" 
                options={{
                    title: 'Focus',
                    tabBarIcon : ({color,focused}) => (
                        <MaterialCommunityIcons name="timer-check-outline" size={24} color="black" />
                    ),
                    }} 
            />
            
            {/*tabIcon target*/}
            <Tabs.Screen 
                name="targets" 
                options={{
                    title: 'Targets',
                    tabBarIcon : ({color,focused}) => (
                        <MaterialCommunityIcons name="target" size={24} color="black" />
                    ),
                    }}
            />
            {/*tabIcon calendar*/}
            <Tabs.Screen 
                name="calendar"
                options={{
                    title: 'Calendar',
                    tabBarIcon : ({color,focused}) => (
                        <MaterialCommunityIcons name="calendar-check" size={24} color="black" />
                    ),
                }}
            />
            {/*tabIcon links*/}
            <Tabs.Screen 
                name="links" 
                options={{
                    title: 'Links',
                    tabBarIcon : ({color,focused}) => (
                        <MaterialIcons name="link" size={24} color="black" />
                    ),
                    }}
            />
            {/*tabIcon settings*/}
            <Tabs.Screen 
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({color,focused}) => (
                        <Feather name= "settings" size={24} color="black" />
                    ),
                }}
            />
            {/*ascundere tabIcon about*/}
            <Tabs.Screen 
                name="about" 
                options={{
                    href:null,
                    }} 
            />
            {/*ascundere tabIcon index*/}
            <Tabs.Screen 
                name="index" 
                options={{
                    href:null,
                    }} 
            />
            {/*ascundere tabIcon trash*/}
            <Tabs.Screen 
                name="trash" 
                options={{
                    href:null,
                    }} 
            />
            {/*ascundere tabIcon archive*/}
            <Tabs.Screen 
                name="archive" 
                options={{
                    href:null,
                    }} 
            />
        </Tabs>
    );
}