import { Text, View } from "react-native"

const TermAndCondition = ()=>{
    return(
        <View style={{alignItems:'center'}}>
            <Text>&copy; SeekSolution {new Date().getFullYear()} T & C </Text>
        </View>
    )
}

export default TermAndCondition