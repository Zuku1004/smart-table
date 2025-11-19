// Сортирует коллекцию по полю
export function sortCollection(arr, field, order) {
    if (!field || order === 'none' || !arr.length) return [...arr];
    
    return [...arr].sort((a, b) => {
        let aValue = a[field];
        let bValue = b[field];
        
        // Для числовых полей
        if (field === 'total' || field === 'amount') {
            aValue = parseFloat(aValue) || 0;
            bValue = parseFloat(bValue) || 0;
        }
        
        // Для дат
        if (field === 'date') {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
        }
        
        if (aValue < bValue) return order === 'up' ? -1 : 1;
        if (aValue > bValue) return order === 'up' ? 1 : -1;
        return 0;
    });
}