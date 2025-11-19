import { createComparison, defaultRules, searchMultipleFields } from '../lib/compare.js';

export function initSearching(searchField, searchFields) {
    return (data, state, action) => {
        const searchTerm = state[searchField]?.trim();
        
        if (!searchTerm) return data;
        
        const rules = [
            defaultRules.skipEmptyTargetValues,
            searchMultipleFields(searchField, searchFields, false)
        ];
        
        const compare = createComparison([], rules);
        
        return data.filter(row => compare(row, { [searchField]: searchTerm }));
    };
}