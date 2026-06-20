import { useEffect, useState } from 'react';
import type { WorkoutBlockDTO, WorkoutDayDTO, WorkoutIntensity } from '../../types/workout.types';
import { IntensityBadge } from '../IntensityBadge/IntensityBadge';
import './DayDetail.css';

interface DayDetailProps {
  workout: WorkoutDayDTO;
  isSelected: boolean;
  canEdit: boolean;
  hasOverride: boolean;
  isSaving: boolean;
  onSave: (workout: WorkoutDayDTO) => Promise<void>;
  onReset: (dateKey: string) => Promise<void>;
}

const INTENSITY_LABELS: Record<WorkoutIntensity, string> = {
  heavy: 'Тяжёлая',
  medium: 'Средняя',
  light: 'Лёгкая',
  recovery: 'Восстановление',
  rest: 'Отдых',
};

const INTENSITY_OPTIONS: WorkoutIntensity[] = ['heavy', 'medium', 'light', 'recovery', 'rest'];

const EMPTY_BLOCK: WorkoutBlockDTO = {
  title: 'Новый блок',
  description: '',
};

export function DayDetail({
  workout,
  isSelected,
  canEdit,
  hasOverride,
  isSaving,
  onSave,
  onReset,
}: DayDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<WorkoutDayDTO>(workout);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setDraft(workout);
    }
  }, [workout, isEditing]);

  const handleBlockChange = (
    index: number,
    field: keyof WorkoutBlockDTO,
    value: string,
  ) => {
    setDraft((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block, blockIndex) =>
        blockIndex === index ? { ...block, [field]: value || undefined } : block,
      ),
    }));
  };

  const handleAddBlock = () => {
    setDraft((prev) => ({
      ...prev,
      blocks: [...prev.blocks, { ...EMPTY_BLOCK }],
    }));
  };

  const handleRemoveBlock = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((_, blockIndex) => blockIndex !== index),
    }));
  };

  const handleSave = async () => {
    setSaveError(null);
    try {
      await onSave(draft);
      setIsEditing(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Ошибка сохранения');
    }
  };

  const handleReset = async () => {
    setSaveError(null);
    try {
      await onReset(workout.date);
      setIsEditing(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Ошибка сброса');
    }
  };

  const handleCancel = () => {
    setDraft(workout);
    setIsEditing(false);
    setSaveError(null);
  };

  return (
    <section className={`day-detail ${isSelected ? 'day-detail--selected' : ''}`}>
      <header className="day-detail__header">
        <div className="day-detail__header-row">
          <h2 className="day-detail__title">{workout.dayLabel}</h2>
          {canEdit && !isEditing && (
            <button type="button" className="day-detail__edit-btn" onClick={() => setIsEditing(true)}>
              Изменить
            </button>
          )}
        </div>
        {workout.weekLabel && <p className="day-detail__week">{workout.weekLabel}</p>}
        <div className="day-detail__meta">
          <IntensityBadge intensity={isEditing ? draft.intensity : workout.intensity} />
          {(isEditing ? draft.totalDuration : workout.totalDuration) && (
            <span className="day-detail__duration">
              {isEditing ? draft.totalDuration : workout.totalDuration}
            </span>
          )}
          {hasOverride && !isEditing && (
            <span className="day-detail__edited-badge">Изменено</span>
          )}
        </div>
      </header>

      {isEditing ? (
        <div className="day-detail__editor">
          <label className="day-detail__field">
            Интенсивность
            <select
              className="day-detail__select"
              value={draft.intensity}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  intensity: event.target.value as WorkoutIntensity,
                }))
              }
            >
              {INTENSITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {INTENSITY_LABELS[option]}
                </option>
              ))}
            </select>
          </label>

          <label className="day-detail__field">
            Длительность
            <input
              className="day-detail__input"
              value={draft.totalDuration ?? ''}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, totalDuration: event.target.value || undefined }))
              }
              placeholder="2.5 ч"
            />
          </label>

          <div className="day-detail__blocks-editor">
            {draft.blocks.map((block, index) => (
              <article key={`${block.title}-${index}`} className="day-detail__block day-detail__block--edit">
                <label className="day-detail__field">
                  Название
                  <input
                    className="day-detail__input"
                    value={block.title}
                    onChange={(event) => handleBlockChange(index, 'title', event.target.value)}
                  />
                </label>
                <label className="day-detail__field">
                  Время
                  <input
                    className="day-detail__input"
                    value={block.duration ?? ''}
                    onChange={(event) => handleBlockChange(index, 'duration', event.target.value)}
                    placeholder="25 мин"
                  />
                </label>
                <label className="day-detail__field">
                  Описание
                  <textarea
                    className="day-detail__textarea"
                    value={block.description}
                    onChange={(event) => handleBlockChange(index, 'description', event.target.value)}
                    rows={3}
                  />
                </label>
                {draft.blocks.length > 1 && (
                  <button
                    type="button"
                    className="day-detail__remove-btn"
                    onClick={() => handleRemoveBlock(index)}
                  >
                    Удалить блок
                  </button>
                )}
              </article>
            ))}
          </div>

          <button type="button" className="day-detail__add-btn" onClick={handleAddBlock}>
            + Добавить блок
          </button>

          {saveError && <p className="day-detail__error">{saveError}</p>}

          <div className="day-detail__actions">
            <button
              type="button"
              className="day-detail__action-btn day-detail__action-btn--primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Сохранение…' : 'Сохранить'}
            </button>
            <button type="button" className="day-detail__action-btn" onClick={handleCancel} disabled={isSaving}>
              Отмена
            </button>
            {hasOverride && (
              <button
                type="button"
                className="day-detail__action-btn day-detail__action-btn--ghost"
                onClick={handleReset}
                disabled={isSaving}
              >
                Сбросить к плану
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="day-detail__blocks">
          {workout.blocks.map((block, index) => (
            <article key={`${block.title}-${index}`} className="day-detail__block">
              <div className="day-detail__block-header">
                <h3 className="day-detail__block-title">{block.title}</h3>
                {block.duration && (
                  <span className="day-detail__block-duration">{block.duration}</span>
                )}
              </div>
              <p className="day-detail__block-text">{block.description}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
