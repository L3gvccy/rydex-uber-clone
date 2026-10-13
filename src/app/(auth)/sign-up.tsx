import { icons, images } from "@/constants";
import { useAuth, useSignUp } from "@clerk/expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import ReactNativeModal from "react-native-modal";
import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { signUp } = useSignUp();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationState, setVerificationState] = useState<
    "none" | "pending" | "success"
  >("none");

  const onSignUpPress = async () => {
    const { error } = await signUp.password({
      emailAddress: form.email,
      password: form.password,
    });
    if (error) {
      Alert.alert("Error", error.message);
      console.log(error);
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      console.log(sendError);
      return;
    }

    setIsVerifying(true);
    setVerificationState("pending");
  };

  const onPressVerify = async () => {
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) {
      console.log(error);
      return;
    }

    const { error: finalizeError } = await signUp.finalize();
    if (finalizeError) {
      console.log(finalizeError);
    }
  };

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

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

          <ReactNativeModal isVisible={verificationState === "pending"}>
            <View className="flex items-center justify-center bg-white px-7 py-9 rounded-3xl min-h-[300px]">
              <Text className="text-3xl font-Jakarta-SemiBold ">
                Verification
              </Text>
              <Text className="text-lg text-gray-400 text-center px-8 my-[12px]">
                We've sent verification code to {form.email}
              </Text>
              <InputField
                label="Code"
                placeholder="123456"
                icon={icons.lock}
                value={code}
                keyboardType="numeric"
                onChangeText={(value) => {
                  setCode(value);
                }}
              />
              <CustomButton
                onPress={() => {
                  router.replace("/(root)/(tabs)/home");
                }}
                title="Verify Email"
                bgVariant="success"
                className="h-[56px] mt-[24px]"
              />
            </View>
          </ReactNativeModal>

          <ReactNativeModal isVisible={verificationState === "success"}>
            <View className="flex items-center justify-center bg-white px-7 py-9 rounded-3xl min-h-[200px]">
              <Image source={images.check} className="w-[110px] h-[110px]" />
              <Text className="text-3xl font-Jakarta-SemiBold mt-[40px]">
                Verified!
              </Text>
              <Text className="text-lg text-gray-400 text-center px-8 mt-[12px]">
                You have successfully verified your account.
              </Text>
              <CustomButton
                onPress={() => {
                  router.replace("/(root)/(tabs)/home");
                }}
                title="Browse Home"
                className="h-[56px] mt-[40px]"
              />
            </View>
          </ReactNativeModal>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
