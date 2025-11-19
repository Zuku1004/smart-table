// Клонирует шаблон с автоматической разметкой вложенных элементов
export function cloneTemplate(templateId) {
    const template = document.getElementById(templateId);
    if (!template) {
        throw new Error(`Template with id "${templateId}" not found`);
    }
    
    const content = template.content.cloneNode(true);
    const container = content.firstElementChild;
    
    const elements = {};
    
    function collectElements(element) {
        if (element.dataset?.name) {
            const name = element.dataset.name;
            elements[name] = element;
        }
        
        const children = element.children;
        for (let child of children) {
            collectElements(child);
        }
    }
    
    if (container) {
        collectElements(container);
    }
    
    return {
        container,
        elements
    };
}

// Собирает все данные из формы в виде простого объекта
export function processFormData(formData) {
    const result = {};
    
    for (let [key, value] of formData.entries()) {
        // Обрабатываем множественные поля
        if (result[key]) {
            if (Array.isArray(result[key])) {
                result[key].push(value);
            } else {
                result[key] = [result[key], value];
            }
        } else {
            result[key] = value;
        }
    }
    
    return result;
}

// Вычисляет видимый список страниц с учётом лимита
export function getPages(currentPage, maxPage, limit = 5) {
    if (maxPage <= 1) return [1];
    
    const pages = [];
    const half = Math.floor(limit / 2);
    let start = currentPage - half;
    let end = currentPage + half;
    
    if (start < 1) {
        end += 1 - start;
        start = 1;
    }
    
    if (end > maxPage) {
        start -= end - maxPage;
        end = maxPage;
    }
    
    start = Math.max(1, start);
    end = Math.min(maxPage, end);
    
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    
    return pages;
}