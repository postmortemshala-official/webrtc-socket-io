// Tooltip.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Color } from "../utils/globalstyles";

const Tooltip = ({ text, tooltipText }: any) => {
  const [visible, setVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }

    setTimeout(() => {
      setVisible(false);
    }, 5000);
  }, [visible, fadeAnim]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <AntDesign name="infocirlceo" size={24} color={Color.white} />
      </TouchableOpacity>
      {visible && (
        <Animated.View style={[styles.tooltip, { opacity: fadeAnim }]}>
          <Text style={styles.tooltipText}>{tooltipText}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    margin: 10,
    flex: 1,
  },
  touchable: {
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  text: {
    color: "#FFFFFF",
  },
  tooltip: {
    position: "absolute",
    top: 40,
    backgroundColor: "#333333",
    padding: 10,
    borderRadius: 5,
    width: 250,
    zIndex: 1,
  },
  tooltipText: {
    color: "#ddd",
    fontSize: 12,
  },
});

export default Tooltip;
