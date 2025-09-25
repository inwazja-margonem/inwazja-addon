// DODAJ TEN KOD W core-ui.js PO UTWORZENIU PANELU, A PRZED INICJALIZACJĄ

/**********************
 *  Funkcja Dashboard
 **********************/
function showDashboard() {
    const content = document.getElementById('inwazja-content');
    const dashboardBtn = document.getElementById('inwazja-dashboard');
    
    if (!content) {
        console.error('Dashboard: nie znaleziono elementu content');
        return;
    }
    
    console.log('Dashboard: pokazuję panel powitalny');
    
    // Oznacz przycisk jako aktywny
    document.querySelectorAll('#inwazja-controls .ia-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (dashboardBtn) dashboardBtn.classList.add('active');
    
    // Ustaw tytuł
    window.inwazjaSetActiveTitle('Dashboard');
    
    // Generuj statystyki
    const totalMessages = window.inwazjaConfig.autoMessages.filter(msg => msg.length > 0).length;
    const ignoredPlayers = window.inwazjaConfig.ignoredPlayers.length;
    const autoEnabled = window.inwazjaConfig.autoEnabled ? 'Tak' : 'Nie';
    const scheduleEnabled = window.inwazjaConfig.scheduleEnabled ? 'Tak' : 'Nie';
    
    content.innerHTML = `
        <div class="dashboard-container">
            <div class="dashboard-title">Inwazja Add-on</div>
            <div class="dashboard-subtitle">
                Zaawansowany dodatek do Margonem z funkcją automatycznego odpowiadania na wiadomości i wieloma innymi modułami.
            </div>
            <div class="dashboard-version">Wersja 2.0.0 | Modułowy System</div>
            
            <div class="dashboard-stats">
                <div class="dashboard-stat">
                    <div class="dashboard-stat-value">${totalMessages}/5</div>
                    <div class="dashboard-stat-label">Aktywne wiadomości</div>
                </div>
                <div class="dashboard-stat">
                    <div class="dashboard-stat-value">${ignoredPlayers}/5</div>
                    <div class="dashboard-stat-label">Ignorowani gracze</div>
                </div>
                <div class="dashboard-stat">
                    <div class="dashboard-stat-value">${autoEnabled}</div>
                    <div class="dashboard-stat-label">Auto-odpowiadanie</div>
                </div>
                <div class="dashboard-stat">
                    <div class="dashboard-stat-value">${scheduleEnabled}</div>
                    <div class="dashboard-stat-label">Harmonogram</div>
                </div>
            </div>
            
            <div style="margin-top: 30px; font-size: 11px; opacity: 0.6;">
                Kliknij w kafelek po lewej stronie, aby przejść do konkretnego modułu.
            </div>
        </div>
    `;
}

/**********************
 *  Inicjalizacja Event Listeners - DODAJ TUTAJ
 **********************/
function initializeEventListeners() {
    console.log('Inicjalizacja event listeners...');
    
    // Suwak przezroczystości
    const opacityInput = document.getElementById('inwazja-opacity');
    if (opacityInput) {
        opacityInput.value = currentOpacity;
        opacityInput.addEventListener('input', (e) => {
            currentOpacity = parseFloat(e.target.value);
            applyTheme();
            window.inwazjaConfig.opacity = currentOpacity;
            window.inwazjaSaveConfig(window.inwazjaConfig);
        });
        console.log('Suwak przezroczystości: OK');
    } else {
        console.error('Suwak przezroczystości: nie znaleziono');
    }
    
    // Przycisk dashboard - TO JEST NAJWAŻNIEJSZE!
    const dashboardBtn = document.getElementById('inwazja-dashboard');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', () => {
            console.log('Dashboard: kliknięto przycisk');
            showDashboard();
            window.inwazjaConfig.activeTab = 'dashboard';
            window.inwazjaSaveConfig(window.inwazjaConfig);
        });
        console.log('Przycisk dashboard: OK');
    } else {
        console.error('Przycisk dashboard: nie znaleziono!');
        // Debug: sprawdź co jest w controls
        const controls = document.getElementById('inwazja-controls');
        if (controls) {
            console.log('Zawartość controls:', controls.innerHTML);
        }
    }
    
    // Przycisk zamknięcia
    const closeBtn = document.getElementById('inwazja-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            panel.classList.remove('ia-visible');
        });
        console.log('Przycisk zamknięcia: OK');
    }
}

/**********************
 *  Inicjalizacja Dashboard - DODAJ TUTAJ
 **********************/
function initializeDashboard() {
    console.log('Inicjalizacja dashboard...');
    
    // Automatyczne wyświetlenie Dashboard przy pierwszym uruchomieniu
    if (!window.inwazjaConfig.activeTab || window.inwazjaConfig.activeTab === 'dashboard') {
        console.log('Wyświetlam dashboard (pierwsze uruchomienie)');
        setTimeout(() => {
            showDashboard();
        }, 100);
    } else {
        console.log('Aktywny tab:', window.inwazjaConfig.activeTab);
        const tile = document.querySelector(`[data-id="${window.inwazjaConfig.activeTab}"]`);
        if (tile) {
            setTimeout(() => {
                tile.click();
            }, 100);
        }
    }
}

// WYWOŁAJ INICJALIZACJĘ NA KONIEC SKRYPTU - DODAJ TO:
setTimeout(() => {
    initializeEventListeners();
    initializeDashboard();
    
    // Inicjalizacja scrolla
    enableMouseWheelScroll(document.getElementById('inwazja-tiles'));
    enableMouseWheelScroll(document.getElementById('inwazja-content'));
    
    console.log('✅ Inwazja Add-on: Core UI w pełni załadowany');
}, 100);
