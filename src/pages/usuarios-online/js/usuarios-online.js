// ===== Página "Usuários Online" (SSE) =====
  class UsuariosOnlinePage {
    constructor() {
      this.usuarios = [];
      this.orgId = window.USER?.organizacao_id ?? null;
      this.isTabActive = !document.hidden;
      this.$list = document.getElementById('usuarios-list');
      this.$counter = document.getElementById('contador-usuarios-online');
      this.$toast = document.getElementById('toast');
      this.initSSE();
      this.bindGlobals();
    }

    initSSE() {
      // Conecta ao endpoint SSE PHP
      this.sse = new EventSource(window.ENV.URL_BASE + '/src/realtime/realtime.stream.php');
      this.sse.addEventListener('users', (ev) => {
        try {
          const payload = JSON.parse(ev.data);
          const all = payload.users || {};
          const list = Object.values(all);
          this.usuarios = (this.orgId == null)
            ? list.filter(u => u.status !== 'offline')
            : list.filter(u => String(u.organizacaoId) === String(this.orgId) && u.status !== 'offline');
          this.render();
        } catch(e) {}
      });
    }

    bindGlobals() {
      // Atualiza presença quando a aba muda
      document.addEventListener('visibilitychange', () => {
        this.isTabActive = !document.hidden;
        this.sendActivity(this.isTabActive ? 'active' : 'away');
      });
      window.addEventListener('focus', () => this.sendActivity('active'));
      window.addEventListener('blur',  () => this.sendActivity('away'));

      // Botão forçar refresh (envia activity p/ “acordar” o stream)
      document.getElementById('btn-refresh')?.addEventListener('click', () => {
        this.sendActivity(this.isTabActive ? 'active' : 'away');
        this.showToast('Fluxo em tempo real ativo');
      });

      // Marca página atual
      this.sendActivity(this.isTabActive ? 'active' : 'away', 'usuarios-online');
    }

    sendActivity(activity, currentPage) {
      // Envia atividade via fetch para atualizar users_online.json
      fetch(window.ENV.URL_BASE + '/src/realtime/user-activity.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: window.SESSION_ID,
          userId: window.USER?.id,
          userName: window.USER?.name,
          organizacaoId: window.USER?.organizacao_id,
          activity,
          tabActive: this.isTabActive,
          currentPage: currentPage || undefined
        })
      });
    }

    render() {
      // contador
      this.$counter.textContent = String(this.usuarios.length);

      if (this.usuarios.length === 0) {
        this.$list.innerHTML = `
          <div class="col-span-full">
            <div class="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
              Nenhum usuário online no momento
            </div>
          </div>`;
        return;
      }

      // cards
      this.$list.innerHTML = this.usuarios.map(u => this.cardUsuario(u)).join('');
    }

    cardUsuario(u) {
      const isAway = (u.activity === 'away') || (u.tabActive === false);
      const badgeColor = isAway ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200' 
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200';
      const badgeText = isAway ? 'Ausente' : 'Online';
      const initial = (u.userName || '?').charAt(0).toUpperCase();
      const page = this.pageLabel(u.currentPage || 'inicio');
      const since = this.sinceText(u.connectedAt);

      return `
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="relative">
                <div class="w-11 h-11 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200 font-semibold">${initial}</div>
                <span class="absolute -right-0 -bottom-0 w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-gray-800 ${isAway ? 'bg-amber-400' : 'bg-emerald-500'}"></span>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">${this.escape(u.userName)}</div>
                <div class="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full ${badgeColor}">${badgeText}</span>
                  <span>•</span>
                  <span>📍 ${this.escape(page)}</span>
                </div>
              </div>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Online há ${since}</div>
          </div>
        </div>
      `;
    }

    pageLabel(p) {
      const map = {
        'inicio':'Início','escalas':'Escalas','voluntarios':'Voluntários',
        'ministerios':'Ministérios','aniversariantes':'Aniversariantes',
        'usuarios-online':'Usuários Online','configuracoes':'Configurações'
      };
      return map[p] || (p ? (p.charAt(0).toUpperCase() + p.slice(1)) : 'Início');
    }

    sinceText(iso) {
      if (!iso) return 'instantes';
      const diff = Math.max(0, (Date.now() - new Date(iso).getTime())/1000|0);
      if (diff < 60) return `${diff}s`;
      if (diff < 3600) return `${(diff/60|0)}m`;
      return `${(diff/3600|0)}h`;
    }

    showToast(msg) {
      this.$toast.textContent = msg;
      this.$toast.classList.remove('hidden');
      clearTimeout(this.__toastTimer);
      this.__toastTimer = setTimeout(() => this.$toast.classList.add('hidden'), 2000);
    }

    escape(s){ return String(s ?? '').replace(/[&<>"]'/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); }
  }

  new UsuariosOnlinePage(); // inicia