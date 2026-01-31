/**
 * Formats a date to "Jan 31, 2026" format.
 * @param {Date|string} date - The date to format.
 * @returns {string} - The formatted date string.
 */
export const formatDateCell = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);

    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};
