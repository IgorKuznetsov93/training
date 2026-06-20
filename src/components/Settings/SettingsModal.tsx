import { useState } from 'react';
import { useSync } from '../../context/SyncContext';
import './SettingsModal.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { isConfigured, username, syncStatus, syncError, connect, disconnect, refreshSync } =
    useSync();
  const [tokenInput, setTokenInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleConnect = async () => {
    const trimmed = tokenInput.trim();
    if (!trimmed) {
      setLocalError('Введи токен');
      return;
    }

    setIsSubmitting(true);
    setLocalError(null);

    try {
      await connect(trimmed);
      setTokenInput('');
      onClose();
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Ошибка подключения');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setTokenInput('');
    setLocalError(null);
    onClose();
  };

  return (
    <div className="settings-modal" role="dialog" aria-modal="true">
      <div className="settings-modal__backdrop" onClick={onClose} />
      <div className="settings-modal__panel">
        <header className="settings-modal__header">
          <h2>Настройки синхронизации</h2>
          <button type="button" className="settings-modal__close" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </header>

        {isConfigured ? (
          <div className="settings-modal__connected">
            <p className="settings-modal__status settings-modal__status--ok">
              Подключено как <strong>{username}</strong>
            </p>
            <p className="settings-modal__hint">
              Изменения сохраняются в приватный GitHub Gist и синхронизируются между устройствами.
            </p>
            {syncStatus === 'syncing' && (
              <p className="settings-modal__syncing">Синхронизация…</p>
            )}
            {syncError && <p className="settings-modal__error">{syncError}</p>}
            <button
              type="button"
              className="settings-modal__btn settings-modal__btn--primary"
              onClick={() => refreshSync()}
              disabled={syncStatus === 'syncing'}
            >
              {syncStatus === 'syncing' ? 'Обновление…' : 'Обновить с GitHub'}
            </button>
            <button type="button" className="settings-modal__btn settings-modal__btn--danger" onClick={handleDisconnect}>
              Отключить
            </button>
          </div>
        ) : (
          <div className="settings-modal__form">
            <p className="settings-modal__hint">
              Создай Classic token на GitHub с правом <code>gist</code> и вставь сюда. На каждом
              устройстве — тот же токен.
            </p>
            <label className="settings-modal__label">
              GitHub Token
              <input
                type="password"
                className="settings-modal__input"
                value={tokenInput}
                onChange={(event) => setTokenInput(event.target.value)}
                placeholder="ghp_..."
                autoComplete="off"
              />
            </label>
            {localError && <p className="settings-modal__error">{localError}</p>}
            <button
              type="button"
              className="settings-modal__btn settings-modal__btn--primary"
              onClick={handleConnect}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Подключение…' : 'Подключить'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
