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
                        // Baixa e faz upload da imagem
                        const uploadResult = await this.downloadAndUploadImage(
                            profileData.profilePictureUrl,
                            voluntario.id
                        );
                        
                        if (uploadResult?.path) {
                            // Atualiza a foto do voluntário com o caminho local
                            await this.updateVoluntarioFoto(
                                voluntario.id,
                                uploadResult.path
                            );
                            
                            // Atualiza o objeto local
                            voluntario.foto = uploadResult.path;
                        }
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
                'https://triks.uazapi.com/chat/GetNameAndImageURL',
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'token': 'f82befc6-1412-4250-8c05-dba33ed29e0d'
                    },
                    body: JSON.stringify({ 
                        number: number.replace('@s.whats', ''), // Remove @s.whats pois a nova API não precisa
                        preview: false
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Erro ao buscar foto do perfil');
            }

            const data = await response.json();
            console.log('Resposta da API:', data);

            // Verifica a existência do campo image na nova estrutura
            if (data && data.image) {
                return {
                    profilePictureUrl: data.image // Usa o campo image da nova estrutura
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

    async downloadAndUploadImage(imageUrl, voluntarioId) {
        try {
            console.log('Baixando imagem:', imageUrl);
            
            // Verifica se já existe uma imagem local e se deve atualizar
            const existingImagePath = `assets/img/voluntarios/${voluntarioId}.jpg`;
            const shouldUpdate = await this.shouldUpdateImage(existingImagePath);
            
            if (!shouldUpdate) {
                console.log(`Imagem já existe para voluntário ${voluntarioId}, pulando download`);
                return { path: existingImagePath };
            }
            
            // Faz o download da imagem
            const response = await fetch(imageUrl, {
                mode: 'cors',
                credentials: 'omit',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Erro ao baixar a imagem: ${response.status} ${response.statusText}`);
            }
            
            const blob = await response.blob();
            
            // Verifica se o blob não está vazio
            if (blob.size === 0) {
                throw new Error('Imagem vazia recebida');
            }
            
            // Verifica se é realmente uma imagem
            if (!blob.type.startsWith('image/')) {
                throw new Error(`Tipo de arquivo inválido: ${blob.type}`);
            }
            
            // Cria FormData para enviar para o upload.service.php
            const formData = new FormData();
            formData.append('voluntario_image', blob, `${voluntarioId}.jpg`);
            formData.append('upload_type', 'voluntario_image');
            formData.append('upload_path', 'assets/img/voluntarios');
            formData.append('file_prefix', voluntarioId.toString());
            formData.append('custom_filename', `${voluntarioId}.jpg`);
            formData.append('allowed_types', 'image/jpeg,image/png,image/gif,image/webp');
            formData.append('max_size', '10485760'); // 10MB
            formData.append('overwrite', 'true'); // Permite sobrescrever arquivo existente
            
            console.log('Enviando para upload.service.php...');
            
            // Envia para o serviço de upload
            const uploadResponse = await fetch(`${window.APP_CONFIG.baseUrl}/config/upload.service.php`, {
                method: 'POST',
                body: formData
            });
            
            // Tenta obter o texto da resposta primeiro
            const responseText = await uploadResponse.text();
            console.log('Resposta do upload (texto):', responseText);
            
            if (!uploadResponse.ok) {
                console.error('Erro no upload:', responseText);
                throw new Error(`Erro ao fazer upload da imagem: ${uploadResponse.status}`);
            }
            
            // Tenta parsear como JSON, removendo warnings PHP se existirem
            let uploadResult;
            try {
                // Remove warnings PHP que podem aparecer antes do JSON
                const jsonStart = responseText.indexOf('{');
                const cleanJson = jsonStart >= 0 ? responseText.substring(jsonStart) : responseText;
                uploadResult = JSON.parse(cleanJson);
            } catch (parseError) {
                console.error('Erro ao parsear JSON:', parseError);
                console.error('Resposta recebida:', responseText);
                
                // Tenta extrair JSON mesmo com warnings
                const jsonMatch = responseText.match(/\{.*\}/s);
                if (jsonMatch) {
                    try {
                        uploadResult = JSON.parse(jsonMatch[0]);
                    } catch (secondError) {
                        throw new Error('Resposta inválida do servidor de upload');
                    }
                } else {
                    throw new Error('Resposta inválida do servidor de upload');
                }
            }
            
            console.log('Resultado do upload:', uploadResult);
            
            if (!uploadResult.success) {
                throw new Error(uploadResult.error || 'Erro desconhecido no upload');
            }
            
            // Retorna o resultado com o caminho correto
            return {
                ...uploadResult,
                path: `assets/img/voluntarios/${voluntarioId}.jpg`
            };
            
        } catch (error) {
            console.error('Erro ao baixar e fazer upload da imagem:', error);
            throw error;
        }
    }

    async shouldUpdateImage(imagePath) {
        try {
            // Verifica se a imagem já existe fazendo uma requisição HEAD
            const response = await fetch(`${window.APP_CONFIG.baseUrl}/${imagePath}`, {
                method: 'HEAD'
            });
            
            if (response.ok) {
                // Se existe, verifica a data de modificação (opcional - por ora sempre atualiza)
                // Por enquanto, sempre retorna true para atualizar
                return true;
            }
            
            // Se não existe, precisa baixar
            return true;
        } catch (error) {
            // Em caso de erro, assume que precisa baixar
            return true;
        }
    }

    async updateVoluntarioFoto(id, foto) {
        try {
            const url = `${window.APP_CONFIG.baseUrl}/src/services/api/voluntarios/update.php`;
            console.log('URL da requisição:', url);
            
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
