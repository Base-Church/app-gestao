import { fetchMinisterios, updateUsuario } from '../api.js';
import { updatePermissionsUI } from './ui.js';

class PermissionsManager {
    // ...existing code da classe PermissionsManager...
}

export const permissionsManager = new PermissionsManager();

export async function loadMinisteriosForPermissions() {
    try {
        const result = await fetchMinisterios();
        if (result.data) {
            updatePermissionsUI(result.data);
        }
    } catch (error) {
        console.error('Erro ao carregar ministérios:', error);
    }
}

export async function handlePermissionsSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const userId = form.dataset.userId;
    try {
        const data = {
            nome: form.querySelector('[name="nome"]').value.trim(),
            whatsapp: form.querySelector('[name="whatsapp"]').value.replace(/\D/g, ''),
            nivel: form.querySelector('[name="nivel"]').value,
            status: 'ativo'
        };
        const selectedMinisterios = permissionsManager.getSelectedMinisterios();
        if (selectedMinisterios.length > 0) data.ministerios = selectedMinisterios;
        const selectedPermissions = permissionsManager.getSelectedPermissions();
        if (selectedPermissions.length > 0) data.permissoes = selectedPermissions;

        const result = await updateUsuario(userId, data);
        if (result.code === 200) {
            document.getElementById('permissionsModal').classList.add('hidden');
            window.loadUsuarios();
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}
