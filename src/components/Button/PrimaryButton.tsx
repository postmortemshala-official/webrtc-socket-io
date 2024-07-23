import { Dimensions, Text, TouchableOpacity } from "react-native"
import { Color, FontSize, Padding } from "../../utils/globalstyles"
const { width, height } = Dimensions.get("screen");

const PrimaryButton = ({text,onPress,bgColor, disableBtn}:any)=>{
    return(
        <TouchableOpacity disabled={disableBtn} style={{ flex:1, backgroundColor:bgColor?bgColor:Color.blue, paddingHorizontal:width*0.1, paddingVertical:width*0.02, borderRadius:10}} onPress={onPress}>
            <Text style={{color:Color.white, textAlign:'center', fontSize:FontSize.size_md}}>{text}</Text>

        </TouchableOpacity>
    )
}


export default PrimaryButton