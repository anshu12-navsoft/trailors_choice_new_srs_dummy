import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../../../Components/Buttons/CustomButton';
import { styles } from '../stylesheets/WelcomeScreen.styles';

const WelcomeScreen = ({ navigation }) => {
  const { height } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      {/* Top image / hero area */}
      <View style={[styles.hero, { height: height * 0.52 }]}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <Icon name="truck-trailer" size={moderateScale(22)} color="#CC2229" />
          <Text style={styles.logoText}>
            <Text style={styles.logoTrailer}>Trailer</Text>
            <Text style={styles.logoChoices}>Choices</Text>
          </Text>
        </View>
      </View>

      {/* Bottom sheet */}
      <View style={styles.sheet}>
        <Text style={styles.heading}>The Smart Way to{'\n'}Rent a Trailer</Text>

        {/* Continue with Phone */}
        <CustomButton
          title="Continue with Phone"
          onPress={() => navigation.navigate('Login')}
          variant="primary"
          size="large"
          style={styles.phoneBtn}
        />

        {/* Or divider */}
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.orLine} />
        </View>

        {/* Continue with Google */}
        <CustomButton
          title="Continue with Google"
          onPress={() => {}}
          variant="outline"
          size="large"
          style={styles.socialBtn}
          leftIcon={
            <Icon name="google" size={moderateScale(18)} color="#4285F4" />
          }
        />

        {/* Continue with Apple */}
        <CustomButton
          title="Continue with Apple"
          onPress={() => {}}
          variant="outline"
          size="large"
          style={styles.socialBtn}
          leftIcon={<Icon name="apple" size={moderateScale(20)} color="#000" />}
        />
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
