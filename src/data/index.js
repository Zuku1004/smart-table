import { generateDataset, indexes } from './dataset.js';

export function initData() {
    const data = generateDataset();
    
    return {
        data,
        indexes: {
            categories: indexes.categories.reduce((acc, category) => {
                acc[category] = category;
                return acc;
            }, {}),
            statuses: indexes.statuses.reduce((acc, status) => {
                acc[status] = status;
                return acc;
            }, {}),
            sellers: indexes.sellers.reduce((acc, seller) => {
                acc[seller] = seller;
                return acc;
            }, {})
        }
    };
}