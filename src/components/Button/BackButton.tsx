import { Image, Text, TouchableOpacity } from "react-native";

const BackButton = ({ navigation }: any) => {
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <TouchableOpacity onPress={goBack} style={{ marginTop:'12%', marginLeft:12 }}>
      <Image
        source={require("../../assets/leftArrorw.png")}
        style={{ width: 50, height: 50, }}
      />
    </TouchableOpacity>
  );
};

export default BackButton;
