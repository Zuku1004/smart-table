import { createComparison, defaultRules } from '../lib/compare.js';

export function initFiltering(elements, indexes) {
    // @todo: #4.1 Заполнение выпадающих списков
    Object.keys(indexes).forEach(elementName => {
        const element = elements[elementName];
        if (element && indexes[elementName]) {
            const values = Object.values(indexes[elementName]);
            
            values.forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                element.append(option);
            });
        }
    });
    
    const compare = createComparison(['skipEmptyTargetValues', 'equals']);
    
    return (data, state, action) => {
        // @todo: #4.2 Очистка фильтров
        if (action && action.name === 'clearFilters') {
            const inputs = elements.controls?.queryAll('select, input[type="text"]') || [];
            inputs.forEach(input => {
                input.value = '';
            });
            
            // Обновляем state
            Object.keys(state).forEach(key => {
                if (key !== 'rowsPerPage' && key !== 'page') {
                    state[key] = '';
                }
            });
        }
        
        // @todo: #4.5 Применение фильтрации
        return data.filter(row => compare(row, state));
    };
}