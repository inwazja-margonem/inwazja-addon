// core-ui.js
(function() {
    'use strict';
    
    if (window.inwazjaCoreLoaded) return;
    window.inwazjaCoreLoaded = true;
    
    console.log('🚀 Inwazja Core UI: rozpoczęcie ładowania');
    
    /**********************
     *  Konfiguracja
     **********************/
    const STORAGE_KEY = 'inwazjaAddonConfig_v2_0';
    const DEFAULT_CFG = {
        pos: null,
        size: { width: 800, height: 600 },
        iconPos: null,
        opacity: 1.0,
        autoMessages: ["", "", "", "", ""],
        currentMessageTab: 0,
        autoEnabled: false,
        repeatMessage: false,
        scheduleEnabled: false,
        scheduleStart: "08:00",
        scheduleEnd: "22:00",
        ignoredPlayers: [],
        activeTab: 'dashboard'
    };
    
    function loadConfig() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? {...DEFAULT_CFG, ...JSON.parse(raw)} : {...DEFAULT_CFG};
        } catch (e) {
            console.warn('Błąd wczytywania configu', e);
            return {...DEFAULT_CFG};
        }
    }
    
    function saveConfig(cfg) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
        } catch (e) {
            console.warn('Błąd zapisu configu', e);
        }
    }
    
    window.inwazjaConfig = loadConfig();
    window.inwazjaSaveConfig = saveConfig;
    
    /**********************
     *  CSS
     **********************/
    const css = `
    #inwazja-icon {
        position: fixed;
        left: 20px; 
        top: 20px;
        width: 400px; /* ZWIĘKSZONE do 160px */
        height: 36px;
        padding: 8px 12px;
        background: rgba(12,12,12,0.95);
        border: 2px solid rgba(255,255,255,0.06);
        border-radius: 8px;
        color: #fff;
        font-weight: 700;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 2147483005;
        user-select: none;
        white-space: nowrap;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
        letter-spacing: 0.2px;
    }
    
    #inwazja-icon:hover {
        background: rgba(20,20,20,0.95);
        transform: translateY(-1px);
        transition: all 0.2s ease;
    }

    #inwazja-panel {
        position: fixed;
        z-index: 2147483004;
        width: 800px;
        height: 600px;
        border-radius: 10px;
        overflow: hidden;
        display: none;
        flex-direction: column;
        background: rgba(36,36,36,0.95);
        color: #eaeff5;
        font-family: Arial, sans-serif;
        box-shadow: 0 36px 80px rgba(0,0,0,0.6);
        user-select: none;
        border: 1px solid rgba(255,255,255,0.1);
    }
    
    #inwazja-panel.visible { 
        display: flex; 
        opacity: 1;
    }
    
    #inwazja-header {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
        background: rgba(0,0,0,0.25);
        border-bottom: 1px solid rgba(255,255,255,0.05);
        cursor: move;
        font-size: 13px;
        font-weight: 600;
    }
    
    #inwazja-controls { 
        display: flex; 
        align-items: center; 
        gap: 8px; 
    }
    
    .ia-btn { 
        background: transparent; 
        border: none; 
        color: inherit; 
        padding: 6px 8px; 
        cursor: pointer;
        border-radius: 4px;
        font-size: 14px;
        transition: background 0.2s ease;
    }
    
    .ia-btn:hover {
        background: rgba(255,255,255,0.1);
    }
    
    #inwazja-body {
        display: flex;
        flex: 1;
        gap: 15px;
        padding: 15px;
        height: calc(100% - 70px);
        background: rgba(0,0,0,0.1);
    }
    
    #inwazja-tiles {
        width: 200px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex-shrink: 0;
    }
    
    .inwazja-tile {
        padding: 12px;
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.1));
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .inwazja-tile:hover {
        background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(0,0,0,0.15));
        border-color: rgba(255,255,255,0.15);
        transform: translateY(-2px);
    }
    
    #inwazja-content {
        flex: 1;
        padding: 15px;
        overflow: auto;
        background: rgba(0,0,0,0.05);
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.05);
    }
    
    .dashboard-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        padding: 40px 20px;
    }
    
    .dashboard-title {
        font-size: 32px;
        font-weight: 800;
        margin-bottom: 15px;
        background: linear-gradient(135deg, #00ff88, #00ccff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 2px 10px rgba(0,255,136,0.3);
    }
    
    .dashboard-subtitle {
        font-size: 15px;
        opacity: 0.85;
        margin-bottom: 30px;
        max-width: 450px;
        line-height: 1.5;
    }
    
    .dashboard-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        width: 100%;
        max-width: 400px;
        margin: 25px 0;
    }
    
    .dashboard-stat {
        padding: 15px;
        background: rgba(255,255,255,0.03);
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.08);
    }
    
    .dashboard-stat-value {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 5px;
        color: #00ff88;
    }
    
    .dashboard-stat-label {
        font-size: 11px;
        opacity: 0.7;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .dashboard-version {
        font-size: 12px;
        opacity: 0.6;
        padding: 8px 16px;
        background: rgba(255,255,255,0.05);
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.1);
        margin-top: 20px;
    }
    
    /* Scrollbar */
    #inwazja-content::-webkit-scrollbar {
        width: 6px;
    }
    
    #inwazja-content::-webkit-scrollbar-track {
        background: rgba(255,255,255,0.02);
        border-radius: 3px;
    }
    
    #inwazja-content::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.15);
        border-radius: 3px;
    }
    
    #inwazja-content::-webkit-scrollbar-thumb:hover {
        background: rgba(255,255,255,0.25);
    }
    `;
    
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    
    /**********************
     *  Tworzenie DOM
     **********************/
    // Usuń stare elementy
    document.getElementById('inwazja-icon')?.remove();
    document.getElementById('inwazja-panel')?.remove();
    
    // Ikona
    const icon = document.createElement('div');
    icon.id = 'inwazja-icon';
    icon.textContent = 'Inwazja Add-on';
    icon.title = 'Inwazja Add-on - Kliknij aby otworzyć';
    document.body.appendChild(icon);
    
    // Panel
    const panel = document.createElement('div');
    panel.id = 'inwazja-panel';
    panel.innerHTML = `
        <div id="inwazja-header">
            <div>Inwazja Add-on | v.2.0.0</div>
            <div id="inwazja-controls">
                <button id="inwazja-dashboard" class="ia-btn" title="Dashboard">🏠</button>
                <button id="inwazja-close" class="ia-btn" title="Zamknij">✖</button>
            </div>
        </div>
        <div id="inwazja-body">
            <div id="inwazja-tiles">
                <div class="inwazja-tile" data-id="auto-message">
                    <div style="font-weight:700; font-size:13px;">Auto-message</div>
                    <div style="opacity:.8; font-size:11px; margin-top:4px;">Automatyczne odpisywanie graczom</div>
                </div>
                <div class="inwazja-tile" data-id="inventory">
                    <div style="font-weight:700; font-size:13px;">Ekwipunek</div>
                    <div style="opacity:.8; font-size:11px; margin-top:4px;">Przegląd przedmiotów</div>
                </div>
                <div class="inwazja-tile" data-id="clan">
                    <div style="font-weight:700; font-size:13px;">Klan</div>
                    <div style="opacity:.8; font-size:11px; margin-top:4px;">Lista członków i statusy</div>
                </div>
                <div class="inwazja-tile" data-id="skills">
                    <div style="font-weight:700; font-size:13px;">Umiejętności</div>
                    <div style="opacity:.8; font-size:11px; margin-top:4px;">Tooltipy i cooldowny</div>
                </div>
                <div class="inwazja-tile" data-id="quests">
                    <div style="font-weight:700; font-size:13px;">Zadania</div>
                    <div style="opacity:.8; font-size:11px; margin-top:4px;">Postępy i nagrody</div>
                </div>
                <div class="inwazja-tile" data-id="settings">
                    <div style="font-weight:700; font-size:13px;">Ustawienia</div>
                    <div style="opacity:.8; font-size:11px; margin-top:4px;">Preferencje GUI</div>
                </div>
            </div>
            <div id="inwazja-content">
                <div style="display:flex; align-items:center; justify-content:center; height:100%; opacity:0.7;">
                    Ładowanie dashboardu...
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(panel);
    
    /**********************
     *  Funkcja Dashboard
     **********************/
    function showDashboard() {
        console.log('🔄 Wyświetlam dashboard');
        const content = document.getElementById('inwazja-content');
        if (!content) {
            console.error('❌ Nie znaleziono content');
            return;
        }
        
        const totalMessages = window.inwazjaConfig.autoMessages.filter(msg => msg.length > 0).length;
        const ignoredPlayers = window.inwazjaConfig.ignoredPlayers.length;
        const autoEnabled = window.inwazjaConfig.autoEnabled ? 'Tak' : 'Nie';
        const scheduleEnabled = window.inwazjaConfig.scheduleEnabled ? 'Tak' : 'Nie';
        
        content.innerHTML = `
            <div class="dashboard-container">
                <div class="dashboard-title">Inwazja Add-on</div>
                <div class="dashboard-subtitle">
                    Zaawansowany dodatek do Margonem z funkcją automatycznego odpowiadania na wiadomości i wieloma innymi modułami
                </div>
                
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
                
                <div class="dashboard-version">Wersja 2.0.0 | Modułowy System</div>
                
                <div style="margin-top: 30px; font-size: 11px; opacity: 0.5;">
                    Kliknij w kafelek po lewej stronie, aby przejść do konkretnego modułu
                </div>
            </div>
        `;
    }
    
    /**********************
     *  Event Listenery
     **********************/
    // Kliknięcie ikony - OTWIERANIE PANELU
    icon.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🎯 Kliknięto ikonę');
        
        if (panel.classList.contains('visible')) {
            panel.classList.remove('visible');
            console.log('⬆️ Zamknięto panel');
        } else {
            panel.classList.add('visible');
            console.log('⬇️ Otworzono panel');
            
            // AUTOMATYCZNIE POKAŻ DASHBOARD
            setTimeout(() => {
                showDashboard();
                console.log('✅ Dashboard wyświetlony');
            }, 50);
        }
    });
    
    // Przycisk dashboard
    document.getElementById('inwazja-dashboard').addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('🏠 Kliknięto przycisk dashboard');
        showDashboard();
    });
    
    // Przycisk zamknięcia
    document.getElementById('inwazja-close').addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('❌ Kliknięto zamknięcie');
        panel.classList.remove('visible');
    });
    
    // Kafelki
    document.querySelectorAll('.inwazja-tile').forEach(tile => {
        tile.addEventListener('click', function() {
            const moduleId = this.dataset.id;
            console.log('📦 Kliknięto kafelek:', moduleId);
            
            if (moduleId === 'auto-message') {
                // Event dla auto-message.js
                window.dispatchEvent(new CustomEvent('inwazjaModuleChange', {
                    detail: { 
                        moduleId: 'auto-message', 
                        title: 'Auto-message', 
                        subtitle: 'Skrypt na automatyczne odpisywanie graczom podczas nieobecności.' 
                    }
                }));
            } else {
                const content = document.getElementById('inwazja-content');
                content.innerHTML = `
                    <div style="padding:20px;">
                        <h3 style="margin-top:0; color:#00ff88;">${this.querySelector('div').textContent}</h3>
                        <div style="opacity:0.8; margin-bottom:20px;">Moduł w budowie</div>
                        <div style="font-size:12px; opacity:0.6;">
                            Ta funkcjonalność będzie dostępna w przyszłych aktualizacjach.
                        </div>
                    </div>
                `;
            }
        });
    });
    
    /**********************
     *  Pozycjonowanie
     **********************/
    panel.style.left = '50%';
    panel.style.top = '50%';
    panel.style.transform = 'translate(-50%, -50%)';
    
    // Przywróć zapisaną pozycję ikony
    if (window.inwazjaConfig.iconPos) {
        icon.style.left = window.inwazjaConfig.iconPos.left + 'px';
        icon.style.top = window.inwazjaConfig.iconPos.top + 'px';
    }
    
    console.log('✅ Inwazja Core UI: załadowany pomyślnie');
    
    // Automatycznie pokaż dashboard po załadowaniu (tylko raz)
    let dashboardShown = false;
    setTimeout(() => {
        if (!dashboardShown) {
            showDashboard();
            dashboardShown = true;
            console.log('🎉 Dashboard załadowany automatycznie');
        }
    }, 1000);
    
})();
