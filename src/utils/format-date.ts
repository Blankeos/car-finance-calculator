import dayjs from "dayjs";

export function formatDate(date: string | Date) {
  return dayjs(date).format("MMMM DD, YYYY");
}

export function formatDateWithTime(date: string | Date) {
  return dayjs(date).format("MMM DD, YYYY h:mm A");
}
