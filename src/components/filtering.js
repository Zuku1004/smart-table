export function initFiltering(elements) {
    
    const updateIndexes = (elements, indexes) => {
        if (elements && indexes) {
            Object.keys(indexes).forEach(elementName => {
                const element = elements[elementName];
                if (element && indexes[elementName]) {
                    element.innerHTML = '<option value="" selected>—</option>';
                    
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

    const applyFiltering = (query, state, action) => {
        const filter = {};
        
        // Фильтры, которые идут на сервер
        if (state.date && state.date.trim()) {
            filter['filter[date]'] = state.date.trim();
        }
        
        if (state.customer && state.customer.trim()) {
            filter['filter[customer]'] = state.customer.trim();
        }
        
        if (state.seller && state.seller.trim()) {
            filter['filter[seller]'] = state.seller.trim();
        }

        return Object.keys(filter).length > 0 
            ? Object.assign({}, query, filter) 
            : query;
    };

    //  НОВАЯ ФУНКЦИЯ: Фильтрация по Total на клиенте
    const applyClientFiltering = (items, state) => {
        let filteredItems = [...items];

        // Фильтр по totalFrom (от)
        if (state.totalFrom && state.totalFrom.trim()) {
            const minTotal = parseFloat(state.totalFrom);
            if (!isNaN(minTotal)) {
                filteredItems = filteredItems.filter(item => {
                    const itemTotal = parseFloat(item.total);
                    return !isNaN(itemTotal) && itemTotal >= minTotal;
                });
            }
        }

        // Фильтр по total (до)
        if (state.total && state.total.trim()) {
            const maxTotal = parseFloat(state.total);
            if (!isNaN(maxTotal)) {
                filteredItems = filteredItems.filter(item => {
                    const itemTotal = parseFloat(item.total);
                    return !isNaN(itemTotal) && itemTotal <= maxTotal;
                });
            }
        }

        return filteredItems;
    };

    return {
        updateIndexes,
        applyFiltering,
        applyClientFiltering //  Экспортирую новую функцию
    };
}