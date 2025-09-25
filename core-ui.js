// core-ui.js
(function() {
    'use strict';
    
    if (window.inwazjaCoreLoaded) return;
    window.inwazjaCoreLoaded = true;
    
    console.log('🎨 Inwazja Core UI: ładowanie stylowego interfejsu...');
    
    /**********************
     *  Konfiguracja
     **********************/
    const STORAGE_KEY = 'inwazjaAddonConfig_v2_1';
    const DEFAULT_CFG = {
        pos: null,
        size: { width: 850, height: 650 },
        iconPos: null,
        opacity: 0.98,
        autoMessages: ["", "", "", "", ""],
        currentMessageTab: 0,
        autoEnabled: false,
        repeatMessage: false,
        scheduleEnabled: false,
        scheduleStart: "08:00",
        scheduleEnd: "22:00",
        ignoredPlayers: [],
        activeTab: 'dashboard',
        theme: 'green-blue'
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
     *  CSS - ZIELONO-NIEBIESKI GRADIENT
     **********************/
    const css = `
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    @keyframes pulseGlow {
        0% {
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        }
        50% {
            box-shadow: 0 0 30px rgba(0, 204, 255, 0.5);
        }
        100% {
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        }
    }
    
    @keyframes floatIcon {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-5px);
        }
    }
    
    @keyframes gradientShift {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }
    
    #inwazja-icon {
        position: fixed;
        left: 25px;
        top: 25px;
        min-width: 150px;
        height: 42px;
        padding: 10px 20px;
        background: linear-gradient(135deg, 
            rgba(0, 255, 136, 0.9) 0%, 
            rgba(0, 204, 255, 0.9) 50%, 
            rgba(0, 255, 200, 0.9) 100%);
        background-size: 200% 200%;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        color: #001a33;
        font-weight: 800;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10000;
        user-select: none;
        white-space: nowrap;
        box-sizing: border-box;
        font-family: 'Segoe UI', system-ui, sans-serif;
        backdrop-filter: blur(20px);
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        animation: floatIcon 6s ease-in-out infinite, pulseGlow 4s ease-in-out infinite;
        letter-spacing: 0.5px;
        text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
    }
    
    #inwazja-icon:hover {
        animation: pulseGlow 2s ease-in-out infinite, gradientShift 3s ease infinite;
        transform: translateY(-2px) scale(1.05);
        background: linear-gradient(135deg, 
            rgba(0, 255, 150, 1) 0%, 
            rgba(0, 230, 255, 1) 50%, 
            rgba(0, 255, 220, 1) 100%);
        background-size: 200% 200%;
        border-color: rgba(255, 255, 255, 0.6);
        box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4);
    }
    
    #inwazja-icon.dragging {
        animation: none;
        transform: scale(0.95);
        opacity: 0.9;
    }

    #inwazja-panel {
        position: fixed;
        z-index: 9999;
        width: 850px;
        height: 650px;
        border-radius: 20px;
        overflow: hidden;
        display: none;
        flex-direction: column;
        background: linear-gradient(135deg, 
            rgba(10, 25, 47, 0.95) 0%, 
            rgba(15, 35, 60, 0.95) 50%, 
            rgba(20, 45, 70, 0.95) 100%);
        color: #e0f7ff;
        font-family: 'Segoe UI', system-ui, sans-serif;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        user-select: none;
        border: 1px solid rgba(0, 255, 136, 0.3);
        backdrop-filter: blur(30px);
        opacity: 0;
        transform: scale(0.8) translateY(50px);
        transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    #inwazja-panel.visible { 
        display: flex;
        opacity: 1;
        transform: scale(1) translateY(0);
        animation: slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    #inwazja-header {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 25px;
        background: linear-gradient(135deg, 
            rgba(0, 40, 80, 0.8) 0%, 
            rgba(0, 60, 100, 0.8) 100%);
        border-bottom: 1px solid rgba(0, 255, 136, 0.2);
        cursor: move;
        font-size: 15px;
        font-weight: 700;
        position: relative;
        overflow: hidden;
    }
    
    #inwazja-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
            transparent, 
            rgba(0, 255, 136, 0.1), 
            transparent);
        transition: left 0.6s ease;
    }
    
    #inwazja-header:hover::before {
        left: 100%;
    }
    
    #inwazja-controls { 
        display: flex; 
        align-items: center; 
        gap: 12px; 
    }
    
    .ia-btn { 
        background: linear-gradient(135deg, 
            rgba(0, 255, 136, 0.2) 0%, 
            rgba(0, 204, 255, 0.2) 100%);
        border: 1px solid rgba(0, 255, 136, 0.3);
        color: #a0f0ff; 
        padding: 8px 14px; 
        cursor: pointer;
        border-radius: 8px;
        font-size: 16px;
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        backdrop-filter: blur(10px);
    }
    
    .ia-btn:hover {
        background: linear-gradient(135deg, 
            rgba(0, 255, 136, 0.4) 0%, 
            rgba(0, 204, 255, 0.4) 100%);
        border-color: rgba(0, 255, 136, 0.6);
        transform: translateY(-2px) scale(1.1);
        box-shadow: 0 5px 15px rgba(0, 255, 136, 0.3);
        color: #00ffcc;
    }
    
    #inwazja-body {
        display: flex;
        flex: 1;
        gap: 25px;
        padding: 25px;
        height: calc(100% - 80px);
        background: linear-gradient(135deg, 
            rgba(5, 20, 40, 0.6) 0%, 
            rgba(10, 30, 50, 0.6) 100%);
    }
    
    #inwazja-tiles {
        width: 240px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        flex-shrink: 0;
    }
    
    .inwazja-tile {
        padding: 18px;
        background: linear-gradient(135deg, 
            rgba(0, 255, 136, 0.1) 0%, 
            rgba(0, 204, 255, 0.1) 100%);
        border: 1px solid rgba(0, 255, 136, 0.2);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        position: relative;
        overflow: hidden;
    }
    
    .inwazja-tile::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
            transparent, 
            rgba(0, 255, 136, 0.2), 
            transparent);
        transition: left 0.6s ease;
    }
    
    .inwazja-tile:hover {
        background: linear-gradient(135deg, 
            rgba(0, 255, 136, 0.2) 0%, 
            rgba(0, 204, 255, 0.2) 100%);
        border-color: rgba(0, 255, 136, 0.4);
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 10px 25px rgba(0, 255, 136, 0.3);
        animation: pulseGlow 2s ease-in-out infinite;
    }
    
    .inwazja-tile:hover::before {
        left: 100%;
    }
    
    #inwazja-content {
        flex: 1;
        padding: 25px;
        overflow: auto;
        background: linear-gradient(135deg, 
            rgba(0, 30, 60, 0.3) 0%, 
            rgba(0, 40, 80, 0.3) 100%);
        border-radius: 15px;
        border: 1px solid rgba(0, 255, 136, 0.2);
        animation: slideInUp 0.5s ease-out;
    }
    
    .dashboard-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        padding: 50px 40px;
        animation: slideInDown 0.6s ease-out;
    }
    
    .dashboard-title {
        font-size: 42px;
        font-weight: 900;
        margin-bottom: 20px;
        background: linear-gradient(135deg, #00ff88, #00ccff, #00ffcc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 4px 20px rgba(0, 255, 136, 0.5);
        animation: gradientShift 4s ease infinite;
        background-size: 200% 200%;
    }
    
    .dashboard-subtitle {
        font-size: 17px;
        opacity: 0.9;
        margin-bottom: 40px;
        max-width: 550px;
        line-height: 1.6;
        background: linear-gradient(135deg, #a0f0ff, #80e0ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .dashboard-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        width: 100%;
        max-width: 500px;
        margin: 30px 0;
    }
    
    .dashboard-stat {
        padding: 20px;
        background: linear-gradient(135deg, 
            rgba(0, 255, 136, 0.1) 0%, 
            rgba(0, 204, 255, 0.1) 100%);
        border-radius: 15px;
        border: 1px solid rgba(0, 255, 136, 0.3);
        transition: all 0.4s ease;
        position: relative;
        overflow: hidden;
    }
    
    .dashboard-stat::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
            transparent, 
            rgba(0, 255, 136, 0.1), 
            transparent);
        transition: left 0.6s ease;
    }
    
    .dashboard-stat:hover {
        transform: translateY(-5px) scale(1.05);
        border-color: rgba(0, 255, 136, 0.6);
        box-shadow: 0 10px 25px rgba(0, 255, 136, 0.2);
    }
    
    .dashboard-stat:hover::before {
        left: 100%;
    }
    
    .dashboard-stat-value {
        font-size: 32px;
        font-weight: 800;
        margin-bottom: 8px;
        background: linear-gradient(135deg, #00ff88, #00ccff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .dashboard-stat-label {
        font-size: 12px;
        opacity: 0.8;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        color: #80e0ff;
    }
    
    .dashboard-version {
        font-size: 14px;
        opacity: 0.7;
        padding: 12px 24px;
        background: linear-gradient(135deg, 
            rgba(0, 255, 136, 0.1) 0%, 
            rgba(0, 204, 255, 0.1) 100%);
        border-radius: 25px;
        border: 1px solid rgba(0, 255, 136, 0.3);
        margin-top: 30px;
        backdrop-filter: blur(10px);
    }
    
    /* Scrollbar styling */
    #inwazja-content::-webkit-scrollbar {
        width: 8px;
    }
    
    #inwazja-content::-webkit-scrollbar-track {
        background: rgba(0, 255, 136, 0.1);
        border-radius: 4px;
    }
    
    #inwazja-content::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #00ff88, #00ccff);
        border-radius: 4px;
    }
    
    #inwazja-content::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #00ffaa, #00e0ff);
    }
    
    /* Responsywność */
    @media (max-width: 900px) {
        #inwazja-panel {
            width: 95vw;
            height: 90vh;
            border-radius: 15px;
        }
        
        #inwazja-tiles {
            width: 200px;
        }
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
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>🌊</span>
                <span>Inwazja Add-on | v.2.1</span>
            </div>
            <div id="inwazja-controls">
                <button id="inwazja-dashboard" class="ia-btn" title="Dashboard">🏠</button>
                <button id="inwazja-close" class="ia-btn" title="Zamknij">✖</button>
            </div>
        </div>
        <div id="inwazja-body">
            <div id="inwazja-tiles">
                <div class="inwazja-tile" data-id="auto-message">
                    <div style="font-weight:800; font-size:15px;">💬 Auto-message</div>
                    <div style="opacity:.9; font-size:12px; margin-top:8px;">Automatyczne odpisywanie graczom</div>
                </div>
                <div class="inwazja-tile" data-id="inventory">
                    <div style="font-weight:800; font-size:15px;">🎒 Ekwipunek</div>
                    <div style="opacity:.9; font-size:12px; margin-top:8px;">Przegląd przedmiotów</div>
                </div>
                <div class="inwazja-tile" data-id="clan">
                    <div style="font-weight:800; font-size:15px;">⚔️ Klan</div>
                    <div style="opacity:.9; font-size:12px; margin-top:8px;">Lista członków i statusy</div>
                </div>
                <div class="inwazja-tile" data-id="skills">
                    <div style="font-weight:800; font-size:15px;">✨ Umiejętności</div>
                    <div style="opacity:.9; font-size:12px; margin-top:8px;">Tooltipy i cooldowny</div>
                </div>
                <div class="inwazja-tile" data-id="quests">
                    <div style="font-weight:800; font-size:15px;">📜 Zadania</div>
                    <div style="opacity:.9; font-size:12px; margin-top:8px;">Postępy i nagrody</div>
                </div>
                <div class="inwazja-tile" data-id="settings">
                    <div style="font-weight:800; font-size:15px;">⚙️ Ustawienia</div>
                    <div style="opacity:.9; font-size:12px; margin-top:8px;">Preferencje GUI</div>
                </div>
            </div>
            <div id="inwazja-content">
                <div style="display:flex; align-items:center; justify-content:center; height:100%; opacity:0.7; font-size:16px;">
                    🎨 Ładowanie stylowego interfejsu...
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
                
                <div class="dashboard-version">Wersja 2.1 | Stylowy Interfejs</div>
                
                <div style="margin-top: 40px; font-size: 13px; opacity: 0.6;">
                    ✨ Kliknij w kafelek po lewej stronie, aby przejść do konkretnego modułu
                </div>
            </div>
        `;
    }
    
    /**********************
     *  Drag & Drop
     **********************/
    let isDraggingIcon = false;
    let dragStartX = 0, dragStartY = 0;
    let startIconX = 0, startIconY = 0;
    
    icon.addEventListener('pointerdown', function(e) {
        if (e.button !== 0) return;
        
        isDraggingIcon = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        startIconX = parseInt(icon.style.left) || 25;
        startIconY = parseInt(icon.style.top) || 25;
        
        icon.classList.add('dragging');
        e.preventDefault();
    });
    
    document.addEventListener('pointermove', function(e) {
        if (!isDraggingIcon) return;
        
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;
        
        const newX = Math.max(10, Math.min(window.innerWidth - icon.offsetWidth - 10, startIconX + deltaX));
        const newY = Math.max(10, Math.min(window.innerHeight - icon.offsetHeight - 10, startIconY + deltaY));
        
        icon.style.left = newX + 'px';
        icon.style.top = newY + 'px';
    });
    
    document.addEventListener('pointerup', function() {
        if (!isDraggingIcon) return;
        
        isDraggingIcon = false;
        icon.classList.remove('dragging');
        
        window.inwazjaConfig.iconPos = {
            left: parseInt(icon.style.left),
            top: parseInt(icon.style.top)
        };
        window.inwazjaSaveConfig(window.inwazjaConfig);
    });
    
    /**********************
     *  Event Listenery
     **********************/
    icon.addEventListener('click', function(e) {
        if (isDraggingIcon) return;
        
        if (panel.classList.contains('visible')) {
            panel.classList.remove('visible');
        } else {
            panel.classList.add('visible');
            if (!window.inwazjaConfig.pos) {
                panel.style.left = '50%';
                panel.style.top = '50%';
                panel.style.transform = 'translate(-50%, -50%) scale(0.8)';
                setTimeout(() => {
                    panel.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 10);
            }
            setTimeout(showDashboard, 100);
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
                    <div style="padding:40px; text-align:center;">
                        <div style="font-size:48px; margin-bottom:20px;">✨</div>
                        <h3 style="margin-top:0; color:#00ffcc; font-size:28px;">${this.querySelector('div').textContent}</h3>
                        <div style="opacity:0.9; margin-bottom:30px; font-size:18px; background:linear-gradient(135deg, #a0f0ff, #80e0ff); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">Moduł w budowie</div>
                        <div style="font-size:14px; opacity:0.7;">
                            🎨 Ta funkcjonalność będzie dostępna w przyszłych aktualizacjach
                        </div>
                    </div>
                `;
            }
        });
    });
    
    /**********************
     *  Inicjalizacja
     **********************/
    if (window.inwazjaConfig.iconPos) {
        icon.style.left = window.inwazjaConfig.iconPos.left + 'px';
        icon.style.top = window.inwazjaConfig.iconPos.top + 'px';
    }
    
    if (window.inwazjaConfig.pos) {
        panel.style.left = window.inwazjaConfig.pos.left + 'px';
        panel.style.top = window.inwazjaConfig.pos.top + 'px';
        panel.style.transform = 'none';
    }
    
    console.log('✅ Inwazja Core UI: stylowy interfejs załadowany');
    
})();
