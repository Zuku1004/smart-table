const sortMap = {
    'none': 'up',
    'up': 'down',
    'down': 'none'
};

export function initSorting(columns) {
    return (query, state, action) => {
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
        
        //  ИСПРАВЛЕНО: Правильное поле для API
        // Для сервера: date = date, total = total 
        let serverField = field;
        if (field === 'date') {
            serverField = 'date';
        } else if (field === 'total') {
            serverField = 'total'; // НЕ total_amount!
        }
        
        //  Формат
        const sort = (serverField && order !== 'none') ? `${serverField}:${order}` : null;
        
        return sort ? Object.assign({}, query, { sort }) : query;
    };
}