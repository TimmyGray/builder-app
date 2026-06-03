const ru = {
  // Navigation
  'nav.tasks': 'Задачи',
  'nav.jobTypes': 'Типы работ',
  'nav.account': 'Аккаунт',

  // Auth
  'auth.subtitle': 'Управляйте задачами и типами работ вместе с командой',
  'auth.signIn': 'Войти',
  'auth.signUp': 'Регистрация',
  'auth.username': 'Имя пользователя',
  'auth.password': 'Пароль',
  'auth.jobRole': 'Должность',
  'auth.createAccount': 'Создать аккаунт',
  'auth.failed': 'Ошибка аутентификации',

  // Common
  'common.edit': 'Редактировать',
  'common.delete': 'Удалить',
  'common.cancel': 'Отмена',
  'common.close': 'Закрыть',
  'common.save': 'Сохранить',
  'common.create': 'Создать',
  'common.none': 'Нет',
  'common.name': 'Название',
  'common.description': 'Описание',
  'common.measure': 'Единица измерения',
  'common.status': 'Статус',
  'common.dateOfCompletion': 'Дата выполнения',
  'common.scopeOfWork': 'Объём работ',
  'common.enterPositiveNumber': 'Введите положительное число',
  'common.amountOfWork': 'Количество выполненной работы ({{unit}})',

  // Task statuses
  'status.ToBeDone': 'К выполнению',
  'status.InProgress': 'В процессе',
  'status.Completed': 'Выполнено',
  'status.Cancelled': 'Отменено',

  // Job roles
  'role.Builder': 'Строитель',
  'role.Supervisor': 'Прораб',

  // Tasks page
  'tasks.title': 'Задачи',
  'tasks.count_one': '{{count}} задача',
  'tasks.count_few': '{{count}} задачи',
  'tasks.count_many': '{{count}} задач',
  'tasks.count_other': '{{count}} задачи',
  'tasks.newTask': 'Новая задача',
  'tasks.col.jobType': 'Тип работы',
  'tasks.col.scopeOfWork': 'Объём работ',
  'tasks.col.worker': 'Исполнитель',
  'tasks.col.role': 'Должность',
  'tasks.col.created': 'Создано',
  'tasks.col.completedOn': 'Выполнено',
  'tasks.delete.title': 'Удалить задачу?',
  'tasks.delete.confirmText': 'Вы уверены, что хотите удалить задачу «{{name}}»? Это действие нельзя отменить.',
  'tasks.deleted': 'Задача удалена',
  'tasks.deleteFailed': 'Не удалось удалить задачу',
  'tasks.pagination.prev': 'Назад',
  'tasks.pagination.next': 'Вперёд',
  'tasks.pagination.rowsPerPage': 'Строк на странице',

  // Job Types page
  'jobTypes.title': 'Типы работ',
  'jobTypes.count_one': '{{count}} тип',
  'jobTypes.count_few': '{{count}} типа',
  'jobTypes.count_many': '{{count}} типов',
  'jobTypes.count_other': '{{count}} типа',
  'jobTypes.newJobType': 'Новый тип работы',
  'jobTypes.empty.title': 'Типов работ пока нет',
  'jobTypes.empty.subtitle': 'Создайте первый тип работы, чтобы начать',
  'jobTypes.empty.create': 'Создать тип работы',
  'jobTypes.noDescription': 'Нет описания',
  'jobTypes.delete.title': 'Удалить тип работы?',
  'jobTypes.delete.confirmText': 'Удалить «{{name}}»? Это может повлиять на связанные задачи.',
  'jobTypes.deleted': 'Тип работы удалён',
  'jobTypes.deleteFailed': 'Не удалось удалить тип работы',

  // Profile modal
  'profile.title': 'Настройки аккаунта',
  'profile.updateUsername': 'Изменить имя пользователя',
  'profile.usernamePlaceholder': 'Новое имя пользователя',
  'profile.session': 'Сессия',
  'profile.signOut': 'Выйти',
  'profile.dangerZone': 'Опасная зона',
  'profile.passwordPlaceholder': 'Подтвердите пароль',
  'profile.usernameUpdated': 'Имя пользователя обновлено',
  'profile.updateFailed': 'Не удалось обновить имя пользователя',
  'profile.accountDeleted': 'Аккаунт удалён',
  'profile.deleteFailed': 'Не удалось удалить аккаунт',

  // Create Task modal
  'createTask.title': 'Новая задача',
  'createTask.worker': 'Исполнитель',
  'createTask.jobType': 'Тип работы',
  'createTask.describeWork': 'Опишите выполненную работу (необязательно)',
  'createTask.create': 'Создать задачу',
  'createTask.created': 'Задача создана',
  'createTask.createFailed': 'Не удалось создать задачу',

  // Edit Task modal
  'editTask.title': 'Редактировать задачу',
  'editTask.reassignWorker': 'Переназначить исполнителя',
  'editTask.describeWork': 'Опишите выполненную работу',
  'editTask.saveChanges': 'Сохранить изменения',
  'editTask.updated': 'Задача обновлена',
  'editTask.updateFailed': 'Не удалось обновить задачу',

  // View Task modal
  'viewTask.title': 'Детали задачи',
  'viewTask.worker': 'Исполнитель',
  'viewTask.role': 'Должность',

  // Create Job Type modal
  'createJobType.title': 'Новый тип работы',
  'createJobType.created': 'Тип работы создан',
  'createJobType.createFailed': 'Не удалось создать тип работы',

  // Edit Job Type modal
  'editJobType.title': 'Редактировать тип работы',
  'editJobType.updated': 'Тип работы обновлён',
  'editJobType.updateFailed': 'Не удалось обновить тип работы',

  // View Job Type modal
  'viewJobType.title': 'Детали типа работы',
  'viewJobType.noDescription': 'Нет описания',
} as const;

export default ru;
