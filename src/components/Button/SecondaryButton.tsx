import { Dimensions, Text, TouchableOpacity } from "react-native";
import { Color, FontSize, Padding } from "../../utils/globalstyles";
const { width, height } = Dimensions.get("screen");

const SecondaryButton = ({ text, onPress }: any) => {
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        backgroundColor: Color.darkGray,
        paddingHorizontal: width * 0.1,
        paddingVertical: width * 0.02,
        borderRadius: 10,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          color: Color.black,
          textAlign: "center",
          fontSize: FontSize.size_md,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default SecondaryButton;
