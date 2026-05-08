const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');   


const app = express();
const port = 5000;
const JWT_SECRET = 'your-secret-key-change-this';

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Ошибка БД:', err);
    else {
        console.log('Подключено к SQLite');
        initDatabase();
    }
});

function initDatabase() {
    db.serialize(() => {
        // 1. Сначала создаём таблицы (если их нет)
        const createTables = `
            CREATE TABLE IF NOT EXISTS Роли (
                id_r INTEGER PRIMARY KEY AUTOINCREMENT,
                Наименование TEXT UNIQUE NOT NULL
            );

            CREATE TABLE IF NOT EXISTS Тип_услуги (
                id_ty INTEGER PRIMARY KEY AUTOINCREMENT,
                Название TEXT UNIQUE NOT NULL
            );

            CREATE TABLE IF NOT EXISTS Категория (
                id_k INTEGER PRIMARY KEY AUTOINCREMENT,
                Наименование TEXT UNIQUE NOT NULL
            );

            CREATE TABLE IF NOT EXISTS Услуги (
                id_y INTEGER PRIMARY KEY AUTOINCREMENT,
                Название TEXT NOT NULL,
                Цена DECIMAL(10,2) NOT NULL,
                id_ty INTEGER NOT NULL,
                FOREIGN KEY (id_ty) REFERENCES Тип_услуги(id_ty) ON DELETE CASCADE
            );

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

            CREATE TABLE IF NOT EXISTS Клиенты (
                id_c INTEGER PRIMARY KEY AUTOINCREMENT,
                ФИО TEXT NOT NULL,
                Телефон TEXT UNIQUE NOT NULL,
                Почта TEXT UNIQUE,
                Пароль TEXT,
                id_r INTEGER NOT NULL DEFAULT 3,
                FOREIGN KEY (id_r) REFERENCES Роли(id_r) ON DELETE RESTRICT
            );

            CREATE TABLE IF NOT EXISTS Расписание (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                День_недели TEXT NOT NULL,
                Начало_смены TIME NOT NULL,
                Конец_смены TIME NOT NULL,
                id_m INTEGER NOT NULL,
                FOREIGN KEY (id_m) REFERENCES Мастер(id_m) ON DELETE CASCADE
            );

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
        `;

        // Выполняем создание таблиц
        const statements = createTables.split(';').filter(s => s.trim());
        statements.forEach(stmt => {
            if (stmt.trim()) db.run(stmt, (err) => {
                if (err && !err.message.includes('already exists')) console.error('Ошибка создания таблицы:', err.message);
            });
        });

        // 2. Проверяем и заполняем начальными данными только если таблицы пустые
        setTimeout(() => {
            // Проверка Ролей
            db.get('SELECT COUNT(*) as count FROM Роли', [], (err, row) => {
                if (err) return;
                if (row.count === 0) {
                    console.log('Заполнение начальными данными...');
                    db.run(`INSERT OR IGNORE INTO Роли (Наименование) VALUES ('Администратор'), ('Мастер'), ('Клиент')`);
                    db.run(`INSERT OR IGNORE INTO Тип_услуги (Название) VALUES 
                        ('Отделка стен'), ('Отделка пола'), ('Потолочные работы'), 
                        ('Сантехнические работы'), ('Электромонтажные работы')`);
                    db.run(`INSERT OR IGNORE INTO Категория (Наименование) VALUES 
                        ('Мастер-универсал'), ('Маляр-штукатур'), ('Плиточник'),
                        ('Сантехник'), ('Электрик')`);
                    db.run(`INSERT OR IGNORE INTO Услуги (Название, Цена, id_ty) VALUES 
                        ('Штукатурка стен', 800.00, 1),
                        ('Покраска стен', 400.00, 1),
                        ('Укладка плитки на пол', 1500.00, 2),
                        ('Укладка ламината', 600.00, 2),
                        ('Монтаж натяжного потолка', 2000.00, 3),
                        ('Установка унитаза', 1200.00, 4),
                        ('Установка смесителя', 800.00, 4),
                        ('Прокладка проводки', 500.00, 5),
                        ('Установка розеток', 300.00, 5),
                        ('Шпаклевка стен', 600.00, 1)`);
                    
                    // Хеш пароля 123456 для начальных данных
                    const hash = '$2a$10$Oh6849Zpv.sXdeU9IXx0L.ClnpyctByoaqsOzo5tf/AL646LQjL..';
                    
                    db.run(`INSERT OR IGNORE INTO Мастер (ФИО, Телефон, Почта, id_k, id_r) VALUES 
                        ('Иванов Иван Иванович', '+79001234567', 'ivanov@mail.ru', 1, 2),
                        ('Петров Петр Петрович', '+79002345678', 'petrov@mail.ru', 2, 2),
                        ('Сидоров Сидор Сидорович', '+79003456789', 'sidorov@mail.ru', 3, 2),
                        ('Козлов Андрей Николаевич', '+79004567890', 'kozlov@mail.ru', 4, 2),
                        ('Морозов Дмитрий Сергеевич', '+79005678901', 'morozov@mail.ru', 5, 2),
                        ('Волков Алексей Михайлович', '+79006789012', 'volkov@mail.ru', 1, 1)`);
                    
                    db.run(`INSERT OR IGNORE INTO Клиенты (ФИО, Телефон, Почта, Пароль, id_r) VALUES 
                        ('Волков Алексей Михайлович', '+79006789012', 'volkov@mail.ru', '${hash}', 1),
                        ('Смирнов Александр Владимирович', '+79111234567', 'smirnov@ya.ru', '${hash}', 3),
                        ('Кузнецова Елена Игоревна', '+79112345678', 'kuznetsova@ya.ru', '${hash}', 3),
                        ('Попов Денис Андреевич', '+79113456789', 'popov@ya.ru', '${hash}', 3),
                        ('Васильева Ольга Петровна', '+79114567890', 'vasilieva@ya.ru', '${hash}', 3),
                        ('Соколов Максим Иванович', '+79115678901', 'sokolov@ya.ru', '${hash}', 3),
                        ('Михайлова Татьяна Сергеевна', '+79116789012', 'mihailova@ya.ru', '${hash}', 3),
                        ('Новиков Игорь Викторович', '+79117890123', 'novikov@ya.ru', '${hash}', 3),
                        ('Федорова Наталья Алексеевна', '+79118901234', 'fedorova@ya.ru', '${hash}', 3)`);
                    
                    db.run(`INSERT OR IGNORE INTO Расписание (День_недели, Начало_смены, Конец_смены, id_m) VALUES 
                        ('Понедельник', '09:00', '18:00', 1), ('Вторник', '09:00', '18:00', 1),
                        ('Среда', '09:00', '18:00', 1), ('Четверг', '09:00', '18:00', 1),
                        ('Пятница', '09:00', '18:00', 1), ('Понедельник', '10:00', '19:00', 2),
                        ('Вторник', '10:00', '19:00', 2), ('Среда', '10:00', '19:00', 2),
                        ('Четверг', '10:00', '19:00', 2), ('Пятница', '10:00', '19:00', 2),
                        ('Понедельник', '08:00', '17:00', 3), ('Вторник', '08:00', '17:00', 3),
                        ('Среда', '08:00', '17:00', 3), ('Четверг', '08:00', '17:00', 3),
                        ('Пятница', '08:00', '17:00', 3)`);
                    
                    db.run(`INSERT OR IGNORE INTO Запись_на_услугу (Дата_время, Статус, id_m, id_c, id_y) VALUES 
                        ('2026-03-15 10:00:00', 'Завершен', 1, 2, 1),
                        ('2026-03-16 14:00:00', 'Завершен', 2, 3, 2),
                        ('2026-03-17 09:00:00', 'Завершен', 3, 4, 3),
                        ('2026-03-18 11:00:00', 'Завершен', 2, 5, 10),
                        ('2026-03-19 13:00:00', 'Завершен', 5, 6, 8),
                        ('2026-04-01 10:00:00', 'Подтвержден', 1, 7, 1),
                        ('2026-04-02 15:00:00', 'Подтвержден', 2, 8, 2),
                        ('2026-04-03 09:00:00', 'Новый', 3, 2, 3),
                        ('2026-04-04 11:00:00', 'Новый', 4, 3, 7),
                        ('2026-04-05 14:00:00', 'Новый', 5, 4, 9),
                        ('2026-04-06 10:00:00', 'Выполняется', 1, 5, 1),
                        ('2026-04-07 12:00:00', 'Выполняется', 2, 6, 2),
                        ('2026-04-08 13:00:00', 'Отменен', 3, 7, 5)`);
                    
                    console.log('Начальные данные добавлены');
                } else {
                    console.log('База данных уже существует, данные сохранены');
                }
            });
        }, 100); // Небольшая задержка для создания таблиц
    });
}

