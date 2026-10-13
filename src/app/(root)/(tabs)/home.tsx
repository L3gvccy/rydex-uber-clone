import { icons, images } from "@/constants";
import { useUser } from "@clerk/expo";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RideCard from "../../components/RideCard";

const recentRides = [
  {
    ride_id: "1",
    origin_address: "Dnipro, Ukraine",
    destination_address: "Zaporizhzhya, Ukraine",
    origin_latitude: "48.466778",
    origin_longitude: "35.050807",
    destination_latitude: "47.825183",
    destination_longitude: "35.160482",
    ride_time: 391,
    fare_price: "19500.00",
    payment_status: "paid",
    driver_id: 2,
    user_id: "1",
    created_at: "2024-08-12 05:19:20.620007",
    driver: {
      driver_id: "2",
      first_name: "David",
      last_name: "Petrenko",
      profile_image_url:
        "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
      car_image_url:
        "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
      car_seats: 5,
      rating: "4.60",
    },
  },
  {
    ride_id: "2",
    origin_address: "Jalkot, MH",
    destination_address: "Pune, Maharashtra, India",
    origin_latitude: "18.609116",
    origin_longitude: "77.165873",
    destination_latitude: "18.520430",
    destination_longitude: "73.856744",
    ride_time: 491,
    fare_price: "24500.00",
    payment_status: "paid",
    driver_id: 1,
    user_id: "1",
    created_at: "2024-08-12 06:12:17.683046",
    driver: {
      driver_id: "1",
      first_name: "James",
      last_name: "Wilson",
      profile_image_url:
        "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
      car_image_url:
        "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
      car_seats: 4,
      rating: "4.80",
    },
  },
  {
    ride_id: "3",
    origin_address: "Zagreb, Croatia",
    destination_address: "Rijeka, Croatia",
    origin_latitude: "45.815011",
    origin_longitude: "15.981919",
    destination_latitude: "45.327063",
    destination_longitude: "14.442176",
    ride_time: 124,
    fare_price: "6200.00",
    payment_status: "paid",
    driver_id: 1,
    user_id: "1",
    created_at: "2024-08-12 08:49:01.809053",
    driver: {
      driver_id: "1",
      first_name: "James",
      last_name: "Wilson",
      profile_image_url:
        "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
      car_image_url:
        "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
      car_seats: 4,
      rating: "4.80",
    },
  },
  {
    ride_id: "4",
    origin_address: "Okayama, Japan",
    destination_address: "Osaka, Japan",
    origin_latitude: "34.655531",
    origin_longitude: "133.919795",
    destination_latitude: "34.693725",
    destination_longitude: "135.502254",
    ride_time: 159,
    fare_price: "7900.00",
    payment_status: "paid",
    driver_id: 3,
    user_id: "1",
    created_at: "2024-08-12 18:43:54.297838",
    driver: {
      driver_id: "3",
      first_name: "Michael",
      last_name: "Johnson",
      profile_image_url:
        "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
      car_image_url:
        "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
      car_seats: 4,
      rating: "4.70",
    },
  },
];

const Home = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  // const [ridesLoading, setRidesLoading] = useState(false);
  const ridesLoading = true;
  if (!isLoaded || !isSignedIn)
    return (
      <SafeAreaView>
        <Text className="text-2xl text-black">Loading...</Text>
      </SafeAreaView>
    );
  return (
    <SafeAreaView className="bg-zinc-100 flex-1 p-4" edges={["top"]}>
      {isSignedIn && (
        <View className="flex flex-row justify-between items-center mb-5">
          <Text className="text-3xl text-black font-Jakarta-Bold">
            Hello, {user.firstName}!
          </Text>
          <TouchableOpacity className="bg-white flex items-center justify-center h-10 w-10 rounded-full">
            <Image source={icons.out} className="h-5 w-5" />
          </TouchableOpacity>
        </View>
      )}
      <Text className="text-2xl font-Jakarta-Bold mb-5">Recent Rides</Text>
      <ScrollView>
        <FlatList
          data={recentRides?.slice(0, 5)}
          // data={[]}
          renderItem={({ item }) => <RideCard ride={item} />}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View className="h-10"></View>}
          ListEmptyComponent={() => (
            <View className="flex flex-col justify-center items-center w-full mt-4 mb-10">
              {ridesLoading ? (
                <>
                  <ActivityIndicator size="large" />
                  <Text className="mt-2">Loading...</Text>
                </>
              ) : (
                <>
                  <Image
                    source={images.noResult}
                    className="w-3/4 h-60"
                    resizeMode="contain"
                  />
                  <Text className="text-lg text-zinc-600">
                    No recent rides found
                  </Text>
                </>
              )}
            </View>
          )}
          className="mb-5"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
