import { Searchbar } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

const CustomSearchInput = ({
  value,
  onChangeText,
  placeholder,
  onClear,
  onFocus,
  style,
  inputStyle,
}) => {
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder ?? t('search_placeholder');

  return (
    <Searchbar
      value={value}
      onChangeText={onChangeText}
      placeholder={resolvedPlaceholder}
      onClearIconPress={onClear}
      onFocus={onFocus}
      style={[{ borderRadius: moderateScale(12) }, style]}
      inputStyle={[{ fontSize: moderateScale(15) }, inputStyle]}
      returnKeyType="search"
    />
  );
};

export default CustomSearchInput;
