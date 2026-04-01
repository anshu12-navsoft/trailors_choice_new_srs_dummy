import defaultColors, { lightColors, darkColors, getColors } from '../../Constants/Colors';

describe('Colors', () => {
  it('getColors(false) returns lightColors', () => {
    expect(getColors(false)).toEqual(lightColors);
  });

  it('getColors(true) returns darkColors', () => {
    expect(getColors(true)).toEqual(darkColors);
  });

  it('getColors() defaults to light', () => {
    expect(getColors()).toEqual(lightColors);
  });

  it('default export equals lightColors', () => {
    expect(defaultColors).toEqual(lightColors);
  });

  it('lightColors and darkColors share the same keys', () => {
    expect(Object.keys(lightColors).sort()).toEqual(Object.keys(darkColors).sort());
  });

  it('primary color is the same in both themes', () => {
    expect(lightColors.primary).toBe(darkColors.primary);
  });

  it('dark theme has a darker background than light theme', () => {
    // Light background is #FFFFFF, dark is #111827
    expect(lightColors.background).toBe('#FFFFFF');
    expect(darkColors.background).toBe('#111827');
  });
});
