import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import LessonScreen from './screens/LessonScreen';
import ProfileScreen from './screens/ProfileScreen';
import { Colors } from './constants/theme';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

function LearnStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home"   component={HomeScreen} />
      <Stack.Screen
        name="Lesson"
        component={LessonScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor:   Colors.primary,
          tabBarInactiveTintColor: Colors.textSecondary,
          tabBarStyle: {
            backgroundColor: Colors.white,
            borderTopWidth: 2,
            borderTopColor: Colors.border,
            height: 68,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '800',
            letterSpacing: 0.5,
          },
          tabBarIcon: ({ color, size, focused }) => {
            let name: React.ComponentProps<typeof Ionicons>['name'] = 'home';
            if (route.name === 'Learn') {
              name = focused ? 'book' : 'book-outline';
            } else if (route.name === 'Profile') {
              name = focused ? 'person' : 'person-outline';
            }
            return <Ionicons name={name} size={size + 2} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Learn"
          component={LearnStack}
          options={{ tabBarLabel: 'Learn' }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ tabBarLabel: 'Profile' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
