import { useEffect, useId, useRef, useState } from 'react';
import { useSync } from '../../context/SyncContext';
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

interface DraftBlockDTO extends WorkoutBlockDTO {
  id: string;
}

interface DraftDayDTO extends Omit<WorkoutDayDTO, 'blocks'> {
  blocks: DraftBlockDTO[];
}

const INTENSITY_LABELS: Record<WorkoutIntensity, string> = {
  heavy: 'Тяжёлая',
  medium: 'Средняя',
  light: 'Лёгкая',
  recovery: 'Восстановление',
  rest: 'Отдых',
};

const INTENSITY_OPTIONS: WorkoutIntensity[] = ['heavy', 'medium', 'light', 'recovery', 'rest'];

function createDraft(workout: WorkoutDayDTO, idPrefix: string): DraftDayDTO {
  return {
    ...workout,
    blocks: workout.blocks.map((block, index) => ({
      ...block,
      id: `${idPrefix}-block-${index}`,
    })),
  };
}

function draftToWorkout(draft: DraftDayDTO): WorkoutDayDTO {
  return {
    ...draft,
    blocks: draft.blocks.map(({ id: _id, ...block }) => block),
  };
}

export function DayDetail({
  workout,
  isSelected,
  canEdit,
  hasOverride,
  isSaving,
  onSave,
  onReset,
}: DayDetailProps) {
  const { setSyncPaused } = useSync();
  const draftIdPrefix = useId();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<DraftDayDTO>(() => createDraft(workout, draftIdPrefix));
  const [saveError, setSaveError] = useState<string | null>(null);
  const editingDateRef = useRef(workout.date);

  useEffect(() => {
    if (!isEditing) {
      setDraft(createDraft(workout, draftIdPrefix));
    }
  }, [workout, isEditing, draftIdPrefix]);

  useEffect(() => {
    if (isEditing && editingDateRef.current !== workout.date) {
      setIsEditing(false);
      setSyncPaused(false);
      editingDateRef.current = workout.date;
    }
  }, [workout.date, isEditing, setSyncPaused]);

  const handleStartEditing = () => {
    editingDateRef.current = workout.date;
    setDraft(createDraft(workout, draftIdPrefix));
    setIsEditing(true);
    setSyncPaused(true);
  };

  const handleBlockChange = (
    blockId: string,
    field: keyof WorkoutBlockDTO,
    value: string,
  ) => {
    setDraft((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) =>
        block.id === blockId
          ? { ...block, [field]: field === 'description' || field === 'title' ? value : value || undefined }
          : block,
      ),
    }));
  };

  const handleAddBlock = () => {
    setDraft((prev) => ({
      ...prev,
      blocks: [
        ...prev.blocks,
        {
          id: `${draftIdPrefix}-block-${Date.now()}`,
          title: 'Новый блок',
          description: '',
        },
      ],
    }));
  };

  const handleRemoveBlock = (blockId: string) => {
    setDraft((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.id !== blockId),
    }));
  };

  const handleStopEditing = () => {
    setIsEditing(false);
    setSyncPaused(false);
  };

  const handleSave = async () => {
    setSaveError(null);
    try {
      await onSave(draftToWorkout(draft));
      handleStopEditing();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Ошибка сохранения');
    }
  };

  const handleReset = async () => {
    setSaveError(null);
    try {
      await onReset(workout.date);
      handleStopEditing();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Ошибка сброса');
    }
  };

  const handleCancel = () => {
    setDraft(createDraft(workout, draftIdPrefix));
    setSaveError(null);
    handleStopEditing();
  };

  return (
    <section className={`day-detail ${isSelected ? 'day-detail--selected' : ''}`}>
      <header className="day-detail__header">
        <div className="day-detail__header-row">
          <h2 className="day-detail__title">{workout.dayLabel}</h2>
          {canEdit && !isEditing && (
            <button type="button" className="day-detail__edit-btn" onClick={handleStartEditing}>
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
            {draft.blocks.map((block) => (
              <article key={block.id} className="day-detail__block day-detail__block--edit">
                <label className="day-detail__field">
                  Название
                  <input
                    className="day-detail__input"
                    value={block.title}
                    onChange={(event) => handleBlockChange(block.id, 'title', event.target.value)}
                  />
                </label>
                <label className="day-detail__field">
                  Время
                  <input
                    className="day-detail__input"
                    value={block.duration ?? ''}
                    onChange={(event) => handleBlockChange(block.id, 'duration', event.target.value)}
                    placeholder="25 мин"
                  />
                </label>
                <label className="day-detail__field">
                  Описание
                  <textarea
                    className="day-detail__textarea"
                    value={block.description}
                    onChange={(event) =>
                      handleBlockChange(block.id, 'description', event.target.value)
                    }
                    rows={3}
                  />
                </label>
                {draft.blocks.length > 1 && (
                  <button
                    type="button"
                    className="day-detail__remove-btn"
                    onClick={() => handleRemoveBlock(block.id)}
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
            <article key={`${workout.date}-${index}`} className="day-detail__block">
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
