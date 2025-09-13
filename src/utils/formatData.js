export function formatDate(dateStr) {
  const date = new Date(dateStr);

  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  return date.toLocaleDateString('en-GB', options);
}

export function formatAmount(value) {
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  return {
    amt: `${isNegative ? '-' : ''}$${absValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    color: isNegative ? 'text-grey900' : 'text-green',
  };
}

export function formatFigures(value) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2 });
}

/**
 * Converts an array of chart data into a chartConfig object
 * @param {Array} data - e.g. [{ category, maximum, theme }]
 * @param {string} valueKey - numeric key to use as the main value (e.g. "maximum")
 * @returns {Object} chartConfig
 */
export function generateChartConfig(data, valueKey = 'maximum') {
  const config = {
    [valueKey]: { label: valueKey.charAt(0).toUpperCase() + valueKey.slice(1) },
  };
  if (!data) return {};

  data.forEach((item) => {
    // if (!item.category) return;
    // safe object key: remove spaces
    const key = item.category.replace(/\s+/g, '');
    config[key] = {
      label: item.category,
      color: item.theme,
    };
  });

  return config;
}
