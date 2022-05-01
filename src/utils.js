function basekickStyles({
  typeSizeModifier,
  baseFontSize,
  descenderHeightScale,
  typeRowSpan,
  gridRowHeight,
  capHeight,
}) {
  const fontSize = typeSizeModifier * baseFontSize;

  const calculateTypeOffset = (lh) => {
    const lineHeightScale = lh / fontSize;
    return (lineHeightScale - 1) / 2 + descenderHeightScale;
  };

  const lineHeight = typeRowSpan * gridRowHeight;
  const typeOffset = calculateTypeOffset(lineHeight);

  const topSpace = lineHeight - capHeight * fontSize;
  const heightCorrection =
    topSpace > gridRowHeight ? topSpace - (topSpace % gridRowHeight) : 0;
  const preventCollapse = gridRowHeight;

  const output = {
    fontSize: `${fontSize}rem`,
    lineHeight: `${lineHeight}rem`,
    transform: `translateY(${typeOffset}em)`,
    paddingTop: `${preventCollapse}rem`,
    "&:before": {
      content: "''",
      marginTop: `-${heightCorrection + preventCollapse}rem`,
      display: "block",
      height: 0,
    },
  };

  return output;
}

const cssRegex = /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/;
function getValueAndUnit(value) {
  if (typeof value !== "string") return [value, ""];
  const matchedValue = value.match(cssRegex);
  if (matchedValue) return [parseFloat(value), matchedValue[2]];
  return [value, undefined];
}

function getFontValue(item) {
  if (typeof item === "object") {
    return item[0];
  }
  return item;
}

function createCssSelectors(fontFamily, sizeName, leading) {
  return (
    `.font-${fontFamily}.text-${sizeName}.leading-${leading}.baseline, ` +
    `.font-${fontFamily} .text-${sizeName}.leading-${leading}.baseline, ` +
    `.font-${fontFamily} .text-${sizeName} .leading-${leading}.baseline ,` +
    `.text-${sizeName} .font-${fontFamily}.leading-${leading}.baseline, ` +
    `.text-${sizeName} .font-${fontFamily} .leading-${leading}.baseline`
  );
}

module.exports = {
  basekickStyles,
  getValueAndUnit,
  getFontValue,
  createCssSelectors,
};
