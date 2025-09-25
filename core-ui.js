// core-ui.js - UPROSZCZONA WERSJA
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
        cursor: pointer;
        z-index: 2147483005;
        user-select: none;
        white-space: nowrap;
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
        padding: 0 10px;
        background: rgba(0,0,0,0.18);
        border-bottom: 1px solid rgba(255,255,255,0.02);
        cursor: move;
    }
    
    #inwazja-controls { display: flex; align-items: center; gap: 6px; }
    
    .ia-btn { 
        background: transparent; 
        border: none; 
        color: inherit; 
        padding: 4px 6px; 
        cursor: pointer; 
    }
    
    #inwazja-body {
        display: flex;
        flex: 1;
        gap: 12px;
        padding: 10px;
        height: calc(100% - 70px);
    }
    
    #inwazja-tiles {
        width: 200px;
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
    }
    
    .inwazja-tile {
        padding: 10px;
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
        cursor: pointer;
    }
    
    #inwazja-content {
        flex: 1;
        padding: 8px;
        overflow: auto;
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
        font-size: 28px;
        font-weight: 800;
        margin-bottom: 10px;
        background: linear-gradient(135deg, #00ff88, #00ccff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .dashboard-subtitle {
        font-size: 14px;
        opacity: 0.8;
        margin-bottom: 30px;
        max-width: 400px;
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
                    <div style="font-weight:700;">Auto-message</div>
                    <div style="opacity:.9;font-size:11px;">Automatyczne odpisywanie</div>
                </div>
                <div class="inwazja-tile" data-id="inventory">
                    <div style="font-weight:700;">Ekwipunek</div>
                    <div style="opacity:.9;font-size:11px;">Przegląd przedmiotów</div>
                </div>
            </div>
            <div id="inwazja-content">
                <div>Ładowanie...</div>
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
        
        content.innerHTML = `
            <div class="dashboard-container">
                <div class="dashboard-title">Inwazja Add-on</div>
                <div class="dashboard-subtitle">
                    Zaawansowany dodatek do Margonem z funkcją automatycznego odpowiadania na wiadomości
                </div>
                <div style="opacity:0.6; font-size:12px;">Wersja 2.0.0 | Modułowy System</div>
                <div style="margin-top:30px; font-size:11px; opacity:0.6;">
                    Kliknij w kafelek po lewej stronie, aby przejść do modułu
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
                    detail: { moduleId: 'auto-message', title: 'Auto-message', subtitle: 'Automatyczne odpisywanie' }
                }));
            } else {
                const content = document.getElementById('inwazja-content');
                content.innerHTML = `<h3>${moduleId}</h3><p>Moduł w budowie</p>`;
            }
        });
    });
    
    /**********************
     *  Pozycjonowanie
     **********************/
    panel.style.left = '50%';
    panel.style.top = '50%';
    panel.style.transform = 'translate(-50%, -50%)';
    
    console.log('✅ Inwazja Core UI: załadowany pomyślnie');
    
    // Automatycznie pokaż dashboard po załadowaniu
    setTimeout(() => {
        showDashboard();
        console.log('🎉 Dashboard załadowany automatycznie');
    }, 500);
    
})();
