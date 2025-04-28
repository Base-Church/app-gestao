export class SyncService {
    constructor() {
        this.urls = {
            whatsapp: {
                base: window.WHATSAPP_API_URL,
                key: window.WHATSAPP_API_KEY,
                instance: window.WHATSAPP_INSTANCE
            }
        };
    }

    async syncVoluntarios(voluntarios) {
        const total = voluntarios.length;
        let current = 0;
        const button = document.getElementById('sync-button');
        
        try {
            for (const voluntario of voluntarios) {
                current++;
                // Atualiza o texto do botão com a porcentagem
                if (button) {
                    const percent = Math.round((current / total) * 100);
                    button.innerHTML = `
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sincronizando... ${percent}% (${current}/${total})
                    `;
                }

                // Pula se não tiver WhatsApp
                if (!voluntario.whatsapp) continue;

                // Limpa o número do WhatsApp
                const numero = this.normalizeWhatsApp(voluntario.whatsapp);
                if (!numero) continue;

                try {
                    // Busca foto do perfil
                    const profileData = await this.getProfilePicture(numero);
                    if (profileData?.profilePictureUrl) {
                        // Atualiza a foto do voluntário
                        await this.updateVoluntarioFoto(
                            voluntario.id,
                            profileData.profilePictureUrl
                        );
                        
                        // Atualiza o objeto local
                        voluntario.foto = profileData.profilePictureUrl;
                    }
                } catch (error) {
                    console.error(`Erro ao processar voluntário ${voluntario.nome}:`, error);
                    continue; // Continua para o próximo voluntário mesmo se houver erro
                }
            }

            // Restaura o botão ao estado original
            if (button) {
                button.innerHTML = 'Sincronizar';
                button.disabled = false;
            }

            return {
                data: voluntarios,
                stats: {
                    total,
                    synchronized: current
                }
            };

        } catch (error) {
            // Restaura o botão em caso de erro
            if (button) {
                button.innerHTML = 'Sincronizar';
                button.disabled = false;
            }
            throw error;
        }
    }

    async getProfilePicture(number) {
        try {
            const response = await fetch(
                `${this.urls.whatsapp.base}/chat/fetchProfilePictureUrl/${this.urls.whatsapp.instance}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': this.urls.whatsapp.key
                    },
                    body: JSON.stringify({ 
                        number: number // Mantém o número original com @s.whats
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Erro ao buscar foto do perfil');
            }

            const data = await response.json();
            console.log('Resposta da API:', data); // Debug

            // Verifica apenas a existência do profilePictureUrl
            if (data && data.profilePictureUrl) {
                return {
                    profilePictureUrl: data.profilePictureUrl
                };
            } else {
                console.warn('Resposta da API sem foto:', data);
                throw new Error('URL da foto não encontrada na resposta');
            }
        } catch (error) {
            console.error('Erro ao buscar foto:', error);
            throw error;
        }
    }

    async updateVoluntarioFoto(id, foto) {
        try {
            const url = `${window.BASE_URL}/src/services/api/voluntarios/update.php`;
            console.log('URL da requisição:', url); // Debug
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id,
                    organizacao_id: window.USER.organizacao_id,
                    foto
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao atualizar foto do voluntário');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao atualizar foto:', error);
            throw error;
        }
    }

    normalizeWhatsApp(numero) {
        if (!numero) return '';
        
        // Remove @s.whats temporariamente
        let normalizado = numero.replace('@s.whats', '');
        
        // Remove todos os caracteres não numéricos
        normalizado = normalizado.replace(/\D/g, '');
        
        // Garante que tem o código do país
        if (!normalizado.startsWith('55')) {
            normalizado = '55' + normalizado;
        }
        
        // Adiciona @s.whats de volta
        return normalizado + '@s.whats';
    }
}
