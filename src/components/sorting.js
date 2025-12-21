const sortMap = {
    'none': 'up',
    'up': 'down',
    'down': 'none'
};

export function initSorting(columns) {
    return (query, state, action) => {  // Изменил data на query для ясности
        let field = '';
        let order = 'none';
        
        // Обработка действий сортировки
        if (action && action.dataset?.field) {
            const currentValue = action.dataset.value || 'none';
            action.dataset.value = sortMap[currentValue];
            field = action.dataset.field;
            order = action.dataset.value;
            
            // Сброс других колонок
            columns.forEach(column => {
                if (column.dataset.field !== action.dataset.field) {
                    column.dataset.value = 'none';
                }
            });
        }
        
        // Применение текущей сортировки
        columns.forEach(column => {
            if (column.dataset.value !== 'none') {
                field = column.dataset.field;
                order = column.dataset.value;
            }
        });
        
        // Обновление отображения заголовков
        columns.forEach(column => {
            const baseText = column.textContent.replace(/[▲▼]$/, '').trim();
            const indicator = column.dataset.value === 'up' ? ' ▲' : 
                            column.dataset.value === 'down' ? ' ▼' : '';
            column.textContent = baseText + indicator;
        });
        
        // Вместо сортировки данных возвращаем параметры для сервера
        const sort = (field && order !== 'none') ? `${field}:${order}` : null;
        
        // Если сортировка есть - добавляем её в query-параметры
        return sort ? Object.assign({}, query, { sort }) : query;
    };
}