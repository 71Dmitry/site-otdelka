// форматирование даты
export const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};

// форматирование телефона
export const formatPhone = (phone) => {
  // +79001234567 -> +7 (900) 123-45-67
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }
  return phone;
};

// валидация email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// валидация телефона
export const validatePhone = (phone) => {
  const re = /^\+7\d{10}$/;
  return re.test(phone.replace(/\D/g, ''));
};

// получить цвет статуса
export const getStatusColor = (status) => {
  switch(status) {
    case 'Завершен':
      return '#4CAF50';
    case 'Выполняется':
      return '#2196F3';
    case 'Подтвержден':
      return '#FF9800';
    case 'Новый':
      return '#9C27B0';
    case 'Отменен':
      return '#f44336';
    default:
      return '#999';
  }
};

// получить текст статуса
export const getStatusText = (status) => {
  switch(status) {
    case 'Новый':
      return 'Ожидает подтверждения';
    case 'Подтвержден':
      return 'Подтвержден мастером';
    case 'Выполняется':
      return 'В работе';
    case 'Завершен':
      return 'Работа завершена';
    case 'Отменен':
      return 'Отменен';
    default:
      return status;
  }
};

// рассчитать стоимость
export const calculatePrice = (area, pricePerMeter, additionalWorks = []) => {
  let total = area * pricePerMeter;
  additionalWorks.forEach(work => {
    total += work.price;
  });
  return total;
};