import { icons, images } from "@/constants";
import { useAuth, useSignUp } from "@clerk/expo";
import { Link, Redirect, router } from "expo-router";
import { useRef, useState } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestInFlight = useRef(false);
  const [completedHere, setCompletedHere] = useState(false);
  const [verificationState, setVerificationState] = useState<
    "none" | "pending" | "success"
  >("none");

  const runRequest = async (request: () => Promise<void>) => {
    if (!isLoaded || requestInFlight.current) return;
    requestInFlight.current = true;
    setIsSubmitting(true);
    try {
      await request();
    } catch (error) {
      Alert.alert(
        "Error",
        error &&
          typeof error === "object" &&
          "longMessage" in error &&
          typeof error.longMessage === "string"
          ? error.longMessage
          : "Something went wrong. Check your connection and try again.",
      );
    } finally {
      requestInFlight.current = false;
      setIsSubmitting(false);
    }
  };

  const finalizeSignUp = async () => {
    if (signUp.status !== "complete") {
      Alert.alert(
        "Registration incomplete",
        "Your email is verified, but Clerk requires additional information. Check the sign-up requirements in your Clerk Dashboard.",
      );
      return;
    }
    // Keep this screen mounted while Clerk activates the new session.
    setCompletedHere(true);
    try {
      const { error } = await signUp.finalize();
      if (error) throw error;
    } catch (error) {
      setCompletedHere(false);
      throw error;
    }
    setForm((current) => ({ ...current, password: "" }));
    setCode("");
    setVerificationState("success");
  };

  const onSignUpPress = () => {
    const emailAddress = form.email.trim();
    const name = form.name.trim();
    if (!name || !emailAddress || !form.password) {
      Alert.alert(
        "Missing information",
        "Enter your name, email and password.",
      );
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      Alert.alert("Invalid email", "Enter a valid email address.");
      return;
    }
    void runRequest(async () => {
      const { error } = await signUp.password({
        emailAddress,
        password: form.password,
        unsafeMetadata: { name },
      });
      if (error) throw error;
      if (signUp.status === "complete") {
        await finalizeSignUp();
        return;
      }
      setCode("");
      setVerificationState("pending");
      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) throw sendError;
    });
  };

  const onPressVerify = () => {
    if (
      signUp.verifications.emailAddress.status !== "verified" &&
      !/^\d{6}$/.test(code)
    ) {
      Alert.alert("Invalid code", "Enter the six-digit code from your email.");
      return;
    }
    void runRequest(async () => {
      if (signUp.verifications.emailAddress.status !== "verified") {
        const { error } = await signUp.verifications.verifyEmailCode({ code });
        if (error) throw error;
      }
      await finalizeSignUp();
    });
  };

  const onResendCode = () => {
    void runRequest(async () => {
      const { error } = await signUp.verifications.sendEmailCode();
      if (error) throw error;
      setCode("");
      Alert.alert("Code sent", "Check your email for a new verification code.");
    });
  };

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isSignedIn && !completedHere) {
    return <Redirect href="/(root)/(tabs)/home" />;
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
              editable={!isSubmitting && verificationState === "none"}
              autoComplete="name"
              onChangeText={(value) => {
                setForm({ ...form, name: value });
              }}
            />
            <InputField
              label="Email"
              placeholder="Enter Email"
              icon={icons.email}
              value={form.email}
              editable={!isSubmitting && verificationState === "none"}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              onChangeText={(value) => {
                setForm({ ...form, email: value });
              }}
            />
            <InputField
              label="Password"
              placeholder="Enter Password"
              icon={icons.lock}
              value={form.password}
              editable={!isSubmitting && verificationState === "none"}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              onChangeText={(value) => {
                setForm({ ...form, password: value });
              }}
            />

            <CustomButton
              title={isSubmitting ? "Please wait..." : "Sign Up"}
              disabled={isSubmitting || verificationState !== "none"}
              onPress={onSignUpPress}
              className="mt-6 h-[56px]"
            />
            <OAuth />
            <View nativeID="clerk-captcha" />

            <Text className="text-lg text-center text-neutral-500 mt-10">
              Already have an account?{" "}
              <Link href="/sign-in">
                <Text className="text-blue-500">Sign In</Text>
              </Link>
            </Text>
          </View>

          <ReactNativeModal
            isVisible={verificationState !== "none"}
            avoidKeyboard
            onBackButtonPress={() => {
              if (isSubmitting) return;
              if (verificationState === "success")
                router.replace("/(root)/(tabs)/home");
              else setVerificationState("none");
            }}
          >
            {verificationState === "pending" ? (
              <View className="flex items-center justify-center bg-white px-7 py-9 rounded-3xl min-h-[300px]">
                <Text className="text-3xl font-Jakarta-SemiBold ">
                  Verification
                </Text>
                <Text className="text-lg text-gray-400 text-center px-8 my-[12px]">
                  Enter the verification code sent to{" "}
                  {signUp.emailAddress || form.email.trim()}.
                </Text>
                <InputField
                  label="Code"
                  placeholder="123456"
                  icon={icons.lock}
                  value={code}
                  keyboardType="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                  textContentType="oneTimeCode"
                  editable={!isSubmitting}
                  onChangeText={(value) => {
                    setCode(value.replace(/\D/g, ""));
                  }}
                />
                <CustomButton
                  onPress={onPressVerify}
                  title={isSubmitting ? "Please wait..." : "Verify Email"}
                  disabled={isSubmitting}
                  bgVariant="success"
                  className="h-[56px] mt-[24px]"
                />
                <CustomButton
                  onPress={onResendCode}
                  title="Resend Code"
                  disabled={
                    isSubmitting ||
                    signUp.verifications.emailAddress.status === "verified"
                  }
                  bgVariant="outline"
                  textVariant="primary"
                  className="h-[56px] mt-3"
                />
                <CustomButton
                  onPress={() => setVerificationState("none")}
                  title="Back"
                  disabled={isSubmitting}
                  bgVariant="outline"
                  textVariant="primary"
                  className="h-[56px] mt-3"
                />
              </View>
            ) : (
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
            )}
          </ReactNativeModal>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
