export function initFiltering(elements) {
    
    // Функция для заполнения выпадающих списков (например, продавцами)
    const updateIndexes = (elements, indexes) => {
        if (elements && indexes) {
            Object.keys(indexes).forEach(elementName => {
                const element = elements[elementName];
                if (element && indexes[elementName]) {
                    // Очищаем список перед заполнением
                    element.innerHTML = '';
                    
                    // Добавляем всех продавцов из indexes
                    const values = Object.values(indexes[elementName]);
                    values.forEach(value => {
                        const option = document.createElement('option');
                        option.value = value;
                        option.textContent = value;
                        element.append(option);
                    });
                }
            });
        }
    };

    // Основная функция: формирует параметры фильтрации для сервера
    const applyFiltering = (query, state, action) => {
        // Очистка фильтров (если нажата кнопка "Очистить")
        if (action && action.name === 'clearFilters' && elements.controls) {
            const inputs = elements.controls.querySelectorAll('select, input[type="text"]');
            inputs.forEach(input => {
                input.value = '';
            });
        }

        // Формируем объект filter для query-параметров
        const filter = {};
        
        // Проходим по всем элементам фильтрации
        Object.keys(elements).forEach(key => {
            const element = elements[key];
            
            // Проверяем, что это поле ввода/выбора И у него есть значение
            if (element && ['INPUT', 'SELECT'].includes(element.tagName) && element.value) {
                // Ключевое исправление: формируем параметр filter[fieldName]
                filter[`filter[${element.name}]`] = element.value;
            }
        });

        // Если есть какие-то фильтры - добавляем их к query
        return Object.keys(filter).length > 0 
            ? Object.assign({}, query, filter) 
            : query;
    };

    // Возвращаем две функции вместо одной
    return {
        updateIndexes,
        applyFiltering
    };
}