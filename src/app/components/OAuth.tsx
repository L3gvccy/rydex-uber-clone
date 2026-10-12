import { icons } from "@/constants";
import { Image, Text, View } from "react-native";
import CustomButton from "./CustomButton";

const OAuth = () => {
  const handleSignInGoogle = async () => {};
  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-5 gap-x-3 ">
        <View className="h-[1px] flex-1 bg-gray-400" />
        <Text className="text-lg">Or</Text>
        <View className="h-[1px] flex-1 bg-gray-400" />
      </View>
      <CustomButton
        title="Sign In with Google"
        className="mt-5 h-[56px] shadow-none"
        bgVariant="outline"
        textVariant="primary"
        IconLeft={() => (
          <Image className="h-[24px] w-[24px] mr-2" source={icons.google} />
        )}
        onPress={handleSignInGoogle}
      />
    </View>
  );
};

export default OAuth;
