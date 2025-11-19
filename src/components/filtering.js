import { createComparison, defaultRules } from '../lib/compare.js';

export function initFiltering(elements, indexes) {
    // Заполнение выпадающих списков
    if (elements && indexes) {
        Object.keys(indexes).forEach(elementName => {
            const element = elements[elementName];
            if (element && indexes[elementName]) {
                const values = Object.values(indexes[elementName]);
                
                // Добавляем опцию "Все"
                const allOption = document.createElement('option');
                allOption.value = 'all';
                allOption.textContent = 'Все';
                element.append(allOption);
                
                values.forEach(value => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = value;
                    element.append(option);
                });
            }
        });
    }
    
    const compare = createComparison(['skipEmptyTargetValues', 'equals']);
    
    return (data, state, action) => {
        // Очистка фильтров
        if (action && action.name === 'clearFilters' && elements.controls) {
            const inputs = elements.controls.querySelectorAll('select, input[type="text"]');
            inputs.forEach(input => {
                input.value = '';
            });
        }
        
        // Применение фильтрации
        return data.filter(row => compare(row, state));
    };
}