export class ScriptLoader {
    static loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.type = 'module';
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Erro ao carregar: ${url}`));
            document.head.appendChild(script);
        });
    }
}
