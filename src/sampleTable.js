cat > sampleTable.js << 'EOF'
// sampleTable.js
export default {
    search: { 
        elements: { 
            searchInput: document.querySelector('input[name="search"]') 
        } 
    },
    filter: { 
        elements: {
            searchBySeller: document.querySelector('select[name="seller"]')
        }
    },
    header: { 
        elements: {
            // Добавьте сюда элементы заголовков для сортировки
            sortDate: document.querySelector('[data-field="date"]'),
            sortTotal: document.querySelector('[data-field="total"]')
        }
    },
    pagination: { 
        elements: {
            // Элементы пагинации
        }
    },
    
    render: function(items) {
        console.log('Rendering table with', items?.length, 'items');
        
        // Простая отрисовка таблицы
        const tbody = document.querySelector('tbody');
        if (tbody && items) {
            tbody.innerHTML = items.map(item => 
                `<tr>
                    <td>${item.id || ''}</td>
                    <td>${item.date || ''}</td>
                    <td>${item.seller || ''}</td>
                    <td>${item.customer || ''}</td>
                    <td>${item.total || ''}</td>
                </tr>`
            ).join('');
        }
    }
};
EOF