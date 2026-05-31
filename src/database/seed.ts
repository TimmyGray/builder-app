import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/users.entity';
import { UserJobRole } from '../users/users.dto';
import { JobType } from '../job-type/job-type.entity';
import { Measure } from '../job-type/job-type.dto';
import { Task } from '../tasks/tasks.entity';
import { TaskStatus } from '../tasks/tasks.dto';

const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USERNAME ?? 'builder',
    password: process.env.DB_PASSWORD ?? 'builder',
    database: process.env.DB_DATABASE ?? 'builder_app',
    entities: [User, JobType, Task],
    synchronize: false,
});

const SEED_PASSWORD = 'Stroyka2024!';
const BCRYPT_ROUNDS = 10;

const USERS: Array<{ username: string; jobRole: UserJobRole }> = [
    { username: 'Иванов Алексей Петрович', jobRole: UserJobRole.Builder },
    { username: 'Смирнова Наталья Владимировна', jobRole: UserJobRole.Supervisor },
    { username: 'Козлов Дмитрий Сергеевич', jobRole: UserJobRole.Builder },
    { username: 'Новикова Елена Михайловна', jobRole: UserJobRole.Builder },
    { username: 'Петров Андрей Николаевич', jobRole: UserJobRole.Supervisor },
    { username: 'Морозов Сергей Иванович', jobRole: UserJobRole.Builder },
    { username: 'Соколов Виктор Александрович', jobRole: UserJobRole.Builder },
    { username: 'Лебедева Ольга Юрьевна', jobRole: UserJobRole.Supervisor },
];

const JOB_TYPES: Array<{ name: string; description: string; measure: Measure | null }> = [
    {
        name: 'Кладка кирпича',
        description: 'Кирпичная и блочная кладка несущих и ненесущих стен',
        measure: Measure.SquareMeter,
    },
    {
        name: 'Бетонирование фундамента',
        description: 'Заливка монолитного железобетонного фундамента',
        measure: Measure.CubicMeter,
    },
    {
        name: 'Монтаж металлоконструкций',
        description: 'Сборка, сварка и установка стальных несущих конструкций',
        measure: Measure.Kilogram,
    },
    {
        name: 'Штукатурные работы',
        description: 'Внутренняя и наружная штукатурка стен и потолков',
        measure: Measure.SquareMeter,
    },
    {
        name: 'Укладка кровли',
        description: 'Монтаж кровельного покрытия из профнастила или металлочерепицы',
        measure: Measure.SquareMeter,
    },
    {
        name: 'Монтаж трубопроводов',
        description: 'Прокладка водопроводных, канализационных и отопительных труб',
        measure: Measure.Meter,
    },
    {
        name: 'Заливка бетонного пола',
        description: 'Устройство монолитной бетонной стяжки пола',
        measure: Measure.CubicMeter,
    },
    {
        name: 'Подготовка строительной площадки',
        description: 'Расчистка, планировка и ограждение участка перед началом работ',
        measure: null,
    },
    {
        name: 'Монтаж оконных блоков',
        description: 'Установка и герметизация оконных и дверных блоков',
        measure: null,
    },
    {
        name: 'Укладка тротуарной плитки',
        description: 'Мощение тротуаров, отмосток и площадок тротуарной плиткой',
        measure: Measure.SquareMeter,
    },
];

type TaskSeed = {
    userIndex: number;
    jobTypeIndex: number;
    status: TaskStatus;
    quantity?: number;
    scopeOfWork?: string;
    dateOfCompletion?: Date;
};

