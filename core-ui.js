// core-ui.js
(function() {
    'use strict';
    
    if (window.inwazjaCoreLoaded) return;
    window.inwazjaCoreLoaded = true;
    
    console.log('🚀 Inwazja Core UI: ładowanie...');
    
    /**********************
     *  Konfiguracja
     **********************/
    const STORAGE_KEY = 'inwazjaAddonConfig_v2_1';
    const DEFAULT_CFG = {
        pos: null,
        size: { width: 800, height: 600 },
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
     *  Tworzenie DOM
     **********************/
    document.getElementById('inwazja-icon')?.remove();
    document.getElementById('inwazja-panel')?.remove();
    
    // Ikona
    const icon = document.createElement('div');
    icon.id = 'inwazja-icon';
    icon.textContent = 'Inwazja Add-on';
    icon.title = 'Inwazja Add-on - Kliknij aby otworzyć';
    
    icon.style.cssText = `
        position: fixed;
        left: 20px;
        top: 20px;
        width: 150px;
        height: 40px;
        padding: 10px 15px;
        background: linear-gradient(135deg, #00ff88, #00ccff);
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 10px;
        color: #002b33;
        font-weight: bold;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10000;
        user-select: none;
        white-space: nowrap;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
        text-align: center;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,255,136,0.3);
    `;
    
    document.body.appendChild(icon);
    
    // Panel
    const panel = document.createElement('div');
    panel.id = 'inwazja-panel';
    
    panel.style.cssText = `
        position: fixed;
        z-index: 9999;
        width: 800px;
        height: 600px;
        border-radius: 15px;
        overflow: hidden;
        display: none;
        flex-direction: column;
        background: rgba(20,30,40,0.95);
        color: #e0f7ff;
        font-family: Arial, sans-serif;
        box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        user-select: none;
        border: 1px solid rgba(0,255,136,0.3);
        backdrop-filter: blur(10px);
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    `;
    
    panel.innerHTML = `
        <div id="inwazja-header" style="
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            background: rgba(0,40,80,0.8);
            border-bottom: 1px solid rgba(0,255,136,0.2);
            cursor: move;
            font-size: 14px;
            font-weight: bold;
        ">
            <div>Inwazja Add-on | v.2.1</div>
            <div id="inwazja-controls" style="display: flex; align-items: center; gap: 10px;">
                <button id="inwazja-dashboard" class="ia-btn" title="Dashboard" style="
                    background: rgba(0,255,136,0.2);
                    border: 1px solid rgba(0,255,136,0.3);
                    color: #a0f0ff;
                    padding: 6px 10px;
                    cursor: pointer;
                    border-radius: 5px;
                    font-size: 16px;
                    transition: all 0.2s ease;
                ">🏠</button>
                <button id="inwazja-close" class="ia-btn" title="Zamknij" style="
                    background: rgba(255,100,100,0.2);
                    border: 1px solid rgba(255,100,100,0.3);
                    color: #ffa0a0;
                    padding: 6px 10px;
                    cursor: pointer;
                    border-radius: 5px;
                    font-size: 16px;
                    transition: all 0.2s ease;
                ">✖</button>
            </div>
        </div>
        <div id="inwazja-body" style="
            display: flex;
            flex: 1;
            gap: 20px;
            padding: 20px;
            height: calc(100% - 65px);
            background: rgba(0,0,0,0.2);
            overflow: hidden;
        ">
            <div id="inwazja-tiles" style="
                width: 200px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                flex-shrink: 0;
                overflow-y: auto;
                padding-right: 5px;
            ">
                <div class="inwazja-tile" data-id="auto-message" style="
                    padding: 15px;
                    background: rgba(0,255,136,0.1);
                    border: 1px solid rgba(0,255,136,0.2);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                ">
                    <div style="font-weight:bold; font-size:14px; color:#00ffcc;">Auto-message</div>
                    <div style="opacity:0.8; font-size:12px; margin-top:5px; color:#a0f0ff;">Automatyczne odpisywanie</div>
                </div>
                <div class="inwazja-tile" data-id="inventory" style="
                    padding: 15px;
                    background: rgba(0,255,136,0.1);
                    border: 1px solid rgba(0,255,136,0.2);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                ">
                    <div style="font-weight:bold; font-size:14px; color:#00ffcc;">Ekwipunek</div>
                    <div style="opacity:0.8; font-size:12px; margin-top:5px; color:#a0f0ff;">Przegląd przedmiotów</div>
                </div>
                <div class="inwazja-tile" data-id="clan" style="
                    padding: 15px;
                    background: rgba(0,255,136,0.1);
                    border: 1px solid rgba(0,255,136,0.2);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                ">
                    <div style="font-weight:bold; font-size:14px; color:#00ffcc;">Klan</div>
                    <div style="opacity:0.8; font-size:12px; margin-top:5px; color:#a0f0ff;">Lista członków</div>
                </div>
                <div class="inwazja-tile" data-id="skills" style="
                    padding: 15px;
                    background: rgba(0,255,136,0.1);
                    border: 1px solid rgba(0,255,136,0.2);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                ">
                    <div style="font-weight:bold; font-size:14px; color:#00ffcc;">Umiejętności</div>
                    <div style="opacity:0.8; font-size:12px; margin-top:5px; color:#a0f0ff;">Tooltipy i cooldowny</div>
                </div>
                <div class="inwazja-tile" data-id="quests" style="
                    padding: 15px;
                    background: rgba(0,255,136,0.1);
                    border: 1px solid rgba(0,255,136,0.2);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                ">
                    <div style="font-weight:bold; font-size:14px; color:#00ffcc;">Zadania</div>
                    <div style="opacity:0.8; font-size:12px; margin-top:5px; color:#a0f0ff;">Postępy i nagrody</div>
                </div>
                <div class="inwazja-tile" data-id="settings" style="
                    padding: 15px;
                    background: rgba(0,255,136,0.1);
                    border: 1px solid rgba(0,255,136,0.2);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                ">
                    <div style="font-weight:bold; font-size:14px; color:#00ffcc;">Ustawienia</div>
                    <div style="opacity:0.8; font-size:12px; margin-top:5px; color:#a0f0ff;">Preferencje GUI</div>
                </div>
            </div>
            <div id="inwazja-content" style="
                flex: 1;
                padding: 20px;
                overflow: auto;
                background: rgba(0,20,40,0.3);
                border-radius: 10px;
                border: 1px solid rgba(0,255,136,0.1);
            ">
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
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                text-align: center;
                padding: 40px 30px;
            ">
                <div style="
                    font-size: 32px;
                    font-weight: bold;
                    margin-bottom: 15px;
                    background: linear-gradient(135deg, #00ff88, #00ccff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                ">Inwazja Add-on</div>
                
                <div style="
                    font-size: 15px;
                    opacity: 0.9;
                    margin-bottom: 30px;
                    max-width: 500px;
                    line-height: 1.5;
                    color: #a0f0ff;
                ">
                    Zaawansowany dodatek do Margonem z funkcją automatycznego odpowiadania na wiadomości
                </div>
                
                <div style="
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                    width: 100%;
                    max-width: 400px;
                    margin: 25px 0;
                ">
                    <div style="padding: 15px; background: rgba(0,255,136,0.1); border-radius: 8px; border: 1px solid rgba(0,255,136,0.3);">
                        <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px; color: #00ff88;">${totalMessages}/5</div>
                        <div style="font-size: 11px; opacity: 0.8; color: #80e0ff;">Aktywne wiadomości</div>
                    </div>
                    <div style="padding: 15px; background: rgba(0,255,136,0.1); border-radius: 8px; border: 1px solid rgba(0,255,136,0.3);">
                        <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px; color: #00ff88;">${ignoredPlayers}/5</div>
                        <div style="font-size: 11px; opacity: 0.8; color: #80e0ff;">Ignorowani gracze</div>
                    </div>
                    <div style="padding: 15px; background: rgba(0,255,136,0.1); border-radius: 8px; border: 1px solid rgba(0,255,136,0.3);">
                        <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px; color: #00ff88;">${autoEnabled}</div>
                        <div style="font-size: 11px; opacity: 0.8; color: #80e0ff;">Auto-odpowiadanie</div>
                    </div>
                    <div style="padding: 15px; background: rgba(0,255,136,0.1); border-radius: 8px; border: 1px solid rgba(0,255,136,0.3);">
                        <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px; color: #00ff88;">${scheduleEnabled}</div>
                        <div style="font-size: 11px; opacity: 0.8; color: #80e0ff;">Harmonogram</div>
                    </div>
                </div>
                
                <div style="
                    font-size: 12px;
                    opacity: 0.7;
                    padding: 8px 16px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 20px;
                    border: 1px solid rgba(255,255,255,0.1);
                    margin-top: 20px;
                    color: #a0f0ff;
                ">Wersja 2.1 | Działający Interfejs</div>
                
                <div style="margin-top: 30px; font-size: 11px; opacity: 0.6; color: #80e0ff;">
                    Kliknij w kafelek po lewej stronie, aby przejść do konkretnego modułu
                </div>
            </div>
        `;
    }
    
    /**********************
     *  POPRAWIONY DRAG & DROP (szybki i responsywny)
     **********************/
    let isDraggingIcon = false;
    let dragStartX = 0, dragStartY = 0;
    let startIconX = 0, startIconY = 0;
    
    // Optymalny drag & drop
    const handleIconMouseDown = (e) => {
        if (e.button !== 0) return;
        
        isDraggingIcon = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        startIconX = parseInt(icon.style.left) || 20;
        startIconY = parseInt(icon.style.top) || 20;
        
        icon.style.transition = 'none'; // Wyłącz animacje podczas drag
        icon.style.opacity = '0.9';
        e.preventDefault();
    };
    
    const handleIconMouseMove = (e) => {
        if (!isDraggingIcon) return;
        
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;
        
        const newX = Math.max(5, Math.min(window.innerWidth - icon.offsetWidth - 5, startIconX + deltaX));
        const newY = Math.max(5, Math.min(window.innerHeight - icon.offsetHeight - 5, startIconY + deltaY));
        
        icon.style.left = newX + 'px';
        icon.style.top = newY + 'px';
    };
    
    const handleIconMouseUp = () => {
        if (!isDraggingIcon) return;
        
        isDraggingIcon = false;
        icon.style.transition = 'all 0.3s ease'; // Włącz animacje z powrotem
        icon.style.opacity = '1';
        
        window.inwazjaConfig.iconPos = {
            left: parseInt(icon.style.left),
            top: parseInt(icon.style.top)
        };
        window.inwazjaSaveConfig(window.inwazjaConfig);
    };
    
    // Event listeners dla drag & drop
    icon.addEventListener('mousedown', handleIconMouseDown);
    document.addEventListener('mousemove', handleIconMouseMove);
    document.addEventListener('mouseup', handleIconMouseUp);
    
    /**********************
     *  SCROLL (działa z kółkiem myszy)
     **********************/
    function enableScrolling() {
        const content = document.getElementById('inwazja-content');
        const tiles = document.getElementById('inwazja-tiles');
        
        if (content) {
            content.addEventListener('wheel', (e) => {
                e.preventDefault();
                content.scrollTop += e.deltaY;
            }, { passive: false });
        }
        
        if (tiles) {
            tiles.addEventListener('wheel', (e) => {
                e.preventDefault();
                tiles.scrollTop += e.deltaY;
            }, { passive: false });
        }
    }
    
    /**********************
     *  Hover effects
     **********************/
    icon.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(135deg, #00ffaa, #00e0ff)';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 20px rgba(0,255,136,0.4)';
    });
    
    icon.addEventListener('mouseleave', function() {
        if (isDraggingIcon) return;
        this.style.background = 'linear-gradient(135deg, #00ff88, #00ccff)';
        this.style.transform = 'translateY(0px)';
        this.style.boxShadow = '0 4px 15px rgba(0,255,136,0.3)';
    });
    
    document.querySelectorAll('.inwazja-tile').forEach(tile => {
        tile.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(0,255,136,0.2)';
            this.style.borderColor = 'rgba(0,255,136,0.4)';
            this.style.transform = 'translateY(-3px)';
        });
        
        tile.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(0,255,136,0.1)';
            this.style.borderColor = 'rgba(0,255,136,0.2)';
            this.style.transform = 'translateY(0px)';
        });
    });
    
    document.querySelectorAll('.ia-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.opacity = '1';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1.0)';
            this.style.opacity = '0.9';
        });
    });
    
    /**********************
     *  Podstawowe eventy
     **********************/
    icon.addEventListener('click', function(e) {
        if (isDraggingIcon) return;
        
        if (panel.style.display === 'flex') {
            panel.style.display = 'none';
        } else {
            panel.style.display = 'flex';
            setTimeout(() => {
                showDashboard();
                enableScrolling(); // Włącz scroll po otwarciu
            }, 50);
        }
    });
    
    document.getElementById('inwazja-dashboard').addEventListener('click', showDashboard);
    
    document.getElementById('inwazja-close').addEventListener('click', function() {
        panel.style.display = 'none';
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
                    <div style="padding:30px; text-align:center;">
                        <h3 style="margin-top:0; color:#00ffcc; font-size:24px;">${this.querySelector('div').textContent}</h3>
                        <div style="opacity:0.8; margin-bottom:20px; font-size:16px; color:#a0f0ff;">Moduł w budowie</div>
                        <div style="font-size:14px; opacity:0.6; color:#80e0ff;">
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
    if (window.inwazjaConfig.iconPos) {
        icon.style.left = window.inwazjaConfig.iconPos.left + 'px';
        icon.style.top = window.inwazjaConfig.iconPos.top + 'px';
    }
    
    if (window.inwazjaConfig.pos) {
        panel.style.left = window.inwazjaConfig.pos.left + 'px';
        panel.style.top = window.inwazjaConfig.pos.top + 'px';
        panel.style.transform = 'none';
    }
    
    console.log('✅ Inwazja Core UI: POPRAWIONY interfejs załadowany');
    
})();
