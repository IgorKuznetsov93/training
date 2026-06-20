import type { DayOfWeekKey, WeekPlanDTO, WorkoutTemplateDTO } from '../types/workout.types';

const WEEK_LABELS: Record<number, string> = {
  1: 'Неделя 1 — ТЯЖЕЛАЯ',
  2: 'Неделя 2 — ЛЕГКАЯ',
  3: 'Неделя 3 — ТЯЖЕЛАЯ',
  4: 'Неделя 4 — ВОССТАНОВИТЕЛЬНАЯ',
  5: 'Неделя 5 — ТЯЖЕЛАЯ',
  6: 'Неделя 6 — ЛЕГКАЯ',
  7: 'Неделя 7 — ТЯЖЕЛАЯ',
  8: 'Неделя 8 — ВОССТАНОВИТЕЛЬНАЯ',
  9: 'Неделя 9 — ТЯЖЕЛАЯ',
  10: 'Неделя 10 — ЛЕГКАЯ',
  11: 'Неделя 11 — ТЯЖЕЛАЯ',
  12: 'Неделя 12 — ВОССТАНОВИТЕЛЬНАЯ',
  13: 'Неделя 13 — ТЯЖЕЛАЯ',
  14: 'Неделя 14 — ЛЕГКАЯ',
  15: 'Неделя 15 — ТЯЖЕЛАЯ',
  16: 'Неделя 16 — ВОССТАНОВИТЕЛЬНАЯ',
};

const week6: WeekPlanDTO = {
  mon: {
    weekLabel: WEEK_LABELS[6],
    dayLabel: 'Понедельник',
    intensity: 'light',
    blocks: [
      {
        title: 'Боулдеры с закрытыми глазами',
        description:
          '5 боулдеров 5С. Начинаешь с 10 сек с открытыми глазами, потом закрываешь и проходишь трассу.',
      },
    ],
  },
  wed: {
    weekLabel: WEEK_LABELS[6],
    dayLabel: 'Среда',
    intensity: 'light',
    totalDuration: '1 ч',
    blocks: [
      {
        title: 'Интеллектуальное лазание',
        duration: '60 мин',
        description:
          'Рисуешь трассу в блокноте, потом лезешь и сверяешь с тем, что нарисовал.',
      },
    ],
  },
  fri: {
    weekLabel: WEEK_LABELS[6],
    dayLabel: 'Пятница',
    intensity: 'light',
    blocks: [
      {
        title: 'Йога + работа над пятками',
        description: 'Йога и лёгкая работа над техникой постановки пяток.',
      },
    ],
  },
  sun: {
    weekLabel: WEEK_LABELS[6],
    dayLabel: 'Воскресенье',
    intensity: 'rest',
    isRestDay: true,
    blocks: [
      {
        title: 'Отдых',
        description: 'Полный отдых.',
      },
    ],
  },
};

const week2: WeekPlanDTO = {
  mon: {
    weekLabel: WEEK_LABELS[2],
    dayLabel: 'Понедельник',
    intensity: 'light',
    blocks: [
      {
        title: 'Разминка',
        description: 'Стандартная разминка перед лазанием.',
      },
      {
        title: 'Боулдеры на технику',
        description:
          '10 боулдеров 5B–5C на идеальную технику. Отдых между ними 3 минуты — анализируешь каждое движение.',
      },
    ],
  },
  wed: {
    weekLabel: WEEK_LABELS[2],
    dayLabel: 'Среда',
    intensity: 'light',
    totalDuration: '1 ч 40 мин',
    blocks: [
      {
        title: 'Чтение трасс',
        duration: '30 мин',
        description: 'Смотришь на новые трассы, рисуешь их в голове.',
      },
      {
        title: 'Лазание',
        duration: '30 мин',
        description: 'Проходишь трассы, которые изучил.',
      },
      {
        title: 'Растяжка',
        duration: '40 мин',
        description: 'Полная растяжка после тренировки.',
      },
    ],
  },
  fri: {
    weekLabel: WEEK_LABELS[2],
    dayLabel: 'Пятница',
    intensity: 'light',
    blocks: [
      {
        title: 'Лёгкий траверс',
        duration: '20 мин',
        description: 'Спокойный траверс без нагрузки.',
      },
      {
        title: 'Йога на спину',
        description: 'Йога с акцентом на мышцы спины.',
      },
    ],
  },
  sun: {
    weekLabel: WEEK_LABELS[2],
    dayLabel: 'Воскресенье',
    intensity: 'rest',
    isRestDay: true,
    blocks: [
      {
        title: 'Отдых',
        description: 'Полный отдых. Только массаж валиком дома.',
      },
    ],
  },
};

