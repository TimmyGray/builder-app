const en = {
  // Navigation
  'nav.tasks': 'Tasks',
  'nav.jobTypes': 'Job Types',
  'nav.account': 'Account',

  // Auth
  'auth.subtitle': 'Manage tasks and job types with your team',
  'auth.signIn': 'Sign In',
  'auth.signUp': 'Sign Up',
  'auth.username': 'Username',
  'auth.password': 'Password',
  'auth.jobRole': 'Job Role',
  'auth.createAccount': 'Create Account',
  'auth.failed': 'Authentication failed',

  // Common
  'common.edit': 'Edit',
  'common.delete': 'Delete',
  'common.cancel': 'Cancel',
  'common.close': 'Close',
  'common.save': 'Save',
  'common.create': 'Create',
  'common.none': 'None',
  'common.name': 'Name',
  'common.description': 'Description',
  'common.measure': 'Measure',
  'common.status': 'Status',
  'common.dateOfCompletion': 'Date of Completion',
  'common.scopeOfWork': 'Scope of work',
  'common.enterPositiveNumber': 'Enter a positive number',
  'common.amountOfWork': 'Amount of work done ({{unit}})',

  // Task statuses
  'status.ToBeDone': 'To Be Done',
  'status.InProgress': 'In Progress',
  'status.Completed': 'Completed',
  'status.Cancelled': 'Cancelled',

  // Job roles
  'role.Builder': 'Builder',
  'role.Supervisor': 'Supervisor',

  // Tasks page
  'tasks.title': 'Tasks',
  'tasks.count_one': '{{count}} task',
  'tasks.count_other': '{{count}} tasks',
  'tasks.newTask': 'New Task',
  'tasks.col.jobType': 'Job Type',
  'tasks.col.scopeOfWork': 'Scope of Work',
  'tasks.col.worker': 'Worker',
  'tasks.col.role': 'Role',
  'tasks.col.created': 'Created',
  'tasks.col.completedOn': 'Completed On',
  'tasks.delete.title': 'Delete Task?',
  'tasks.delete.confirmText': 'Are you sure you want to delete the task «{{name}}»? This cannot be undone.',
  'tasks.deleted': 'Task deleted',
  'tasks.deleteFailed': 'Failed to delete task',
  'tasks.pagination.prev': 'Previous',
  'tasks.pagination.next': 'Next',
  'tasks.pagination.rowsPerPage': 'Rows per page',

  // Job Types page
  'jobTypes.title': 'Job Types',
  'jobTypes.count_one': '{{count}} type',
  'jobTypes.count_other': '{{count}} types',
  'jobTypes.newJobType': 'New Job Type',
  'jobTypes.empty.title': 'No job types yet',
  'jobTypes.empty.subtitle': 'Create your first job type to get started',
  'jobTypes.empty.create': 'Create Job Type',
  'jobTypes.noDescription': 'No description',
  'jobTypes.delete.title': 'Delete Job Type?',
  'jobTypes.delete.confirmText': 'Delete «{{name}}»? Any tasks using this job type may be affected.',
  'jobTypes.deleted': 'Job type deleted',
  'jobTypes.deleteFailed': 'Failed to delete job type',

  // Profile modal
  'profile.title': 'Account Settings',
  'profile.updateUsername': 'Update Username',
  'profile.usernamePlaceholder': 'New username',
  'profile.session': 'Session',
  'profile.signOut': 'Sign Out',
  'profile.dangerZone': 'Danger Zone',
  'profile.passwordPlaceholder': 'Confirm password',
  'profile.usernameUpdated': 'Username updated successfully',
  'profile.updateFailed': 'Failed to update username',
  'profile.accountDeleted': 'Account deleted',
  'profile.deleteFailed': 'Failed to delete account',

  // Create Task modal
  'createTask.title': 'New Task',
  'createTask.worker': 'Worker',
  'createTask.jobType': 'Job Type',
  'createTask.describeWork': 'Describe the work done (optional)',
  'createTask.create': 'Create Task',
  'createTask.created': 'Task created',
  'createTask.createFailed': 'Failed to create task',

  // Edit Task modal
  'editTask.title': 'Edit Task',
  'editTask.reassignWorker': 'Reassign Worker',
  'editTask.describeWork': 'Describe the work done',
  'editTask.saveChanges': 'Save Changes',
  'editTask.updated': 'Task updated',
  'editTask.updateFailed': 'Failed to update task',

  // View Task modal
  'viewTask.title': 'Task Details',
  'viewTask.worker': 'Worker',
  'viewTask.role': 'Role',

  // Create Job Type modal
  'createJobType.title': 'New Job Type',
  'createJobType.created': 'Job type created',
  'createJobType.createFailed': 'Failed to create job type',

  // Edit Job Type modal
  'editJobType.title': 'Edit Job Type',
  'editJobType.updated': 'Job type updated',
  'editJobType.updateFailed': 'Failed to update job type',

  // View Job Type modal
  'viewJobType.title': 'Job Type Details',
  'viewJobType.noDescription': 'No description',
} as const;

export default en;
