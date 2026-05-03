const bcrypt = require('bcryptjs');

async function generateHash() {
    const hash = await bcrypt.hash('123456', 10);
    console.log('Хеш для пароля 123456:', hash);
}

generateHash();