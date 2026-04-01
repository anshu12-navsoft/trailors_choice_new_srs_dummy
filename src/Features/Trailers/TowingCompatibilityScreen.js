import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View, Text, StyleSheet, StatusBar, ScrollView,
  TouchableOpacity, TextInput, Modal, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../Constants/Colors';

const MAKES = ['Ford', 'Chevrolet', 'Toyota', 'Ram', 'GMC', 'Honda', 'Nissan', 'Jeep', 'Dodge', 'Hyundai'];
const MODELS_BY_MAKE = {
  Ford: ['F-150', 'F-250', 'Explorer', 'Expedition', 'Edge'],
  Chevrolet: ['Silverado 1500', 'Silverado 2500', 'Tahoe', 'Suburban', 'Equinox'],
  Toyota: ['Tundra', 'Tacoma', '4Runner', 'Sequoia', 'Highlander'],
  Ram: ['1500', '2500', '3500', 'ProMaster'],
  GMC: ['Sierra 1500', 'Sierra 2500', 'Yukon', 'Terrain'],
  Honda: ['Ridgeline', 'Pilot', 'Passport'],
  Nissan: ['Titan', 'Frontier', 'Armada', 'Pathfinder'],
  Jeep: ['Grand Cherokee', 'Wrangler', 'Gladiator'],
  Dodge: ['Durango', 'Journey'],
  Hyundai: ['Palisade', 'Santa Fe', 'Tucson'],
};
const HITCH_TYPES = ['Class I (2,000 lbs)', 'Class II (3,500 lbs)', 'Class III (6,000 lbs)', 'Class IV (10,000 lbs)', 'Class V (18,000 lbs)'];
const YEARS = Array.from({ length: 15 }, (_, i) => String(2024 - i));

const PickerModal = ({ visible, title, options, onSelect, onClose }) => (
  <Modal visible={visible} transparent animationType="slide">
    <TouchableOpacity style={styles.overlay} onPress={onClose}>
      <View style={styles.pickerSheet}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>{title}</Text>
        <FlatList
          data={options}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.pickerOption} onPress={() => onSelect(item)}>
              <Text style={styles.pickerOptionText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </TouchableOpacity>
  </Modal>
);

const TowingCompatibilityScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const trailer = route.params?.trailer ?? { weightCapacity: 7000, hitchType: 'Class III' };

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [hitchType, setHitchType] = useState('');
  const [towCapacity, setTowCapacity] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [result, setResult] = useState(null);

  const [activePicker, setActivePicker] = useState(null);

  const handleMakeSelect = (val) => { setMake(val); setModel(''); setActivePicker(null); };
  const handleModelSelect = (val) => { setModel(val); setActivePicker(null); };
  const handleYearSelect = (val) => { setYear(val); setActivePicker(null); };
  const handleHitchSelect = (val) => { setHitchType(val); setActivePicker(null); };

  const checkCompatibility = () => {
    const userCap = parseInt(towCapacity, 10);
    if (!userCap || isNaN(userCap)) return;

    const trailerWeight = trailer.weightCapacity ?? 7000;
    const ratio = userCap / trailerWeight;

    let status, confidence, message;
    if (ratio >= 1.2) {
      status = 'compatible';
      confidence = Math.min(99, Math.round(ratio * 60));
      message = t('compatibility_message_sufficient', { capacity: userCap.toLocaleString(), weight: trailerWeight.toLocaleString() });
    } else if (ratio >= 1.0) {
      status = 'marginal';
      confidence = Math.round(ratio * 55);
      message = t('compatibility_message_marginal', { capacity: userCap.toLocaleString(), weight: trailerWeight.toLocaleString() });
    } else {
      status = 'incompatible';
      confidence = Math.round(ratio * 50);
      message = t('compatibility_message_insufficient', { capacity: userCap.toLocaleString(), weight: trailerWeight.toLocaleString() });
    }

    // Hitch class check
    const hitchClass = hitchType.includes('I)') ? 1 : hitchType.includes('II)') ? 2 : hitchType.includes('III)') ? 3 : hitchType.includes('IV)') ? 4 : 5;
    const requiredClass = trailer.hitchType?.includes('III') ? 3 : 2;
    if (hitchClass < requiredClass && status === 'compatible') {
      status = 'marginal';
      message += ' However, your hitch class may not be suitable for this trailer.';
    }

    setResult({ status, confidence, message });
  };

  const getResultColor = () => {
    if (!result) return colors.primary;
    return result.status === 'compatible' ? colors.success : result.status === 'marginal' ? colors.warning : colors.error;
  };

  const getResultIcon = () => {
    if (!result) return 'help';
    return result.status === 'compatible' ? 'check-circle' : result.status === 'marginal' ? 'warning' : 'cancel';
  };

  const getResultLabel = () => {
    if (!result) return '';
    return result.status === 'compatible' ? t('compatible_status') : result.status === 'marginal' ? t('marginal_status') : t('not_compatible_status');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={moderateScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('towing_compatibility_title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Trailer Specs */}
        <View style={styles.trailerCard}>
          <Icon name="local-shipping" size={moderateScale(24)} color={colors.primary} />
          <View style={styles.trailerCardInfo}>
            <Text style={styles.trailerCardTitle}>{trailer.title ?? 'Selected Trailer'}</Text>
            <Text style={styles.trailerCardSub}>Required: {trailer.hitchType ?? 'Class III'} hitch · Max load: {(trailer.weightCapacity ?? 7000).toLocaleString()} lbs</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('your_vehicle_section')}</Text>

        {/* Make */}
        <Text style={styles.fieldLabel}>{t('make_label')}</Text>
        <TouchableOpacity style={styles.pickerBtn} onPress={() => setActivePicker('make')}>
          <Text style={[styles.pickerBtnText, !make && styles.placeholder]}>{make || t('select_make')}</Text>
          <Icon name="expand-more" size={moderateScale(20)} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Model */}
        <Text style={styles.fieldLabel}>{t('model_label')}</Text>
        <TouchableOpacity
          style={[styles.pickerBtn, !make && styles.pickerBtnDisabled]}
          onPress={() => make && setActivePicker('model')}
        >
          <Text style={[styles.pickerBtnText, !model && styles.placeholder]}>{model || t('select_model')}</Text>
          <Icon name="expand-more" size={moderateScale(20)} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Year */}
        <Text style={styles.fieldLabel}>{t('year_label')}</Text>
        <TouchableOpacity style={styles.pickerBtn} onPress={() => setActivePicker('year')}>
          <Text style={[styles.pickerBtnText, !year && styles.placeholder]}>{year || t('select_year')}</Text>
          <Icon name="expand-more" size={moderateScale(20)} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Towing Capacity */}
        <Text style={styles.fieldLabel}>{t('max_towing_capacity_label')}</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={towCapacity}
            onChangeText={setTowCapacity}
            placeholder={t('towing_capacity_placeholder')}
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>

        {/* Hitch Type */}
        <Text style={styles.fieldLabel}>{t('hitch_type_label')}</Text>
        <TouchableOpacity style={styles.pickerBtn} onPress={() => setActivePicker('hitch')}>
          <Text style={[styles.pickerBtnText, !hitchType && styles.placeholder]}>{hitchType || t('select_hitch_type')}</Text>
          <Icon name="expand-more" size={moderateScale(20)} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Check Button */}
        <TouchableOpacity
          style={[styles.checkBtn, (!towCapacity || !hitchType) && styles.checkBtnDisabled]}
          onPress={checkCompatibility}
          disabled={!towCapacity || !hitchType}
        >
          <Icon name="rv-hookup" size={moderateScale(18)} color="#fff" />
          <Text style={styles.checkBtnText}>{t('check_compatibility_button')}</Text>
        </TouchableOpacity>

        {/* Result */}
        {result && (
          <View style={[styles.resultCard, { borderColor: getResultColor() }]}>
            <View style={styles.resultHeader}>
              <Icon name={getResultIcon()} size={moderateScale(32)} color={getResultColor()} />
              <View style={styles.resultHeaderInfo}>
                <Text style={[styles.resultLabel, { color: getResultColor() }]}>{getResultLabel()}</Text>
                <View style={styles.confidenceRow}>
                  <View style={[styles.confidenceBar, { width: `${result.confidence}%`, backgroundColor: getResultColor() }]} />
                  <Text style={styles.confidenceText}>{result.confidence}{t('confidence_label')}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.resultMessage}>{result.message}</Text>

            {result.status !== 'compatible' && (
              <TouchableOpacity style={styles.ackRow} onPress={() => setAcknowledged(!acknowledged)}>
                <View style={[styles.checkbox, acknowledged && styles.checkboxActive]}>
                  {acknowledged && <Icon name="check" size={moderateScale(14)} color="#fff" />}
                </View>
                <Text style={styles.ackText}>{t('acknowledge_risks')}</Text>
              </TouchableOpacity>
            )}

            {(result.status === 'compatible' || acknowledged) && (
              <TouchableOpacity
                style={styles.proceedBtn}
                onPress={() => navigation.navigate('Booking', { trailer })}
              >
                <Text style={styles.proceedBtnText}>{t('proceed_to_booking_button')}</Text>
                <Icon name="arrow-forward" size={moderateScale(16)} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ height: moderateScale(30) }} />
      </ScrollView>

      {/* Pickers */}
      <PickerModal
        visible={activePicker === 'make'}
        title={t('select_make_title')}
        options={MAKES}
        onSelect={handleMakeSelect}
        onClose={() => setActivePicker(null)}
      />
      <PickerModal
        visible={activePicker === 'model'}
        title={t('select_model_title')}
        options={MODELS_BY_MAKE[make] ?? []}
        onSelect={handleModelSelect}
        onClose={() => setActivePicker(null)}
      />
      <PickerModal
        visible={activePicker === 'year'}
        title={t('select_year_title')}
        options={YEARS}
        onSelect={handleYearSelect}
        onClose={() => setActivePicker(null)}
      />
      <PickerModal
        visible={activePicker === 'hitch'}
        title={t('select_hitch_title')}
        options={HITCH_TYPES}
        onSelect={handleHitchSelect}
        onClose={() => setActivePicker(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(12), gap: 12, borderBottomWidth: 1, borderColor: colors.border },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: moderateScale(18), fontWeight: '700', color: colors.textPrimary },
  scrollContent: { padding: moderateScale(16) },
  trailerCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#EFF6FF', borderRadius: moderateScale(12), padding: moderateScale(14), marginBottom: moderateScale(20), borderWidth: 1, borderColor: '#BFDBFE' },
  trailerCardInfo: { flex: 1 },
  trailerCardTitle: { fontSize: moderateScale(14), fontWeight: '700', color: colors.textPrimary },
  trailerCardSub: { fontSize: moderateScale(12), color: colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontSize: moderateScale(17), fontWeight: '700', color: colors.textPrimary, marginBottom: moderateScale(14) },
  fieldLabel: { fontSize: moderateScale(13), fontWeight: '600', color: colors.textPrimary, marginBottom: 6 },
  pickerBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: moderateScale(10), paddingHorizontal: moderateScale(14), height: moderateScale(48), marginBottom: moderateScale(14), backgroundColor: colors.surface },
  pickerBtnDisabled: { opacity: 0.5 },
  pickerBtnText: { fontSize: moderateScale(14), color: colors.textPrimary },
  placeholder: { color: '#9CA3AF' },
  inputRow: { borderWidth: 1, borderColor: colors.border, borderRadius: moderateScale(10), paddingHorizontal: moderateScale(14), height: moderateScale(48), marginBottom: moderateScale(14), backgroundColor: colors.surface, justifyContent: 'center' },
  textInput: { fontSize: moderateScale(14), color: colors.textPrimary },
  checkBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: moderateScale(12), paddingVertical: moderateScale(14), marginTop: moderateScale(4), marginBottom: moderateScale(20) },
  checkBtnDisabled: { backgroundColor: '#93C5FD' },
  checkBtnText: { color: '#fff', fontSize: moderateScale(15), fontWeight: '700' },
  resultCard: { borderWidth: 2, borderRadius: moderateScale(14), padding: moderateScale(16), gap: 12 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  resultHeaderInfo: { flex: 1 },
  resultLabel: { fontSize: moderateScale(18), fontWeight: '800' },
  confidenceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  confidenceBar: { height: 4, borderRadius: 2 },
  confidenceText: { fontSize: moderateScale(12), color: colors.textSecondary },
  resultMessage: { fontSize: moderateScale(13), color: colors.textSecondary, lineHeight: 20 },
  ackRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  ackText: { flex: 1, fontSize: moderateScale(13), color: colors.textSecondary },
  proceedBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.primary, borderRadius: moderateScale(10), paddingVertical: moderateScale(12) },
  proceedBtnText: { color: '#fff', fontSize: moderateScale(14), fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  pickerSheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: moderateScale(20), maxHeight: '60%' },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: moderateScale(17), fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  pickerOption: { paddingVertical: moderateScale(14), borderBottomWidth: 1, borderColor: colors.border },
  pickerOptionText: { fontSize: moderateScale(15), color: colors.textPrimary },
});

export default TowingCompatibilityScreen;
