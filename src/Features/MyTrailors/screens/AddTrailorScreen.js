import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
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
import {
  submitTrailer,
  clearMessages,
  fetchCategories,
} from '../../../App/Redux/Slices/addTrailerSlice';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TOTAL_STEPS = 3;

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
const StepOne = ({ form, setForm, categoryOptions, categoriesLoading }) => {
  const { t } = useTranslation();
  const specs = form.specs || {};
  const features = form.features || {};

  const setSpec = (key, v) =>
    setForm(f => ({ ...f, specs: { ...(f.specs || {}), [key]: v } }));

  const toggleFeature = key =>
    setForm(f => ({
      ...f,
      features: { ...(f.features || {}), [key]: !f.features?.[key] },
    }));

  const handlePickSpecs = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, res => {
      if (res.assets?.[0]?.uri)
        setForm(f => ({ ...f, specsPhoto: res.assets[0].uri }));
    });
  };

  const FEATURE_LIST = [
    { key: 'ramp', labelKey: 'ramp_included' },
    { key: 'spareTire', labelKey: 'spare_tire' },
    { key: 'tieDown', labelKey: 'tie_down_points' },
    { key: 'winch', labelKey: 'winch' },
  ];

  return (
    <View style={step.container}>
      <Text style={step.title}>{t('trailer_category_label')}</Text>

      {/* Category */}
      <View style={step.fieldGap}>
        <CustomDropdown
          label={t('trailer_category_label')}
          placeholder={
            categoriesLoading ? 'Loading…' : t('select_trailer_category')
          }
          value={form.category}
          options={categoryOptions}
          onSelect={v => setForm(f => ({ ...f, category: v }))}
        />
      </View>

      {/* Title */}
      <View style={step.fieldGap}>
        <CustomTextInput
          label={t('title_label') || 'Title'}
          placeholder={
            t('title_placeholder') || 'e.g. 26ft Big Tex Flatbed for Rent'
          }
          value={form.title}
          onChangeText={v => setForm(f => ({ ...f, title: v }))}
        />
      </View>

      {/* Make & Model + Year */}
      <View style={step.fieldGapRow}>
        <View style={{ flex: 1 }}>
          <CustomTextInput
            label={t('make_model_label')}
            placeholder={t('make_model_placeholder')}
            value={form.makeModel}
            onChangeText={v => setForm(f => ({ ...f, makeModel: v }))}
          />
        </View>
        <View style={{ flex: 1 }}>
          <CustomTextInput
            label={t('year_label')}
            placeholder={t('year_placeholder')}
            value={form.year}
            onChangeText={v => setForm(f => ({ ...f, year: v }))}
            keyboardType="number-pad"
          />
        </View>
      </View>

      {/* License Plate */}
      <View style={step.fieldGap}>
        <CustomTextInput
          label={t('license_plate_label')}
          placeholder={t('license_plate_placeholder')}
          value={form.licensePlate}
          onChangeText={v => setForm(f => ({ ...f, licensePlate: v }))}
          style={{ textTransform: 'uppercase' }}
        />
      </View>

      {/* Description */}
      <View style={step.fieldGap}>
        <CustomTextInput
          label={t('description_label') || 'Description'}
          placeholder={
            t('description_placeholder') ||
            'Describe your trailer, condition, and any special notes…'
          }
          value={form.description}
          onChangeText={v => setForm(f => ({ ...f, description: v }))}
          multiline
          numberOfLines={4}
          inputStyle={step.textArea}
        />
      </View>

      <Text style={step.title}>{t('specs_features_section')}</Text>

      {/* Dimensions grid */}
      {[
        [
          { key: 'length', label: 'Length', ph: 'e.g. 26 ft' },
          { key: 'width', label: 'Width', ph: 'e.g. 8 ft' },
        ],
        [
          { key: 'heightGround', label: 'Height off Ground', ph: 'e.g. 7 ft' },
          { key: 'totalHeight', label: 'Total Height', ph: 'e.g. 10 ft' },
        ],
        [
          {
            key: 'weightCapacity',
            label: 'Weight Capacity',
            ph: 'e.g. 14000 lb',
          },
          { key: 'tongueWeight', label: 'Tongue Weight', ph: 'e.g. 1400 lb' },
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

const step = StyleSheet.create({
  container: { paddingBottom: moderateScale(20) },
  title: {
    fontSize: Fonts.size.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: moderateScale(20),
  },
  fieldGapRow: {
    marginBottom: moderateScale(16),
    flexDirection: 'row',
    gap: 10,
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
  textArea: {
    height: verticalScale(90),
    textAlignVertical: 'top',
    paddingTop: moderateScale(8),
  },
});

// ── Media Upload Slot ─────────────────────────────────────────────────────
const MediaSlot = ({ uri, onPress, iconName, iconOverlay, label }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [media.slot, pressed && { opacity: 0.75 }]}
  >
    {uri ? (
      <Image
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
    ) : (
      <>
        <View style={media.iconWrap}>
          <Icon
            name={iconName}
            size={moderateScale(28)}
            color={colors.textPrimary}
          />
          {iconOverlay && (
            <View style={media.overlayBadge}>
              <Icon
                name={iconOverlay}
                size={moderateScale(12)}
                color={colors.textPrimary}
              />
            </View>
          )}
        </View>
        <Text style={media.label}>{label}</Text>
      </>
    )}
  </Pressable>
);

const media = StyleSheet.create({
  slot: {
    height: verticalScale(120),
    borderRadius: moderateScale(12),
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.textDisabled,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: moderateScale(16),
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  overlayBadge: {
    position: 'absolute',
    bottom: -moderateScale(6),
    right: -moderateScale(10),
  },
  label: {
    marginTop: moderateScale(10),
    fontSize: Fonts.size.sm,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});

// ── Step 2 — Media & Documentation ───────────────────────────────────────
const TAG_OPTIONS = [
  'Ramp Included',
  'Tool Box',
  'Tarp Included',
  'Side Rails',
];

const StepTwo = ({ form, setForm }) => {
  const { t } = useTranslation();
  const tags = form.tags || [];
  const [customTag, setCustomTag] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const toggleTag = tag =>
    setForm(f => {
      const cur = f.tags || [];
      return {
        ...f,
        tags: cur.includes(tag) ? cur.filter(tg => tg !== tag) : [...cur, tag],
      };
    });

  const addCustomTag = () => {
    const trimmed = customTag.trim();
    if (trimmed && !tags.includes(trimmed))
      setForm(f => ({ ...f, tags: [...(f.tags || []), trimmed] }));
    setCustomTag('');
    setShowCustomInput(false);
  };

  const handlePickPhoto = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8, selectionLimit: 0 },
      res => {
        if (res.assets?.length) {
          setForm(f => ({
            ...f,
            mediaPhotos: [
              ...(f.mediaPhotos || []),
              ...res.assets.map(a => a.uri),
            ],
          }));
        }
      },
    );
  };

  const handlePickVideo = () => {
    launchImageLibrary({ mediaType: 'video', selectionLimit: 0 }, res => {
      if (res.assets?.length) {
        setForm(f => ({
          ...f,
          mediaVideos: [
            ...(f.mediaVideos || []),
            ...res.assets.map(a => a.uri),
          ],
        }));
      }
    });
  };

  const handlePickDocument = () => {
    launchImageLibrary({ mediaType: 'mixed', selectionLimit: 0 }, res => {
      if (res.assets?.length) {
        setForm(f => ({
          ...f,
          mediaDocuments: [
            ...(f.mediaDocuments || []),
            ...res.assets.map(a => a.uri),
          ],
        }));
      }
    });
  };

  return (
    <View style={step.container}>
      <Text style={step.title}>{t('media_documentation_title')}</Text>

      {/* Upload Photos */}
      <Text style={s2.sectionLabel}>{t('upload_photos_label')}</Text>
      <MediaSlot
        uri={form.mediaPhotos?.[0]}
        onPress={handlePickPhoto}
        iconName="image"
        iconOverlay="plus"
        label={t('add_main_trailer_photo')}
      />

      {/* Upload Videos */}
      <Text style={s2.sectionLabel}>{t('upload_videos_label')}</Text>
      <MediaSlot
        uri={null}
        onPress={handlePickVideo}
        iconName="film"
        iconOverlay="video"
        label={t('add_trailer_videos')}
      />

      {/* Upload Documents */}
      <Text style={s2.sectionLabel}>{t('upload_documents_label')}</Text>
      <MediaSlot
        uri={null}
        onPress={handlePickDocument}
        iconName="file-plus"
        label={t('add_trailer_documents')}
      />

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
          <Pressable
            onPress={() => setShowCustomInput(true)}
            style={[s2.tag, s2.tagCustom]}
          >
            <Text style={[s2.tagText, s2.tagCustomText]}>
              {t('custom_tag')}
            </Text>
          </Pressable>
        )}
      </View>
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
  tagCustom: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  tagCustomText: {
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
          label="Security Deposit"
          placeholder="$0"
          value={pricing.deposit || ''}
          onChangeText={v => setPrice('deposit', v)}
          keyboardType="decimal-pad"
          style={s3.halfInput}
        />
        {/* <CustomTextInput
          label="Weekly Price"
          placeholder="$0"
          value={pricing.weekly || ''}
          onChangeText={v => setPrice('weekly', v)}
          keyboardType="decimal-pad"
          style={s3.halfInput}
        /> */}
      </View>

      {/* <View style={s3.row}>
       <CustomTextInput
          label="Monthly Price"
          placeholder="$0"
          value={pricing.monthly || ''}
          onChangeText={v => setPrice('monthly', v)}
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
      </View> */}

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
          multiline
          numberOfLines={4}
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    height: verticalScale(120),
    textAlignVertical: 'top',
    paddingTop: moderateScale(10),
  },
});

const STEPS = [StepOne, StepTwo, StepThree];

// ── Build multipart FormData payload ─────────────────────────────────────
const buildFormData = form => {
  const fd = new FormData();
  fd.append('make_model', form.makeModel.trim());
  fd.append('year', form.year.trim());
  fd.append('license_plate', form.licensePlate.trim());
  fd.append('title', form.title.trim());
  fd.append('description', form.description.trim());
  fd.append('category', form.category);
  fd.append('pricing', JSON.stringify(form.pricing || {}));
  fd.append(
    'location',
    JSON.stringify({ address: (form.address || '').trim() }),
  );
  fd.append('specifications', JSON.stringify(form.specs || {}));

  (form.mediaPhotos || []).forEach((uri, i) => {
    const ext = uri.split('.').pop()?.split('?')[0] || 'jpg';
    fd.append('files', {
      uri,
      type: `image/${ext}`,
      name: `photo_${i}.${ext}`,
    });
  });

  return fd;
};

// ── Main Screen ───────────────────────────────────────────────────────────
const AddTrailorScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, error, successMessage, categories, categoriesLoading } =
    useSelector(s => s.addTrailer);

  const categoryOptions = categories.map(c => ({ label: c.name, value: c.id }));

  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    category: null,
    title: '',
    makeModel: '',
    year: '',
    licensePlate: '',
    description: '',
    specs: {
      length: '',
      width: '',
      heightGround: '',
      totalHeight: '',
      weightCapacity: '',
      tongueWeight: '',
    },
    features: {
      ramp: false,
      spareTire: false,
      tieDown: false,
      winch: false,
    },
    specsPhoto: null,
    mediaPhotos: [],
    mediaVideos: [],
    mediaDocuments: [],
    tags: [],
    pricing: { daily: '', weekly: '', monthly: '', deposit: '' },
    address: '',
    safety: '',
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  useEffect(() => {
    if (successMessage) {
      Alert.alert('Success', successMessage, [
        {
          text: 'OK',
          onPress: () => {
            dispatch(clearMessages());
            navigation.goBack();
          },
        },
      ]);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: () => dispatch(clearMessages()) },
      ]);
    }
  }, [error]);

  const validateStep1 = () => {
    if (!form.category) {
      Alert.alert('Required', 'Please select a trailer category.');
      return false;
    }
    if (!form.title.trim()) {
      Alert.alert('Required', 'Please enter a title for your listing.');
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
    if (!form.description.trim()) {
      Alert.alert('Required', 'Please enter a description.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    const fd = buildFormData(form);
    dispatch(submitTrailer(fd));
  };

  const goNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(p => p + 1);
    } else {
      handleSubmit();
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
      <CustomHeader title={t('post_your_trailer')} onBack={goBack} />

      {/* Segmented tracker */}
      <SegmentedTracker currentStep={currentStep} />

      {/* Scrollable body */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StepContent
          form={form}
          setForm={setForm}
          categoryOptions={categoryOptions}
          categoriesLoading={categoriesLoading}
        />
        <CustomButton
          title={
            loading
              ? ''
              : currentStep === TOTAL_STEPS
              ? t('submit_button')
              : t('continue_button')
          }
          onPress={goNext}
          disabled={loading}
          size="large"
          style={styles.continueBtn}
          leftIcon={
            loading ? <ActivityIndicator size="small" color="#fff" /> : null
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddTrailorScreen;
