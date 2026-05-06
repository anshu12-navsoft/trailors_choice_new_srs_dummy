import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
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
  updateTrailer,
  clearMessages,
  fetchCategories,
  fetchCategoryAttributes,
  fetchTrailerDetail,
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
const StepOne = ({
  form,
  setForm,
  categoryOptions,
  categoriesLoading,
  attributes,
  attributesLoading,
}) => {
  const { t } = useTranslation();
  const specs = form.specs || {};

  const setSpec = (key, v) => {
    console.log('[StepOne setSpec] attr_id:', key, '→ value:', v);
    setForm(f => ({ ...f, specs: { ...(f.specs || {}), [key]: v } }));
  };

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

      {/* Specs & Features */}
      <Text style={step.title}>{t('specs_features_section')}</Text>

      {!form.category ? (
        <Text style={step.specsPlaceholder}>
          {t('select_category_for_specs') ||
            'First select a category to see the specs & features specifically related to the category'}
        </Text>
      ) : attributesLoading ? (
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={{ marginVertical: moderateScale(12) }}
        />
      ) : attributes.length === 0 ? (
        <Text style={step.specsPlaceholder}>
          {'No specs found for this category. Check console for API response.'}
        </Text>
      ) : (
        (() => {
          const sorted = [...attributes].sort(
            (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
          );
          const rows = [];
          for (let i = 0; i < sorted.length; i += 2) {
            rows.push(sorted.slice(i, i + 2));
          }
          return rows.map((row, ri) => {
            const isOddLast = row.length === 1;
            return (
              <View
                key={ri}
                style={isOddLast ? { marginBottom: moderateScale(12) } : s2.row}
              >
                {row.map(attr => {
                  const key = String(attr.id);
                  const fieldType = (attr.field_type || 'text').toLowerCase();

                  if (fieldType === 'dropdown') {
                    const dropOptions = Array.isArray(attr.field_values)
                      ? attr.field_values.map(o =>
                          typeof o === 'string' ? { label: o, value: o } : o,
                        )
                      : [];
                    return (
                      <View
                        key={key}
                        style={isOddLast ? undefined : s2.halfInput}
                      >
                        <CustomDropdown
                          label={attr.attribute_name}
                          placeholder={`Select ${attr.attribute_name}`}
                          value={specs[key] || null}
                          options={dropOptions}
                          onSelect={v => setSpec(key, v)}
                        />
                      </View>
                    );
                  }

                  return (
                    <CustomTextInput
                      key={key}
                      label={attr.attribute_name}
                      placeholder={attr.attribute_name}
                      value={specs[key] || ''}
                      keyboardType={
                        fieldType === 'number' ? 'decimal-pad' : 'default'
                      }
                      onChangeText={v =>
                        setSpec(
                          key,
                          fieldType === 'number'
                            ? v.replace(/[^0-9.]/g, '')
                            : v,
                        )
                      }
                      style={isOddLast ? undefined : s2.halfInput}
                    />
                  );
                })}
              </View>
            );
          });
        })()
      )}

      {/* Towing Vehicle Requirement */}
      <View style={step.fieldGap}>
        <CustomTextInput
          label={
            t('towing_vehicle_requirement') || 'Towing Vehicle Requirement'
          }
          placeholder={
            t('enter_requirements_optional') ||
            'Describe your trailer, condition, and any special notes…'
          }
          value={form.towingRequirements}
          onChangeText={v => setForm(f => ({ ...f, towingRequirements: v }))}
          multiline
          numberOfLines={4}
          inputStyle={step.textArea}
        />
      </View>

      {/* Usage/Rental Rules */}
      <View style={step.fieldGap}>
        <CustomTextInput
          label={t('usage_rental_rules') || 'Usage/Rental Rules'}
          placeholder={
            t('enter_usage_rules_rental_rules') ||
            'Describe your trailer, condition, and any special notes…'
          }
          value={form.rentalRules}
          onChangeText={v => setForm(f => ({ ...f, rentalRules: v }))}
          multiline
          numberOfLines={4}
          inputStyle={step.textArea}
        />
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
  specsPlaceholder: {
    fontSize: Fonts.size.sm,
    color: colors.textSecondary,
    marginBottom: moderateScale(16),
    lineHeight: moderateScale(20),
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

  const SPECS_PHOTO_MIN = 3;
  const SPECS_PHOTO_MAX = 10;
  const handlePickSpecs = () => {
    const current = form.specsPhotos?.length || 0;
    const remaining = SPECS_PHOTO_MAX - current;
    if (remaining <= 0) {
      Alert.alert('Limit Reached', `You can select a maximum of ${SPECS_PHOTO_MAX} spec photos.`);
      return;
    }
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8, selectionLimit: remaining },
      res => {
        if (res.assets?.length) {
          setForm(f => ({
            ...f,
            specsPhotos: [...(f.specsPhotos || []), ...res.assets.map(a => a.uri)],
          }));
        }
      },
    );
  };

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
      <Text style={s2.sectionValidateLabel}>{t('upload_jpeg_png')}</Text>
      {/* Upload Videos */}
      <Text style={s2.sectionLabel}>{t('upload_videos_label')}</Text>
      <MediaSlot
        uri={null}
        onPress={handlePickVideo}
        iconName="film"
        iconOverlay="video"
        label={t('add_trailer_videos')}
      />
      <Text style={s2.sectionValidateLabel}>{t('upload_video_mp4')}</Text>
      {/* Upload Documents */}
      <Text style={s2.sectionLabel}>{t('upload_documents_label')}</Text>
      <MediaSlot
        uri={null}
        onPress={handlePickDocument}
        iconName="file-plus"
        label={t('add_trailer_documents')}
      />
      <Text style={s2.sectionValidateLabel}>{t('upload_pdf')}</Text>
      {/* Upload Specs Photos (min 3, max 10) */}
      <Text style={s2.sectionLabel}>{t('upload_specs_label')}</Text>
      <PhotoSlot
        uri={form.specsPhotos?.[0]}
        onPress={handlePickSpecs}
        isMain
        specsLabel={
          form.specsPhotos?.length
            ? `${form.specsPhotos.length} photo${form.specsPhotos.length > 1 ? 's' : ''} selected (min ${SPECS_PHOTO_MIN}, max ${SPECS_PHOTO_MAX})`
            : `Add spec photos (min ${SPECS_PHOTO_MIN}, max ${SPECS_PHOTO_MAX})`
        }
      />
      <Text style={s2.sectionValidateLabel}>{t('upload_jpeg_png')}</Text>
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
  sectionValidateLabel: {
    fontSize: Fonts.size.md,
    fontWeight: '400',
    color: colors.textSecondary,
    marginTop: moderateScale(0),
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
          value={pricing.price_per_day || ''}
          onChangeText={v => setPrice('price_per_day', v)}
          keyboardType="decimal-pad"
          style={s3.halfInput}
        />
        <CustomTextInput
          label="Security Deposit"
          placeholder="$0"
          value={pricing.security_deposit || ''}
          onChangeText={v => setPrice('security_deposit', v)}
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
const buildFormData = (form, isDraft = false) => {
  const spec_attributes_preview = Object.entries(form.specs || {})
    .filter(([, v]) => v !== '' && v !== null && v !== undefined)
    .map(([attribute, value]) => ({ attribute: Number(attribute), value: String(value) }));

  console.log('===== TRAILER PAYLOAD =====');
  console.log('is_draft:', isDraft);
  console.log('form.specs (raw):', JSON.stringify(form.specs));
  console.log('make_model:', form.makeModel);
  console.log('year:', form.year);
  console.log('license_plate:', form.licensePlate);
  console.log('category:', form.category);
  console.log('pricing:', {
    price_per_day: form.pricing?.price_per_day || '',
    security_deposit: form.pricing?.security_deposit || '',
  });
  console.log('location:', {
    address: form.address,
    city: 'Dallas',
    state: 'Texas',
    zip_code: '75201',
    country: 'USA',
    latitude: '32.776665',
    longitude: '-96.796989',
  });
  console.log('safety_requirements:', form.safety);
  console.log('specifications:', {
    spec_attributes: spec_attributes_preview,
    towing_vehicle_requirements: form.towingRequirements,
    rental_rules: form.rentalRules,
  });
  console.log('files (photos):', form.mediaPhotos);
  console.log('files (videos):', form.mediaVideos);
  console.log('files (documents):', form.mediaDocuments);
  console.log('specs_photos:', form.specsPhotos);
  console.log('===========================');

  const fd = new FormData();
  fd.append('is_draft', isDraft ? 'true' : 'false');
  fd.append('make_model', form.makeModel.trim());
  fd.append('year', form.year.trim());
  fd.append('license_plate', form.licensePlate.trim());
  fd.append('category', form.category);
  fd.append(
    'pricing',
    JSON.stringify({
      price_per_day: form.pricing?.price_per_day || '',
      security_deposit: form.pricing?.security_deposit || '',
    }),
  );
  // TODO: replace with user-entered city, state, zip_code, country, latitude, longitude
  fd.append(
    'location',
    JSON.stringify({
      address: (form.address || '').trim(),
      city: 'Dallas',
      state: 'Texas',
      zip_code: '75201',
      country: 'USA',
      latitude: '32.776665',
      longitude: '-96.796989',
    }),
  );
  fd.append('safety_requirements', (form.safety || '').trim());

  fd.append(
    'specifications',
    JSON.stringify({
      spec_attributes: spec_attributes_preview,
      towing_vehicle_requirements: (form.towingRequirements || '').trim(),
      rental_rules: (form.rentalRules || '').trim(),
    }),
  );

  // Media files: photos, videos, documents
  const allFiles = [
    ...(form.mediaPhotos || []).map(uri => ({ uri, mediaType: 'image', prefix: 'photo' })),
    ...(form.mediaVideos || []).map(uri => ({ uri, mediaType: 'video', prefix: 'video' })),
    ...(form.mediaDocuments || []).map(uri => ({ uri, mediaType: 'application', prefix: 'doc' })),
  ];
  allFiles.forEach(({ uri, mediaType, prefix }, i) => {
    const ext = uri.split('.').pop()?.split('?')[0] || 'jpg';
    fd.append('files', { uri, type: `${mediaType}/${ext}`, name: `${prefix}_${i}.${ext}` });
  });

  // Spec photos sent separately
  (form.specsPhotos || []).forEach((uri, i) => {
    const ext = uri.split('.').pop()?.split('?')[0] || 'jpg';
    fd.append('specs_photos', { uri, type: `image/${ext}`, name: `spec_${i}.${ext}` });
  });

  return fd;
};

const buildInitialForm = trailerData => {
  if (!trailerData) {
    return {
      category: null,
      makeModel: '',
      year: '',
      licensePlate: '',
      towingRequirements: '',
      rentalRules: '',
      specs: {},
      specsPhotos: [],
      mediaPhotos: [],
      mediaVideos: [],
      mediaDocuments: [],
      tags: [],
      pricing: { price_per_day: '', security_deposit: '' },
      address: '',
      safety: '',
    };
  }

  const spec = trailerData.specification ?? trailerData.specifications ?? {};
  const specAttrs = spec.spec_attributes;
  const specsMap = Array.isArray(specAttrs)
    ? Object.fromEntries(specAttrs.map(sa => [String(sa.attribute), String(sa.value ?? '')]))
    : {};

  return {
    category: trailerData.category ?? null,
    makeModel: trailerData.make_model || trailerData.makeModel || '',
    year: trailerData.year ? String(trailerData.year) : '',
    licensePlate: trailerData.license_plate || trailerData.licensePlate || '',
    towingRequirements: spec.towing_vehicle_requirements || '',
    rentalRules: spec.rental_rules || '',
    specs: specsMap,
    specsPhotos: trailerData.specs_photo_urls || [],
    mediaPhotos: trailerData.mediaPhotoUrls || trailerData.media_photo_urls || [],
    mediaVideos: trailerData.mediaVideoUrls || trailerData.media_video_urls || [],
    mediaDocuments: trailerData.mediaDocumentUrls || trailerData.media_document_urls || [],
    tags: trailerData.tags || [],
    pricing: {
      price_per_day: trailerData.pricing?.price_per_day ? String(trailerData.pricing.price_per_day) : '',
      security_deposit: trailerData.pricing?.security_deposit ? String(trailerData.pricing.security_deposit) : '',
    },
    address: trailerData.location?.address || trailerData.address || '',
    safety: trailerData.safety_requirements || trailerData.safety || '',
  };
};

// ── Main Screen ───────────────────────────────────────────────────────────
const AddTrailorScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const trailerId = route?.params?.trailerId ?? null;
  const {
    loading,
    detailLoading,
    error,
    successMessage,
    categories,
    categoriesLoading,
    attributes,
    attributesLoading,
  } = useSelector(s => s.addTrailer);

  const categoryOptions = categories.map(c => ({ label: c.name, value: c.id }));

  const [currentStep, setCurrentStep] = useState(1);
  const isDraftRef = useRef(false);
  const isCategoryInitRef = useRef(false);
  // Tracks the trailer ID once a draft is first created via POST.
  // All subsequent step submissions use PUT (updateTrailer) with this ID
  // so the same license plate never gets re-POSTed.
  const draftTrailerIdRef = useRef(trailerId);
  // False while we are fetching existing trailer details for edit mode.
  const [formReady, setFormReady] = useState(!trailerId);
  const [form, setForm] = useState(() => buildInitialForm(null));

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  // When editing an existing draft, fetch its full details and pre-fill the form.
  useEffect(() => {
    if (!trailerId) return;
    dispatch(fetchTrailerDetail(trailerId)).then(action => {
      if (fetchTrailerDetail.fulfilled.match(action)) {
        const detail = action.payload;
        isCategoryInitRef.current = !!detail?.category;
        setForm(buildInitialForm(detail));
      }
      setFormReady(true);
    });
  }, [trailerId]);

  useEffect(() => {
    if (form.category) {
      dispatch(fetchCategoryAttributes(form.category));
      if (isCategoryInitRef.current) {
        isCategoryInitRef.current = false;
      } else {
        setForm(f => ({ ...f, specs: {} }));
      }
    }
  }, [form.category]);

  useEffect(() => {
    if (successMessage) {
      if (isDraftRef.current) {
        Alert.alert(
          'Saved as Draft',
          'Your trailer has been saved as a draft. You can continue filling in the remaining details.',
          [
            {
              text: 'OK',
              onPress: () => {
                dispatch(clearMessages());
                setCurrentStep(p => p + 1);
              },
            },
          ],
        );
      } else {
        Alert.alert('Success', 'Trailer created successfully.', [
          {
            text: 'OK',
            onPress: () => {
              dispatch(clearMessages());
              navigation.goBack();
            },
          },
        ]);
      }
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
    for (const attr of attributes) {
      const val = (form.specs || {})[String(attr.id)];
      if (!val || String(val).trim() === '') {
        Alert.alert('Required', `Please fill in ${attr.attribute_name}.`);
        return false;
      }
    }
    if (!form.towingRequirements.trim()) {
      Alert.alert('Required', 'Please enter Towing Vehicle Requirement.');
      return false;
    }
    if (!form.rentalRules.trim()) {
      Alert.alert('Required', 'Please enter Usage/Rental Rules.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if ((form.specsPhotos?.length || 0) < 3) {
      Alert.alert('Required', 'Please select at least 3 spec photos.');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!form.pricing?.price_per_day?.toString().trim()) {
      Alert.alert('Required', 'Please enter a Daily Price.');
      return false;
    }
    if (!form.pricing?.security_deposit?.toString().trim()) {
      Alert.alert('Required', 'Please enter a Security Deposit.');
      return false;
    }
    if (!form.address?.trim()) {
      Alert.alert('Required', 'Please enter a Pickup Address.');
      return false;
    }
    if (!form.safety?.trim()) {
      Alert.alert('Required', 'Please enter Safety & Requirements.');
      return false;
    }
    return true;
  };

  const goNext = async () => {
    let isDraft = true;
    if (currentStep === 1) {
      if (!validateStep1()) return;
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
    } else {
      if (!validateStep3()) return;
      isDraft = false;
    }

    isDraftRef.current = isDraft;
    const fd = buildFormData(form, isDraft);

    if (draftTrailerIdRef.current) {
      dispatch(updateTrailer({ id: draftTrailerIdRef.current, data: fd }));
    } else {
      const action = await dispatch(submitTrailer(fd));
      if (submitTrailer.fulfilled.match(action)) {
        const id = action.payload?.id ?? action.payload?.data?.id ?? null;
        if (id) draftTrailerIdRef.current = id;
      }
    }
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(p => p - 1);
    else navigation.goBack();
  };

  const StepContent = STEPS[currentStep - 1];

  if (!formReady || detailLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <CustomHeader title="Edit Trailer" onBack={goBack} />
        <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      {/* Header */}
      <CustomHeader title={trailerId ? 'Edit Trailer' : t('post_your_trailer')} onBack={goBack} />

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
          attributes={attributes}
          attributesLoading={attributesLoading}
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
