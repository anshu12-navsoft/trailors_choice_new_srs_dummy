import { FlatList, View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text, Divider, useTheme } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

const CustomFlatList = ({
  data = [],
  renderItem,
  keyExtractor,
  loading = false,
  refreshing = false,
  onRefresh,
  onEndReached,
  ListHeaderComponent,
  ListFooterComponent,
  contentContainerStyle,
  ItemSeparatorComponent,
  emptyText,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const resolvedEmptyText = emptyText ?? t('no_data_available');

  const Loader = () => (
    <View style={styles.loader}>
      <ActivityIndicator size="small" />
    </View>
  );

  const EmptyState = () => (
    <View style={styles.empty}>
      <Text variant="bodyMedium" style={{ color: colors.onSurfaceDisabled }}>
        {resolvedEmptyText}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.4}
      onEndReached={onEndReached}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={[
        styles.container,
        data.length === 0 && styles.center,
        contentContainerStyle,
      ]}
      ItemSeparatorComponent={
        ItemSeparatorComponent ?? (() => <Divider style={styles.separator} />)
      }
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={loading ? <Loader /> : ListFooterComponent}
      ListEmptyComponent={!loading && <EmptyState />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: moderateScale(20),
  },
  center: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  separator: {
    marginVertical: moderateScale(5),
  },
  loader: {
    paddingVertical: moderateScale(20),
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
  },
});

export default CustomFlatList;
