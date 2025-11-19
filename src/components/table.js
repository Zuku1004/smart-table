import { cloneTemplate, processFormData } from '../lib/utils.js';

export function initTable({ before = [], after = [] } = {}) {
    const { container, elements } = cloneTemplate('table-template');
    
    const root = {
        container,
        elements,
        body: elements.body
    };
    
    // Добавление дополнительных шаблонов
    before.reverse().forEach(templateId => {
        try {
            const template = cloneTemplate(templateId);
            root[templateId] = template;
            root.container.prepend(template.container);
        } catch (error) {
            console.warn(`Template ${templateId} not found`);
        }
    });
    
    after.forEach(templateId => {
        try {
            const template = cloneTemplate(templateId);
            root[templateId] = template;
            root.container.append(template.container);
        } catch (error) {
            console.warn(`Template ${templateId} not found`);
        }
    });
    
    function update(data) {
        const rowTemplate = document.getElementById('row-template');
        if (!rowTemplate) {
            console.error('Row template not found');
            return;
        }
        
        // Очищаем тело таблицы
        root.body.innerHTML = '';
        
        // Формирование строк
        const nextRows = data.map(item => {
            const row = cloneTemplate('row-template');
            
            Object.keys(item).forEach(key => {
                if (row.elements[key]) {
                    if (row.elements[key].tagName === 'INPUT' || row.elements[key].tagName === 'SELECT') {
                        row.elements[key].value = item[key];
                    } else {
                        row.elements[key].textContent = item[key];
                    }
                }
            });
            
            return row.container;
        });
        
        root.body.append(...nextRows);
    }
    
    function collectState() {
        const formData = new FormData(root.container);
        let state = processFormData(formData);
        
        const rowsPerPage = parseInt(state.rowsPerPage) || 10;
        const page = parseInt(state.page) || 1;
        
        return {
            ...state,
            rowsPerPage,
            page
        };
    }
    
    // Обработка событий
    function bindEvents(onAction) {
        root.container.addEventListener('change', () => {
            onAction();
        });
        
        root.container.addEventListener('reset', () => {
            setTimeout(() => onAction(), 0);
        });
        
        root.container.addEventListener('submit', (e) => {
            e.preventDefault();
            onAction(e.submitter);
        });
    }
    
    return {
        root,
        update,
        collectState,
        bindEvents
    };
}
