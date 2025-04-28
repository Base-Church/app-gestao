// Fix imports to use correct relative paths from services directory
import { VALID_PREFIXES } from '../config/prefixes.js';
import { MusicLayout } from '../layouts/MusicLayout.js';
import { CrtvLayout } from '../layouts/CrtvLayout.js';
import { DefaultLayout } from '../layouts/DefaultLayout.js';

export class LayoutManager {
    static getLayout(prefix) {
        switch (prefix) {
            case VALID_PREFIXES.MUSIC:
                return MusicLayout;
            case VALID_PREFIXES.CRTV:
                return CrtvLayout;
            default:
                return DefaultLayout;
        }
    }

    static async render(data) {
        console.log('LayoutManager.render iniciado com:', data);
        
        try {
            // Identificar o tipo de escala pelos dados recebidos
            const layoutType = data.data?.escala?.tipo || 'default';
            console.log('Tipo de escala:', layoutType);

            // Selecionar o layout apropriado
            const Layout = this.getLayoutByType(layoutType);
            console.log('Usando layout:', Layout.name);
            
            return await Layout.render(data);
        } catch (error) {
            console.error('Erro ao renderizar layout:', error);
            throw error;
        }
    }

    static getLayoutByType(type) {
        switch (type.toLowerCase()) {
            case 'musica':
            case 'music':
                return MusicLayout;
            case 'crtv':
                return CrtvLayout;
            default:
                return DefaultLayout;
        }
    }
}
