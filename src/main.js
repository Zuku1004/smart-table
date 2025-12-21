import { initData } from './data/index.js';
import sampleTable from './sampleTable.js';
import { initPagination } from './components/pagination.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';

// Инициализация API (БЕЗ передачи sourceData)
const api = initData();

// Инициализация компонентов (используем sampleTable, а не initTable)
const { applyPagination, updatePagination } = initPagination(sampleTable.pagination.elements);
const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements);
const applySorting = initSorting(sampleTable.header.elements);
const applySearching = initSearching({ input: sampleTable.search.elements.searchInput });

// Функция сбора состояния из элементов таблицы
function collectState() {
    return {
        page: parseInt(document.querySelector('input[name="page"]:checked')?.value) || 1,
        rowsPerPage: parseInt(document.querySelector('select[name="rowsPerPage"]')?.value) || 10,
        seller: document.querySelector('select[name="seller"]')?.value || '',
        customer: document.querySelector('input[name="customer"]')?.value || '',
        date: document.querySelector('input[name="date"]')?.value || '',
        total: document.querySelector('input[name="total"]')?.value || '',
        search: document.querySelector('input[name="search"]')?.value || ''
    };
}

// Основная асинхронная функция рендера
async function render(action) {
    let state = collectState();
    let query = {}; // Объект для параметров запроса к серверу
    
    // Формируем параметры запроса (в правильном порядке)
    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);
    
    // Получаем данные с сервера сформированными параметрами
    const { total, items } = await api.getRecords(query);
    
    // Обновляем пагинатор с реальным количеством данных
    updatePagination(total, { page: state.page, limit: state.rowsPerPage });
    
    // Рендерим таблицу с полученными данными
    sampleTable.render(items);
}

// Асинхронная инициализация приложения
async function init() {
    try {
        // Получаем индексы (списки продавцов и покупателей) с сервера
        const indexes = await api.getIndexes();
        
        // Заполняем выпадающий список продавцов
        updateIndexes(sampleTable.filter.elements, {
            searchBySeller: indexes.sellers
        });
        
        // Первоначальный рендер
        await render();
        
    } catch (error) {
        console.error('Ошибка инициализации:', error);
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Запускаем init, а затем устанавливаем render как обработчик событий
    init().then(() => {
        // Привязываем обработчики событий ко всем кликабельным элементам
        document.addEventListener('click', (event) => {
            const target = event.target;
            
            // Обрабатываем только элементы с data-action или теги button, input, select
            if (target.hasAttribute('data-action') || 
                ['BUTTON', 'INPUT', 'SELECT', 'A'].includes(target.tagName)) {
                render(target);
            }
        });
        
        // Обработка изменения значения в select для rowsPerPage
        const rowsPerPageSelect = document.querySelector('select[name="rowsPerPage"]');
        if (rowsPerPageSelect) {
            rowsPerPageSelect.addEventListener('change', () => {
                render();
            });
        }
        
        // Обработка ввода в текстовые поля фильтров с debounce
        let searchTimeout;
        const textInputs = document.querySelectorAll('input[type="text"]:not([name="search"])');
        textInputs.forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    render();
                }, 300); // Задержка 300 мс
            });
        });
        
        // Обработка ввода в поле поиска с debounce
        const searchInput = document.querySelector('input[name="search"]');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    render();
                }, 300);
            });
        }
    });
});