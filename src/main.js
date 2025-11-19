import { initData } from './data/index.js';
import { initTable } from './components/table.js';
import { initPagination } from './components/pagination.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';

function main() {
    try {
        // Инициализация данных
        const { data: sourceData, indexes } = initData();
        
        // Инициализация таблицы с дополнительными шаблонами
        const sampleTable = initTable({
            before: ['search', 'filter', 'header'],
            after: ['pagination']
        });

        // Проверка загрузки шаблонов
        if (!sampleTable.root) {
            throw new Error('Failed to initialize table');
        }

        // Безопасная инициализация сортировки
        const sortColumns = [];
        if (sampleTable.header?.elements) {
            const elements = sampleTable.header.elements;
            const availableColumns = [
                'sortId', 'sortProduct', 'sortCategory', 'sortPrice', 
                'sortQuantity', 'sortTotal', 'sortStatus', 'sortDate'
            ];
            
            availableColumns.forEach(colName => {
                if (elements[colName]) {
                    sortColumns.push(elements[colName]);
                }
            });
        }

        // Инициализация модулей
        const applySearching = initSearching('search', ['product', 'category', 'seller', 'status']);
        const applyFiltering = initFiltering(sampleTable.filter?.elements || {}, indexes);
        const applySorting = initSorting(sortColumns);
        
        const applyPagination = initPagination(
            sampleTable.pagination?.elements || {},
            (el, page, isCurrent) => {
                const input = el.querySelector('input');
                const label = el.querySelector('span');
                if (input) {
                    input.value = page;
                    input.checked = isCurrent;
                }
                if (label) {
                    label.textContent = page;
                }
                return el;
            }
        );

        // Функция обновления таблицы
        function updateTable(action) {
            try {
                const state = sampleTable.collectState();
                
                let result = [...sourceData];
                result = applySearching(result, state, action);
                result = applyFiltering(result, state, action);
                result = applySorting(result, state, action);
                result = applyPagination(result, state, action);
                
                sampleTable.update(result);
            } catch (error) {
                console.error('Error updating table:', error);
            }
        }

        // Привязка событий
        sampleTable.bindEvents(updateTable);
        
        // Первоначальная отрисовка
        const app = document.getElementById('app');
        if (app) {
            app.append(sampleTable.root.container);
            updateTable();
        } else {
            console.error('App container not found');
        }

    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', main);