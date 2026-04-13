import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Switch,
  Platform,
  UIManager,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomDropdown from '../../../Components/Dropdown/CustomDropdown';
import CustomTextInput from '../../../Components/TextInput/CustomTextInput';
import CustomButton from '../../../Components/Buttons/CustomButton';
import colors from '../../../Constants/Colors';
import Fonts from '../../../Theme/Fonts';
import { styles } from '../stylesheets/AddTrailor.style';
import CustomHeader from '../../../Components/Header/CustomHeader';


if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TOTAL_STEPS = 3;

const TRAILER_CATEGORIES = [
  { label: 'Flatbed', value: 'flatbed' },
  { label: 'Enclosed', value: 'enclosed' },
  { label: 'Dump', value: 'dump' },
  { label: 'Utility', value: 'utility' },
  { label: 'Car Hauler', value: 'car_hauler' },
  { label: 'Livestock', value: 'livestock' },
  { label: 'Boat', value: 'boat' },
  { label: 'Travel', value: 'travel' },
];

// ── Segmented Progress Bar ────────────────────────────────────────────────
const SegmentedTracker = ({ currentStep }) => (
  <View style={tracker.row}>
    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
      <View
        key={i}
        style={[
          tracker.segment,
          i < TOTAL_STEPS - 1 && tracker.segmentGap,
          i < currentStep ? tracker.segmentFilled : tracker.segmentEmpty,
        ]}
      />
    ))}
  </View>
);

const tracker = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(10),
  },
  segment: {
    flex: 1,
    height: moderateScale(4),
  },
  segmentGap: {
    marginRight: moderateScale(4),
  },
  segmentFilled: {
    backgroundColor: colors.textPrimary,
  },
  segmentEmpty: {
    backgroundColor: colors.border,
  },
});

// ── Photo Slot ────────────────────────────────────────────────────────────
const PhotoSlot = ({ uri, onPress, isMain = false, specsLabel }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      isMain ? photo.mainSlot : photo.thumbSlot,
      pressed && { opacity: 0.75 },
    ]}
  >
    {uri ? (
      <Image
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
    ) : (
      <>
        <View style={photo.iconWrap}>
          <Icon
            name="image"
            size={moderateScale(isMain ? 28 : 18)}
            color={colors.textDisabled}
          />
          <View style={photo.plusBadge}>
            <Icon
              name="plus"
              size={moderateScale(10)}
              color={colors.textDisabled}
            />
          </View>
        </View>
        {isMain && (
          <Text style={photo.mainLabel}>
            {specsLabel ?? 'Add main trailer photo'}
          </Text>
        )}
      </>
    )}
  </Pressable>
);

