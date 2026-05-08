import React from 'react';

const ActPDF = ({ booking, client, master, service, onClose }) => {
    const generatePDF = () => {
        const element = document.getElementById('act-content');
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: `akt_${booking?.id_z || '___'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, letterRendering: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        import('html2pdf.js').then(html2pdf => {
            html2pdf.default().set(opt).from(element).save();
        });
    };

    return (
        <div className="pdf-modal" onClick={onClose}>
            <div className="pdf-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }}>
                <h3>Акт выполненных работ</h3>
                <div id="act-content" style={{ padding: '20px', background: 'white', fontFamily: 'Arial' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2>АКТ №{booking?.id_z || '___'}</h2>
                        <p>от {new Date().toLocaleDateString('ru-RU')}</p>
                        <p>на выполнение отделочных работ</p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ background: '#f0f0f0', padding: '5px' }}>1. ЗАКАЗЧИК</h3>
                        <p><strong>ФИО:</strong> {client?.ФИО || '_______________'}</p>
                        <p><strong>Телефон:</strong> {client?.Телефон || '_______________'}</p>
                        <p><strong>Email:</strong> {client?.Почта || '_______________'}</p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ background: '#f0f0f0', padding: '5px' }}>2. ИСПОЛНИТЕЛЬ</h3>
                        <p><strong>Мастер:</strong> {master?.ФИО || '_______________'}</p>
                        <p><strong>Телефон:</strong> {master?.Телефон || '_______________'}</p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ background: '#f0f0f0', padding: '5px' }}>3. ПЕРЕЧЕНЬ РАБОТ</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#4CAF50', color: 'white' }}>
                                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>№</th>
                                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Наименование работ</th>
                                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Цена (₽/м²)</th>
                                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Стоимость</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>1</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{service?.Название || 'Отделочные работы'}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{service?.Цена || 0} ₽</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>по факту</td>
                                </tr>
                            </tbody>
                        </table>
                        <p style={{ textAlign: 'right', marginTop: '10px' }}><strong>Итого:___________________ руб.</strong></p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ background: '#f0f0f0', padding: '5px' }}>4. СРОКИ ВЫПОЛНЕНИЯ</h3>
                        <p><strong>Дата начала:</strong> {booking?.Дата_время ? new Date(booking.Дата_время).toLocaleDateString('ru-RU') : '_______________'}</p>
                        <p><strong>Дата окончания:</strong>___________ (заполняется по факту)</p>
                    </div>

                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ textAlign: 'center' }}>
                            <p>Заказчик</p>
                            <p>_______________ /{client?.ФИО?.split(' ')[0] || ''}/</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p>Исполнитель</p>
                            <p>_______________ /{master?.ФИО?.split(' ')[0] || ''}/</p>
                        </div>
                    </div>

                    <p style={{ marginTop: '30px', fontSize: '10px', textAlign: 'center', color: '#999' }}>
                        Акт сформирован автоматически в системе ОтделкаПрофи
                    </p>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button className="btn btn-primary" onClick={generatePDF}>
                        Скачать акт (PDF)
                    </button>
                    <button className="btn btn-outline" onClick={onClose}>
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActPDF;