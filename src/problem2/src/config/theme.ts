const sizes = {
  mobileS: "320px",
  mobileM: "576px",
  mobileL: "768px",
  tablet: "992px",
  laptop: "1200px",
  laptopL: "1400px",
  desktop: "1600px",
};

export const devices = {
  mobileS: `(min-width: ${sizes.mobileS})`,
  mobileM: `(min-width: ${sizes.mobileM})`,
  mobileL: `(min-width: ${sizes.mobileL})`,
  tablet: `(min-width: ${sizes.tablet})`,
  laptop: `(min-width: ${sizes.laptop})`,
  laptopL: `(min-width: ${sizes.laptopL})`,
  desktop: `(min-width: ${sizes.desktop})`,
};

// Primitive color palette — raw values only, no semantic meaning.
// Neutral scale: higher number = darker (50 ≈ near-white, 950 ≈ near-black).
export const primitiveColors = {
  // Neutrals
  white:          "#ffffff",
  neutral50:      "#fafafa",
  neutral200:     "#d8d8d8",
  neutral300:     "#bcbcbc",
  neutral400:     "#a8a8a8",
  neutral420:     "#a3a3a3",
  neutral500:     "#8e8d8d",
  neutral560:     "#7d7a7a",
  neutral600:     "#6b6d72",
  neutral640:     "#656565",
  neutral700:     "#4b4b4b",
  neutral800:     "#2a2a2a",
  neutral820:     "#262626",
  neutral900:     "#171717",
  neutral950:     "#0d0d0d",
  black:          "#000000",

  // Semi-transparent neutrals
  neutral580Alpha24: "#7877773d", // rgba(120,119,119,0.24)
  neutral620Alpha10: "#6a69691a", // rgba(106,105,105,0.10)

  // Brand — orange
  orange400:  "#ff801f",
  orange500:  "#f76b15",
  orange950:  "#331e0b",

  // Status
  red500:   "#ef4444",
  green400: "#1bbe47",
  green500: "#22c55f",
  teal400:  "#3ebb9a",

  // Transparent darks (used for box-shadows)
  indigoAlpha10: "#0e0e2c1a", // rgba(14,14,44,0.10)
  blackAlpha5:   "#0000000d", // rgba(0,0,0,0.05)
} as const;

export const theme = {
  colors: {
    background:      primitiveColors.black,
    backgroundSecond: primitiveColors.neutral900,
    backgroundThird: primitiveColors.neutral400,
    backgroundAlt:   primitiveColors.neutral950,
    backgroundLogo:  primitiveColors.neutral800,

    border:          primitiveColors.neutral820,
    lightBorder:     primitiveColors.neutral500,
    borderHover:     primitiveColors.neutral700,
    borderDisabled:  primitiveColors.neutral620Alpha10,

    buttonHover:     primitiveColors.neutral900,

    text:            primitiveColors.neutral50,
    textSubtle:      primitiveColors.neutral420,
    textMuted:       primitiveColors.neutral200,
    placeHolder:     primitiveColors.neutral560,

    icon:            primitiveColors.neutral50,
    iconSubtle:      primitiveColors.neutral420,
    iconDefault:     primitiveColors.neutral600,
    iconLight:       primitiveColors.neutral300,
    iconSearch:      primitiveColors.neutral640,

    overlay:         primitiveColors.neutral580Alpha24,

    white:           primitiveColors.neutral50,
    pureWhite:       primitiveColors.white,
    black:           primitiveColors.black,

    orange:          primitiveColors.orange500,
    orangeSecondary: primitiveColors.orange400,
    orangeFade:      primitiveColors.orange950,

    red:             primitiveColors.red500,
    green:           primitiveColors.green500,
    statusGreen:     primitiveColors.green400,
    checkmark:       primitiveColors.teal400,

    shadowPrimary:   primitiveColors.indigoAlpha10,
    shadowSecondary: primitiveColors.blackAlpha5,
  },
  radius: {
    sm:   "4px",
    md:   "8px",
    lg:   "12px",
    xl:   "16px",
    xxl:  "24px",
    full: "9999px",
  },
  gap: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
  },
  zIndex: {
    overlay:      20,
    modalContent: 25,
  },
} as const;

export type ThemeType = typeof theme;
