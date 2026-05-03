import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getClientBookings, cancelBooking, updateProfile, updatePassword } from '../api';
import { formatDate, getStatusColor, getStatusText } from '../utils/helpers';
import Loader from '../components/Loader';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [message, setMessage] = useState({ text: '', type: '' });

  // состояния для форм редактирования
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [profileForm, setProfileForm] = useState({
    ФИО: '',
    Телефон: '',
    Почта: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setProfileForm({
      ФИО: parsedUser.ФИО || '',
      Телефон: parsedUser.Телефон || '',
      Почта: parsedUser.Почта || ''
    });
    fetchBookings(parsedUser.id);
  }, [navigate]);

  const fetchBookings = async (clientId) => {
    try {
      const response = await getClientBookings(clientId);
      setBookings(response.data);
    } catch (error) {
      console.error('Ошибка загрузки записей:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Вы уверены, что хотите отменить запись?')) {
      try {
        await cancelBooking(bookingId);
        const userData = JSON.parse(localStorage.getItem('user'));
        fetchBookings(userData.id);
        setMessage({ text: 'Запись успешно отменена', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } catch (error) {
        setMessage({ text: 'Не удалось отменить запись', type: 'error' });
      }
    }
  };

  // валидация профиля
  const validateProfileForm = () => {
    const newErrors = {};
    if (!profileForm.ФИО.trim()) {
      newErrors.ФИО = 'Введите ФИО';
    } else if (profileForm.ФИО.length < 5) {
      newErrors.ФИО = 'ФИО должно содержать минимум 5 символов';
    }
    if (!profileForm.Телефон.trim()) {
      newErrors.Телефон = 'Введите номер телефона';
    } else {
      const cleaned = profileForm.Телефон.replace(/\D/g, '');
      if (!/^7\d{10}$/.test(cleaned)) {
        newErrors.Телефон = 'Введите номер в формате +7XXXXXXXXXX';
      }
    }
    if (profileForm.Почта && profileForm.Почта.trim() !== '') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(profileForm.Почта)) {
        newErrors.Почта = 'Введите корректный email';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // сохранение профиля
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    try {
      await updateProfile(user.id, profileForm);
      const updatedUser = { ...user, ...profileForm };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setShowProfileForm(false);
      setMessage({ text: 'Профиль успешно обновлён', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Ошибка обновления профиля', type: 'error' });
    }
  };

  // валидация пароля
  const validatePasswordForm = () => {
    const newErrors = {};
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'Введите новый пароль';
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Пароль должен содержать минимум 6 символов';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // смена пароля
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    try {
      await updatePassword(user.id, { Пароль: passwordForm.newPassword });
      setShowPasswordForm(false);
      setPasswordForm({ newPassword: '', confirmPassword: '' });
      setMessage({ text: 'Пароль успешно изменён', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Ошибка смены пароля', type: 'error' });
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Helmet>
        <title>Личный кабинет | РемонтПрофи</title>
      </Helmet>

      <div className="profile-page">
        <div className="container">
          <div className="profile-header">
            <h1>Личный кабинет</h1>
          </div>

          {message.text && (
            <div className={`profile-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="profile-grid">
            {/* боковая панель */}
            <div className="profile-sidebar">
              <div className="user-card">
                <div className="user-avatar">
                  {user?.ФИО?.charAt(0) || 'П'}
                </div>
                <h2>{user?.ФИО || 'Пользователь'}</h2>
                <p className="user-phone">{user?.Телефон}</p>
                <p className="user-email">{user?.Почта || 'Email не указан'}</p>
                <div className="user-actions">
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => { setShowProfileForm(true); setShowPasswordForm(false); }}
                  >
                    Редактировать профиль
                  </button>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => { setShowPasswordForm(true); setShowProfileForm(false); }}
                  >
                    Сменить пароль
                  </button>
                </div>
              </div>

              <div className="sidebar-menu">
                <button 
                  className={`menu-item ${activeTab === 'bookings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bookings')}
                >
                  Мои записи
                </button>
                <button 
                  className={`menu-item ${activeTab === 'history' ? 'active' : ''}`}
                  onClick={() => setActiveTab('history')}
                >
                  История
                </button>
              </div>
            </div>

            {/* основной контент */}
            <div className="profile-content">
              {/* форма редактирования профиля (показывается поверх записей, если активна) */}
              {showProfileForm && (
                <div className="edit-form-overlay">
                  <div className="edit-form-card">
                    <h3>Редактирование профиля</h3>
                    <form onSubmit={handleProfileUpdate}>
                      <div className="form-group">
                        <label>ФИО *</label>
                        <input 
                          type="text"
                          value={profileForm.ФИО}
                          onChange={(e) => setProfileForm({...profileForm, ФИО: e.target.value})}
                          className={`form-control ${errors.ФИО ? 'error' : ''}`}
                        />
                        {errors.ФИО && <span className="error-text">{errors.ФИО}</span>}
                      </div>

                      <div className="form-group">
                        <label>Телефон *</label>
                        <input 
                          type="tel"
                          value={profileForm.Телефон}
                          onChange={(e) => setProfileForm({...profileForm, Телефон: e.target.value})}
                          className={`form-control ${errors.Телефон ? 'error' : ''}`}
                        />
                        {errors.Телефон && <span className="error-text">{errors.Телефон}</span>}
                      </div>

                      <div className="form-group">
                        <label>Email</label>
                        <input 
                          type="email"
                          value={profileForm.Почта}
                          onChange={(e) => setProfileForm({...profileForm, Почта: e.target.value})}
                          className={`form-control ${errors.Почта ? 'error' : ''}`}
                        />
                        {errors.Почта && <span className="error-text">{errors.Почта}</span>}
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="btn btn-primary">Сохранить</button>
                        <button type="button" className="btn btn-outline" onClick={() => setShowProfileForm(false)}>Отмена</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* форма смены пароля */}
              {showPasswordForm && (
                <div className="edit-form-overlay">
                  <div className="edit-form-card">
                    <h3>Смена пароля</h3>
                    <form onSubmit={handlePasswordChange}>
                      <div className="form-group">
                        <label>Новый пароль *</label>
                        <input 
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          className={`form-control ${errors.newPassword ? 'error' : ''}`}
                        />
                        {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
                      </div>

                      <div className="form-group">
                        <label>Подтвердите пароль *</label>
                        <input 
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                        />
                        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="btn btn-primary">Сменить пароль</button>
                        <button type="button" className="btn btn-outline" onClick={() => setShowPasswordForm(false)}>Отмена</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* вкладка записей */}
              {activeTab === 'bookings' && !showProfileForm && !showPasswordForm && (
                <div className="bookings-section">
                  <h2>Мои записи</h2>
                  {bookings.length === 0 ? (
                    <div className="no-bookings">
                      <p>У вас пока нет записей</p>
                      <button className="btn btn-primary" onClick={() => navigate('/services')}>
                        Выбрать услугу
                      </button>
                    </div>
                  ) : (
                    <div className="bookings-list">
                      {bookings.map(booking => (
                        <div key={booking.id_z} className="booking-card">
                          <div className="booking-header">
                            <span className="booking-status" style={{ backgroundColor: getStatusColor(booking.Статус) }}>
                              {getStatusText(booking.Статус)}
                            </span>
                            <span className="booking-date">{formatDate(booking.Дата_время)}</span>
                          </div>
                          <div className="booking-body">
                            <div className="booking-info">
                              <h3>{booking.Услуга}</h3>
                              <p><strong>Мастер:</strong> {booking.Мастер}</p>
                              <p><strong>Телефон мастера:</strong> {booking.Телефон_мастера}</p>
                              <p><strong>Стоимость:</strong> {booking.Цена} ₽/м²</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* вкладка истории */}
              {activeTab === 'history' && !showProfileForm && !showPasswordForm && (
                <div className="history-section">
                  <h2>История выполненных работ</h2>
                  {bookings.filter(b => b.Статус === 'Завершен').length === 0 ? (
                    <div className="no-history"><p>У вас пока нет завершённых работ</p></div>
                  ) : (
                    <div className="history-list">
                      {bookings.filter(b => b.Статус === 'Завершен').map(booking => (
                        <div key={booking.id_z} className="history-item">
                          <div className="history-date">{formatDate(booking.Дата_время)}</div>
                          <div className="history-details">
                            <h4>{booking.Услуга}</h4>
                            <p>Мастер: {booking.Мастер}</p>
                            <p>Стоимость: {booking.Цена} ₽/м²</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;