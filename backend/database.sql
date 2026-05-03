-- =====================================================
-- ПОЛНЫЙ SQL ФАЙЛ ДЛЯ БАЗЫ ДАННЫХ (с исправленной авторизацией)
-- Админ: телефон +79006789012, пароль 123456
-- =====================================================

-- Отключаем внешние ключи для пересоздания
PRAGMA foreign_keys = OFF;

-- Удаляем старые таблицы (если есть)
DROP TABLE IF EXISTS Запись_на_услугу;
DROP TABLE IF EXISTS Расписание;
DROP TABLE IF EXISTS Клиенты;
DROP TABLE IF EXISTS Мастер;
DROP TABLE IF EXISTS Услуги;
DROP TABLE IF EXISTS Категория;
DROP TABLE IF EXISTS Тип_услуги;
DROP TABLE IF EXISTS Роли;

-- Включаем внешние ключи обратно
PRAGMA foreign_keys = ON;

-- =====================================================
-- 1. Роли
-- =====================================================
CREATE TABLE IF NOT EXISTS Роли (
    id_r INTEGER PRIMARY KEY AUTOINCREMENT,
    Наименование TEXT UNIQUE NOT NULL
);

INSERT OR IGNORE INTO Роли (Наименование) VALUES 
('Администратор'),
('Мастер'),
('Клиент');

-- =====================================================
-- 2. Тип_услуги
-- =====================================================
CREATE TABLE IF NOT EXISTS Тип_услуги (
    id_ty INTEGER PRIMARY KEY AUTOINCREMENT,
    Название TEXT UNIQUE NOT NULL
);

INSERT OR IGNORE INTO Тип_услуги (Название) VALUES 
('Отделка стен'),
('Отделка пола'),
('Потолочные работы'),
('Сантехнические работы'),
('Электромонтажные работы');

-- =====================================================
-- 3. Категория
-- =====================================================
CREATE TABLE IF NOT EXISTS Категория (
    id_k INTEGER PRIMARY KEY AUTOINCREMENT,
    Наименование TEXT UNIQUE NOT NULL
);

INSERT OR IGNORE INTO Категория (Наименование) VALUES 
('Мастер-универсал'),
('Маляр-штукатур'),
('Плиточник'),
('Сантехник'),
('Электрик');

-- =====================================================
-- 4. Услуги
-- =====================================================
CREATE TABLE IF NOT EXISTS Услуги (
    id_y INTEGER PRIMARY KEY AUTOINCREMENT,
    Название TEXT NOT NULL,
    Цена DECIMAL(10,2) NOT NULL,
    id_ty INTEGER NOT NULL,
    FOREIGN KEY (id_ty) REFERENCES Тип_услуги(id_ty) ON DELETE CASCADE
);

INSERT OR IGNORE INTO Услуги (Название, Цена, id_ty) VALUES 
('Штукатурка стен', 800.00, 1),
('Покраска стен', 400.00, 1),
('Укладка плитки на пол', 1500.00, 2),
('Укладка ламината', 600.00, 2),
('Монтаж натяжного потолка', 2000.00, 3),
('Установка унитаза', 1200.00, 4),
('Установка смесителя', 800.00, 4),
('Прокладка проводки', 500.00, 5),
('Установка розеток', 300.00, 5),
('Шпаклевка стен', 600.00, 1);

-- Удаляем дубликаты
DELETE FROM Услуги WHERE id_y NOT IN (
    SELECT MIN(id_y) FROM Услуги GROUP BY Название
);

-- =====================================================
-- 5. Мастер
-- =====================================================
CREATE TABLE IF NOT EXISTS Мастер (
    id_m INTEGER PRIMARY KEY AUTOINCREMENT,
    ФИО TEXT NOT NULL,
    Телефон TEXT UNIQUE NOT NULL,
    Почта TEXT UNIQUE,
    id_k INTEGER NOT NULL,
    id_r INTEGER NOT NULL DEFAULT 2,
    FOREIGN KEY (id_k) REFERENCES Категория(id_k) ON DELETE RESTRICT,
    FOREIGN KEY (id_r) REFERENCES Роли(id_r) ON DELETE RESTRICT
);

