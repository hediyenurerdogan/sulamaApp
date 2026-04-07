import { Tabs } from 'expo-router';
import { CloudSun, Home, Sprout, ScanLine } from 'lucide-react-native';
import { Platform, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 12,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#10B981', // Agri Green
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontFamily: 'Inter_600SemiBold',
          fontSize: 12,
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Asistan',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: focused ? '#ECFDF5' : 'transparent',
              padding: 8,
              borderRadius: 12,
              width: 44,
              height: 44
            }}>
              <Home size={22} color={color} strokeWidth={2.5} />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Tara',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#10B981',
              padding: 12,
              borderRadius: 30,
              width: 56,
              height: 56,
              marginTop: -20, // Butonu yukarı kaldırarak vurguluyoruz
              shadowColor: '#10B981',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}>
              <ScanLine size={26} color="white" strokeWidth={2.5} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="plants"
        options={{
          title: 'Bitkilerim',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: focused ? '#ECFDF5' : 'transparent',
              padding: 8,
              borderRadius: 12,
              width: 44,
              height: 44
            }}>
              <Sprout size={22} color={color} strokeWidth={2.5} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="weather"
        options={{
          title: 'Hava Durumu',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: focused ? '#EFF6FF' : 'transparent',
              padding: 8,
              borderRadius: 12,
              width: 44,
              height: 44
            }}>
              <CloudSun size={22} color={color} strokeWidth={2.5} />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
