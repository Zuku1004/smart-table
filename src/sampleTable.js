//  ИСПРАВЛЕНО: Добавлены все элементы фильтров
export default {
    search: { 
        elements: { 
            get searchInput() {
                return document.querySelector('input[name="search"]');
            }
        } 
    },
    filter: { 
        elements: {
            get searchBySeller() {
                return document.querySelector('select[name="seller"]');
            },
            //  ДОБАВЛЕНО: Элементы для фильтрации
            get searchByCustomer() {
                return document.querySelector('input[name="customer"]');
            },
            get searchByDate() {
                return document.querySelector('input[name="date"]');
            },
            get totalFrom() {
                return document.querySelector('input[name="totalFrom"]');
            },
            get totalTo() {
                return document.querySelector('input[name="total"]');
            }
        }
    },
    header: { 
        elements: {
            get sortDate() {
                return document.querySelector('button[data-field="date"]');
            },
            get sortTotal() {
                return document.querySelector('button[data-field="total"]');
            }
        }
    },
    pagination: { 
        elements: {
            get pages() {
                return document.querySelector('[data-name="pages"]');
            },
            get fromRow() {
                return document.querySelector('[data-name="fromRow"]');
            },
            get toRow() {
                return document.querySelector('[data-name="toRow"]');
            },
            get totalRows() {
                return document.querySelector('[data-name="totalRows"]');
            }
        }
    },
    
    render: function(items) {
        console.log('Rendering table with', items?.length, 'items');
        
        const rowsContainer = document.querySelector('[data-name="rows"]');
        if (rowsContainer && items) {
            rowsContainer.innerHTML = items.map(item => 
                `<div class="table-row" role="row">
                    <div class="table-column" role="cell">${item.date || ''}</div>
                    <div class="table-column" role="cell">${item.customer || ''}</div>
                    <div class="table-column" role="cell">${item.seller || ''}</div>
                    <div class="table-column" role="cell">${item.total || ''}</div>
                </div>`
            ).join('');
        }
    }
};