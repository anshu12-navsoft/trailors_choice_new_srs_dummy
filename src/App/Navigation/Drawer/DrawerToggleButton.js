import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../../Components/Buttons/CustomButton';
const DrawerToggleButton = () => {
  const navigation = useNavigation();

  return (
    <CustomButton
      onPress={() => navigation.toggleDrawer()}
      leftIcon={<Icon name="menu" size={26} color="#000" />}
      style={{
        marginLeft: 15,
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
        paddingVertical: 0,
      }}
    />
  );
};

export default DrawerToggleButton;
