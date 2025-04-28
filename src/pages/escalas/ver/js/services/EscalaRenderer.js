import { LayoutManager } from './LayoutManager.js';

export class EscalaRenderer {
    static async renderEscala(container, data, prefix) {
        try {
           
            const Layout = LayoutManager.getLayout(prefix);
            const renderedContent = await Layout.render(data);
            
            if (!renderedContent) {
                throw new Error('No content rendered');
            }

            container.innerHTML = renderedContent;
            container.classList.remove('hidden');
        } catch (error) {
            
            container.innerHTML = `
                <div class="p-4 bg-red-50 dark:bg-zinc-900 rounded-lg">
                    <p class="text-red-500">Erro ao renderizar: ${error.message}</p>
                </div>
            `;
            throw error;
        }
    }
}
