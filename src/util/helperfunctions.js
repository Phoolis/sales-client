export function formatDateTime(dateTime) {
  if (!dateTime) return "";
  return new Date(dateTime)
    .toLocaleDateString("fi-FI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", "");
}
