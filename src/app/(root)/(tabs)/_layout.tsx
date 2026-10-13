import { icons } from "@/constants";
import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabIcon = ({
  focused,
  source,
}: {
  focused: boolean;
  source: ImageSourcePropType;
}) => (
  <View
    className={`w-12 h-12 items-center justify-center rounded-full ${focused ? "bg-green-500" : "bg-transparent"}`}
  >
    <Image
      source={source}
      tintColor="white"
      resizeMode="contain"
      className="w-7 h-7"
    />
  </View>
);
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4f5" }}>
      <Tabs
        safeAreaInsets={{ bottom: 0 }}
        initialRouteName="home"

        screenOptions={{
          sceneStyle: { backgroundColor: "#f4f4f5" },
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "white",
          tabBarShowLabel: false,
          tabBarIconStyle: {
            width: 48,
            height: "100%",
          },
          tabBarStyle: {
            backgroundColor: "#333333",
            borderRadius: 100,
            height: 64,
            borderTopWidth: 0,
            paddingTop: 0,
            paddingBottom: 0,
            overflow: "hidden",
            marginHorizontal: 20,
            marginBottom: Math.max(insets.bottom, 20),
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} source={icons.home} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} source={icons.list} />
            ),
          }}
        />
        <Tabs.Screen
          name="rides"
          options={{
            title: "Rides",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} source={icons.chat} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} source={icons.profile} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
