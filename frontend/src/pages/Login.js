import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { login, register } from '../api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    Телефон: '',
    Пароль: '',
    ФИО: '',
    Почта: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    console.log('Отправка запроса...', formData.Телефон);
    const response = await login({
      Телефон: formData.Телефон,
      Пароль: formData.Пароль
    });
    
    console.log('Ответ сервера:', response.data);
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    navigate('/profile');
  } catch (err) {
    console.error('Ошибка входа:', err.response?.data || err);
    setError(err.response?.data?.error || 'Неверный телефон или пароль');
  } finally {
    setLoading(false);
  }
  };

  const handleRegister = async (e) => {
  e.preventDefault();
  setError('');

  if (formData.Пароль !== formData.confirmPassword) {
    setError('Пароли не совпадают');
    return;
  }

  setLoading(true);
  try {
    const response = await register({
      ФИО: formData.ФИО,
      Телефон: formData.Телефон,
      Почта: formData.Почта || '',
      Пароль: formData.Пароль
    });
    
    console.log('Регистрация успешна:', response.data);
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    navigate('/profile');
  } catch (err) {
    console.error('Ошибка регистрации:', err.response?.data);
    setError(err.response?.data?.error || 'Ошибка регистрации');
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Вход' : 'Регистрация'} | РемонтПрофи</title>
        <meta name="description" content="Войдите в личный кабинет или зарегистрируйтесь для отслеживания заказов" />
      </Helmet>

      <div className="login-page">
        <div className="container">
          <div className="login-container">
            <div className="login-card">
              <div className="login-tabs">
                <button 
                  className={`tab-btn ${isLogin ? 'active' : ''}`}
                  onClick={() => setIsLogin(true)}
                >
                  Вход
                </button>
                <button 
                  className={`tab-btn ${!isLogin ? 'active' : ''}`}
                  onClick={() => setIsLogin(false)}
                >
                  Регистрация
                </button>
              </div>

              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              {isLogin ? (
                // Форма входа
                <form onSubmit={handleLogin} className="login-form">
                  <div className="form-group">
                    <label htmlFor="Телефон">Телефон</label>
                    <input
                      type="tel"
                      id="Телефон"
                      name="Телефон"
                      value={formData.Телефон}
                      onChange={handleChange}
                      required
                      className="form-control"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="Пароль">Пароль</label>
                    <input
                      type="password"
                      id="Пароль"
                      name="Пароль"
                      value={formData.Пароль}
                      onChange={handleChange}
                      required
                      className="form-control"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-block"
                      disabled={loading}
                    >
                      {loading ? 'Вход...' : 'Войти'}
                    </button>
                  </div>

                  <div className="form-links">
                    <Link to="/forgot-password">Забыли пароль?</Link>
                  </div>
                </form>
              ) : (
                // Форма регистрации
                <form onSubmit={handleRegister} className="login-form">
                  <div className="form-group">
                    <label htmlFor="ФИО">ФИО *</label>
                    <input
                      type="text"
                      id="ФИО"
                      name="ФИО"
                      value={formData.ФИО}
                      onChange={handleChange}
                      required
                      className="form-control"
                      placeholder="Иванов Иван Иванович"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="Телефон">Телефон *</label>
                    <input
                      type="tel"
                      id="Телефон"
                      name="Телефон"
                      value={formData.Телефон}
                      onChange={handleChange}
                      required
                      className="form-control"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="Почта">Email</label>
                    <input
                      type="email"
                      id="Почта"
                      name="Почта"
                      value={formData.Почта}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="ivan@mail.ru"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="Пароль">Пароль *</label>
                    <input
                      type="password"
                      id="Пароль"
                      name="Пароль"
                      value={formData.Пароль}
                      onChange={handleChange}
                      required
                      className="form-control"
                      placeholder="Минимум 6 символов"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Подтвердите пароль *</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="form-control"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="form-checkbox">
                    <input type="checkbox" id="agree" required />
                    <label htmlFor="agree">
                      Я согласен с условиями обработки персональных данных
                    </label>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-block"
                      disabled={loading}
                    >
                      {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                  </div>
                </form>
              )}

              <div className="login-footer">
                <p>
                  {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
                  <button 
                    className="link-btn"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Зарегистрируйтесь' : 'Войдите'}
                  </button>
                </p>
              </div>
            </div>

            <div className="login-info">
              <h2>Личный кабинет</h2>
              <ul>
                <li>✓ Отслеживайте статус заказов</li>
                <li>✓ История выполненных работ</li>
                <li>✓ Редактирование профиля</li>
                <li>✓ Специальные предложения</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;