class CheckinState {
    constructor() {
        this.currentCheckinId = null;
        this.checkins = [];
    }

    // Getters
    getCurrentCheckinId() {
        return this.currentCheckinId;
    }

    getCheckins() {
        return this.checkins;
    }

    // Setters
    setCurrentCheckinId(id) {
        this.currentCheckinId = id;
    }

    setCheckins(checkins) {
        this.checkins = checkins || [];
    }

    // Métodos de manipulação
    addCheckin(checkin) {
        this.checkins.unshift(checkin);
    }

    updateCheckin(id, updatedData) {
        const index = this.checkins.findIndex(c => c.id == id);
        if (index !== -1) {
            this.checkins[index] = { ...this.checkins[index], ...updatedData };
        }
    }

    removeCheckin(id) {
        this.checkins = this.checkins.filter(c => c.id != id);
    }

    getCheckinById(id) {
        return this.checkins.find(c => c.id == id);
    }

    // Método utilitário
    reset() {
        this.currentCheckinId = null;
        this.checkins = [];
    }
}

// Instância global do estado
window.CheckinState = CheckinState;