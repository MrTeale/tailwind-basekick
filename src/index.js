const plugin = require("tailwindcss/plugin");
const {
  basekickStyles,
  getValueAndUnit,
  getFontValue,
  createCssSelectors,
} = require("./utils");

module.exports = plugin(function ({ addUtilities, theme }) {
  const spacing = theme("spacing");
  const [gridRowHeightRem] = getValueAndUnit(spacing["1"]);
  const fonts = theme("basekick");
  const lineHeight = theme("lineHeight");
  const fontSize = theme("fontSize");

  const multiplierLeadings = Object.keys(lineHeight).filter(
    (leading) => !lineHeight[leading].endsWith("rem")
  );

  const remLeadings = Object.keys(lineHeight).filter((leading) =>
    lineHeight[leading].endsWith("rem")
  );

  const utilities = {};
  Object.keys(fonts).forEach((fontFamily) => {
    const fontConfig = fonts[fontFamily];
    const fontBasekickConfig = {
      baseFontSize: 1,
      gridRowHeight: gridRowHeightRem,
      descenderHeightScale: fontConfig.descenderHeightScale,
      capHeight: fontConfig.capHeight,
    };

    Object.keys(fontSize).forEach((sizeName) => {
      const [fontSizeRem] = getValueAndUnit(getFontValue(fontSize[sizeName]));
      multiplierLeadings.forEach((leading) => {
        const [lineHeightMultiplier] = getValueAndUnit(lineHeight[leading]);
        utilities[createCssSelectors(fontFamily, sizeName, leading)] =
          basekickStyles({
            typeSizeModifier: fontSizeRem,
            typeRowSpan: Math.ceil(
              (lineHeightMultiplier * fontSizeRem) / gridRowHeightRem
            ),
            ...fontBasekickConfig,
          });
      });

      remLeadings.forEach((leading) => {
        const [lineHeightRem] = getValueAndUnit(lineHeight[leading]);
        utilities[createCssSelectors(fontFamily, sizeName, leading)] =
          basekickStyles({
            typeSizeModifier: fontSizeRem,
            typeRowSpan: Math.ceil(lineHeightRem / gridRowHeightRem),
            ...fontBasekickConfig,
          });
      });
    });
  });

  addUtilities(utilities);
});
