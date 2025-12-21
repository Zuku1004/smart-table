export function initSearching({ input }) {
    return (query, state, action) => {
        // Проверяем, есть ли текст в поле поиска
        // state.search содержит значение из поля ввода "search"
        if (state.search && state.search.trim()) {
            // Добавляем параметр search к запросу
            return Object.assign({}, query, { 
                search: state.search.trim() 
            });
        }
        
        // Если поле поиска пустое, возвращаем query без изменений
        return query;
    };
}