import { icons, images } from "@/constants";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onSignUpPress = () => {};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1 bg-white"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
      >
        <View className="flex-1 bg-white">
          <View className="relative w-full h-[250px]">
            <Image
              source={images.signUpCar}
              className="z-0 w-full h-[250px]"
              resizeMode="contain"
            />
            <Text className="absolute left-6 bottom-[34px] text-3xl font-Jakarta-SemiBold">
              Create Your Account
            </Text>
          </View>
          <View className="w-full px-6">
            <InputField
              label="Name"
              placeholder="Enter Name"
              icon={icons.person}
              value={form.name}
              onChangeText={(value) => {
                setForm({ ...form, name: value });
              }}
            />
            <InputField
              label="Email"
              placeholder="Enter Email"
              icon={icons.email}
              value={form.email}
              onChangeText={(value) => {
                setForm({ ...form, email: value });
              }}
            />
            <InputField
              label="Password"
              placeholder="Enter Password"
              icon={icons.lock}
              value={form.password}
              onChangeText={(value) => {
                setForm({ ...form, password: value });
              }}
            />

            <CustomButton
              title="Sign Up"
              onPress={onSignUpPress}
              className="mt-6 h-[56px]"
            />
            <OAuth />

            <Text className="text-lg text-center text-neutral-500 mt-10">
              Already have an account?{" "}
              <Link href="/sign-in">
                <Text className="text-blue-500">Sign In</Text>
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
