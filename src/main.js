import { initData } from './data.js';
import sampleTable from './sampleTable.js';
import { initPagination } from './components/pagination.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';

const api = initData();

const { applyPagination, updatePagination } = initPagination(sampleTable.pagination.elements);
const { applyFiltering, updateIndexes, applyClientFiltering } = initFiltering(sampleTable.filter.elements);
const applySorting = initSorting(Object.values(sampleTable.header.elements));
const applySearching = initSearching({ input: sampleTable.search.elements.searchInput });

function collectState() {
    return {
        page: parseInt(document.querySelector('input[name="page"]:checked')?.value) || 1,
        rowsPerPage: parseInt(document.querySelector('select[name="rowsPerPage"]')?.value) || 10,
        seller: document.querySelector('select[name="seller"]')?.value || '',
        customer: document.querySelector('input[name="customer"]')?.value || '',
        date: document.querySelector('input[name="date"]')?.value || '',
        total: document.querySelector('input[name="total"]')?.value || '',
        totalFrom: document.querySelector('input[name="totalFrom"]')?.value || '',
        search: document.querySelector('input[name="search"]')?.value || ''
    };
}

async function render(action) {
    let state = collectState();
    let query = {};
    
    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);
    
    const { total, items } = await api.getRecords(query);
    
    // Применяем клиентскую фильтрацию по Total
    const filteredItems = applyClientFiltering(items, state);
    
    // Обновляем пагинатор с учётом клиентской фильтрации
    updatePagination(filteredItems.length, query);
    
    sampleTable.render(filteredItems);
}

async function init() {
    try {
        const indexes = await api.getIndexes();
        
        updateIndexes(sampleTable.filter.elements, {
            searchBySeller: indexes.sellers
        });
        
        await render();
        
    } catch (error) {
        console.error('Ошибка инициализации:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    init().then(() => {
        
        // Кнопка Reset all filters
        const resetButton = document.querySelector('button[data-name="reset"]');
        if (resetButton) {
            resetButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                document.querySelectorAll('input[type="text"]').forEach(input => {
                    input.value = '';
                });
                
                document.querySelectorAll('select').forEach(select => {
                    select.selectedIndex = 0;
                });
                
                const firstPageRadio = document.querySelector('input[name="page"][value="1"]');
                if (firstPageRadio) {
                    firstPageRadio.checked = true;
                }
                
                render({ name: 'reset' });
            });
        }
        
        // Обработка кликов на кнопки сортировки
        const sortButtons = document.querySelectorAll('button[data-field]');
        sortButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                render(button);
            });
        });
        
        // Обработка кликов на другие кнопки (пагинация)
        document.addEventListener('click', (event) => {
            const target = event.target;
            
            if (target.tagName === 'BUTTON' && target.name && !target.dataset.field) {
                render(target);
            } else if (target.tagName === 'INPUT' && target.type === 'radio') {
                render(target);
            }
        });
        
        // Обработка изменения rowsPerPage
        const rowsPerPageSelect = document.querySelector('select[name="rowsPerPage"]');
        if (rowsPerPageSelect) {
            rowsPerPageSelect.addEventListener('change', () => {
                render();
            });
        }
        
        // Обработка изменения seller
        const sellerSelect = document.querySelector('select[name="seller"]');
        if (sellerSelect) {
            sellerSelect.addEventListener('change', () => {
                render();
            });
        }
        
        // Обработка ввода в текстовые поля с debounce
        let searchTimeout;
        const textInputs = document.querySelectorAll('input[type="text"]');
        textInputs.forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    render();
                }, 300);
            });
        });
    });
});