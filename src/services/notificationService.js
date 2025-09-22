// Cross-app notification scheduler scaffold
// Schedules local notifications with relative times

export function scheduleNotifications(date, title, body) {
  try {
    const target = new Date(date).getTime();
    const now = Date.now();
    const offsets = [24*60*60*1000, 6*60*60*1000, 60*60*1000, 0];
    offsets.forEach((offset) => {
      const when = target - offset;
      if (when > now) {
        const delay = when - now;
        setTimeout(() => {
          showNotification(title, body);
        }, delay);
      }
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export function showNotification(title, body) {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((perm) => {
      if (perm === 'granted') new Notification(title, { body });
    });
  }
}


