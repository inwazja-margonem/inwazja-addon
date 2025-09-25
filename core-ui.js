// core-ui.js
(function() {
    'use strict';
    
    if (window.inwazjaCoreLoaded) return;
    window.inwazjaCoreLoaded = true;
    
    /**********************
     *  Ustawienia i storage
     **********************/
    const STORAGE_KEY = 'inwazjaAddonConfig_v2_0';
    
    // Domyślne ustawienia
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
        activeTab: null,
        firstRun: true
    };
    
    function loadConfig() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return Object.assign({}, DEFAULT_CFG);
            const loaded = Object.assign({}, DEFAULT_CFG, JSON.parse(raw || '{}'));
            
            if (!loaded.autoMessages || loaded.autoMessages.length !== 5) {
                loaded.autoMessages = ["", "", "", "", ""];
            }
            
            if (!Array.isArray(loaded.ignoredPlayers)) {
                loaded.ignoredPlayers = [];
            }
            
            return loaded;
        } catch (e) {
            console.warn('Inwazja: błąd wczytywania configu', e);
            return Object.assign({}, DEFAULT_CFG);
        }
    }
    
    function saveConfig(cfg) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
        } catch (e) {
            console.warn('Inwazja: błąd zapisu configu', e);
        }
    }
    
    // Globalny config dostępny dla wszystkich modułów
    window.inwazjaConfig = loadConfig();
    window.inwazjaSaveConfig = saveConfig;
    
    /**********************
     *  Stałe kolory
     **********************/
    const DEFAULT_COLOR = { r: 36, g: 36, b: 36 };
    const DEFAULT_GLOW = 'rgba(120, 120, 120, 0.6)';
    let currentOpacity = typeof window.inwazjaConfig.opacity === 'number' ? window.inwazjaConfig.opacity : 1.0;
    
    /**********************
     *  CSS (stylowanie)
     **********************/
    const css = `
    /* --- ikona --- */
    #inwazja-icon {
        position: fixed;
        left: 20px; top: 20px;
        width: 140px;
        height: 36px;
        padding: 6px 12px;
        background: rgba(12,12,12,0.95);
        border: 2px solid rgba(255,255,255,0.06);
        border-radius: 8px;
        color: #fff;
        font-weight: 700;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        z-index: 2147483005;
        user-select: none;
        transition: transform 0.12s ease, box-shadow .12s ease, border-color .16s ease;
        box-sizing: border-box;
        white-space: nowrap;
    }
    #inwazja-icon.dragging { transform: none !important; transition: none !important; }

    #inwazja-icon:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 10px 22px rgba(0,0,0,0.6);
    }

    /* --- okno (panel) --- */
    #inwazja-panel {
        position: fixed;
        z-index: 2147483004;
        min-width: 600px;
        min-height: 400px;
        width: ${window.inwazjaConfig.size?.width || 800}px;
        height: ${window.inwazjaConfig.size?.height || 600}px;
        border-radius: 10px;
        overflow: hidden;
        display: none;
        flex-direction: column;
        color: #eaeff5;
        font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif;
        box-shadow: 0 36px 80px rgba(0,0,0,0.6);
        -webkit-user-select: none;
        user-select: none;
        opacity: 0;
        transform: translate(-50%, -50%) scale(.98);
        transition: opacity .22s ease, transform .22s ease;
        pointer-events: auto;
        border: 1px solid rgba(255,255,255,0.03);
        box-sizing: border-box;
    }
    #inwazja-panel.ia-visible { display:flex; opacity: 1; transform: translate(0, 0) scale(1); }

    /* header */
    #inwazja-header {
        height: 40px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        padding: 0 10px;
        gap:8px;
        cursor: move;
        background: rgba(0,0,0,0.18);
        border-bottom: 1px solid rgba(255,255,255,0.02);
    }
    #inwazja-header .title {
        font-weight:800;
        font-size:13px;
        display:flex;
        align-items:center;
        gap:8px;
    }
    #inwazja-header .version {
        opacity: 0.7;
        font-size: 11px;
        margin-left: 8px;
        padding-left: 8px;
        border-left: 1px solid rgba(255,255,255,0.2);
    }
    #inwazja-controls { display:flex; align-items:center; gap:6px; }

    .ia-btn { background:transparent; border:none; color:inherit; padding:4px 6px; border-radius:4px; cursor:pointer; font-size:13px; transition: background 0.2s ease; }
    .ia-btn:hover { background: rgba(255,255,255,0.02); }
    .ia-btn.active { background: rgba(100, 200, 255, 0.2); }

    #inwazja-close {
        color: #d6d6d6;
        border:1px solid rgba(255,255,255,0.03);
        padding:4px 6px;
        border-radius:4px;
        transition: all 0.2s ease;
    }
    #inwazja-close:hover {
        color:#ff6b6b;
        background: rgba(255,107,107,0.1);
        border-color: rgba(255,107,107,0.3);
    }

    /* --- SUWAK PRZEZROCZYSTOŚCI --- */
    #inwazja-opacity {
        width: 80px;
        height: 5px;
        background: rgba(255,255,255,0.1);
        border-radius: 3px;
        outline: none;
        cursor: pointer;
        -webkit-appearance: none;
        margin: 0;
        padding: 0;
    }

    #inwazja-opacity::-webkit-slider-runnable-track {
        width: 100%;
        height: 5px;
        background: rgba(255,255,255,0.1);
        border-radius: 3px;
        border: none;
    }

    #inwazja-opacity::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 14px;
        height: 14px;
        background: #000000;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.3);
        cursor: pointer;
        margin-top: -4.5px;
    }

    #inwazja-opacity::-moz-range-track {
        width: 100%;
        height: 5px;
        background: rgba(255,255,255,0.1);
        border-radius: 3px;
        border: none;
    }

    #inwazja-opacity::-moz-range-thumb {
        width: 14px;
        height: 14px;
        background: #000000;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.3);
        cursor: pointer;
    }

    /* body: kafelki + content */
    #inwazja-body {
        display:flex;
        flex:1;
        gap:12px;
        padding:10px;
        box-sizing:border-box;
        overflow: hidden;
        height: calc(100% - 70px);
    }

    #inwazja-tiles {
        width: 200px;
        flex-shrink:0;
        display:grid;
        grid-template-columns: 1fr;
        gap:8px;
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 100%;
    }

    .inwazja-tile {
        border-radius:8px;
        padding:8px 10px;
        min-height: 50px;
        height: auto;
        display:flex;
        flex-direction:column;
        justify-content:center;
        background: linear-gradient(180deg, rgba(255,255,255,0.015), rgba(0,0,0,0.05));
        border:1px solid rgba(255,255,255,0.02);
        transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
        position:relative;
        overflow:hidden;
        cursor:pointer;
    }

    .inwazja-tile:hover {
        transform: translateY(-1px) scale(1.005);
        box-shadow: 0 4px 10px var(--inwazja-glow, rgba(255,255,255,0.03));
        border-color: color-mix(in srgb, var(--inwazja-glow, rgba(255,255,255,0.06)) 20%, rgba(255,255,255,0.02));
    }

    #inwazja-content {
        flex:1;
        padding:8px;
        overflow: auto;
        border-radius:6px;
        overflow-x: hidden;
        max-height: 100%;
    }

    /* footer */
    #inwazja-footer {
        height:30px;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:4px 8px;
        border-top:1px solid rgba(255,255,255,0.02);
        font-size:11px;
        opacity:0.95;
        background: rgba(0,0,0,0.06);
    }

    /* resizer */
    #inwazja-resizer {
        position:absolute;
        right:6px;
        bottom:6px;
        width:14px;
        height:14px;
        cursor: se-resize;
        border-radius:2px;
        z-index:2147483010;
        background: linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.3) 50%);
        border: 1px solid rgba(255,255,255,0.1);
        transition: all 0.2s ease;
    }
    #inwazja-resizer:hover {
        background: linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.5) 50%);
        border-color: rgba(255,255,255,0.3);
    }

    /* --- DASHBOARD STYLES --- */
    .dashboard-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        text-align: center;
        height: 100%;
    }

    .dashboard-title {
        font-size: 28px;
        font-weight: 800;
        margin-bottom: 10px;
        background: linear-gradient(135deg, #00ff88, #00ccff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .dashboard-subtitle {
        font-size: 14px;
        opacity: 0.8;
        margin-bottom: 30px;
        max-width: 400px;
        line-height: 1.5;
    }

    .dashboard-version {
        font-size: 12px;
        opacity: 0.6;
        margin-bottom: 40px;
        padding: 8px 16px;
        background: rgba(255,255,255,0.05);
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.1);
    }

    .dashboard-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        width: 100%;
        max-width: 400px;
        margin-top: 20px;
    }

    .dashboard-stat {
        padding: 15px;
        background: rgba(255,255,255,0.03);
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.05);
    }

    .dashboard-stat-value {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 5px;
    }

    .dashboard-stat-label {
        font-size: 11px;
        opacity: 0.7;
    }

    /* SCROLLBARY */
    #inwazja-tiles::-webkit-scrollbar,
    #inwazja-content::-webkit-scrollbar {
        width: 6px;
    }

    #inwazja-tiles::-webkit-scrollbar-track,
    #inwazja-content::-webkit-scrollbar-track {
        background: rgba(255,255,255,0.02);
        border-radius: 3px;
    }

    #inwazja-tiles::-webkit-scrollbar-thumb,
    #inwazja-content::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.15);
        border-radius: 3px;
        transition: background 0.2s ease;
    }

    #inwazja-tiles::-webkit-scrollbar-thumb:hover,
    #inwazja-content::-webkit-scrollbar-thumb:hover {
        background: rgba(255,255,255,0.25);
    }

    /* RESPONSYWNOŚĆ */
    @media (max-width: 900px) {
        #inwazja-panel {
            width: 95vw;
            height: 80vh;
            min-width: 400px;
            min-height: 300px;
        }
        #inwazja-tiles { width: 35%; }
    }

    @media (max-width: 600px) {
        #inwazja-tiles { width: 100%; grid-template-columns: repeat(2, 1fr); }
        #inwazja-body { flex-direction: column; }
    }
    `;
    
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
    
    /**********************
     *  Budowa DOM
     **********************/
    const prevIcon = document.getElementById('inwazja-icon');
    if (prevIcon) prevIcon.remove();
    const prevPanel = document.getElementById('inwazja-panel');
    if (prevPanel) prevPanel.remove();
    
    // Ikona
    const icon = document.createElement('div');
    icon.id = 'inwazja-icon';
    icon.title = 'Inwazja Add-on';
    icon.textContent = 'Inwazja Add-on';
    document.body.appendChild(icon);
    
    // Panel
    const panel = document.createElement('div');
    panel.id = 'inwazja-panel';
    panel.innerHTML = `
        <div id="inwazja-header">
            <div class="title">
                Inwazja Add-on
                <span class="version">| v. 2.0.0</span>
            </div>
            <div id="inwazja-controls">
                <button id="inwazja-dashboard" class="ia-btn" title="Dashboard">🏠</button>
                <input id="inwazja-opacity" type="range" min="0.5" max="1" step="0.01" value="${currentOpacity}" title="Przezroczystość">
                <button id="inwazja-close" class="ia-btn" title="Zamknij">✖</button>
            </div>
        </div>
        <div id="inwazja-body">
            <div id="inwazja-tiles"></div>
            <div id="inwazja-content"><div style="opacity:.9">Wersja: modułowa 2.0.0. <strong id="inwazja-activeTitle"></strong></div></div>
        </div>
        <div id="inwazja-footer">Modułowy UI | Inwazja Add-on v2.0.0</div>
        <div id="inwazja-resizer" aria-hidden="true" title="Zmień rozmiar okna"></div>
    `;
    document.body.appendChild(panel);
    
    // Kafelki
    const modulesData = [
        { id: 'auto-message', title: 'Auto-message', subtitle: 'Skrypt na automatyczne odpisywanie graczom podczas nieobecności.' },
        { id: 'inventory', title: 'Ekwipunek', subtitle: 'Przegląd przedmiotów' },
        { id: 'clan', title: 'Klan', subtitle: 'Lista członków i statusy' },
        { id: 'skills', title: 'Umiejętności', subtitle: 'Tooltipy i cooldowny' },
        { id: 'quests', title: 'Zadania', subtitle: 'Postępy i nagrody' },
        { id: 'settings', title: 'Ustawienia', subtitle: 'Preferencje GUI' }
    ];
    
    const tilesContainer = document.getElementById('inwazja-tiles');
    modulesData.forEach(m => {
        const t = document.createElement('div');
        t.className = 'inwazja-tile';
        t.dataset.id = m.id;
        t.innerHTML = `<div style="font-weight:700; font-size:12px;">${m.title}</div><div style="opacity:.9;font-size:10px; line-height:1.2;">${m.subtitle}</div>`;
        t.title = `${m.title}: ${m.subtitle}`;
        tilesContainer.appendChild(t);
        
        t.addEventListener('click', () => {
            // Usuń aktywność z przycisku dashboard
            const dashboardBtn = document.getElementById('inwazja-dashboard');
            if (dashboardBtn) dashboardBtn.classList.remove('active');
            
            // Event dla modułów do obsługi
            const event = new CustomEvent('inwazjaModuleChange', { 
                detail: { moduleId: m.id, title: m.title, subtitle: m.subtitle }
            });
            window.dispatchEvent(event);
            
            window.inwazjaConfig.activeTab = m.id;
            window.inwazjaSaveConfig(window.inwazjaConfig);
        });
    });
    
    /**********************
     *  Funkcje pomocnicze
     **********************/
    function applyTheme() {
        panel.style.background = `rgba(${DEFAULT_COLOR.r}, ${DEFAULT_COLOR.g}, ${DEFAULT_COLOR.b}, ${currentOpacity})`;
        panel.style.setProperty('--inwazja-glow', DEFAULT_GLOW);
    }
    
    function enableMouseWheelScroll(element) {
        if (!element) return;
        element.addEventListener('wheel', (e) => {
            if (element.scrollHeight > element.clientHeight) {
                element.scrollTop += e.deltaY;
                e.preventDefault();
            }
        }, { passive: false });
    }
    
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
    
    // Funkcje pomocnicze dostępne globalnie
    window.inwazjaShowModuleContent = function(contentHTML) {
        const content = document.getElementById('inwazja-content');
        if (content) content.innerHTML = contentHTML;
    };
    
    window.inwazjaSetActiveTitle = function(title) {
        const titleElement = document.getElementById('inwazja-activeTitle');
        if (titleElement) titleElement.textContent = title;
    };
    
    /**********************
     *  Inicjalizacja pozycjonowania
     **********************/
    const cfg = window.inwazjaConfig;
    
    // Pozycjonowanie ikony
    if (cfg.iconPos && typeof cfg.iconPos.left === 'number') {
        icon.style.left = cfg.iconPos.left + 'px';
        icon.style.top = cfg.iconPos.top + 'px';
    } else {
        icon.style.left = '20px';
        icon.style.top  = '20px';
    }
    
    // Pozycjonowanie panelu
    if (cfg.pos && typeof cfg.pos.left === 'number') {
        panel.style.left = cfg.pos.left + 'px';
        panel.style.top  = cfg.pos.top + 'px';
        panel.style.transform = 'translate(0,0)';
    } else {
        panel.style.left = '50%';
        panel.style.top  = '50%';
        panel.style.transform = 'translate(-50%,-50%) scale(.98)';
    }
    
    // Rozmiar panelu
    if (cfg.size && cfg.size.width && cfg.size.height) {
        panel.style.width = cfg.size.width + 'px';
        panel.style.height = cfg.size.height + 'px';
    }
    
    applyTheme();
    
    /**********************
     *  Event Listeners
     **********************/
    
    // Drag & drop ikony
    (function iconClickDrag() {
        let down = false, moved = false;
        let startX = 0, startY = 0;
        const THRESHOLD = 6;
        
        icon.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            down = true; moved = false;
            startX = e.clientX; startY = e.clientY;
            icon.classList.add('dragging');
            e.preventDefault();
        });
        
        window.addEventListener('pointermove', (e) => {
            if (!down) return;
            const dx = e.clientX - startX, dy = e.clientY - startY;
            if (!moved && Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return;
            moved = true;
            const left = Math.max(6, Math.min(window.innerWidth - icon.offsetWidth - 6, e.clientX - (icon.offsetWidth/2)));
            const top  = Math.max(6, Math.min(window.innerHeight - icon.offsetHeight - 6, e.clientY - (icon.offsetHeight/2)));
            icon.style.left = left + 'px';
            icon.style.top  = top  + 'px';
        });
        
        window.addEventListener('pointerup', (e) => {
            if (!down) return;
            down = false;
            icon.classList.remove('dragging');
            if (moved) {
                cfg.iconPos = { left: parseInt(icon.style.left), top: parseInt(icon.style.top) };
                saveConfig(cfg);
                return;
            }
            
            if (panel.classList.contains('ia-visible')) {
                panel.classList.remove('ia-visible');
            } else {
                panel.classList.add('ia-visible');
                if (cfg.pos && typeof cfg.pos.left === 'number') {
                    panel.style.transform = 'translate(0,0)';
                } else {
                    panel.style.transform = 'translate(-50%,-50%) scale(.98)';
                }
                
                // AUTOMATYCZNIE PRZEJDŹ NA DASHBOARD PO OTWARCIU
                setTimeout(() => {
                    showDashboard();
                    window.inwazjaConfig.activeTab = 'dashboard';
                    window.inwazjaSaveConfig(window.inwazjaConfig);
                    
                    enableMouseWheelScroll(document.getElementById('inwazja-tiles'));
                    enableMouseWheelScroll(document.getElementById('inwazja-content'));
                }, 100);
            }
        });
    })();
    
    // Drag panelu
    (function panelDrag() {
        const header = document.getElementById('inwazja-header');
        if (!header) return;
        
        let dragging = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;
        
        header.addEventListener('pointerdown', (e) => {
            if (e.target.id === 'inwazja-opacity' || e.target.closest('#inwazja-opacity')) return;
            if (e.target.id === 'inwazja-close' || e.target.id === 'inwazja-dashboard') return;
            if (e.button !== 0) return;
            dragging = true;
            
            if (!cfg.pos || typeof cfg.pos.left !== 'number') {
                const rect = panel.getBoundingClientRect();
                startLeft = rect.left;
                startTop  = rect.top;
                panel.style.left = startLeft + 'px';
                panel.style.top  = startTop  + 'px';
                panel.style.transform = 'translate(0,0)';
            } else {
                startLeft = parseInt(panel.style.left || 0);
                startTop  = parseInt(panel.style.top || 0);
            }
            startX = e.clientX; startY = e.clientY;
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });
        
        window.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            const dx = e.clientX - startX, dy = e.clientY - startY;
            let left = startLeft + dx, top = startTop + dy;
            left = Math.max(6, Math.min(window.innerWidth - panel.offsetWidth - 6, left));
            top  = Math.max(6, Math.min(window.innerHeight - panel.offsetHeight - 6, top));
            panel.style.left = left + 'px';
            panel.style.top  = top  + 'px';
        });
        
        window.addEventListener('pointerup', () => {
            if (!dragging) return;
            dragging = false;
            document.body.style.userSelect = '';
            cfg.pos = { left: parseInt(panel.style.left), top: parseInt(panel.style.top) };
            saveConfig(cfg);
        });
    })();
    
    // Resizer
    (function resizerInit(){
        const resizer = document.getElementById('inwazja-resizer');
        if (!resizer) return;
        
        let resizing = false, startX=0, startY=0, startW=0, startH=0;
        resizer.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            resizing = true;
            startX = e.clientX; startY = e.clientY;
            startW = panel.offsetWidth; startH = panel.offsetHeight;
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });
        
        window.addEventListener('pointermove', (e) => {
            if (!resizing) return;
            const dx = e.clientX - startX, dy = e.clientY - startY;
            const newW = Math.max(600, Math.min(startW + dx, window.innerWidth - 40));
            const newH = Math.max(400, Math.min(startH + dy, window.innerHeight - 40));
            panel.style.width = newW + 'px';
            panel.style.height = newH + 'px';
        });
        
        window.addEventListener('pointerup', () => {
            if (!resizing) return;
            resizing = false;
            document.body.style.userSelect = '';
            cfg.size = { width: panel.offsetWidth, height: panel.offsetHeight };
            saveConfig(cfg);
        });
    })();
    
    /**********************
     *  Inicjalizacja Event Listeners
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
        }
        
        // Przycisk dashboard
        const dashboardBtn = document.getElementById('inwazja-dashboard');
        if (dashboardBtn) {
            dashboardBtn.addEventListener('click', () => {
                console.log('Dashboard: kliknięto przycisk');
                showDashboard();
                window.inwazjaConfig.activeTab = 'dashboard';
                window.inwazjaSaveConfig(window.inwazjaConfig);
            });
            console.log('Przycisk dashboard: OK');
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
    
    // Obsługa resize okna
    window.addEventListener('resize', () => {
        const left = parseInt(panel.style.left || 0), top = parseInt(panel.style.top || 0);
        const w = panel.offsetWidth, h = panel.offsetHeight;
        let changed = false, newLeft = left, newTop = top;
        if (left + w > window.innerWidth - 8) { newLeft = Math.max(8, window.innerWidth - w - 8); changed = true; }
        if (top + h > window.innerHeight - 8) { newTop = Math.max(8, window.innerHeight - h - 8); changed = true; }
        if (changed) {
            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
            cfg.pos = { left: newLeft, top: newTop };
            saveConfig(cfg);
        }
        
        const iconLeft = parseInt(icon.style.left || 0), iconTop = parseInt(icon.style.top || 0);
        let iconChanged = false, newIconLeft = iconLeft, newIconTop = iconTop;
        if (iconLeft + icon.offsetWidth > window.innerWidth - 6) { newIconLeft = Math.max(6, window.innerWidth - icon.offsetWidth - 6); iconChanged = true; }
        if (iconTop + icon.offsetHeight > window.innerHeight - 6) { newIconTop = Math.max(6, window.innerHeight - icon.offsetHeight - 6); iconChanged = true; }
        if (iconChanged) {
            icon.style.left = newIconLeft + 'px';
            icon.style.top  = newIconTop + 'px';
            cfg.iconPos = { left: newIconLeft, top: newIconTop };
            saveConfig(cfg);
        }
    });
    
    // Zapisz przed zamknięciem
    window.addEventListener('beforeunload', () => {
        cfg.opacity = currentOpacity;
        if (panel.style.left && panel.style.top) {
            const leftVal = parseFloat(panel.style.left);
            if (!isNaN(leftVal)) cfg.pos = { left: leftVal, top: parseFloat(panel.style.top) };
        }
        cfg.size = { width: panel.offsetWidth, height: panel.offsetHeight };
        cfg.iconPos = { left: parseFloat(icon.style.left), top: parseFloat(icon.style.top) };
        saveConfig(cfg);
    });
    
    /**********************
     *  Finalna inicjalizacja
     **********************/
    setTimeout(() => {
        initializeEventListeners();
        
        // Zawsze pokazuj dashboard przy otwarciu
        console.log('Automatyczne wyświetlanie dashboardu...');
        showDashboard();
        window.inwazjaConfig.activeTab = 'dashboard';
        window.inwazjaSaveConfig(window.inwazjaConfig);
        
        // Inicjalizacja scrolla
        enableMouseWheelScroll(document.getElementById('inwazja-tiles'));
        enableMouseWheelScroll(document.getElementById('inwazja-content'));
        
        console.log('✅ Inwazja Add-on: Core UI w pełni załadowany z Dashboardem');
    }, 100);
})();
