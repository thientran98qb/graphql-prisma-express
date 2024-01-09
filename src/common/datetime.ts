import { DateTime } from "luxon";

// コード上で時間を扱う時は、DateTime型を使ってください。
// Date型を使う必要がある場合（ex.prismaに渡す）、は必ずconvertDateTimeToDateで変換してください。

/**
 * DBから取得した日付をjstに変換する
 * DBにはUTC日本時間で保存されているため、
 * jstに変換し、+9時間された分を調整する
 * @param date
 * @returns
 */
export const convertDateToDateTime = (date: Date): DateTime =>
  DateTime.fromJSDate(date).minus({ hours: 9 });

/**
 * UNIXタイムスタンプをDateTimeの日付に変換する
 * @param unixTimeStamp
 * @returns
 */
export const convertUnixTimeStampToDateTime = (
  unixTimeStamp: number
): DateTime => DateTime.fromSeconds(unixTimeStamp, { zone: "jst" });

/**
 * DBに保存するためにDate型に変換
 * DBにはUTC日本時間で保存されているため、
 * utcに変換し、-9時間された分を調整する。
 * @param datetime
 * @returns
 */
type convertDateTimeToDateReturnType<T> = T extends DateTime ? Date : undefined;
export const convertDateTimeToDate = <T extends DateTime | null | undefined>(
  datetime: T
): convertDateTimeToDateReturnType<T> =>
  (!datetime
    ? undefined
    : datetime
        .toUTC()
        .plus({ hours: 9 })
        .set({ millisecond: 0 })
        .toJSDate()) as convertDateTimeToDateReturnType<T>;

export const now = () => DateTime.local().setZone("Asia/Tokyo");

export const jsDateNow = () => DateTime.local().plus({ hours: 9 }).toJSDate();

export const calcSubscriptionMinCancellableDatetime = (
  startedAt: DateTime,
  minimumUpdateCount: number
): DateTime => {
  return startedAt.plus({ month: minimumUpdateCount }).startOf("day");
};

export const getNextMonthDatetime = (currentDatetime: DateTime): DateTime => {
  const nextMonthDatetime = currentDatetime.plus({ month: 1 }).endOf("day");
  return nextMonthDatetime;
};
