import { useUser } from "@clerk/expo";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  if (!isLoaded || !isSignedIn)
    return (
      <SafeAreaView>
        <Text className="text-2xl text-black">Loading...</Text>
      </SafeAreaView>
    );
  return (
    <SafeAreaView>
      <Text className="text-5xl text-black">Home</Text>
      <Text className="text-xl text-black">
        Hello {user?.emailAddresses[0].emailAddress}
      </Text>
    </SafeAreaView>
  );
};

export default Home;
