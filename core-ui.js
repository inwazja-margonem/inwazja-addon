// core-ui.js
(function() {
    'use strict';
    
    if (window.inwazjaCoreLoaded) return;
    window.inwazjaCoreLoaded = true;
    
    console.log('🚀 Inwazja Core UI: ładowanie...');
    
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
        min-width: 140px;
        height: 36px;
        padding: 8px 16px;
        background: rgba(12,12,12,0.95);
        border: 2px solid rgba(255,255,255,0.08);
        border-radius: 8px;
        color: #fff;
        font-weight: 700;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10000;
        user-select: none;
        white-space: nowrap;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    }
    
    #inwazja-icon:hover {
        background: rgba(20,20,20,0.98);
        border-color: rgba(255,255,255,0.12);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
    
    #inwazja-icon.dragging {
        opacity: 0.8;
        transition: none;
    }

    #inwazja-panel {
        position: fixed;
        z-index: 9999;
        width: 800px;
        height: 600px;
        border-radius: 12px;
        overflow: hidden;
        display: none;
        flex-direction: column;
        background: rgba(28,28,28,0.95);
        color: #eaeff5;
        font-family: Arial, sans-serif;
        box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        user-select: none;
        border: 1px solid rgba(255,255,255,0.1);
        backdrop-filter: blur(15px);
    }
    
    #inwazja-panel.visible { 
        display: flex;
        opacity: 1;
    }
    
    #inwazja-header {
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        background: rgba(0,0,0,0.3);
        border-bottom: 1px solid rgba(255,255,255,0.08);
        cursor: move;
        font-size: 14px;
        font-weight: 600;
    }
    
    #inwazja-controls { 
        display: flex; 
        align-items: center; 
        gap: 10px; 
    }
    
    .ia-btn { 
        background: transparent; 
        border: none; 
        color: inherit; 
        padding: 8px 12px; 
        cursor: pointer;
        border-radius: 6px;
        font-size: 16px;
        transition: all 0.3s ease;
    }
    
    .ia-btn:hover {
        background: rgba(255,255,255,0.1);
        transform: scale(1.1);
    }
    
    #inwazja-body {
        display: flex;
        flex: 1;
        gap: 20px;
        padding: 20px;
        height: calc(100% - 75px);
        background: rgba(0,0,0,0.1);
    }
    
    #inwazja-tiles {
        width: 220px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        flex-shrink: 0;
    }
    
    .inwazja-tile {
        padding: 15px;
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.15));
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .inwazja-tile:hover {
        background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(0,0,0,0.2));
        border-color: rgba(255,255,255,0.2);
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    #inwazja-content {
        flex: 1;
        padding: 20px;
        overflow: auto;
        background: rgba(0,0,0,0.05);
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.08);
    }
    
    .dashboard-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        padding: 50px 30px;
    }
    
    .dashboard-title {
        font-size: 36px;
        font-weight: 800;
        margin-bottom: 20px;
        background: linear-gradient(135deg, #00ff88, #00ccff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 4px 15px rgba(0,255,136,0.4);
    }
    
    .dashboard-subtitle {
        font-size: 16px;
        opacity: 0.9;
        margin-bottom: 40px;
        max-width: 500px;
        line-height: 1.6;
    }
    
    .dashboard-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        width: 100%;
        max-width: 450px;
        margin: 30px 0;
    }
    
    .dashboard-stat {
        padding: 20px;
        background: rgba(255,255,255,0.05);
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.1);
        transition: all 0.3s ease;
    }
    
    .dashboard-stat:hover {
        transform: translateY(-2px);
        background: rgba(255,255,255,0.08);
    }
    
    .dashboard-stat-value {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 8px;
        color: #00ff88;
    }
    
    .dashboard-stat-label {
        font-size: 12px;
        opacity: 0.8;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    .dashboard-version {
        font-size: 13px;
        opacity: 0.7;
        padding: 10px 20px;
        background: rgba(255,255,255,0.08);
        border-radius: 25px;
        border: 1px solid rgba(255,255,255,0.15);
        margin-top: 30px;
    }
    
    /* Scrollbar */
    #inwazja-content::-webkit-scrollbar {
        width: 8px;
    }
    
    #inwazja-content::-webkit-scrollbar-track {
        background: rgba(255,255,255,0.03);
        border-radius: 4px;
    }
    
    #inwazja-content::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.2);
        border-radius: 4px;
    }
    
    #inwazja-content::-webkit-scrollbar-thumb:hover {
        background: rgba(255,255,255,0.3);
    }
    `;
    
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    
    /**********************
     *  Tworzenie DOM
     **********************/
    document.getElementById('inwazja-icon')?.remove();
    document.getElementById('inwazja-panel')?.remove();
    
    const icon = document.createElement('div');
    icon.id = 'inwazja-icon';
    icon.textContent = 'Inwazja Add-on';
    icon.title = 'Inwazja Add-on - Kliknij aby otworzyć';
    document.body.appendChild(icon);
    
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
                    <div style="font-weight:700; font-size:14px;">Auto-message</div>
                    <div style="opacity:.8; font-size:12px; margin-top:6px;">Automatyczne odpisywanie graczom</div>
                </div>
                <div class="inwazja-tile" data-id="inventory">
                    <div style="font-weight:700; font-size:14px;">Ekwipunek</div>
                    <div style="opacity:.8; font-size:12px; margin-top:6px;">Przegląd przedmiotów</div>
                </div>
                <div class="inwazja-tile" data-id="clan">
                    <div style="font-weight:700; font-size:14px;">Klan</div>
                    <div style="opacity:.8; font-size:12px; margin-top:6px;">Lista członków i statusy</div>
                </div>
                <div class="inwazja-tile" data-id="skills">
                    <div style="font-weight:700; font-size:14px;">Umiejętności</div>
                    <div style="opacity:.8; font-size:12px; margin-top:6px;">Tooltipy i cooldowny</div>
                </div>
                <div class="inwazja-tile" data-id="quests">
                    <div style="font-weight:700; font-size:14px;">Zadania</div>
                    <div style="opacity:.8; font-size:12px; margin-top:6px;">Postępy i nagrody</div>
                </div>
                <div class="inwazja-tile" data-id="settings">
                    <div style="font-weight:700; font-size:14px;">Ustawienia</div>
                    <div style="opacity:.8; font-size:12px; margin-top:6px;">Preferencje GUI</div>
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
     *  Funkcje
     **********************/
    function showDashboard() {
        const content = document.getElementById('inwazja-content');
        if (!content) return;
        
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
                
                <div style="margin-top: 40px; font-size: 12px; opacity: 0.6;">
                    Kliknij w kafelek po lewej stronie, aby przejść do konkretnego modułu
                </div>
            </div>
        `;
    }
    
    /**********************
     *  Drag & Drop Ikony
     **********************/
    let isDraggingIcon = false;
    let dragStartX = 0, dragStartY = 0;
    let startIconX = 0, startIconY = 0;
    
    icon.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return; // Tylko lewy przycisk myszy
        
        isDraggingIcon = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        startIconX = parseInt(icon.style.left) || 20;
        startIconY = parseInt(icon.style.top) || 20;
        
        icon.classList.add('dragging');
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDraggingIcon) return;
        
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;
        
        const newX = Math.max(10, Math.min(window.innerWidth - icon.offsetWidth - 10, startIconX + deltaX));
        const newY = Math.max(10, Math.min(window.innerHeight - icon.offsetHeight - 10, startIconY + deltaY));
        
        icon.style.left = newX + 'px';
        icon.style.top = newY + 'px';
    });
    
    document.addEventListener('mouseup', function() {
        if (!isDraggingIcon) return;
        
        isDraggingIcon = false;
        icon.classList.remove('dragging');
        
        // Zapisz pozycję
        window.inwazjaConfig.iconPos = {
            left: parseInt(icon.style.left),
            top: parseInt(icon.style.top)
        };
        window.inwazjaSaveConfig(window.inwazjaConfig);
    });
    
    /**********************
     *  Drag & Drop Panelu
     **********************/
    let isDraggingPanel = false;
    let panelStartX = 0, panelStartY = 0;
    let startPanelX = 0, startPanelY = 0;
    
    const header = document.getElementById('inwazja-header');
    
    header.addEventListener('mousedown', function(e) {
        if (e.target.closest('#inwazja-controls')) return; // Nie przeciągaj przy kliknięciu w kontrolki
        
        isDraggingPanel = true;
        panelStartX = e.clientX;
        panelStartY = e.clientY;
        startPanelX = parseInt(panel.style.left) || (window.innerWidth / 2 - panel.offsetWidth / 2);
        startPanelY = parseInt(panel.style.top) || (window.innerHeight / 2 - panel.offsetHeight / 2);
        
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDraggingPanel) return;
        
        const deltaX = e.clientX - panelStartX;
        const deltaY = e.clientY - panelStartY;
        
        const newX = Math.max(10, Math.min(window.innerWidth - panel.offsetWidth - 10, startPanelX + deltaX));
        const newY = Math.max(10, Math.min(window.innerHeight - panel.offsetHeight - 10, startPanelY + deltaY));
        
        panel.style.left = newX + 'px';
        panel.style.top = newY + 'px';
        panel.style.transform = 'none'; // Usuń transform center
    });
    
    document.addEventListener('mouseup', function() {
        if (!isDraggingPanel) return;
        
        isDraggingPanel = false;
        
        // Zapisz pozycję
        window.inwazjaConfig.pos = {
            left: parseInt(panel.style.left),
            top: parseInt(panel.style.top)
        };
        window.inwazjaSaveConfig(window.inwazjaConfig);
    });
    
    /**********************
     *  Event Listenery
     **********************/
    icon.addEventListener('click', function(e) {
        // Jeśli przeciągaliśmy, nie otwieraj panelu
        if (isDraggingIcon) return;
        
        if (panel.classList.contains('visible')) {
            panel.classList.remove('visible');
        } else {
            panel.classList.add('visible');
            // Wycentruj panel przy pierwszym otwarciu
            if (!window.inwazjaConfig.pos) {
                panel.style.left = '50%';
                panel.style.top = '50%';
                panel.style.transform = 'translate(-50%, -50%)';
            }
            setTimeout(showDashboard, 50);
        }
    });
    
    document.getElementById('inwazja-dashboard').addEventListener('click', showDashboard);
    
    document.getElementById('inwazja-close').addEventListener('click', function() {
        panel.classList.remove('visible');
    });
    
    document.querySelectorAll('.inwazja-tile').forEach(tile => {
        tile.addEventListener('click', function() {
            const moduleId = this.dataset.id;
            if (moduleId === 'auto-message') {
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
                    <div style="padding:30px;">
                        <h3 style="margin-top:0; color:#00ff88; font-size:24px;">${this.querySelector('div').textContent}</h3>
                        <div style="opacity:0.8; margin-bottom:25px; font-size:16px;">Moduł w budowie</div>
                        <div style="font-size:14px; opacity:0.6;">
                            Ta funkcjonalność będzie dostępna w przyszłych aktualizacjach.
                        </div>
                    </div>
                `;
            }
        });
    });
    
    /**********************
     *  Inicjalizacja
     **********************/
    // Przywróć zapisane pozycje
    if (window.inwazjaConfig.iconPos) {
        icon.style.left = window.inwazjaConfig.iconPos.left + 'px';
        icon.style.top = window.inwazjaConfig.iconPos.top + 'px';
    }
    
    if (window.inwazjaConfig.pos) {
        panel.style.left = window.inwazjaConfig.pos.left + 'px';
        panel.style.top = window.inwazjaConfig.pos.top + 'px';
        panel.style.transform = 'none';
    } else {
        panel.style.left = '50%';
        panel.style.top = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
    }
    
    console.log('✅ Inwazja Core UI: załadowany z drag & drop');
    
})();
