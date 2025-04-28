export class EscalaFormatter {
    static formatDiaSemana(dia) {
        if (!dia) return '';
        const dias = {
            'domingo': 'Domingo',
            'segunda': 'Segunda-feira',
            'terca': 'Terça-feira',
            'quarta': 'Quarta-feira',
            'quinta': 'Quinta-feira',
            'sexta': 'Sexta-feira',
            'sabado': 'Sábado'
        };
        return dias[dia] || dia;
    }

    static formatHorario(hora) {
        if (!hora) return '';
        try {
            const [h, m] = hora.split(':');
            const horas = parseInt(h);
            let periodo = 'manhã';
            if (horas >= 12 && horas < 18) periodo = 'tarde';
            if (horas >= 18) periodo = 'noite';
            return `${h}:${m}h (${periodo})`;
        } catch (e) {
            console.error('Erro ao formatar horário:', e);
            return hora;
        }
    }

    static formatDate(dateString) {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('pt-BR');
        } catch (e) {
            console.error('Erro ao formatar data:', e);
            return dateString;
        }
    }
}
