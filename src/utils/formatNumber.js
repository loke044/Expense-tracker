/**
 * Formats a number using the Indian numbering system (en-IN).
 * @param {number|string} num - The number to format.
 * @param {number} decimals - Number of decimal places.
 * @returns {string} - The formatted number string.
 */
export const formatNumber = (num, decimals = 2) => {
    if (num === undefined || num === null || num === "") return "0.00";
    const val = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
    if (isNaN(val)) return "0.00";

    return val.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};
