package py.mifondo.personal;

import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.ZonedDateTime;

/** Calendar policy only; independent of Android and the device's chosen time zone. */
public final class ReminderCalendar {
    public static final String TIMEZONE = "America/Asuncion";
    public static final ZoneId ZONE = ZoneId.of(TIMEZONE);

    private ReminderCalendar() {}

    public static long dueInMonth(YearMonth month) {
        return month.atDay(7).atTime(8, 0).atZone(ZONE).toInstant().toEpochMilli();
    }

    public static String monthAt(long epochMillis) {
        return YearMonth.from(Instant.ofEpochMilli(epochMillis).atZone(ZONE)).toString();
    }

    /** First future occurrence, excluding any month already delivered. */
    public static long nextDueAfter(long nowMillis, String deliveredMonth) {
        YearMonth month = YearMonth.from(Instant.ofEpochMilli(nowMillis).atZone(ZONE));
        if (dueInMonth(month) <= nowMillis) month = month.plusMonths(1);
        YearMonth delivered = parseMonth(deliveredMonth);
        // A clock rollback must not repeat an already processed month.
        if (delivered != null && !month.isAfter(delivered)) month = delivered.plusMonths(1);
        return dueInMonth(month);
    }

    /** Preserve a deliberate deferral, such as first enabling after 08:00 on day 7. */
    public static long nextScheduledDue(long nowMillis, String deliveredMonth, long previousDue) {
        long next = nextDueAfter(nowMillis, deliveredMonth);
        if (previousDue > nowMillis) {
            long rebased = dueInMonth(YearMonth.parse(monthAt(previousDue)));
            if (rebased > next) next = rebased;
        }
        return next;
    }

    /** Catch-up is allowed only for a previously scheduled occurrence on this day 7. */
    public static boolean isDeliverableToday(long nowMillis, long scheduledDue, String deliveredMonth) {
        if (scheduledDue <= 0 || scheduledDue > nowMillis) return false;
        ZonedDateTime now = Instant.ofEpochMilli(nowMillis).atZone(ZONE);
        YearMonth month = YearMonth.from(now);
        YearMonth delivered = parseMonth(deliveredMonth);
        return now.getDayOfMonth() == 7
                && nowMillis >= dueInMonth(month)
                && month.toString().equals(monthAt(scheduledDue))
                && (delivered == null || month.isAfter(delivered));
    }

    private static YearMonth parseMonth(String value) {
        try { return value == null || value.isEmpty() ? null : YearMonth.parse(value); }
        catch (java.time.DateTimeException ignored) { return null; }
    }
}
