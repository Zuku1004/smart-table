import { initData } from './data/index.js';
import { initTable } from './components/table.js';
import { initPagination } from './components/pagination.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';

function main() {
    // Инициализация данных
    const { data: sourceData, indexes } = initData();
    
    // Инициализация таблицы с дополнительными шаблонами
    const sampleTable = initTable({
        before: ['search', 'filter', 'header'],
        after: ['pagination']
    });
    
    // @todo: Инициализация модулей
    const applySearching = initSearching('search', ['product', 'category', 'seller']);
    const applyFiltering = initFiltering(sampleTable.filter.elements, indexes);
    const applySorting = initSorting([
        sampleTable.header.elements.sortId,
        sampleTable.header.elements.sortProduct,
        sampleTable.header.elements.sortCategory,
        sampleTable.header.elements.sortPrice,
        sampleTable.header.elements.sortQuantity,
        sampleTable.header.elements.sortTotal,
        sampleTable.header.elements.sortStatus,
        sampleTable.header.elements.sortDate
    ]);
    
    const applyPagination = initPagination(
        sampleTable.pagination.elements,
        (el, page, isCurrent) => {
            const input = el.querySelector('input');
            const label = el.querySelector('span');
            if (input) input.value = page;
            if (input) input.checked = isCurrent;
            if (label) label.textContent = page;
            return el;
        }
    );
    
    // Функция обновления таблицы
    function updateTable(action) {
        const state = sampleTable.collectState();
        
        let result = [...sourceData];
        result = applySearching(result, state, action);
        result = applyFiltering(result, state, action);
        result = applySorting(result, state, action);
        result = applyPagination(result, state, action);
        
        sampleTable.update(result);
    }
    
    // Привязка событий
    sampleTable.bindEvents(updateTable);
    
    // Первоначальная отрисовка
    const app = document.getElementById('app');
    if (app) {
        app.append(sampleTable.root.container);
        updateTable();
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', main);