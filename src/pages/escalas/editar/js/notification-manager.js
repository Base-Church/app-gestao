class NotificationManager {
    constructor() {
        this.createNotificationContainer();
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50';
        document.body.appendChild(container);
    }

    show(message) {
        const notification = document.createElement('div');
        notification.className = `
            bg-white/90 dark:bg-gray-800/90 shadow-lg rounded-full p-1
            transform translate-y-full opacity-0 transition-all duration-300 ease-out
            backdrop-blur-sm w-48
        `;

        notification.innerHTML = `
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div class="progress-bar bg-blue-600 h-1 rounded-full w-0 transition-all duration-300 ease-linear"></div>
            </div>
        `;

        const container = document.getElementById('notification-container');
        container.innerHTML = '';
        container.appendChild(notification);

        // Animar entrada
        requestAnimationFrame(() => {
            notification.classList.remove('translate-y-full', 'opacity-0');
        });

        // Iniciar barra de progresso
        const progressBar = notification.querySelector('.progress-bar');
        requestAnimationFrame(() => {
            progressBar.style.width = '100%';
            progressBar.style.transitionDuration = '2000ms';
        });

        return {
            notification,
            update: () => {
                // Apenas atualiza a cor da barra de progresso
                const progressBar = notification.querySelector('.progress-bar');
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = '100%';
                }, 100);
            },
            finish: (success = true) => {
                const progressBar = notification.querySelector('.progress-bar');
                progressBar.classList.remove('bg-blue-600');
                progressBar.classList.add(success ? 'bg-green-500' : 'bg-red-500');

                // Remover após delay
                setTimeout(() => {
                    notification.classList.add('translate-y-full', 'opacity-0');
                    setTimeout(() => {
                        notification.remove();
                    }, 300);
                }, 1000);
            }
        };
    }
}

window.notificationManager = new NotificationManager();
