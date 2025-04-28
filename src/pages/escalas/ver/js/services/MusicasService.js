export class MusicasService {
    static async searchMusicas(search = '', page = 1, limit = 100) {
        try {
            const params = new URLSearchParams({
                search,
                page: page.toString(),
                limit: limit.toString()
            });

            const response = await fetch(
                `${window.ENV.API_BASE_URL}/api/musicas?${params}`,
                {
                    headers: {
                        'Authorization': window.ENV.API_KEY,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao buscar músicas');
            }

            return await response.json();
        } catch (error) {
            console.error('\n Erro ao buscar músicas:', error);
            throw error;
        }
    }

    static getYouTubeThumbnail(url) {
        if (!url) return null;
        
        try {
            const videoId = this.extractVideoId(url);
            if (!videoId) return null;
            return `https://img.youtube.com/vi/${videoId}/default.jpg`;
        } catch {
            return null;
        }
    }

    static extractVideoId(url) {
        if (!url) return null;
        
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu.be\/)([^&\n?#]+)/,
            /youtube.com\/embed\/([^&\n?#]+)/,
            /youtube.com\/v\/([^&\n?#]+)/,
            /youtube.com\/user\/[^\/]+\/\?v=([^&\n?#]+)/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }

        return null;
    }
}
