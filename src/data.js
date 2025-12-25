const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

export function initData() {
    let sellers;
    let customers;
    let lastResult;
    let lastQuery;

    const mapRecords = (data) => {
        //  Защита от undefined
        if (!data || !Array.isArray(data)) {
            console.error('Invalid data for mapRecords:', data);
            return [];
        }
        
        return data.map(item => ({
            id: item.receipt_id,
            date: item.date,
            seller: sellers[item.seller_id],
            customer: customers[item.customer_id],
            total: item.total_amount
        }));
    };

    const getIndexes = async () => {
        if (!sellers || !customers) {
            [sellers, customers] = await Promise.all([
                fetch(`${BASE_URL}/sellers`).then(res => res.json()),
                fetch(`${BASE_URL}/customers`).then(res => res.json())
            ]);
        }
        
        return { sellers, customers };
    };

    const getRecords = async (query, isUpdated = false) => {
        const qs = new URLSearchParams(query);
        const nextQuery = qs.toString();
        
        if (lastQuery === nextQuery && !isUpdated) {
            return lastResult;
        }
        
        try {
            // Запрос к серверу
            const url = `${BASE_URL}/records?${nextQuery}`;
            // console.log('Fetching:', url); //  Для отладки
            
            const response = await fetch(url);
            
            //  Проверка ответа сервера
            if (!response.ok) {
                console.error('Server error:', response.status, await response.text());
                return { total: 0, items: [] };
            }
            
            const records = await response.json();
            // console.log('Server response:', records); //  Для отладки
            
            //  Проверка структуры данных
            if (!records || !records.items) {
                console.error('Invalid response structure:', records);
                return { total: 0, items: [] };
            }
            
            lastQuery = nextQuery;
            lastResult = {
                total: records.total || 0,
                items: mapRecords(records.items)
            };
            
            return lastResult;
        } catch (error) {
            console.error('Error in getRecords:', error);
            return { total: 0, items: [] };
        }
    };

    return {
        getIndexes,
        getRecords
    };
}