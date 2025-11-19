import { getPages } from '../lib/utils.js';

export function initPagination(elements, createPage) {
    const { pages, fromRow, toRow, totalRows } = elements;
    
    let pageTemplate;
    if (pages && pages.firstElementChild) {
        pageTemplate = pages.firstElementChild.cloneNode(true);
        pages.firstElementChild.remove();
    }
    
    return (data, state, action) => {
        const rowsPerPage = state.rowsPerPage;
        const pageCount = Math.ceil(data.length / rowsPerPage);
        let page = Math.max(1, Math.min(state.page, pageCount || 1));
        
        // Обработка действий
        if (action) {
            switch(action.name) {
                case 'prev':
                    page = Math.max(1, page - 1);
                    break;
                case 'next':
                    page = Math.min(pageCount, page + 1);
                    break;
                case 'first':
                    page = 1;
                    break;
                case 'last':
                    page = pageCount;
                    break;
            }
        }
        
        // Пагинация данных
        const skip = (page - 1) * rowsPerPage;
        const paginatedData = data.slice(skip, skip + rowsPerPage);
        
        // Обновление отображения страниц
        if (pageTemplate && pages) {
            const visiblePages = getPages(page, pageCount, 5);
            const pageElements = visiblePages.map(pageNumber => {
                const el = pageTemplate.cloneNode(true);
                return createPage(el, pageNumber, pageNumber === page);
            });
            pages.replaceChildren(...pageElements);
        }
        
        // Статус пагинации
        if (fromRow && toRow && totalRows) {
            fromRow.textContent = data.length > 0 ? skip + 1 : 0;
            toRow.textContent = Math.min(skip + rowsPerPage, data.length);
            totalRows.textContent = data.length;
        }
        
        return paginatedData;
    };
}