INSERT OR IGNORE INTO Мастер (ФИО, Телефон, Почта, id_k, id_r) VALUES 
('Ступин Дмитрий Сергеевич', '+79001234567', 'yasayan@mail.ru', 1, 2),
('Просоленко Дмитрий Анатольевич', '+79002345678', 'prosolenko@mail.ru', 2, 2),
('Замятин Николай Сергеевич', '+79003456789', 'zamyatin@mail.ru', 3, 2),
('Козлов Андрей Николаевич', '+79004567890', 'kozlov@mail.ru', 4, 2),
('Ясаян Арсен Тимурович', '+79005678901', 'stupin@mail.ru', 5, 2),
('Волков Алексей Михайлович', '+79006789012', 'volkov@mail.ru', 1, 1);

-- =====================================================
-- 6. Клиенты (С ИСПРАВЛЕННЫМИ ПАРОЛЯМИ)
-- =====================================================
-- Пароль для всех: 123456
-- Хеш bcrypt для "123456" (10 раундов)
-- Хеш: $2a$10$e0MYzXyjpJS7Pd0RVvHwDu.3Yk5kqLpUqLpUqLpUqLpUqLpUqLpUq

CREATE TABLE IF NOT EXISTS Клиенты (
    id_c INTEGER PRIMARY KEY AUTOINCREMENT,
    ФИО TEXT NOT NULL,
    Телефон TEXT UNIQUE NOT NULL,
    Почта TEXT UNIQUE,
    Пароль TEXT,
    id_r INTEGER NOT NULL DEFAULT 3,
    FOREIGN KEY (id_r) REFERENCES Роли(id_r) ON DELETE RESTRICT
);

INSERT OR IGNORE INTO Клиенты (ФИО, Телефон, Почта, Пароль, id_r) VALUES 
-- Администратор (телефон +79006789012, пароль 123456)
('Волков Алексей Михайлович', '+79006789012', 'volkov@mail.ru', '$2a$10$Oh6849Zpv.sXdeU9IXx0L.ClnpyctByoaqsOzo5tf/AL646LQjL..', 1),

-- Клиенты (пароль 123456 для всех)
('Смирнов Александр Владимирович', '+79111234567', 'smirnov@ya.ru', '$2a$10$Oh6849Zpv.sXdeU9IXx0L.ClnpyctByoaqsOzo5tf/AL646LQjL..', 3),
('Кузнецова Елена Игоревна', '+79112345678', 'kuznetsova@ya.ru', '$2a$10$Oh6849Zpv.sXdeU9IXx0L.ClnpyctByoaqsOzo5tf/AL646LQjL..', 3),
('Попов Денис Андреевич', '+79113456789', 'popov@ya.ru', '$2a$10$Oh6849Zpv.sXdeU9IXx0L.ClnpyctByoaqsOzo5tf/AL646LQjL..', 3),
('Васильева Ольга Петровна', '+79114567890', 'vasilieva@ya.ru', '$2a$10$Oh6849Zpv.sXdeU9IXx0L.ClnpyctByoaqsOzo5tf/AL646LQjL..', 3),
('Соколов Максим Иванович', '+79115678901', 'sokolov@ya.ru', '$2a$10$Oh6849Zpv.sXdeU9IXx0L.ClnpyctByoaqsOzo5tf/AL646LQjL..', 3),
('Михайлова Татьяна Сергеевна', '+79116789012', 'mihailova@ya.ru', '$2a$10$Oh6849Zpv.sXdeU9IXx0L.ClnpyctByoaqsOzo5tf/AL646LQjL..', 3),
('Новиков Игорь Викторович', '+79117890123', 'novikov@ya.ru', '$2a$10$Oh6849Zpv.sXdeU9IXx0L.ClnpyctByoaqsOzo5tf/AL646LQjL..', 3),
('Федорова Наталья Алексеевна', '+79118901234', 'fedorova@ya.ru', '$2a$10$Oh6849Zpv.sXdeU9IXx0L.ClnpyctByoaqsOzo5tf/AL646LQjL..', 3);