const week8RecoveryDay: WorkoutTemplateDTO = {
  weekLabel: WEEK_LABELS[8],
  dayLabel: '',
  intensity: 'recovery',
  totalDuration: 'до 30 мин',
  blocks: [
    {
      title: 'Восстановительная неделя',
      description:
        'Суперкомпенсация перед скалами. Делаешь только то, что приносит удовольствие и не нагружает руки.',
    },
    {
      title: 'Лёгкое лазание',
      duration: 'до 30 мин',
      description: 'Лазание — максимум 30 мин за тренировку. Лёгкий режим, без проектов и максимальных нагрузок.',
    },
  ],
};

export const WEEK_PLANS: Record<number, WeekPlanDTO> = {
  1: {
    mon: {
      weekLabel: WEEK_LABELS[1],
      dayLabel: 'Понедельник',
      intensity: 'heavy',
      totalDuration: '2.5 ч',
      blocks: [
        {
          title: 'Разминка',
          duration: '25 мин',
          description: '5 мин бег + суставная гимнастика + 15 мин лазание вертикали.',
        },
        {
          title: 'Основной блок',
          duration: '80 мин',
          description:
            'Выбери 8 боулдеров уровня 6А. Пройди каждый по 3 раза подряд без отдыха между повторами. Отдых между боулдерами — 2 минуты.',
        },
        {
          title: 'Кор',
          duration: '15 мин',
          description: 'Планка 3×1 мин, боковая планка 3×45 сек, подъём ног в висе 3×10 раз.',
        },
        {
          title: 'Заминка',
          duration: '10 мин',
          description: 'Растяжка пальцев, бицепса, бедра.',
        },
      ],
    },
    wed: {
      weekLabel: WEEK_LABELS[1],
      dayLabel: 'Среда',
      intensity: 'medium',
      totalDuration: '2 ч',
      blocks: [
        {
          title: 'Разминка',
          duration: '20 мин',
          description: 'Стандартная разминка перед лазанием.',
        },
        {
          title: 'Техника ног',
          duration: '60 мин',
          description:
            'Пройди 10 трасс 5С–6А с одной попытки. Главное правило — тишина. Если нога стукнула зацепку — перелезай заново.',
        },
        {
          title: 'Траверс',
          duration: '25 мин',
          description: 'Траверс по вертикальной стене без остановок, касаясь ногами каждой зацепки.',
        },
        {
          title: 'Заминка',
          duration: '15 мин',
          description: 'Растяжка и восстановление.',
        },
      ],
    },
    fri: {
      weekLabel: WEEK_LABELS[1],
      dayLabel: 'Пятница',
      intensity: 'heavy',
      totalDuration: '2.5 ч',
      blocks: [
        {
          title: 'Разминка',
          duration: '20 мин',
          description: 'Стандартная разминка перед лазанием.',
        },
        {
          title: 'Выносливость на топ-ропе',
          duration: '70 мин',
          description: '4 подхода по 30 движений на трассе 6А+. Отдых между подходами 5 минут.',
        },
        {
          title: 'Добивка на турнике',
          duration: '20 мин',
          description: 'Подтягивания широким хватом 5×5.',
        },
        {
          title: 'Заминка',
          duration: '10 мин',
          description: 'Растяжка и восстановление.',
        },
      ],
    },
    sun: {
      weekLabel: WEEK_LABELS[1],
      dayLabel: 'Воскресенье',
      intensity: 'light',
      totalDuration: '1.5 ч',
      blocks: [
        {
          title: 'Лёгкое лазание',
          duration: '30 мин',
          description: 'Легкое лазание на вертикали.',
        },
        {
          title: 'Растяжка',
          duration: '40 мин',
          description: 'Растяжка, особенно приводящие и грудные.',
        },
        {
          title: 'Вис на турнике',
          duration: '15 мин',
          description: 'Вис на турнике на расслабление.',
        },
      ],
    },
  },
  2: week2,
  3: {
    mon: {
      weekLabel: WEEK_LABELS[3],
      dayLabel: 'Понедельник',
      intensity: 'heavy',
      totalDuration: '2.5 ч',
      blocks: [
        {
          title: 'Разминка',
          duration: '25 мин',
          description: 'Обязательно разогреть пальцы на больших зацепках.',
        },
        {
          title: 'Мунборд',
          duration: '60 мин',
          description:
            'Только трассы уровня 6А–6А+. Выбери 4 трассы, пройди каждую по 2 раза. Отдых 3 минуты.',
        },
        {
          title: 'Фингерборд',
          description:
            '4 подхода виса на 15 секунд на хорошей зацепке (25 мм). Отдых 2 мин.',
        },
        {
          title: 'Заминка',
          duration: '15 мин',
          description: 'Растяжка и восстановление.',
        },
      ],
    },
    wed: {
      weekLabel: WEEK_LABELS[3],
      dayLabel: 'Среда',
      intensity: 'medium',
      blocks: [
        {
          title: 'Объём без мунборда',
          description: '15 боулдеров 6А. Отдых между подходами 1 мин.',
        },
      ],
    },
    fri: {
      weekLabel: WEEK_LABELS[3],
      dayLabel: 'Пятница',
      intensity: 'heavy',
      blocks: [
        {
          title: 'Подтягивания',
          description: '5×5 без веса.',
        },
        {
          title: 'Выносливость',
          description: '5 подходов по 20 движений на выносливость (6В).',
        },
      ],
    },
    sun: {
      weekLabel: WEEK_LABELS[3],
      dayLabel: 'Воскресенье',
      intensity: 'light',
      blocks: [
        {
          title: 'Лёгкая растяжка и траверс',
          duration: '20 мин',
          description: 'Спокойная растяжка и лёгкий траверс.',
        },
      ],
    },
  },
  4: {
    mon: {
      weekLabel: WEEK_LABELS[4],
      dayLabel: 'Понедельник',
      intensity: 'recovery',
      blocks: [
        {
          title: 'Разминка',
          description: 'Лёгкая разминка.',
        },
        {
          title: 'Траверс',
          duration: '20 мин',
          description: 'Спокойный траверс.',
        },
        {
          title: 'Растяжка',
          duration: '40 мин',
          description: 'Полная растяжка.',
        },
      ],
    },
    wed: {
      weekLabel: WEEK_LABELS[4],
      dayLabel: 'Среда',
      intensity: 'recovery',
      blocks: [
        {
          title: 'Кардио',
          duration: '30 мин',
          description: 'Кардио на автоматах.',
        },
        {
          title: 'Планка',
          description: '3 подхода планки.',
        },
      ],
    },
    fri: {
      weekLabel: WEEK_LABELS[4],
      dayLabel: 'Пятница',
      intensity: 'recovery',
      totalDuration: '1 ч',
      blocks: [
        {
          title: 'Йога',
          duration: '1 ч',
          description: 'Йога на восстановление.',
        },
      ],
    },
    sun: {
      weekLabel: WEEK_LABELS[4],
      dayLabel: 'Воскресенье',
      intensity: 'rest',
      isRestDay: true,
      blocks: [
        {
          title: 'Прогулка',
          description: 'Гуляй на улице.',
        },
      ],
    },
  },
  5: {
    mon: {
      weekLabel: WEEK_LABELS[5],
      dayLabel: 'Понедельник',
      intensity: 'heavy',
      totalDuration: '2.5 ч',
      blocks: [
        {
          title: 'Разминка',
          duration: '25 мин',
          description: 'Стандартная разминка.',
        },
        {
          title: 'Фингерборд',
          description:
            '5 подходов виса на 18 мм на максимум (до срыва, 7–10 сек). Отдых 3 минуты. Это тяжелейшее упражнение.',
        },
        {
          title: 'Мунборд',
          duration: '60 мин',
          description:
            'Проекты. Даёшь 3 попытки на одну трассу. Не пролез — переходишь к другой.',
        },
        {
          title: 'Заминка',
          duration: '15 мин',
          description: 'Растяжка и восстановление.',
        },
      ],
    },
    wed: {
      weekLabel: WEEK_LABELS[5],
      dayLabel: 'Среда',
      intensity: 'medium',
      blocks: [
        {
          title: 'Боулдеры на выносливость',
          description: '6 боулдеров 6B+ на выносливость. Каждый по 2 раза подряд.',
        },
      ],
    },
    fri: {
      weekLabel: WEEK_LABELS[5],
      dayLabel: 'Пятница',
      intensity: 'heavy',
      blocks: [
        {
          title: 'Силовая выносливость',
          description:
            'Связка из 2 трасс 6В+ без отдыха между ними. 6 связок за тренировку. Отдых между связками — 4 мин.',
        },
      ],
    },
    sun: {
      weekLabel: WEEK_LABELS[5],
      dayLabel: 'Воскресенье',
      intensity: 'light',
      blocks: [
        {
          title: 'Вертикаль и растяжка',
          description: 'Только вертикаль и растяжка.',
        },
      ],
    },
  },
  6: week6,
  7: {
    mon: {
      weekLabel: WEEK_LABELS[7],
      dayLabel: 'Понедельник',
      intensity: 'heavy',
      blocks: [
        {
          title: 'Фингерборд',
          description: '4 подхода на 18 мм, не до отказа — 80% усилия.',
        },
        {
          title: 'Мунборд',
          description: '5 попыток на проект. Отдых 5 минут.',
        },
      ],
    },
    wed: {
      weekLabel: WEEK_LABELS[7],
      dayLabel: 'Среда',
      intensity: 'medium',
      blocks: [
        {
          title: 'Техника в нависании',
          description: '6В, акцент на диагональные шаги.',
        },
      ],
    },
    fri: {
      weekLabel: WEEK_LABELS[7],
      dayLabel: 'Пятница',
      intensity: 'heavy',
      blocks: [
        {
          title: '4×4',
          description: '4 связки по 4 боулдера подряд на уровне 6В+.',
        },
      ],
    },
    sun: {
      weekLabel: WEEK_LABELS[7],
      dayLabel: 'Воскресенье',
      intensity: 'recovery',
      blocks: [
        {
          title: 'Восстановление',
          description: 'МФР (миофascial release) — работа с валиком и мячом.',
        },
      ],
    },
  },
  8: {
    mon: { ...week8RecoveryDay, dayLabel: 'Понедельник' },
    wed: { ...week8RecoveryDay, dayLabel: 'Среда' },
    fri: { ...week8RecoveryDay, dayLabel: 'Пятница' },
    sun: { ...week8RecoveryDay, dayLabel: 'Воскресенье' },
  },
  9: {
    mon: {
      weekLabel: WEEK_LABELS[9],
      dayLabel: 'Понедельник',
      intensity: 'heavy',
      blocks: [
        {
          title: 'Фингерборд',
          description: 'Максимальные висы на фингерборде.',
        },
        {
          title: 'Мунборд',
          description: '7А+ проекты, 3 попытки на трассу.',
        },
      ],
    },
    wed: {
      weekLabel: WEEK_LABELS[9],
      dayLabel: 'Среда',
      intensity: 'medium',
      blocks: [
        {
          title: 'Техника ног',
          description: 'Отработка техники постановки ног.',
        },
        {
          title: 'Флэши 6В',
          description: 'Прохождение трасс 6В на скорость.',
        },
      ],
    },
    fri: {
      weekLabel: WEEK_LABELS[9],
      dayLabel: 'Пятница',
      intensity: 'heavy',
      blocks: [
        {
          title: 'Объём',
          description: '10 трасс 6С. Отдых 30 сек.',
        },
      ],
    },
    sun: {
      weekLabel: WEEK_LABELS[9],
      dayLabel: 'Воскресенье',
      intensity: 'light',
      blocks: [
        {
          title: 'Растяжка',
          description: 'Полная растяжка.',
        },
        {
          title: 'Бег',
          duration: '30 мин',
          description: 'Лёгкий бег.',
        },
      ],
    },
  },
  10: {
    mon: { ...week6.mon!, weekLabel: WEEK_LABELS[10] },
    wed: { ...week6.wed!, weekLabel: WEEK_LABELS[10] },
    fri: { ...week6.fri!, weekLabel: WEEK_LABELS[10] },
    sun: { ...week6.sun!, weekLabel: WEEK_LABELS[10] },
  },
  11: {
    mon: {
      weekLabel: WEEK_LABELS[11],
      dayLabel: 'Понедельник',
      intensity: 'heavy',
      blocks: [
        {
          title: 'Разминка',
          description: 'Стандартная разминка.',
        },
        {
          title: 'Мунборд',
          description: 'Никаких проектов! Только знакомые трассы.',
        },
      ],
    },
    wed: {
      weekLabel: WEEK_LABELS[11],
      dayLabel: 'Среда',
      intensity: 'recovery',
      blocks: [
        {
          title: 'Лёгкая растяжка и массаж',
          description: 'Растяжка и массаж валиком.',
        },
      ],
    },
  },
  12: {
    mon: {
      weekLabel: WEEK_LABELS[12],
      dayLabel: 'Понедельник',
      intensity: 'rest',
      isRestDay: true,
      blocks: [{ title: 'Отдых', description: 'Отдых, сон, еда.' }],
    },
    tue: {
      weekLabel: WEEK_LABELS[12],
      dayLabel: 'Вторник',
      intensity: 'rest',
      isRestDay: true,
      blocks: [{ title: 'Отдых', description: 'Отдых, сон, еда.' }],
    },
    wed: {
      weekLabel: WEEK_LABELS[12],
      dayLabel: 'Среда',
      intensity: 'rest',
      isRestDay: true,
      blocks: [{ title: 'Отдых', description: 'Отдых, сон, еда.' }],
    },
    thu: {
      weekLabel: WEEK_LABELS[12],
      dayLabel: 'Четверг',
      intensity: 'recovery',
      blocks: [{ title: 'Лёгкая йога', description: 'Спокойная йога на восстановление.' }],
    },
    fri: {
      weekLabel: WEEK_LABELS[12],
      dayLabel: 'Пятница',
      intensity: 'rest',
      isRestDay: true,
      blocks: [{ title: 'Прогулка', description: 'Прогулка на свежем воздухе.' }],
    },
    sat: {
      weekLabel: WEEK_LABELS[12],
      dayLabel: 'Суббота',
      intensity: 'rest',
      isRestDay: true,
      blocks: [{ title: 'Прогулка', description: 'Прогулка на свежем воздухе.' }],
    },
    sun: {
      weekLabel: WEEK_LABELS[12],
      dayLabel: 'Воскресенье',
      intensity: 'rest',
      isRestDay: true,
      blocks: [{ title: 'Прогулка', description: 'Прогулка на свежем воздухе.' }],
    },
  },
  13: {
    mon: {
      weekLabel: WEEK_LABELS[13],
      dayLabel: 'Понедельник',
      intensity: 'heavy',
      blocks: [
        {
          title: 'Объём',
          description: '15 боулдеров 6А.',
        },
      ],
    },
    wed: {
      weekLabel: WEEK_LABELS[13],
      dayLabel: 'Среда',
      intensity: 'medium',
      blocks: [
        {
          title: 'Техника ног + чтение',
          description: 'Отработка техники ног и чтение трасс.',
        },
      ],
    },
    fri: {
      weekLabel: WEEK_LABELS[13],
      dayLabel: 'Пятница',
      intensity: 'heavy',
      blocks: [
        {
          title: 'Выносливость на топ-ропе',
          description: '4 подхода на выносливость.',
        },
      ],
    },
    sun: {
      weekLabel: WEEK_LABELS[13],
      dayLabel: 'Воскресенье',
      intensity: 'light',
      blocks: [{ title: 'Растяжка', description: 'Полная растяжка.' }],
    },
  },
  14: {
    mon: { ...week2.mon!, weekLabel: WEEK_LABELS[14] },
    wed: { ...week2.wed!, weekLabel: WEEK_LABELS[14] },
    fri: { ...week6.fri!, weekLabel: WEEK_LABELS[14] },
    sun: { ...week6.sun!, weekLabel: WEEK_LABELS[14] },
  },
  15: {
    mon: {
      weekLabel: WEEK_LABELS[15],
      dayLabel: 'Понедельник',
      intensity: 'heavy',
      blocks: [
        {
          title: 'Фингерборд',
          description: '70% от максимума, вис 10 сек.',
        },
        {
          title: 'Мунборд',
          description: 'Лёгкие проекты — для удовольствия.',
        },
      ],
    },
    wed: {
      weekLabel: WEEK_LABELS[15],
      dayLabel: 'Среда',
      intensity: 'heavy',
      blocks: [
        {
          title: 'Объём на 6В+',
          description: '8 трасс 6В+.',
        },
      ],
    },
    fri: {
      weekLabel: WEEK_LABELS[15],
      dayLabel: 'Пятница',
      intensity: 'heavy',
      blocks: [
        {
          title: 'Силовая выносливость',
          description: 'Связки 6В.',
        },
      ],
    },
    sun: {
      weekLabel: WEEK_LABELS[15],
      dayLabel: 'Воскресенье',
      intensity: 'light',
      blocks: [{ title: 'Лёгкая вертикаль', description: 'Спокойное лазание на вертикали.' }],
    },
  },
  16: {
    mon: {
      weekLabel: WEEK_LABELS[16],
      dayLabel: 'Понедельник',
      intensity: 'recovery',
      blocks: [
        {
          title: 'Разминка',
          duration: '20 мин',
          description: 'Лёгкая разминка.',
        },
        {
          title: 'Боулдеры',
          description: '5 боулдеров 6А.',
        },
      ],
    },
    wed: {
      weekLabel: WEEK_LABELS[16],
      dayLabel: 'Среда',
      intensity: 'recovery',
      blocks: [
        {
          title: 'Растяжка',
          duration: '30 мин',
          description: 'Лёгкая растяжка.',
        },
        {
          title: 'Массаж валиком',
          description: 'МФР дома.',
        },
      ],
    },
    thu: {
      weekLabel: WEEK_LABELS[16],
      dayLabel: 'Четверг',
      intensity: 'recovery',
      blocks: [
        {
          title: 'Кардио',
          duration: '30 мин',
          description: 'Кардио с пульсом 120.',
        },
      ],
    },
    fri: {
      weekLabel: WEEK_LABELS[16],
      dayLabel: 'Пятница',
      intensity: 'rest',
      isRestDay: true,
      blocks: [{ title: 'Отдых', description: 'День отдыха.' }],
    },
    sat: {
      weekLabel: WEEK_LABELS[16],
      dayLabel: 'Суббота',
      intensity: 'heavy',
      blocks: [{ title: 'Боулдерфест', description: 'Боулдерфест!' }],
    },
  },
};

