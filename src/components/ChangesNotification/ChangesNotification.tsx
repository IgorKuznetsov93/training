import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useSync } from '../../context/SyncContext';
import './ChangesNotification.css';

export function ChangesNotification() {
  const { remoteChanges, dismissRemoteChanges } = useSync();

  if (!remoteChanges) {
    return null;
  }

  const formatDateLabel = (dateKey: string): string => {
    try {
      return format(parseISO(dateKey), 'd MMMM (EEEE)', { locale: ru });
    } catch {
      return dateKey;
    }
  };

  return (
    <div
      className="changes-notification"
      role="dialog"
      aria-modal="true"
      onClick={dismissRemoteChanges}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          dismissRemoteChanges();
        }
      }}
    >
      <div className="changes-notification__card">
        <h2 className="changes-notification__title">Есть новые изменения</h2>
        <p className="changes-notification__subtitle">
          План обновился на другом устройстве. Изменены дни:
        </p>
        <ul className="changes-notification__list">
          {remoteChanges.changedDates.map((dateKey) => (
            <li key={dateKey}>{formatDateLabel(dateKey)}</li>
          ))}
        </ul>
        <p className="changes-notification__hint">Нажми, чтобы применить и закрыть</p>
      </div>
    </div>
  );
}
