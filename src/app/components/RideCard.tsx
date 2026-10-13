import { icons } from "@/constants";
import dayjs from "dayjs";
import { Image, Text, View } from "react-native";
import { Ride } from "../../../types/type";

const RideCard = ({ ride }: { ride: Ride | any }) => {
  const apiKey = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY?.trim();
  const coordinates = `${ride.destination_longitude},${ride.destination_latitude}`;
  const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=300&height=200&center=lonlat:${coordinates}&zoom=15&marker=lonlat:${coordinates};type:material;color:dodgerblue;size:36&apiKey=${apiKey ?? ""}`;
  return (
    <View className="flex gap-4 bg-white rounded-3xl p-4 ">
      <View className="flex flex-row gap-4">
        <Image
          source={{
            uri: mapUrl,
          }}
          className="h-[90px] w-[80px] rounded-xl"
          resizeMode="cover"
          onError={({ nativeEvent }) => {
            console.warn(
              "Map image failed:",
              nativeEvent.error.replace(/apiKey=[^&\s]+/g, "apiKey=[hidden]"),
            );
          }}
        />
        <View className="flex-1 justify-around items-end">
          <View className="w-full flex flex-row justify-start items-center gap-2">
            <Image source={icons.to} className="w-6 h-6" resizeMode="contain" />
            <Text className="text-lg text-zinc-700 font-Jakarta-Medium">
              {ride.destination_address}
            </Text>
          </View>
          <View className="w-full flex flex-row justify-start items-center gap-2">
            <Image
              source={icons.point}
              className="w-6 h-6"
              resizeMode="contain"
            />
            <Text className="text-lg text-zinc-700 font-Jakarta-Medium">
              {ride.origin_address}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex gap-2 p-4 bg-zinc-100 rounded-xl">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-xl text-zinc-600 font-Jakarta-Medium">
            Date & Time
          </Text>
          <Text className="text-xl font-Jakarta-Medium">
            {dayjs(ride.created_at).format("DD.MM.YYYY, HH:mm")}
          </Text>
        </View>

        <View className="w-full h-[1px] bg-white" />

        <View className="flex flex-row items-center justify-between">
          <Text className="text-xl text-zinc-600 font-Jakarta-Medium">
            Driver
          </Text>
          <Text className="text-xl font-Jakarta-Medium">
            {`${ride.driver.first_name} ${ride.driver.last_name}`}
          </Text>
        </View>

        <View className="w-full h-[1px] bg-white" />

        <View className="flex flex-row items-center justify-between">
          <Text className="text-xl text-zinc-600 font-Jakarta-Medium">
            Car seats
          </Text>
          <Text className="text-xl font-Jakarta-Medium">
            {ride.driver.car_seats}
          </Text>
        </View>

        <View className="w-full h-[1px] bg-white" />

        <View className="flex flex-row items-center justify-between">
          <Text className="text-xl text-zinc-600 font-Jakarta-Medium">
            Payment Status
          </Text>

          {ride.payment_status === "paid" ? (
            <Text className="text-xl font-Jakarta-Medium text-green-500">
              Paid
            </Text>
          ) : (
            <Text className="text-xl font-Jakarta-Medium text-yellow-500">
              {ride.payment_status}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default RideCard;
