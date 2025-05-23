import { fetchUsuarios, fetchMinisterios } from '../api.js';

export async function loadUsuarios() {
    try {
        const [usuariosData, ministeriosData] = await Promise.all([
            fetchUsuarios(),
            fetchMinisterios()
        ]);
        if (usuariosData.code === 200) {
            window.usuariosData = usuariosData.data;
        }
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}
