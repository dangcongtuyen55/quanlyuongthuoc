import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Schedule, Medication } from '../types';

// Cấu hình cách thông báo hiển thị khi app đang mở trên màn hình (Foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NOTIFICATION_CHANNEL_ID = 'medication-reminder';
export const CATEGORY_MEDICATION_ACTION = 'medication-actions';
export const ACTION_TAKE = 'TAKE_ACTION';
export const ACTION_SNOOZE = 'SNOOZE_ACTION';

/**
 * Khởi tạo kênh thông báo (Notification Channel) và các nút hành động cho Android
 * Phải chạy hàm này sớm khi mở app để Android biết cách rung và phát chuông
 */
export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS === 'android') {
    // 1. Kênh thông báo ưu tiên cao để chuông kêu to và nổi trên màn hình
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: 'Nhắc uống thuốc',
      description: 'Thông báo nhắc nhở đến giờ uống thuốc hàng ngày',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 250, 500],
      lightColor: '#003C90',
      sound: 'default',
      enableLights: true,
      enableVibrate: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: false,
    });
  }

  // 2. Định nghĩa 2 nút bấm nhanh trực tiếp trên thông báo: "Đã uống" và "Nhắc lại sau 15p"
  await Notifications.setNotificationCategoryAsync(CATEGORY_MEDICATION_ACTION, [
    {
      identifier: ACTION_TAKE,
      buttonTitle: '✓ Đã uống',
      options: {
        opensAppToForeground: false,
      },
    },
    {
      identifier: ACTION_SNOOZE,
      buttonTitle: '⏰ Nhắc lại sau 15 phút',
      options: {
        opensAppToForeground: false,
      },
    },
  ]);
}

/**
 * Kiểm tra và xin quyền thông báo từ hệ thống
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });

  return (
    requested.granted || requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

/**
 * Đặt lịch nhắc uống thuốc cục bộ (Local Notification)
 * Mỗi khung giờ của thuốc sẽ là một thông báo lặp lại hàng ngày / theo thứ
 */
export async function scheduleMedicationReminder(
  schedule: Schedule,
  medication: Medication
): Promise<string> {
  const [hourStr, minuteStr] = schedule.time_of_day.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const identifier = `med_${medication.id}_sched_${schedule.id}`;

  // Tiêu đề & nội dung thân thiện, dễ đọc
  const title = `Đến giờ uống thuốc (${schedule.time_of_day})`;
  const body = `${medication.name} - ${medication.dosage || '1 liều'}${
    medication.notes ? ` (${medication.notes})` : ''
  }`;

  // Đặt thông báo lặp hàng ngày vào đúng khung giờ
  await Notifications.scheduleNotificationAsync({
    identifier,
    content: {
      title,
      body,
      sound: 'default',
      categoryIdentifier: CATEGORY_MEDICATION_ACTION,
      data: {
        medicationId: medication.id,
        scheduleId: schedule.id,
        scheduledTime: schedule.time_of_day,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: NOTIFICATION_CHANNEL_ID,
    },
  });

  return identifier;
}

/**
 * Huỷ một lịch nhắc cụ thể
 */
export async function cancelMedicationReminder(scheduleId: string, medicationId: string): Promise<void> {
  const identifier = `med_${medicationId}_sched_${scheduleId}`;
  await Notifications.cancelScheduledNotificationAsync(identifier);
}

/**
 * Huỷ tất cả thông báo của ứng dụng
 */
export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Đặt nhắc lại sau 15 phút (khi người dùng bấm Hoãn / Snooze)
 */
export async function scheduleSnoozeReminder(
  medicationName: string,
  dosage: string,
  data: Record<string, any>
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Nhắc lại: Giờ uống thuốc!',
      body: `${medicationName} - ${dosage}`,
      sound: 'default',
      categoryIdentifier: CATEGORY_MEDICATION_ACTION,
      data,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 15 * 60, // 15 phút
      channelId: NOTIFICATION_CHANNEL_ID,
    },
  });
}

/**
 * Đặt lại toàn bộ thông báo từ danh sách lịch uống (rescheduleAll)
 * Chạy khi: mở app, đăng nhập, hoặc sau khi thêm/sửa/xoá thuốc
 * Quy trình: Huỷ hết thông báo cũ -> Quét các lịch đang bật -> Đặt lại
 * Giúp app không bao giờ bị thông báo ma hoặc thông báo bị lặp trùng
 */
export async function rescheduleAllReminders(
  schedules: Schedule[]
): Promise<number> {
  // 1. Huỷ toàn bộ thông báo cũ
  await cancelAllReminders();

  let count = 0;
  // 2. Duyệt qua từng lịch uống hợp lệ để đặt lại
  for (const schedule of schedules) {
    if (schedule.enabled && schedule.medication && schedule.medication.is_active) {
      try {
        await scheduleMedicationReminder(schedule, schedule.medication);
        count++;
      } catch {
        // Tiếp tục nếu 1 thông báo gặp sự cố
      }
    }
  }

  return count;
}