const TASKS: TaskSeed[] = [
    // Иванов Алексей Петрович
    { userIndex: 0, jobTypeIndex: 0, status: TaskStatus.InProgress, quantity: 45.5 },
    { userIndex: 0, jobTypeIndex: 3, status: TaskStatus.TBD, quantity: 120.0 },
    { userIndex: 0, jobTypeIndex: 5, status: TaskStatus.Cancelled, quantity: 28.5 },

    // Смирнова Наталья Владимировна
    { userIndex: 1, jobTypeIndex: 0, status: TaskStatus.Completed, quantity: 210.0, dateOfCompletion: new Date('2026-04-15') },

    // Козлов Дмитрий Сергеевич
    { userIndex: 2, jobTypeIndex: 1, status: TaskStatus.Completed, quantity: 18.0, dateOfCompletion: new Date('2026-03-28') },
    { userIndex: 2, jobTypeIndex: 6, status: TaskStatus.InProgress, quantity: 32.5 },
    { userIndex: 2, jobTypeIndex: 7, status: TaskStatus.TBD, scopeOfWork: 'Устройство временных дорог и ограждений строительной площадки' },

    // Новикова Елена Михайловна
    { userIndex: 3, jobTypeIndex: 7, status: TaskStatus.Completed, scopeOfWork: 'Расчистка территории от строительного мусора и планировка грунта', dateOfCompletion: new Date('2026-02-20') },
    { userIndex: 3, jobTypeIndex: 8, status: TaskStatus.InProgress, scopeOfWork: 'Установка пластиковых окон на 2-м этаже секции А' },

    // Петров Андрей Николаевич
    { userIndex: 4, jobTypeIndex: 1, status: TaskStatus.InProgress, quantity: 55.0 },

    // Морозов Сергей Иванович
    { userIndex: 5, jobTypeIndex: 2, status: TaskStatus.TBD, quantity: 2850.0 },
    { userIndex: 5, jobTypeIndex: 4, status: TaskStatus.Completed, quantity: 380.0, dateOfCompletion: new Date('2026-05-02') },
    { userIndex: 5, jobTypeIndex: 3, status: TaskStatus.Cancelled, quantity: 87.5 },

    // Соколов Виктор Александрович
    { userIndex: 6, jobTypeIndex: 5, status: TaskStatus.InProgress, quantity: 64.0 },
    { userIndex: 6, jobTypeIndex: 9, status: TaskStatus.TBD, quantity: 95.0 },

    // Лебедева Ольга Юрьевна
    { userIndex: 7, jobTypeIndex: 4, status: TaskStatus.TBD, quantity: 145.0 },
    { userIndex: 7, jobTypeIndex: 8, status: TaskStatus.Completed, scopeOfWork: 'Монтаж входных металлических дверей в подъездах секции Б', dateOfCompletion: new Date('2026-05-18') },
];

async function seed() {
    console.log('Connecting to database...');
    await dataSource.initialize();

    const userRepo = dataSource.getRepository(User);
    const jobTypeRepo = dataSource.getRepository(JobType);
    const taskRepo = dataSource.getRepository(Task);

    console.log('Clearing existing data...');
    await taskRepo.createQueryBuilder().delete().from(Task).execute();
    await userRepo.createQueryBuilder().delete().from(User).execute();
    await jobTypeRepo.createQueryBuilder().delete().from(JobType).execute();

    console.log('Seeding users...');
    const password = await bcrypt.hash(SEED_PASSWORD, BCRYPT_ROUNDS);
    const savedUsers = await userRepo.save(
        USERS.map((u) => userRepo.create({ ...u, password })),
    );

    console.log('Seeding job types...');
    const savedJobTypes = await jobTypeRepo.save(
        JOB_TYPES.map((jt) => jobTypeRepo.create(jt)),
    );

    console.log('Seeding tasks...');
    const tasks = TASKS.map((t) =>
        taskRepo.create({
            user: savedUsers[t.userIndex],
            jobType: savedJobTypes[t.jobTypeIndex],
            status: t.status,
            quantity: t.quantity ?? undefined,
            scopeOfWork: t.scopeOfWork ?? undefined,
            dateOfCompletion: t.dateOfCompletion ?? undefined,
        }),
    );
    await taskRepo.save(tasks);

    console.log(`Done. Seeded ${savedUsers.length} users, ${savedJobTypes.length} job types, ${tasks.length} tasks.`);
    console.log(`Seed password for all users: ${SEED_PASSWORD}`);

    await dataSource.destroy();
}

seed().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
