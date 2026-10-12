package py.mifondo.personal;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.TimeZone;

/** Dependency-free checks; also invoked by the JUnit wrapper. */
public final class ReminderCalendarChecks {
    private static int checked;
    private ReminderCalendarChecks() {}

    public static void main(String[] args) {
        runAll();
        System.out.println("Reminder calendar: " + checked + " checks passed.");
    }

    public static void runAll() {
        checked = 0;
        long october = due("2026-10");
        long november = due("2026-11");
        equal(october, ReminderCalendar.nextDueAfter(at("2026-10-01T09:00:00"), ""), "before day 7");
        equal(october, ReminderCalendar.nextDueAfter(at("2026-10-07T07:59:59"), ""), "one second before");
        equal(november, ReminderCalendar.nextDueAfter(october, ""), "enable exactly at 08:00 starts next month");
        equal(november, ReminderCalendar.nextDueAfter(at("2026-10-07T08:00:01"), ""), "enable after 08:00");
        equal(november, ReminderCalendar.nextDueAfter(at("2026-10-08T06:00:00"), ""), "after day 7");
        equal(due("2027-01"), ReminderCalendar.nextDueAfter(at("2026-12-31T23:59:00"), ""), "year rollover");
        equal(due("2028-03"), ReminderCalendar.nextDueAfter(at("2028-02-29T12:00:00"), ""), "leap year");
        equal(november, ReminderCalendar.nextDueAfter(at("2026-10-01T09:00:00"), "2026-10"), "delivered-month dedup");
        equal(due("2027-01"), ReminderCalendar.nextDueAfter(at("2026-10-01T09:00:00"), "2026-12"), "clock rollback");
        equal(october, ReminderCalendar.nextDueAfter(at("2026-10-01T09:00:00"), "invalid"), "bad stored month recovers");
        truth(ReminderCalendar.isDeliverableToday(at("2026-10-07T08:01:00"), october, ""), "same-day boot catch-up");
        truth(ReminderCalendar.isDeliverableToday(at("2026-10-07T23:59:59"), october, "2026-09"), "last-second catch-up");
        falsity(ReminderCalendar.isDeliverableToday(at("2026-10-08T00:00:00"), october, ""), "next-day catch-up forbidden");
        falsity(ReminderCalendar.isDeliverableToday(at("2026-10-07T07:59:59"), october, ""), "early delivery forbidden");
        falsity(ReminderCalendar.isDeliverableToday(at("2026-10-07T09:00:00"), november, ""), "enable-late then reboot");
        falsity(ReminderCalendar.isDeliverableToday(at("2026-10-07T09:00:00"), october, "2026-10"), "duplicate broadcast");
        falsity(ReminderCalendar.isDeliverableToday(at("2026-10-07T09:00:00"), due("2026-09"), ""), "stale previous month");
        falsity(ReminderCalendar.isDeliverableToday(at("2026-10-07T09:00:00"), 0, ""), "no previously scheduled due");
        equal(november, ReminderCalendar.nextScheduledDue(at("2026-10-07T07:00:00"), "", november), "preserve deliberate deferral");
        equal(november, ReminderCalendar.nextScheduledDue(at("2026-10-08T09:00:00"), "", october), "missed day advances");
        TimeZone saved = TimeZone.getDefault();
        try {
            TimeZone.setDefault(TimeZone.getTimeZone("Asia/Tokyo"));
            equal(october, ReminderCalendar.nextDueAfter(at("2026-10-01T09:00:00"), ""), "device zone ignored");
        } finally {
            TimeZone.setDefault(saved);
        }
    }

    private static long due(String month) { return ReminderCalendar.dueInMonth(YearMonth.parse(month)); }
    private static long at(String local) {
        return LocalDateTime.parse(local).atZone(ReminderCalendar.ZONE).toInstant().toEpochMilli();
    }
    private static void equal(long expected, long actual, String scenario) {
        checked++;
        if (expected != actual) throw new AssertionError(scenario + ": expected " + expected + ", got " + actual);
    }
    private static void truth(boolean actual, String scenario) {
        checked++;
        if (!actual) throw new AssertionError(scenario);
    }
    private static void falsity(boolean actual, String scenario) { truth(!actual, scenario); }
}