const photo = StyleSheet.create({
  mainSlot: {
    height: verticalScale(130),
    borderRadius: moderateScale(12),
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.textDisabled,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(10),
    overflow: 'hidden',
  },
  thumbSlot: {
    flex: 1,
    height: moderateScale(100),
    borderRadius: moderateScale(10),
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.textDisabled,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  plusBadge: {
    position: 'absolute',
    bottom: -moderateScale(4),
    right: -moderateScale(4),
  },
  mainLabel: {
    marginTop: moderateScale(8),
    fontSize: Fonts.size.sm,
    color: colors.textSecondary,
  },
});

// ── Step 1 — Trailer Detail ───────────────────────────────────────────────
const StepOne = ({ form, setForm }) => {
  const { t } = useTranslation();
  const handlePickMain = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, res => {
      if (res.assets?.[0]?.uri) {
        setForm(f => ({ ...f, mainPhoto: res.assets[0].uri }));
      }
    });
  };

  const handlePickThumb = index => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, res => {
      if (res.assets?.[0]?.uri) {
        setForm(f => {
          const thumbs = [...(f.thumbPhotos || [null, null, null])];
          thumbs[index] = res.assets[0].uri;
          return { ...f, thumbPhotos: thumbs };
        });
      }
    });
  };

  const thumbPhotos = form.thumbPhotos || [null, null, null, null, null, null];

  return (
    <View style={step.container}>
      <Text style={step.title}>{t('trailer_category_label')}</Text>

      <View style={step.fieldGap}>
        <CustomDropdown
          label={t('trailer_category_label')}
          placeholder={t('select_trailer_category')}
          value={form.category}
          options={TRAILER_CATEGORIES}
          onSelect={v => setForm(f => ({ ...f, category: v }))}
        />
      </View>

      <View style={step.fieldGap}>
        <CustomTextInput
          label={t('make_model_label')}
          placeholder={t('make_model_placeholder')}
          value={form.makeModel}
          onChangeText={v => setForm(f => ({ ...f, makeModel: v }))}
        />
      </View>

      <View style={step.fieldGap}>
        <CustomTextInput
          label={t('year_label')}
          placeholder={t('year_placeholder')}
          value={form.year}
          onChangeText={v => setForm(f => ({ ...f, year: v }))}
          keyboardType="number-pad"
        />
      </View>

      <View style={step.fieldGap}>
        <CustomTextInput
          label={t('license_plate_label')}
          placeholder={t('license_plate_placeholder')}
          value={form.licensePlate}
          onChangeText={v => setForm(f => ({ ...f, licensePlate: v }))}
          style={{ textTransform: 'uppercase' }}
        />
      </View>

      {/* Photo upload */}
      <View style={[step.fieldGap, { marginTop: moderateScale(4) }]}>
        <Text style={step.photoLabel}>
          {t('upload_photo_label')}{' '}
          <Text style={step.photoHint}>{t('upload_photo_hint')}</Text>
        </Text>

        <PhotoSlot uri={form.mainPhoto} onPress={handlePickMain} isMain />

        <View style={{ gap: moderateScale(10) }}>
          {[0, 3].map(offset => (
            <View
              key={offset}
              style={{ flexDirection: 'row', gap: moderateScale(10) }}
            >
              {thumbPhotos.slice(offset, offset + 3).map((uri, i) => (
                <PhotoSlot
                  key={offset + i}
                  uri={uri}
                  onPress={() => handlePickThumb(offset + i)}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const step = StyleSheet.create({
  container: { paddingBottom: moderateScale(20) },
  title: {
    fontSize: Fonts.size.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: moderateScale(20),
  },
  fieldGap: { marginBottom: moderateScale(16) },
  photoLabel: {
    fontSize: Fonts.size.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: moderateScale(10),
  },
  photoHint: {
    fontWeight: '400',
    color: colors.textSecondary,
  },
});

// ── Step 2 — Specs & Features ─────────────────────────────────────────────
const FEATURE_LIST = [
  { key: 'ramp', labelKey: 'ramp_included' },
  { key: 'spareTire', labelKey: 'spare_tire' },
  { key: 'tieDown', labelKey: 'tie_down_points' },
  { key: 'winch', labelKey: 'winch' },
];

const TAG_OPTIONS = [
  'Ramp Included',
  'Tool Box',
  'Tarp Included',
  'Side Rails',
];

const StepTwo = ({ form, setForm }) => {
  const { t } = useTranslation();
  const specs = form.specs || {};
  const features = form.features || {};
  const tags = form.tags || [];
  const [customTag, setCustomTag] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const setSpec = (key, val) =>
    setForm(f => ({ ...f, specs: { ...(f.specs || {}), [key]: val } }));

  const toggleFeature = key =>
    setForm(f => ({
      ...f,
      features: { ...(f.features || {}), [key]: !f.features?.[key] },
    }));

  const toggleTag = tag =>
    setForm(f => {
      const cur = f.tags || [];
      return {
        ...f,
        tags: cur.includes(tag) ? cur.filter(t => t !== tag) : [...cur, tag],
      };
    });

  const addCustomTag = () => {
    const trimmed = customTag.trim();
    if (trimmed && !tags.includes(trimmed))
      setForm(f => ({ ...f, tags: [...(f.tags || []), trimmed] }));
    setCustomTag('');
    setShowCustomInput(false);
  };

  const handlePickSpecs = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, res => {
      if (res.assets?.[0]?.uri)
        setForm(f => ({ ...f, specsPhoto: res.assets[0].uri }));
    });
  };

  return (
    <View style={step.container}>
      <Text style={step.title}>{t('specs_features_section')}</Text>

      {/* Dimensions grid */}
      {[
        [
          { key: 'length', label: 'Length', ph: 'e.g. 126 ft' },
          { key: 'width', label: 'Width', ph: 'e.g. 56 ft' },
        ],
        [
          { key: 'heightGround', label: 'Height off Ground', ph: 'e.g. 7 ft' },
          { key: 'totalHeight', label: 'Total Height', ph: 'e.g. 10 ft' },
        ],
        [
          { key: 'weightCapacity', label: 'Weight Capacity', ph: 'e.g. 500lb' },
          { key: 'tongueWeight', label: 'Tounge Weight', ph: 'e.g. 200lb' },
        ],
      ].map((row, ri) => (
        <View key={ri} style={s2.row}>
          {row.map(({ key, label, ph }) => (
            <CustomTextInput
              key={key}
              label={label}
              placeholder={ph}
              value={specs[key] || ''}
              onChangeText={v => setSpec(key, v)}
              keyboardType="decimal-pad"
              style={s2.halfInput}
            />
          ))}
        </View>
      ))}

      {/* Included Features */}
      <Text style={s2.sectionLabel}>{t('included_features')}</Text>
      <View style={s2.featureList}>
        {FEATURE_LIST.map(fItem => (
          <View key={fItem.key} style={s2.featureRow}>
            <Icon
              name="anchor"
              size={moderateScale(18)}
              color={colors.textSecondary}
            />
            <Text style={s2.featureLabel}>{t(fItem.labelKey)}</Text>
            <Switch
              value={!!features[fItem.key]}
              onValueChange={() => toggleFeature(fItem.key)}
              trackColor={{ false: colors.border, true: colors.textPrimary }}
              thumbColor="#fff"
            />
          </View>
        ))}
      </View>

      {/* Tags */}
      <Text style={s2.sectionLabel}>{t('add_tags_label')}</Text>
      <View style={s2.tagsWrap}>
        {TAG_OPTIONS.map(tag => (
          <Pressable
            key={tag}
            onPress={() => toggleTag(tag)}
            style={[s2.tag, tags.includes(tag) && s2.tagActive]}
          >
            <Text style={[s2.tagText, tags.includes(tag) && s2.tagTextActive]}>
              {tag}
            </Text>
          </Pressable>
        ))}
        {tags
          .filter(tag => !TAG_OPTIONS.includes(tag))
          .map(tag => (
            <Pressable
              key={tag}
              onPress={() => toggleTag(tag)}
              style={[s2.tag, s2.tagActive]}
            >
              <Text style={[s2.tagText, s2.tagTextActive]}>{tag}</Text>
            </Pressable>
          ))}
        {showCustomInput ? (
          <View style={s2.customInputRow}>
            <CustomTextInput
              placeholder={t('tag_name_placeholder')}
              value={customTag}
              onChangeText={setCustomTag}
              style={{ flex: 1 }}
              onSubmitEditing={addCustomTag}
              returnKeyType="done"
            />
          </View>
        ) : (
          <Pressable onPress={() => setShowCustomInput(true)} style={s2.tag}>
            <Text style={s2.tagText}>{t('custom_tag')}</Text>
          </Pressable>
        )}
      </View>

      {/* Upload Specs */}
      <Text style={s2.sectionLabel}>{t('upload_specs_label')}</Text>
      <PhotoSlot
        uri={form.specsPhoto}
        onPress={handlePickSpecs}
        isMain
        specsLabel={t('add_trailer_specs_photo')}
      />
    </View>
  );
};

const s2 = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: moderateScale(12),
    marginBottom: moderateScale(12),
  },
  halfInput: { flex: 1 },
  sectionLabel: {
    fontSize: Fonts.size.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: moderateScale(16),
    marginBottom: moderateScale(10),
  },
  featureList: {
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(14),
    borderBottomWidth: 1,
    borderColor: colors.border,
    gap: moderateScale(12),
  },
  featureLabel: {
    flex: 1,
    fontSize: Fonts.size.md,
    color: colors.textPrimary,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(8),
  },
  tag: {
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  tagActive: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  tagText: {
    fontSize: Fonts.size.sm,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  tagTextActive: {
    color: '#fff',
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: moderateScale(120),
  },
});

// ── Step 3 — Pricing & Location ───────────────────────────────────────────
const StepThree = ({ form, setForm }) => {
  const { t } = useTranslation();
  const pricing = form.pricing || {};
  const setPrice = (key, val) =>
    setForm(f => ({ ...f, pricing: { ...(f.pricing || {}), [key]: val } }));

  return (
    <View style={step.container}>
      {/* Pricing */}
      <Text style={step.title}>{t('set_pricing_title')}</Text>

      <View style={s3.row}>
        <CustomTextInput
          label="Daily Price"
          placeholder="$0"
          value={pricing.daily || ''}
          onChangeText={v => setPrice('daily', v)}
          keyboardType="decimal-pad"
          style={s3.halfInput}
        />
        <CustomTextInput
          label="Weekly Price"
          placeholder="$0"
          value={pricing.weekly || ''}
          onChangeText={v => setPrice('weekly', v)}
          keyboardType="decimal-pad"
          style={s3.halfInput}
        />
      </View>

      <View style={s3.row}>
        <CustomTextInput
          label="Monthly Price"
          placeholder="$0"
          value={pricing.monthly || ''}
          onChangeText={v => setPrice('monthly', v)}
          keyboardType="decimal-pad"
          style={s3.halfInput}
        />
        <CustomTextInput
          label="Security Deposit"
          placeholder="$0"
          value={pricing.deposit || ''}
          onChangeText={v => setPrice('deposit', v)}
          keyboardType="decimal-pad"
          style={s3.halfInput}
        />
      </View>

      {/* Pickup Location */}
      <Text style={[step.title, { marginTop: moderateScale(10) }]}>
        {t('pickup_location_title')}
      </Text>

      <CustomTextInput
        label={t('pickup_address_label')}
        placeholder={t('pickup_address_placeholder')}
        value={form.address || ''}
        onChangeText={v => setForm(f => ({ ...f, address: v }))}
        style={{ marginBottom: moderateScale(10) }}
      />

      {/* Map placeholder */}
      <View style={s3.mapBox}>
        <View style={s3.mapGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={s3.mapTile} />
          ))}
        </View>
        <View style={s3.mapRoadsH} />
        <View style={s3.mapRoadsV} />
        <View style={s3.pinWrapper}>
          <Icon
            name="map-pin"
            size={moderateScale(30)}
            color={colors.textPrimary}
          />
        </View>
        {!form.address && (
          <View style={s3.mapOverlay}>
            <Icon
              name="map"
              size={moderateScale(20)}
              color={colors.textDisabled}
            />
            <Text style={s3.mapHint}>{t('enter_address_for_location')}</Text>
          </View>
        )}
      </View>

      {/* Safety & Requirements */}
      <Text style={s3.sectionLabel}>{t('safety_requirements_label')}</Text>
      <View style={s3.textAreaWrapper}>
        <CustomTextInput
          placeholder={t('enter_safety_requirements')}
          value={form.safety || ''}
          onChangeText={v => setForm(f => ({ ...f, safety: v }))}
          style={{ marginBottom: 0 }}
          inputStyle={s3.textArea}
        />
      </View>
    </View>
  );
};

const s3 = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: moderateScale(12),
    marginBottom: moderateScale(12),
  },
  halfInput: { flex: 1 },
  sectionLabel: {
    fontSize: Fonts.size.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: moderateScale(4),
    marginBottom: moderateScale(10),
  },
  mapBox: {
    height: verticalScale(170),
    borderRadius: moderateScale(12),
    backgroundColor: '#E8EEF4',
    marginBottom: moderateScale(16),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mapTile: {
    width: '33.33%',
    height: '50%',
    borderWidth: 0.5,
    borderColor: '#C8D4DF',
  },
  mapRoadsH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: moderateScale(10),
    backgroundColor: '#fff',
    top: '38%',
    opacity: 0.7,
  },
  mapRoadsV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: moderateScale(10),
    backgroundColor: '#fff',
    left: '45%',
    opacity: 0.7,
  },
  pinWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(232,238,244,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(6),
  },
  mapHint: {
    fontSize: Fonts.size.xs,
    color: colors.textDisabled,
  },
  textAreaWrapper: {
    marginBottom: moderateScale(8),
  },
  textArea: {
    minHeight: verticalScale(100),
    textAlignVertical: 'top',
    paddingTop: moderateScale(10),
  },
});