export const SPECIAL_DAYS: Record<string, WorkoutTemplateDTO> = {
  '2026-08-15': {
    weekLabel: WEEK_LABELS[11],
    dayLabel: 'Суббота',
    intensity: 'heavy',
    blocks: [
      {
        title: 'Фестиваль на скалах',
        description: 'Первый день фестиваля на скалах.',
      },
    ],
  },
  '2026-08-16': {
    weekLabel: WEEK_LABELS[11],
    dayLabel: 'Воскресенье',
    intensity: 'heavy',
    blocks: [
      {
        title: 'Фестиваль на скалах',
        description: 'Второй день фестиваля на скалах.',
      },
    ],
  },
  '2026-08-17': {
    weekLabel: WEEK_LABELS[11],
    dayLabel: 'Понедельник',
    intensity: 'light',
    blocks: [
      {
        title: 'Восстановление',
        description: 'Если есть силы — лёгкая растяжка. Если нет — просто сон.',
      },
    ],
  },
};

export const DAY_KEY_BY_INDEX: Record<number, DayOfWeekKey> = {
  0: 'sun',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
};

export const PROGRAM_WEEKS = 16;

export function getWeekLabel(weekNumber: number): string {
  return WEEK_LABELS[weekNumber] ?? `Неделя ${weekNumber}`;
}
