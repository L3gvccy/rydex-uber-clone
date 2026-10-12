import { onboarding } from "@/constants";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import CustomButton from "../components/CustomButton";

const Onboarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastPage = activeIndex === 2;

  const handleBtnPress = () => {
    if (!isLastPage) {
      swiperRef.current?.scrollBy(1);
    } else {
      router.replace("/(auth)/sign-up");
    }
  };

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white pb-5">
      <TouchableOpacity
        onPress={() => {
          router.replace(`/(auth)/sign-up`);
        }}
        className="w-full flex justify-end items-end p-5"
      >
        <Text className="text-black text-md font-Jakarta-Bold">Skip</Text>
      </TouchableOpacity>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
        }
        activeDot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#0286FF] rounded-full" />
        }
        index={activeIndex}
        onIndexChanged={(i) => setActiveIndex(i)}
      >
        {onboarding.map((item) => (
          <View key={item.id} className="flex justify-center gap-5 p-5">
            <Image
              source={item.image}
              className="w-full h-[300px]"
              resizeMode="contain"
            ></Image>
            <Text className="text-3xl text-center mx-10 font-Jakarta-ExtraBold">
              {item.title}
            </Text>
            <Text className="text-lg text-gray-700 text-center mx-10 font-Jakarta-Medium">
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>
      <View className="w-full px-5 mt-10">
        {/* <TouchableOpacity
          onPress={handleBtnPress}
          className="flex w-full items-center justify-center bg-blue-500 h-[56px] rounded-full"
        >
          <Text className="text-white text-xl font-Jakarta-SemiBold">
            {isLastPage ? "Get started" : "Next"}
          </Text>
        </TouchableOpacity> */}
        <CustomButton
          onPress={handleBtnPress}
          title={isLastPage ? "Get started" : "Next"}
          className="h-[56px]"
        />
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