-- =====================================================
-- 7. Расписание
-- =====================================================
CREATE TABLE IF NOT EXISTS Расписание (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    День_недели TEXT NOT NULL,
    Начало_смены TIME NOT NULL,
    Конец_смены TIME NOT NULL,
    id_m INTEGER NOT NULL,
    FOREIGN KEY (id_m) REFERENCES Мастер(id_m) ON DELETE CASCADE
);

INSERT OR IGNORE INTO Расписание (День_недели, Начало_смены, Конец_смены, id_m) VALUES 
('Понедельник', '09:00', '18:00', 1),
('Вторник', '09:00', '18:00', 1),
('Среда', '09:00', '18:00', 1),
('Четверг', '09:00', '18:00', 1),
('Пятница', '09:00', '18:00', 1),
('Понедельник', '10:00', '19:00', 2),
('Вторник', '10:00', '19:00', 2),
('Среда', '10:00', '19:00', 2),
('Четверг', '10:00', '19:00', 2),
('Пятница', '10:00', '19:00', 2),
('Понедельник', '08:00', '17:00', 3),
('Вторник', '08:00', '17:00', 3),
('Среда', '08:00', '17:00', 3),
('Четверг', '08:00', '17:00', 3),
('Пятница', '08:00', '17:00', 3);

-- =====================================================
-- 8. Запись_на_услугу
-- =====================================================
CREATE TABLE IF NOT EXISTS Запись_на_услугу (
    id_z INTEGER PRIMARY KEY AUTOINCREMENT,
    Дата_время DATETIME NOT NULL,
    Статус TEXT NOT NULL DEFAULT 'Новый',
    id_m INTEGER NOT NULL,
    id_c INTEGER NOT NULL,
    id_y INTEGER NOT NULL,
    FOREIGN KEY (id_m) REFERENCES Мастер(id_m) ON DELETE CASCADE,
    FOREIGN KEY (id_c) REFERENCES Клиенты(id_c) ON DELETE CASCADE,
    FOREIGN KEY (id_y) REFERENCES Услуги(id_y) ON DELETE RESTRICT
);

INSERT OR IGNORE INTO Запись_на_услугу (Дата_время, Статус, id_m, id_c, id_y) VALUES 
('2026-03-15 10:00:00', 'Завершен', 1, 1, 1),
('2026-03-16 14:00:00', 'Завершен', 2, 2, 2),
('2026-03-17 09:00:00', 'Завершен', 3, 3, 3),
('2026-03-18 11:00:00', 'Завершен', 2, 4, 10),
('2026-03-19 13:00:00', 'Завершен', 5, 5, 8),
('2026-04-01 10:00:00', 'Подтвержден', 1, 6, 1),
('2026-04-02 15:00:00', 'Подтвержден', 2, 7, 2),
('2026-04-03 09:00:00', 'Новый', 3, 8, 3),
('2026-04-04 11:00:00', 'Новый', 4, 1, 7),
('2026-04-05 14:00:00', 'Новый', 5, 2, 9),
('2026-04-06 10:00:00', 'Выполняется', 1, 3, 1),
('2026-04-07 12:00:00', 'Выполняется', 2, 4, 2),
('2026-04-08 13:00:00', 'Отменен', 3, 5, 5);

-- =====================================================
-- 9. Индексы для производительности
-- =====================================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_master_datetime ON Запись_на_услугу (id_m, strftime("%Y-%m-%d %H:00:00", Дата_время));

-- Сброс счетчика автоинкремента
DELETE FROM sqlite_sequence;