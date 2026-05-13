import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ActPDF from '../components/ActPDF';
import {
  getAllBookings, addBooking, updateBooking, deleteBooking,
  getAllServicesAdmin, addService, updateService, deleteService,
  getAllMastersAdmin, addMaster, updateMaster, deleteMaster,
  getAllClients, addClient, updateClient, deleteClient,
  getAllCategories, addCategory, deleteCategory,
  getServiceTypes,
  getAllServiceTypesAdmin, addServiceType, deleteServiceType
} from '../api';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [masters, setMasters] = useState([]);
  const [clients, setClients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [currentPDFData, setCurrentPDFData] = useState(null);
  const [serviceTypesAdmin, setServiceTypesAdmin] = useState([]);

  const fetchAll = async () => {
  setLoading(true);
  try {
    const [bookRes, servRes, typesRes, mastRes, clientRes, catRes] = await Promise.all([
      getAllBookings(),
      getAllServicesAdmin(),
      getServiceTypes(),           
      getAllMastersAdmin(),
      getAllClients(),
      getAllCategories()
    ]);
    setBookings(bookRes.data);
    setServices(servRes.data);
    setServiceTypes(typesRes.data);       
    setServiceTypesAdmin(typesRes.data);   
    setMasters(mastRes.data);
    setClients(clientRes.data);
    setCategories(catRes.data);
  } catch (err) { console.error(err); }
  setLoading(false);
};

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 1) navigate('/');
    else {
      setCurrentUser(user);
      fetchAll();
    }
  }, [navigate]);

  const handleSubmit = async (e, action, data, id = null) => {
    e.preventDefault();
    try {
      if (id) await action(id, data);
      else await action(data);
      setEditingItem(null);
      fetchAll();
    } catch (err) { alert(err.response?.data?.error || 'Мастер уже занят в это время!'); }
  };

  const handleDelete = async (action, id, name, itemRole = null) => {
    if (currentUser && itemRole === 1 && currentUser.id === id) {
      alert('Вы не можете удалить свой собственный аккаунт администратора');
      return;
    }
    if (window.confirm(`Удалить ${name}?`)) {
      await action(id);
      fetchAll();
    }
  };

  const handleStatusChange = async (bookingId, newStatus, bookingData) => {
  try {
    // поиск полных данных клиента, мастера и услуги
    const fullClient = clients.find(c => c.id_c === bookingData.id_c);
    const fullMaster = masters.find(m => m.id_m === bookingData.id_m);
    const fullService = services.find(s => s.id_y === bookingData.id_y);
    
    await updateBooking(bookingId, { ...bookingData, Статус: newStatus });
    fetchAll();
    
    if (newStatus === 'Подтвержден') {
      setCurrentPDFData({
        ...bookingData,
        client: fullClient,
        master: fullMaster,
        service: fullService
      });
      setShowPDFModal(true);
    }
  } catch (error) {
    alert('Ошибка обновления статуса');
  }
};

  if (loading) return <div className="loader-container">Загрузка...</div>;

  return (
    <>
      <Helmet><title>Админ панель</title></Helmet>
      <div className="admin-page">
        <div className="container">
          <h1 className="page-title">Админ панель</h1>
          <div className="admin-tabs">
            <button className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>Заявки</button>
            <button className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>Услуги</button>
            <button className={activeTab === 'masters' ? 'active' : ''} onClick={() => setActiveTab('masters')}>Мастера</button>
            <button className={activeTab === 'clients' ? 'active' : ''} onClick={() => setActiveTab('clients')}>Клиенты</button>
            <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => setActiveTab('categories')}>Категории мастеров</button>
            <button className={activeTab === 'serviceTypes' ? 'active' : ''} onClick={() => setActiveTab('serviceTypes')}>Типы услуг</button>
          </div>

          {activeTab === 'bookings' && (
            <div>
              <h2>Управление заявками</h2>
              <button className="btn btn-primary" onClick={() => setEditingItem({})}>Добавить заявку</button>
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Дата</th><th>Клиент</th><th>Услуга</th><th>Мастер</th><th>Статус</th><th>Действия</th></tr></thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id_z}>
                      <td>#{b.id_z}</td><td>{new Date(b.Дата_время).toLocaleDateString()}</td>
                      <td>{b.Клиент}</td><td>{b.Услуга}</td><td>{b.Мастер}</td>
                      <td>
                        <select 
                          className="status-select"
                          value={b.Статус}
                          onChange={(e) => handleStatusChange(b.id_z, e.target.value, b)}
                        >
                          <option value="Новый">Новый</option>
                          <option value="Подтвержден">Подтвержден</option>
                          <option value="Выполняется">Выполняется</option>
                          <option value="Завершен">Завершен</option>
                          <option value="Отменен">Отменен</option>
                        </select>
                      </td>
                      <td><button onClick={() => setEditingItem(b)}>Изменить</button><button onClick={() => handleDelete(deleteBooking, b.id_z, 'заявку')}>Удалить</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {editingItem && (
                <form onSubmit={(e) => handleSubmit(e, editingItem.id_z ? updateBooking : addBooking, editingItem, editingItem.id_z)} className="admin-form">
                  <input type="datetime-local" value={editingItem.Дата_время || ''} onChange={e => setEditingItem({...editingItem, Дата_время: e.target.value})} required />
                  <select value={editingItem.id_c || ''} onChange={e => setEditingItem({...editingItem, id_c: e.target.value})} required><option value="">Клиент</option>{clients.map(c => <option key={c.id_c} value={c.id_c}>{c.ФИО}</option>)}</select>
                  <select value={editingItem.id_y || ''} onChange={e => setEditingItem({...editingItem, id_y: e.target.value})} required><option value="">Услуга</option>{services.map(s => <option key={s.id_y} value={s.id_y}>{s.Название}</option>)}</select>
                  <select value={editingItem.id_m || ''} onChange={e => setEditingItem({...editingItem, id_m: e.target.value})} required><option value="">Мастер</option>{masters.map(m => <option key={m.id_m} value={m.id_m}>{m.ФИО}</option>)}</select>
                  <select value={editingItem.Статус || 'Новый'} onChange={e => setEditingItem({...editingItem, Статус: e.target.value})}>
                    <option>Новый</option><option>Подтвержден</option><option>Выполняется</option><option>Завершен</option><option>Отменен</option>
                  </select>
                  <button type="submit">Сохранить</button><button type="button" onClick={() => setEditingItem(null)}>Отмена</button>
                </form>
              )}
            </div>
          )}

          {activeTab === 'services' && (
            <div>
              <h2>Управление услугами</h2>
              <button className="btn btn-primary" onClick={() => setEditingItem({})}>Добавить услугу</button>
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Название</th><th>Тип</th><th>Цена (₽/м²)</th><th>Действия</th></tr></thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s.id_y}>
                      <td>#{s.id_y}</td><td>{s.Название}</td><td>{s.Тип_услуги}</td><td>{s.Цена}</td>
                      <td><button onClick={() => setEditingItem(s)}>Изменить</button><button onClick={() => handleDelete(deleteService, s.id_y, 'услугу')}>Удалить</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {editingItem && (
                <form onSubmit={(e) => handleSubmit(e, editingItem.id_y ? updateService : addService, editingItem, editingItem.id_y)} className="admin-form">
                  <input type="text" placeholder="Название" value={editingItem.Название || ''} onChange={e => setEditingItem({...editingItem, Название: e.target.value})} required />
                  <select value={editingItem.id_ty || ''} onChange={e => setEditingItem({...editingItem, id_ty: e.target.value})} required><option value="">Тип услуги</option>{serviceTypes.map(t => <option key={t.id_ty} value={t.id_ty}>{t.Название}</option>)}</select>
                  <input type="number" step="0.01" placeholder="Цена" value={editingItem.Цена || ''} onChange={e => setEditingItem({...editingItem, Цена: e.target.value})} required />
                  <button type="submit">Сохранить</button><button type="button" onClick={() => setEditingItem(null)}>Отмена</button>
                </form>
              )}
            </div>
          )}

          {activeTab === 'masters' && (
            <div>
              <h2>Управление мастерами</h2>
              <button className="btn btn-primary" onClick={() => setEditingItem({})}>Добавить мастера</button>
              <table className="admin-table">
                <thead><tr><th>ID</th><th>ФИО</th><th>Телефон</th><th>Email</th><th>Категория</th><th>Действия</th></tr></thead>
                <tbody>
                  {masters.map(m => (
                    <tr key={m.id_m}>
                      <td>#{m.id_m}</td><td>{m.ФИО}</td><td>{m.Телефон}</td><td>{m.Почта || '-'}</td><td>{m.Категория}</td>
                      <td><button onClick={() => setEditingItem(m)}>Изменить</button><button onClick={() => handleDelete(deleteMaster, m.id_m, 'мастера')}>Удалить</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {editingItem && (
                <form onSubmit={(e) => handleSubmit(e, editingItem.id_m ? updateMaster : addMaster, editingItem, editingItem.id_m)} className="admin-form">
                  <input type="text" placeholder="ФИО" value={editingItem.ФИО || ''} onChange={e => setEditingItem({...editingItem, ФИО: e.target.value})} required />
                  <input type="tel" placeholder="Телефон" value={editingItem.Телефон || ''} onChange={e => setEditingItem({...editingItem, Телефон: e.target.value})} required />
                  <input type="email" placeholder="Email" value={editingItem.Почта || ''} onChange={e => setEditingItem({...editingItem, Почта: e.target.value})} />
                  <select value={editingItem.id_k || ''} onChange={e => setEditingItem({...editingItem, id_k: e.target.value})} required><option value="">Категория</option>{categories.map(c => <option key={c.id_k} value={c.id_k}>{c.Наименование}</option>)}</select>
                  <button type="submit">Сохранить</button><button type="button" onClick={() => setEditingItem(null)}>Отмена</button>
                </form>
              )}
            </div>
          )}

          {activeTab === 'clients' && (
            <div>
              <h2>Управление клиентами</h2>
              <button className="btn btn-primary" onClick={() => setEditingItem({})}>Добавить клиента</button>
              <table className="admin-table">
                <thead><tr><th>ID</th><th>ФИО</th><th>Телефон</th><th>Email</th><th>Роль</th><th>Действия</th></tr></thead>
                <tbody>
                  {clients.map(c => {
                    const isSelf = currentUser && currentUser.id === c.id_c && currentUser.role === 1;
                    return (
                      <tr key={c.id_c}>
                        <td>#{c.id_c}</td><td>{c.ФИО}</td><td>{c.Телефон}</td><td>{c.Почта || '-'}</td>
                        <td>{c.id_r === 1 ? 'Админ' : c.id_r === 2 ? 'Мастер' : 'Клиент'}</td>
                        <td>
                          <button onClick={() => setEditingItem(c)}>Изменить</button>
                          {!isSelf && <button onClick={() => handleDelete(deleteClient, c.id_c, 'клиента', c.id_r)}>Удалить</button>}
                          {isSelf && <button disabled style={{opacity:0.5}} title="Нельзя удалить себя">Удалить</button>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {editingItem && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const isSelf = currentUser && currentUser.id === editingItem.id_c;
                  const newRole = parseInt(editingItem.id_r);
                  if (isSelf && newRole !== 1) {
                    alert('Вы не можете понизить свой собственный аккаунт администратора до клиента');
                    return;
                  }
                  handleSubmit(e, editingItem.id_c ? updateClient : addClient, editingItem, editingItem.id_c);
                }} className="admin-form">
                  <input type="text" placeholder="ФИО" value={editingItem.ФИО || ''} onChange={e => setEditingItem({...editingItem, ФИО: e.target.value})} required />
                  <input type="tel" placeholder="Телефон" value={editingItem.Телефон || ''} onChange={e => setEditingItem({...editingItem, Телефон: e.target.value})} required />
                  <input type="email" placeholder="Email" value={editingItem.Почта || ''} onChange={e => setEditingItem({...editingItem, Почта: e.target.value})} />
                  <input type="password" placeholder="Пароль (можно не трогать)" onChange={e => setEditingItem({...editingItem, Пароль: e.target.value})} />
                  {currentUser && currentUser.id === editingItem.id_c ? (
                    <input type="text" value="Администратор" disabled style={{background:'#f0f0f0'}} />
                  ) : (
                    <select value={editingItem.id_r || 3} onChange={e => setEditingItem({...editingItem, id_r: e.target.value})}>
                      <option value={1}>Администратор</option>
                      <option value={3}>Клиент</option>
                    </select>
                  )}
                  <button type="submit">Сохранить</button>
                  <button type="button" onClick={() => setEditingItem(null)}>Отмена</button>
                </form>
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <h2>Управление категориями (для мастеров)</h2>
              <form onSubmit={async (e) => {
                  e.preventDefault();
                  const name = e.target.categoryName.value;
                  if (!name) return;
                  try {
                      await addCategory(name);
                      e.target.categoryName.value = '';
                      fetchAll();
                  } catch (err) {
                      alert('Ошибка добавления категории');
                  }
              }} className="admin-form">
                <input type="text" name="categoryName" placeholder="Название категории" required />
                <button type="submit">Добавить</button>
              </form>
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Название</th><th>Действия</th></tr></thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c.id_k}>
                      <td>#{c.id_k}</td>
                      <td>{c.Наименование}</td>
                      <td><button onClick={() => handleDelete(deleteCategory, c.id_k, 'категорию')}>Удалить</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'serviceTypes' && (
            <div>
              <h2>Управление типами услуг</h2>
              <form onSubmit={async (e) => {
                  e.preventDefault();
                  const name = e.target.serviceTypeName.value;
                  if (!name) return;
                  try {
                      await addServiceType({ Название: name });  // ← передаём объект, а не строку
                      e.target.serviceTypeName.value = '';
                      fetchAll();
                  } catch (err) {
                      alert(err.response?.data?.error || 'Ошибка добавления типа услуги');
                  }
              }} className="admin-form">
                <input type="text" name="serviceTypeName" placeholder="Название типа услуги" required />
                <button type="submit">Добавить</button>
              </form>
              <table className="admin-table">
                <thead>
                  <tr><th>ID</th><th>Название</th><th>Действия</th></tr>
                </thead>
                <tbody>
                  {serviceTypesAdmin.map(t => (
                    <tr key={t.id_ty}>
                      <td>#{t.id_ty}</td>
                      <td>{t.Название}</td>
                      <td>
                        <button onClick={() => {
                          if (window.confirm(`Удалить тип услуги "${t.Название}"?`)) {
                            deleteServiceType(t.id_ty).then(() => fetchAll()).catch(err => alert(err.response?.data?.error || 'Ошибка'));
                          }
                        }}>Удалить</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {serviceTypesAdmin.length === 0 && <p>Нет типов услуг. Добавьте первый!</p>}
            </div>
          )}
        </div>

{showPDFModal && currentPDFData && (
    <ActPDF 
        booking={currentPDFData}
        client={currentPDFData.client}
        master={currentPDFData.master}
        service={currentPDFData.service}
        onClose={() => setShowPDFModal(false)}
    />
)}
      </div>
    </>
  );
};

export default Admin;