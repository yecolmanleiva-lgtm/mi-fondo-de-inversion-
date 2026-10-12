package py.mifondo.personal;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public final class ReminderReceiver extends BroadcastReceiver {
    @Override public void onReceive(Context context, Intent intent) {
        if (intent == null) return;
        if (ReminderScheduler.MONTHLY_ACTION.equals(intent.getAction())) {
            ReminderScheduler.deliverMonthly(context, intent.getLongExtra(ReminderScheduler.EXTRA_DUE, 0));
        } else if (ReminderScheduler.TEST_ACTION.equals(intent.getAction())) {
            ReminderScheduler.showTestNotification(context);
        }
    }
}
