export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return "₦0";
  return `₦${Number(amount).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });

export const calculateDiscountPercent = (price, discount) => discount || 0;

export const truncate = (text, length = 80) =>
  text && text.length > length ? `${text.slice(0, length).trim()}…` : text;
