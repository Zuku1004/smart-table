// Правила сравнения по умолчанию
export const defaultRules = {
    skipEmptyTargetValues: (source, target, field) => {
        const value = target[field];
        return value === '' || value == null || value === 'all';
    },
    equals: (source, target, field) => {
        return String(source[field]) === String(target[field]);
    },
    includes: (source, target, field) => {
        const sourceValue = String(source[field] || '').toLowerCase();
        const targetValue = String(target[field] || '').toLowerCase();
        return sourceValue.includes(targetValue);
    }
};

// Сравнивает два объекта
export function compare(source, target, rules) {
    for (let field in target) {
        if (target[field] === '' || target[field] == null || target[field] === 'all') continue;
        
        let matched = false;
        for (let rule of rules) {
            if (rule(source, target, field)) {
                matched = true;
                break;
            }
        }
        
        if (!matched) return false;
    }
    
    return true;
}

// Создаёт подготовленную функцию сравнения
export function createComparison(standard = [], custom = []) {
    const rules = [...custom];
    
    // Добавляем стандартные правила
    standard.forEach(ruleName => {
        if (defaultRules[ruleName]) {
            rules.push(defaultRules[ruleName]);
        }
    });
    
    return (source, target) => compare(source, target, rules);
}

// Специальное правило для поиска по нескольким полям
export function searchMultipleFields(searchField, fields, caseSensitive = false) {
    return (source, target, field) => {
        if (field !== searchField) return false;
        
        const searchTerm = caseSensitive ? target[searchField] : target[searchField]?.toLowerCase();
        if (!searchTerm) return true;
        
        for (let fieldName of fields) {
            let sourceValue = source[fieldName];
            if (sourceValue == null) continue;
            
            sourceValue = caseSensitive ? String(sourceValue) : String(sourceValue).toLowerCase();
            if (sourceValue.includes(searchTerm)) {
                return true;
            }
        }
        
        return false;
    };
}