// мидл варе
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Требуется авторизация' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Недействительный токен' });
        req.user = user;
        next();
    });
}
function requireAdmin(req, res, next) {
    if (req.user && req.user.role === 1) next();
    else res.status(403).json({ error: 'Доступ запрещен' });
}

// публич маршруты
app.get('/api/services', (req, res) => {
    db.all(`SELECT y.id_y, y.Название, y.Цена, ty.Название as Тип_услуги FROM Услуги y JOIN Тип_услуги ty ON y.id_ty = ty.id_ty`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.get('/api/service-types', (req, res) => {
    db.all('SELECT * FROM Тип_услуги', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.get('/api/masters', (req, res) => {
    db.all(`SELECT m.id_m, m.ФИО, m.Телефон, k.Наименование as Категория FROM Мастер m JOIN Категория k ON m.id_k = k.id_k WHERE m.id_r = 2`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// авториз
app.post('/api/login', (req, res) => {
    const { Телефон, Пароль } = req.body;
    
    // Ищем пользователя в таблице Клиенты
    db.get('SELECT id_c, ФИО, Телефон, Почта, Пароль, id_r FROM Клиенты WHERE Телефон = ?', [Телефон], async (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!user) {
            res.status(401).json({ error: 'Неверный телефон или пароль' });
        } else {
            // Проверяем пароль через bcrypt
            const valid = await bcrypt.compare(Пароль, user.Пароль);
            if (!valid) {
                return res.status(401).json({ error: 'Неверный телефон или пароль' });
            }
            
            // Генерируем токен
            const token = jwt.sign(
                { id: user.id_c, role: user.id_r }, 
                JWT_SECRET, 
                { expiresIn: '24h' }
            );
            
            res.json({ 
                token, 
                user: { 
                    id: user.id_c, 
                    ФИО: user.ФИО, 
                    Телефон: user.Телефон,
                    Почта: user.Почта || '',
                    role: user.id_r 
                } 
            });
        }
    });
});

app.post('/api/register', async (req, res) => {
    const { ФИО, Телефон, Почта, Пароль } = req.body;
    try {
        const hash = await bcrypt.hash(Пароль, 10);
        db.run('INSERT INTO Клиенты (ФИО, Телефон, Почта, Пароль, id_r) VALUES (?,?,?,?,3)', [ФИО, Телефон, Почта, hash], function(err) {
            if (err) return res.status(400).json({ error: 'Телефон или email занят' });
            const token = jwt.sign({ id: this.lastID, role: 3 }, JWT_SECRET);
            res.json({ token, user: { id: this.lastID, ФИО, Телефон, Почта, role: 3 } });
        });
    } catch (error) { res.status(500).json({ error: 'Ошибка сервера' }); }
});

// защищенные маршруты для клиентов
app.get('/api/client-bookings/:clientId', authenticateToken, (req, res) => {
    if (req.user.id != req.params.clientId && req.user.role !== 1) return res.status(403).json({ error: 'Нет доступа' });
    db.all(`SELECT z.*, y.Название as Услуга, y.Цена, m.ФИО as Мастер FROM Запись_на_услугу z JOIN Услуги y ON z.id_y = y.id_y JOIN Мастер m ON z.id_m = m.id_m WHERE z.id_c = ?`, [req.params.clientId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.post('/api/bookings', authenticateToken, (req, res) => {
    const { Дата_время, id_m, id_y } = req.body;
    db.run('INSERT INTO Запись_на_услугу (Дата_время, Статус, id_m, id_c, id_y) VALUES (?, "Новый", ?, ?, ?)', [Дата_время, id_m, req.user.id, id_y], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

// админ маршруты
// проверка записей по датам
function checkDateOverlap(id_m, date, excludeId = null, callback) {
    // созд дата в формат YYYY-MM-DD
    const dateOnly = date.split('T')[0];
    let query = `SELECT id_z FROM Запись_на_услугу 
                 WHERE id_m = ? AND date(Дата_время) = date(?)`;
    const params = [id_m, dateOnly];
    if (excludeId) {
        query += ` AND id_z != ?`;
        params.push(excludeId);
    }
    db.get(query, params, (err, row) => {
        if (err) callback(err);
        else callback(null, !!row);
    });
}
    //получение всех заявок
    app.get('/api/admin/bookings', authenticateToken, requireAdmin, (req, res) => {
        db.all(`SELECT z.*, y.Название as Услуга, m.ФИО as Мастер, c.ФИО as Клиент 
                FROM Запись_на_услугу z 
                JOIN Услуги y ON z.id_y = y.id_y 
                JOIN Мастер m ON z.id_m = m.id_m 
                JOIN Клиенты c ON z.id_c = c.id_c`, [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    });

    // созд заявка с проверкой занятости
    app.post('/api/admin/bookings', authenticateToken, requireAdmin, (req, res) => {
    const { Дата_время, id_m, id_c, id_y, Статус } = req.body;
    // проверка по времени
    checkDateOverlap(id_m, Дата_время, null, (err, hasOverlap) => {
        if (err) return res.status(500).json({ error: err.message });
        if (hasOverlap) return res.status(400).json({ error: 'На эту дату у мастера уже есть запись' });
        // вставкка
        db.run('INSERT INTO Запись_на_услугу (Дата_время, Статус, id_m, id_c, id_y) VALUES (?, ?, ?, ?, ?)',
            [Дата_время, Статус || 'Новый', id_m, id_c, id_y],
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ id: this.lastID });
            });
    });
});

    // обновление заявки с проверкой занятости (кроме сасой себя)
    app.put('/api/admin/bookings/:id', authenticateToken, requireAdmin, (req, res) => {
    const { Дата_время, id_m, id_c, id_y, Статус } = req.body;
    const bookingId = req.params.id;
    checkDateOverlap(id_m, Дата_время, bookingId, (err, hasOverlap) => {
        if (err) return res.status(500).json({ error: err.message });
        if (hasOverlap) return res.status(400).json({ error: 'На эту дату у мастера уже есть запись' });
        db.run('UPDATE Запись_на_услугу SET Дата_время = ?, Статус = ?, id_m = ?, id_c = ?, id_y = ? WHERE id_z = ?',
            [Дата_время, Статус, id_m, id_c, id_y, bookingId],
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Обновлено' });
            });
    });
});

    // удаление заявки
    app.delete('/api/admin/bookings/:id', authenticateToken, requireAdmin, (req, res) => {
        db.run('DELETE FROM Запись_на_услугу WHERE id_z = ?', [req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Удалено' });
        });
    });

// услуги
app.get('/api/admin/services', authenticateToken, requireAdmin, (req, res) => {
    db.all(`SELECT y.*, ty.Название as Тип_услуги FROM Услуги y JOIN Тип_услуги ty ON y.id_ty = ty.id_ty`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.post('/api/admin/services', authenticateToken, requireAdmin, (req, res) => {
    const { Название, Цена, id_ty } = req.body;
    db.run('INSERT INTO Услуги (Название, Цена, id_ty) VALUES (?, ?, ?)', [Название, Цена, id_ty], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    }); 
});
app.put('/api/admin/services/:id', authenticateToken, requireAdmin, (req, res) => {
    const { Название, Цена, id_ty } = req.body;
    db.run('UPDATE Услуги SET Название = ?, Цена = ?, id_ty = ? WHERE id_y = ?', [Название, Цена, id_ty, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Обновлено' });
    });
});
app.delete('/api/admin/services/:id', authenticateToken, requireAdmin, (req, res) => {
    db.run('DELETE FROM Услуги WHERE id_y = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Удалено' });
    });
});

// мастера
app.get('/api/admin/masters', authenticateToken, requireAdmin, (req, res) => {
    db.all(`SELECT m.*, k.Наименование as Категория FROM Мастер m JOIN Категория k ON m.id_k = k.id_k`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.post('/api/admin/masters', authenticateToken, requireAdmin, (req, res) => {
    const { ФИО, Телефон, Почта, id_k } = req.body;
    db.run('INSERT INTO Мастер (ФИО, Телефон, Почта, id_k, id_r) VALUES (?, ?, ?, ?, 2)', [ФИО, Телефон, Почта, id_k], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});
app.put('/api/admin/masters/:id', authenticateToken, requireAdmin, (req, res) => {
    const { ФИО, Телефон, Почта, id_k } = req.body;
    db.run('UPDATE Мастер SET ФИО = ?, Телефон = ?, Почта = ?, id_k = ? WHERE id_m = ?', [ФИО, Телефон, Почта, id_k, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Обновлено' });
    });
});
app.delete('/api/admin/masters/:id', authenticateToken, requireAdmin, (req, res) => {
    db.run('DELETE FROM Мастер WHERE id_m = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Удалено' });
    });
});

// клиенты
app.get('/api/admin/clients', authenticateToken, requireAdmin, (req, res) => {
    db.all(`SELECT id_c, ФИО, Телефон, Почта, id_r FROM Клиенты`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.post('/api/admin/clients', authenticateToken, requireAdmin, async (req, res) => {
    const { ФИО, Телефон, Почта, Пароль, id_r } = req.body;
    const hash = await bcrypt.hash(Пароль || '123456', 10);
    db.run('INSERT INTO Клиенты (ФИО, Телефон, Почта, Пароль, id_r) VALUES (?, ?, ?, ?, ?)', [ФИО, Телефон, Почта, hash, id_r || 3], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});
app.put('/api/admin/clients/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { ФИО, Телефон, Почта, Пароль, id_r } = req.body;
    if (Пароль) {
        const hash = await bcrypt.hash(Пароль, 10);
        db.run('UPDATE Клиенты SET ФИО = ?, Телефон = ?, Почта = ?, Пароль = ?, id_r = ? WHERE id_c = ?', [ФИО, Телефон, Почта, hash, id_r, req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Обновлено' });
        });
    } else {
        db.run('UPDATE Клиенты SET ФИО = ?, Телефон = ?, Почта = ?, id_r = ? WHERE id_c = ?', [ФИО, Телефон, Почта, id_r, req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Обновлено' });
        });
    }
});
app.delete('/api/admin/clients/:id', authenticateToken, requireAdmin, (req, res) => {
    db.run('DELETE FROM Клиенты WHERE id_c = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Удалено' });
    });
});

// категории
app.get('/api/admin/categories', authenticateToken, requireAdmin, (req, res) => {
    db.all('SELECT * FROM Категория', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.post('/api/admin/categories', authenticateToken, requireAdmin, (req, res) => {
    const { Наименование } = req.body;
    db.run('INSERT INTO Категория (Наименование) VALUES (?)', [Наименование], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});
app.delete('/api/admin/categories/:id', authenticateToken, requireAdmin, (req, res) => {
    db.run('DELETE FROM Категория WHERE id_k = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Удалено' });
    });
});
// 15. ОБНОВИТЬ ПРОФИЛЬ КЛИЕНТА
app.put('/api/client/profile/:id', [
    body('ФИО').optional().notEmpty(),
    body('Телефон').optional().isMobilePhone('ru-RU'),
    body('Почта').optional().isEmail()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { ФИО, Телефон, Почта } = req.body;
    const clientId = req.params.id;
    const updates = [];
    const values = [];

    if (ФИО) { updates.push('ФИО = ?'); values.push(ФИО); }
    if (Телефон) { updates.push('Телефон = ?'); values.push(Телефон); }
    if (Почта !== undefined) { updates.push('Почта = ?'); values.push(Почта); }

    if (updates.length === 0) {
        return res.status(400).json({ error: 'Нет данных для обновления' });
    }

    values.push(clientId);
    const query = `UPDATE Клиенты SET ${updates.join(', ')} WHERE id_c = ?`;

    db.run(query, values, function(err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                res.status(400).json({ error: 'Телефон или email уже используются' });
            } else {
                res.status(500).json({ error: err.message });
            }
        } else {
            res.json({ message: 'Профиль обновлён' });
        }
    });
});

// 16. СМЕНИТЬ ПАРОЛЬ КЛИЕНТА
app.put('/api/client/password/:id', [
    body('Пароль').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { Пароль } = req.body;
    const clientId = req.params.id;

    try {
        const hashedPassword = await bcrypt.hash(Пароль, 10);
        db.run('UPDATE Клиенты SET Пароль = ? WHERE id_c = ?', [hashedPassword, clientId], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Пароль обновлён' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка хеширования' });
    }
});
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log(`Админ: +79006789012 / 123456`);
});