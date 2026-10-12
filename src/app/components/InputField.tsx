import { Image, Text, TextInput, View } from "react-native";
import { InputFieldProps } from "../../../types/type";

const InputField = ({
  label,
  labelStyle = "",
  placeholder,
  secureTextEntry = false,
  containerStyle = "",
  inputStyle = "",
  iconStyle = "",
  icon,
  value,
  className = "",
  placeholderTextColor = "#6B7280",
  onChangeText,
  ...props
}: InputFieldProps) => {
  return (
    <View className="w-full my-2">
      <Text className={`text-lg font-Jakarta-SemiBold mb-3 ${labelStyle}`}>
        {label}
      </Text>
      <View
        className={`flex flex-row justify-start items-center relative px-3 bg-neutral-100 border border-neutral-100 focus:border-blue-500 rounded-full ${containerStyle}`}
      >
        {icon && (
          <Image
            className={`w-[24px] h-[24px] ${iconStyle}`}
            resizeMode="contain"
            source={icon}
          />
        )}
        <TextInput
          {...props}
          className={`flex-1 min-w-0 text-left rounded-full p-4 text-[15px] text-neutral-900 font-Jakarta ${inputStyle} ${className}`}
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

export default InputField;
