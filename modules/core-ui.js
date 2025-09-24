// modules/core-ui.js
(function() {
    'use strict';
    
    if (window.inwazjaCoreLoaded) return;
    window.inwazjaCoreLoaded = true;
    
    /**********************
     *  Ustawienia i storage
     **********************/
    const STORAGE_KEY = 'inwazjaAddonConfig_v1_6';
    
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
        activeTab: null
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
        /* ... (CAŁY KOD CSS Z TWOJEGO SKRYPTU) ... */
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
            // Event dla modułów do obsługi
            const event = new CustomEvent('inwazjaModuleChange', { 
                detail: { moduleId: m.id, title: m.title, subtitle: m.subtitle }
            });
            window.dispatchEvent(event);
            
            window.inwazjaConfig.activeTab = m.id;
            window.inwazjaSaveConfig(window.inwazjaConfig);
        });
    });
    
    // Funkcje pomocnicze dostępne globalnie
    window.inwazjaShowModuleContent = function(contentHTML) {
        document.getElementById('inwazja-content').innerHTML = contentHTML;
    };
    
    window.inwazjaSetActiveTitle = function(title) {
        document.getElementById('inwazja-activeTitle').textContent = title;
    };
    
    /**********************
     *  Funkcjonalność główna
     **********************/
    // ... (reszta kodu z twojego skryptu: pozycjonowanie, drag&drop, resizer, etc.)
    
    console.log('✅ Inwazja Add-on: Core UI załadowany');
})();
