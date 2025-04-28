import { ui } from './ui.js';
import { api } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7);
    if (ui.elements.monthPicker) {
        ui.elements.monthPicker.value = currentMonth;
    }

    async function loadCalendarData() {
        try {
            ui.showLoading();
            const selectedMonth = ui.elements.monthPicker ? ui.elements.monthPicker.value : currentMonth;
            const ministerioAtual = window.USER.ministerio_atual;
            
            if (!ministerioAtual) {
                throw new Error('Nenhum ministério selecionado');
            }

            const response = await api.getCalendarData(ministerioAtual, selectedMonth);
            if (!response?.data?.dias_indisponiveis) {
                throw new Error('Nenhuma indisponibilidade encontrada');
            }

            ui.generateCalendar(selectedMonth, response);
            ui.showCalendar();
        } catch (error) {
            ui.showError(error.message);
        }
    }

    // Carregar dados iniciais
    loadCalendarData();

    // Listener para mudança de mês
    if (ui.elements.monthPicker) {
        ui.elements.monthPicker.addEventListener('change', loadCalendarData);
    }

    // Listener para mudança de ministério
    window.addEventListener('ministerioChanged', loadCalendarData);
});
