import { getPages } from '../lib/utils.js';

export function initPagination(elements) {
    const { pages, fromRow, toRow, totalRows } = elements;
    
    let pageTemplate;
    let pageCount;
    
    // ФУНКЦИЯ 1: формирует параметры для запроса (ДО получения данных)
    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;
        
        // Обработка действий пагинации
        if (action && action.name) {
            switch(action.name) {
                case 'prev':
                    page = Math.max(1, page - 1);
                    break;
                case 'next':
                    page = Math.min(pageCount || page, page + 1);
                    break;
                case 'first':
                    page = 1;
                    break;
                case 'last':
                    page = pageCount || page;
                    break;
            }
        }
        
        // Возвращаем query с добавленными параметрами пагинации
        return Object.assign({}, query, {
            limit,
            page
        });
    };
    
    // ФУНКЦИЯ 2: обновляет UI пагинатора (ПОСЛЕ получения данных)
    const updatePagination = (total, { page, limit }) => {
        // Пересчитываем количество страниц на основе total с сервера
        pageCount = Math.ceil(total / limit);
        
        // Обновление отображения страниц
        if (pages) {
            // Сохраняем шаблон при первом вызове
            if (!pageTemplate && pages.firstElementChild) {
                pageTemplate = pages.firstElementChild.cloneNode(true);
            }
            
            if (pageTemplate) {
                const visiblePages = getPages(page, pageCount, 5);
                const pageElements = visiblePages.map(pageNumber => {
                    const el = pageTemplate.cloneNode(true);
                    const input = el.querySelector('input');
                    const span = el.querySelector('span');
                    
                    if (input) {
                        input.value = pageNumber;
                        input.checked = pageNumber === page;
                    }
                    if (span) {
                        span.textContent = pageNumber;
                    }
                    
                    return el;
                });
                
                pages.replaceChildren(...pageElements);
            }
        }
        
        // Обновление статуса пагинации (показано X-Y из Z строк)
        if (fromRow && toRow && totalRows) {
            const skip = (page - 1) * limit;
            fromRow.textContent = total > 0 ? skip + 1 : 0;
            toRow.textContent = Math.min(skip + limit, total);
            totalRows.textContent = total;
        }
    };
    
    // Возвращаем обе функции
    return {
        applyPagination,
        updatePagination
    };
}
