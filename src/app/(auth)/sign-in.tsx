import { icons, images } from "@/constants";
import { useAuth, useSignIn } from "@clerk/expo";
import { Link, Redirect } from "expo-router";
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
import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsCode, setNeedsCode] = useState(false);
  const [code, setCode] = useState("");
  const requestInFlight = useRef(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const runRequest = async (request: () => Promise<void>) => {
    if (!isLoaded || requestInFlight.current) return;
    requestInFlight.current = true;
    setIsSubmitting(true);
    try {
      await request();
    } catch (error) {
      Alert.alert(
        "Sign-in failed",
        error &&
          typeof error === "object" &&
          "longMessage" in error &&
          typeof error.longMessage === "string"
          ? error.longMessage
          : "Unable to sign in. Check your connection and try again.",
      );
    } finally {
      requestInFlight.current = false;
      setIsSubmitting(false);
    }
  };

  const finishSignIn = async () => {
    if (signIn.status !== "complete") {
      Alert.alert(
        "Additional verification required",
        "This account requires another verification method before you can sign in.",
      );
      return;
    }
    const { error } = await signIn.finalize();
    if (error) throw error;
    setForm((current) => ({ ...current, password: "" }));
    setCode("");
  };

  const onSignInPress = () => {
    if (signIn.status === "complete") {
      void runRequest(finishSignIn);
      return;
    }
    const emailAddress = form.email.trim();
    if (!emailAddress || !form.password) {
      Alert.alert("Missing information", "Enter your email and password.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      Alert.alert("Invalid email", "Enter a valid email address.");
      return;
    }
    void runRequest(async () => {
      const { error } = await signIn.password({
        emailAddress,
        password: form.password,
      });
      if (error) throw error;
      if (signIn.status === "complete") {
        await finishSignIn();
      } else if (
        (signIn.status === "needs_client_trust" ||
          signIn.status === "needs_second_factor") &&
        signIn.supportedSecondFactors.some(
          (factor) => factor.strategy === "email_code",
        )
      ) {
        setNeedsCode(true);
        setCode("");
        const { error: sendError } = await signIn.mfa.sendEmailCode();
        if (sendError) throw sendError;
      } else {
        Alert.alert(
          "Additional verification required",
          "This account requires another verification method. Use a supported sign-in method for your account.",
        );
      }
    });
  };

  const onVerifyPress = () => {
    if (signIn.status !== "complete" && !/^\d{6}$/.test(code)) {
      Alert.alert("Invalid code", "Enter the six-digit code from your email.");
      return;
    }
    void runRequest(async () => {
      if (signIn.status !== "complete") {
        const { error } = await signIn.mfa.verifyEmailCode({ code });
        if (error) throw error;
      }
      await finishSignIn();
    });
  };

  const onResendPress = () => {
    void runRequest(async () => {
      const { error } = await signIn.mfa.sendEmailCode();
      if (error) throw error;
      setCode("");
      Alert.alert("Code sent", "Check your email for a new verification code.");
    });
  };

  const onBackPress = () => {
    void runRequest(async () => {
      const { error } = await signIn.reset();
      if (error) throw error;
      setNeedsCode(false);
      setCode("");
    });
  };

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (isSignedIn) return <Redirect href="/(root)/(tabs)/home" />;

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
              Welcome Back!
            </Text>
          </View>
          <View className="w-full px-6">
            {needsCode ? (
              <>
                <Text className="text-lg text-center text-neutral-500 my-4">
                  Enter the verification code sent to your email to finish
                  signing in.
                </Text>
                <InputField
                  label="Verification Code"
                  placeholder="123456"
                  icon={icons.lock}
                  value={code}
                  onChangeText={(value) => setCode(value.replace(/\D/g, ""))}
                  keyboardType="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                  textContentType="oneTimeCode"
                  editable={!isSubmitting}
                  onSubmitEditing={onVerifyPress}
                />
                <CustomButton
                  title={isSubmitting ? "Please wait..." : "Verify and Sign In"}
                  onPress={onVerifyPress}
                  disabled={isSubmitting}
                  className="mt-6 h-[56px]"
                />
                <CustomButton
                  title="Resend Code"
                  onPress={onResendPress}
                  disabled={isSubmitting || signIn.status === "complete"}
                  bgVariant="outline"
                  textVariant="primary"
                  className="mt-3 h-[56px]"
                />
                <CustomButton
                  title="Back"
                  onPress={onBackPress}
                  disabled={isSubmitting}
                  bgVariant="outline"
                  textVariant="primary"
                  className="mt-3 h-[56px]"
                />
              </>
            ) : (
              <>
                <InputField
                  label="Email"
                  placeholder="Enter Email"
                  icon={icons.email}
                  value={form.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  editable={!isSubmitting}
                  onChangeText={(value) => {
                    setForm({ ...form, email: value });
                  }}
                />
                <InputField
                  label="Password"
                  placeholder="Enter Password"
                  icon={icons.lock}
                  value={form.password}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="current-password"
                  editable={!isSubmitting}
                  returnKeyType="go"
                  onSubmitEditing={onSignInPress}
                  onChangeText={(value) => {
                    setForm({ ...form, password: value });
                  }}
                />

                <CustomButton
                  title={isSubmitting ? "Signing in..." : "Sign In"}
                  onPress={onSignInPress}
                  disabled={isSubmitting}
                  className="mt-6 h-[56px]"
                />
                <OAuth />
              </>
            )}

            <Text className="text-lg text-center text-neutral-500 mt-10">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up">
                <Text className="text-blue-500">Sign Up</Text>
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