const STEPS = [StepOne, StepTwo, StepThree];

// ── Main Screen ───────────────────────────────────────────────────────────
const AddTrailorScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    category: null,
    makeModel: '',
    year: '',
    licensePlate: '',
    mainPhoto: null,
    thumbPhotos: [null, null, null, null, null, null],
  });

  const validateStep1 = () => {
    if (!form.category) {
      Alert.alert('Required', 'Please select a trailer category.');
      return false;
    }
    if (!form.makeModel.trim()) {
      Alert.alert('Required', 'Please enter Make & Model.');
      return false;
    }
    if (!form.year.trim()) {
      Alert.alert('Required', 'Please enter Year.');
      return false;
    }
    if (!form.licensePlate.trim()) {
      Alert.alert('Required', 'Please enter License Plate.');
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(p => p + 1);
    } else {
      // submit
    }
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(p => p - 1);
    else navigation.goBack();
  };

  const StepContent = STEPS[currentStep - 1];

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      {/* Header */}
      <CustomHeader
        title={t('post_your_trailer')}
        onBack={() => navigation.goBack()}
      />

      {/* Segmented tracker — flush under header */}
      <SegmentedTracker currentStep={currentStep} />

      {/* Scrollable body */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StepContent form={form} setForm={setForm} />
        <CustomButton
          title={
            currentStep === TOTAL_STEPS
              ? t('submit_button')
              : t('continue_button')
          }
          onPress={goNext}
          size="large"
          style={styles.continueBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddTrailorScreen;
