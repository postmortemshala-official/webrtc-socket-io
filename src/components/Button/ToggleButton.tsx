import React from 'react';
import { Button, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const ToggleButton = () => {
  const { isDarkTheme, toggleTheme } = useTheme();

  return (
    <View>
      <Button
        title={`Switch to ${isDarkTheme ? 'Light' : 'Dark'} Theme`}
        onPress={toggleTheme}
      />
    </View>
  );
};

export default ToggleButton;
