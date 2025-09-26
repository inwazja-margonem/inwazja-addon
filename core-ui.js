// core-ui.js (POPRAWIONA WERSJA)
(function() {
    'use strict';
    
    if (window.inwazjaCoreLoaded) return;
    window.inwazjaCoreLoaded = true;
    
    console.log('🚀 Inwazja Core UI: ładowanie poprawionej wersji...');
    
    /**********************
     *  Konfiguracja
     **********************/
    const STORAGE_KEY = 'inwazjaAddonConfig_v2_2';
    const DEFAULT_CFG = {
        pos: null,
        size: { width: 800, height: 600 },
        iconPos: null,
        opacity: 0.95,
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
    
    let currentOpacity = window.inwazjaConfig.opacity || 0.95;
    
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
        width: 140px;
        height: 36px;
        padding: 8px 12px;
        background: rgba(12,12,12,0.95);
        border: 2px solid rgba(255,255,255,0.08);
        border-radius: 8px;
        color: #fff;
        font-weight: bold;
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
        text-align: center;
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(icon);
    
    // Panel
    const panel = document.createElement('div');
    panel.id = 'inwazja-panel';
    
    panel.style.cssText = `
        position: fixed;
        z-index: 9999;
        width: ${window.inwazjaConfig.size.width}px;
        height: ${window.inwazjaConfig.size.height}px;
        border-radius: 12px;
        overflow: hidden;
        display: none;
        flex-direction: column;
        background: rgba(28,28,28,${currentOpacity});
        color: #eaeff5;
        font-family: Arial, sans-serif;
        box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        user-select: none;
        border: 1px solid rgba(255,255,255,0.1);
        backdrop-filter: blur(10px);
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        resize: none;
    `;
    
    // SVG dla ikony domku (dashboard)
    const dashboardSVG = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 12.5V8.5H8.5V12.5H11.5V7.5H13.5L7 1.5L0.5 7.5H2.5V12.5H5.5Z" fill="currentColor"/>
    </svg>`;
    
    panel.innerHTML = `
        <div id="inwazja-header" style="
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px;
            background: rgba(0,0,0,0.3);
            border-bottom: 1px solid rgba(255,255,255,0.05);
            cursor: move;
            font-size: 13px;
            font-weight: bold;
            position: relative;
        ">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span>Inwazja Add-on</span>
                <span style="opacity: 0.6; font-size: 11px;">| v.2.2</span>
            </div>
            <div id="inwazja-controls" style="display: flex; align-items: center; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 11px; opacity: 0.7;">Przezroczystość</span>
                    <div style="position: relative; width: 90px;">
                        <input type="range" id="inwazja-opacity" min="50" max="100" value="${currentOpacity * 100}" 
                            style="width: 100%; height: 4px; background: rgba(255,255,255,0.15); border-radius: 2px; cursor: pointer; appearance: none; outline: none;"
                            title="Przezroczystość">
                    </div>
                </div>
                <button id="inwazja-dashboard" class="ia-btn" title="Dashboard" style="
                    background: transparent;
                    border: none;
                    color: #d6d6d6;
                    padding: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    border-radius: 3px;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">${dashboardSVG}</button>
                <button id="inwazja-close" class="ia-btn" title="Zamknij" style="
                    background: transparent;
                    border: none;
                    color: #d6d6d6;
                    padding: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    border-radius: 3px;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">✖</button>
            </div>
        </div>
        <div id="inwazja-body" style="
            display: flex;
            flex: 1;
            gap: 15px;
            padding: 15px;
            height: calc(100% - 50px);
            background: rgba(0,0,0,0.1);
            overflow: hidden;
        ">
            <div id="inwazja-tiles" style="
                width: 200px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                flex-shrink: 0;
                overflow-y: auto;
                padding-right: 5px;
            ">
                <div class="inwazja-tile" data-id="auto-message" style="
                    padding: 12px;
                    background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(0,0,0,0.1));
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                    position: relative;
                ">
                    <div style="font-weight:bold; font-size:13px; color:#eaeff5;">Auto-message</div>
                    <div style="opacity:0.8; font-size:11px; margin-top:4px; color:#b0b8c5;">Automatyczne odpisywanie</div>
                </div>
<div class="inwazja-tile" data-id="auto-heal" style="
    padding: 12px;
    background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(0,0,0,0.1));
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;
    position: relative;
">
    <div style="font-weight:bold; font-size:13px; color:#eaeff5;">Auto-heal</div>
    <div style="opacity:0.8; font-size:11px; margin-top:4px; color:#b0b8c5;">Skrypt na automatyczne leczenie</div>
</div>
                <div class="inwazja-tile" data-id="clan" style="
                    padding: 12px;
                    background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(0,0,0,0.1));
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                    position: relative;
                ">
                    <div style="font-weight:bold; font-size:13px; color:#eaeff5;">Klan</div>
                    <div style="opacity:0.8; font-size:11px; margin-top:4px; color:#b0b8c5;">Lista członków</div>
                </div>
                <div class="inwazja-tile" data-id="skills" style="
                    padding: 12px;
                    background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(0,0,0,0.1));
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                    position: relative;
                ">
                    <div style="font-weight:bold; font-size:13px; color:#eaeff5;">Umiejętności</div>
                    <div style="opacity:0.8; font-size:11px; margin-top:4px; color:#b0b8c5;">Tooltipy i cooldowny</div>
                </div>
                <div class="inwazja-tile" data-id="quests" style="
                    padding: 12px;
                    background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(0,0,0,0.1));
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                    position: relative;
                ">
                    <div style="font-weight:bold; font-size:13px; color:#eaeff5;">Zadania</div>
                    <div style="opacity:0.8; font-size:11px; margin-top:4px; color:#b0b8c5;">Postępy i nagrody</div>
                </div>
                <div class="inwazja-tile" data-id="settings" style="
                    padding: 12px;
                    background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(0,0,0,0.1));
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                    position: relative;
                ">
                    <div style="font-weight:bold; font-size:13px; color:#eaeff5;">Ustawienia</div>
                    <div style="opacity:0.8; font-size:11px; margin-top:4px; color:#b0b8c5;">Preferencje GUI</div>
                </div>
            </div>
            <div id="inwazja-content" style="
                flex: 1;
                padding: 15px;
                overflow: auto;
                background: rgba(0,0,0,0.05);
                border-radius: 8px;
                border: 1px solid rgba(255,255,255,0.05);
            ">
                <div style="display:flex; align-items:center; justify-content:center; height:100%; opacity:0.7; font-size:14px;">
                    Ładowanie dashboardu...
                </div>
            </div>
        </div>
        <div id="inwazja-resizer" style="
            position: absolute;
            right: 2px;
            bottom: 2px;
            width: 12px;
            height: 12px;
            cursor: nwse-resize;
            background: linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.3) 50%);
            border-radius: 1px;
            z-index: 1000;
        "></div>
        <div id="inwazja-footer" style="
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2px 8px;
            background: rgba(0,0,0,0.2);
            border-top: 1px solid rgba(255,255,255,0.03);
            font-size: 10px;
            opacity: 0.7;
        ">Inwazja Add-on v2.2</div>
    `;
    
    document.body.appendChild(panel);
    
    /**********************
     *  Styl suwaka przezroczystości
     **********************/
    const style = document.createElement('style');
    style.textContent = `
        /* Styl dla suwaka przezroczystości */
        #inwazja-opacity::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #000000;
            border: 2px solid rgba(255,255,255,0.3);
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        #inwazja-opacity::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #000000;
            border: 2px solid rgba(255,255,255,0.3);
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        #inwazja-opacity::-webkit-slider-track {
            background: rgba(255,255,255,0.15);
            border-radius: 2px;
            height: 4px;
        }
        
        #inwazja-opacity::-moz-range-track {
            background: rgba(255,255,255,0.15);
            border-radius: 2px;
            height: 4px;
            border: none;
        }
        
        /* Styl dla kafelków z gradientowym podświetleniem */
        .inwazja-tile:hover::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(135deg, #00ff88, #0099ff);
            border-radius: 8px;
            z-index: -1;
            opacity: 0.4;
            animation: gradientGlow 2s ease-in-out infinite alternate;
        }
        
        .inwazja-tile:hover {
            transform: translateY(-2px);
            border-color: rgba(255,255,255,0.15);
            z-index: 1;
        }
        
        @keyframes gradientGlow {
            0% {
                opacity: 0.3;
            }
            100% {
                opacity: 0.6;
            }
        }
        
        /* Styl dla kafelków statystyk w dashboardzie */
        .stat-tile {
            position: relative;
            transition: all 0.3s ease;
        }
        
        .stat-tile:hover::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(135deg, #00ff88, #0099ff);
            border-radius: 8px;
            z-index: -1;
            opacity: 0.4;
            animation: gradientGlow 2s ease-in-out infinite alternate;
        }
        
        .stat-tile:hover {
            transform: translateY(-1px);
            border-color: rgba(0, 255, 136, 0.3);
        }
    `;
    document.head.appendChild(style);
    
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
                padding: 30px 20px;
            ">
                <div style="
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #eaeff5;
                ">Inwazja Add-on</div>
                
                <div style="
                    font-size: 13px;
                    opacity: 0.8;
                    margin-bottom: 25px;
                    max-width: 400px;
                    line-height: 1.4;
                    color: #b0b8c5;
                ">
                    Zaawansowany dodatek do Margonem z funkcją automatycznego odpowiadania na wiadomości
                </div>
                
                <div style="
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                    width: 100%;
                    max-width: 350px;
                    margin: 20px 0;
                ">
                    <div class="stat-tile" style="padding: 12px; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: 20px; font-weight: bold; margin-bottom: 4px; color: #eaeff5;">${totalMessages}/5</div>
                        <div style="font-size: 10px; opacity: 0.7; color: #b0b8c5;">Aktywne wiadomości</div>
                    </div>
                    <div class="stat-tile" style="padding: 12px; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: 20px; font-weight: bold; margin-bottom: 4px; color: #eaeff5;">${ignoredPlayers}/5</div>
                        <div style="font-size: 10px; opacity: 0.7; color: #b0b8c5;">Ignorowani gracze</div>
                    </div>
                    <div class="stat-tile" style="padding: 12px; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: 20px; font-weight: bold; margin-bottom: 4px; color: #eaeff5;">${autoEnabled}</div>
                        <div style="font-size: 10px; opacity: 0.7; color: #b0b8c5;">Auto-odpowiadanie</div>
                    </div>
                    <div class="stat-tile" style="padding: 12px; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: 20px; font-weight: bold; margin-bottom: 4px; color: #eaeff5;">${scheduleEnabled}</div>
                        <div style="font-size: 10px; opacity: 0.7; color: #b0b8c5;">Harmonogram</div>
                    </div>
                </div>
                
                <div style="
                    font-size: 11px;
                    opacity: 0.6;
                    padding: 6px 12px;
                    background: rgba(255,255,255,0.03);
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.05);
                    margin-top: 15px;
                    color: #b0b8c5;
                ">Wersja 2.2 | Poprawiony Interfejs</div>
                
                <div style="margin-top: 20px; font-size: 10px; opacity: 0.5; color: #b0b8c5;">
                    Kliknij w kafelek po lewej stronie, aby przejść do konkretnego modułu
                </div>
            </div>
        `;
    }
    
    function applyOpacity() {
        panel.style.background = `rgba(28,28,28,${currentOpacity})`;
    }
    
    /**********************
     *  Drag & Drop Ikony
     **********************/
    let isDraggingIcon = false;
    let dragStartX = 0, dragStartY = 0;
    let startIconX = 0, startIconY = 0;
    
    const handleIconMouseDown = (e) => {
        if (e.button !== 0) return;
        
        isDraggingIcon = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        startIconX = parseInt(icon.style.left) || 20;
        startIconY = parseInt(icon.style.top) || 20;
        
        icon.style.transition = 'none';
        icon.style.opacity = '0.8';
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
        icon.style.transition = 'all 0.2s ease';
        icon.style.opacity = '1';
        
        window.inwazjaConfig.iconPos = {
            left: parseInt(icon.style.left),
            top: parseInt(icon.style.top)
        };
        window.inwazjaSaveConfig(window.inwazjaConfig);
    };
    
    icon.addEventListener('mousedown', handleIconMouseDown);
    document.addEventListener('mousemove', handleIconMouseMove);
    document.addEventListener('mouseup', handleIconMouseUp);
    
    /**********************
     *  Drag & Drop Panelu
     **********************/
    let isDraggingPanel = false;
    let panelStartX = 0, panelStartY = 0;
    let startPanelX = 0, startPanelY = 0;
    
    const header = document.getElementById('inwazja-header');
    
    const handlePanelMouseDown = (e) => {
        if (e.button !== 0) return;
        if (e.target.closest('#inwazja-controls')) return;
        
        isDraggingPanel = true;
        panelStartX = e.clientX;
        panelStartY = e.clientY;
        startPanelX = parseInt(panel.style.left);
        startPanelY = parseInt(panel.style.top);
        
        panel.style.transition = 'none';
        e.preventDefault();
    };
    
    const handlePanelMouseMove = (e) => {
        if (!isDraggingPanel) return;
        
        const deltaX = e.clientX - panelStartX;
        const deltaY = e.clientY - panelStartY;
        
        const newX = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, startPanelX + deltaX));
        const newY = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, startPanelY + deltaY));
        
        panel.style.left = newX + 'px';
        panel.style.top = newY + 'px';
        panel.style.transform = 'none';
    };
    
    const handlePanelMouseUp = () => {
        if (!isDraggingPanel) return;
        
        isDraggingPanel = false;
        panel.style.transition = 'all 0.2s ease';
        
        window.inwazjaConfig.pos = {
            left: parseInt(panel.style.left),
            top: parseInt(panel.style.top)
        };
        window.inwazjaSaveConfig(window.inwazjaConfig);
    };
    
    header.addEventListener('mousedown', handlePanelMouseDown);
    document.addEventListener('mousemove', handlePanelMouseMove);
    document.addEventListener('mouseup', handlePanelMouseUp);
    
    /**********************
     *  Resize Panelu
     **********************/
    let isResizing = false;
    let resizeStartX = 0, resizeStartY = 0;
    let startWidth = 0, startHeight = 0;
    
    const resizer = document.getElementById('inwazja-resizer');
    
    const handleResizeMouseDown = (e) => {
        if (e.button !== 0) return;
        
        isResizing = true;
        resizeStartX = e.clientX;
        resizeStartY = e.clientY;
        startWidth = panel.offsetWidth;
        startHeight = panel.offsetHeight;
        
        panel.style.transition = 'none';
        e.preventDefault();
    };
    
    const handleResizeMouseMove = (e) => {
        if (!isResizing) return;
        
        const deltaX = e.clientX - resizeStartX;
        const deltaY = e.clientY - resizeStartY;
        
        const newWidth = Math.max(600, Math.min(1200, startWidth + deltaX));
        const newHeight = Math.max(400, Math.min(800, startHeight + deltaY));
        
        panel.style.width = newWidth + 'px';
        panel.style.height = newHeight + 'px';
    };
    
    const handleResizeMouseUp = () => {
        if (!isResizing) return;
        
        isResizing = false;
        panel.style.transition = 'all 0.2s ease';
        
        window.inwazjaConfig.size = {
            width: panel.offsetWidth,
            height: panel.offsetHeight
        };
        window.inwazjaSaveConfig(window.inwazjaConfig);
    };
    
    resizer.addEventListener('mousedown', handleResizeMouseDown);
    document.addEventListener('mousemove', handleResizeMouseMove);
    document.addEventListener('mouseup', handleResizeMouseUp);
    
    /**********************
     *  Scroll
     **********************/
    function enableScrolling() {
        const content = document.getElementById('inwazja-content');
        const tiles = document.getElementById('inwazja-tiles');
        
        // Custom scrollbar styles
        const scrollStyle = document.createElement('style');
        scrollStyle.textContent = `
            #inwazja-content::-webkit-scrollbar,
            #inwazja-tiles::-webkit-scrollbar {
                width: 6px;
            }
            #inwazja-content::-webkit-scrollbar-track,
            #inwazja-tiles::-webkit-scrollbar-track {
                background: rgba(255,255,255,0.02);
                border-radius: 3px;
            }
            #inwazja-content::-webkit-scrollbar-thumb,
            #inwazja-tiles::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.15);
                border-radius: 3px;
            }
            #inwazja-content::-webkit-scrollbar-thumb:hover,
            #inwazja-tiles::-webkit-scrollbar-thumb:hover {
                background: rgba(255,255,255,0.25);
            }
        `;
        document.head.appendChild(scrollStyle);
        
        // Wheel scrolling
        if (content) {
            content.addEventListener('wheel', (e) => {
                e.preventDefault();
                content.scrollTop += e.deltaY * 0.5;
            }, { passive: false });
        }
        
        if (tiles) {
            tiles.addEventListener('wheel', (e) => {
                e.preventDefault();
                tiles.scrollTop += e.deltaY * 0.5;
            }, { passive: false });
        }
    }
    
    /**********************
     *  Event Listenery
     **********************/
    icon.addEventListener('click', function(e) {
        if (isDraggingIcon) return;
        
        if (panel.style.display === 'flex') {
            panel.style.display = 'none';
        } else {
            panel.style.display = 'flex';
            setTimeout(() => {
                showDashboard();
                enableScrolling();
            }, 50);
        }
    });
    
    document.getElementById('inwazja-dashboard').addEventListener('click', showDashboard);
    
    document.getElementById('inwazja-close').addEventListener('click', function() {
        panel.style.display = 'none';
    });
    
    // Suwak przezroczystości
    document.getElementById('inwazja-opacity').addEventListener('input', function(e) {
        currentOpacity = parseInt(e.target.value) / 100;
        applyOpacity();
        window.inwazjaConfig.opacity = currentOpacity;
        window.inwazjaSaveConfig(window.inwazjaConfig);
    });
    
    // Hover effects
    icon.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(20,20,20,0.95)';
        this.style.transform = 'translateY(-1px)';
    });
    
    icon.addEventListener('mouseleave', function() {
        if (isDraggingIcon) return;
        this.style.background = 'rgba(12,12,12,0.95)';
        this.style.transform = 'translateY(0px)';
    });
    
    document.querySelectorAll('.ia-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255,255,255,0.1)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
        });
    });
    
    document.querySelectorAll('.inwazja-tile').forEach(tile => {
        tile.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.15))';
            this.style.borderColor = 'rgba(255,255,255,0.1)';
        });
        
        tile.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(0,0,0,0.1))';
            this.style.borderColor = 'rgba(255,255,255,0.06)';
            this.style.transform = 'translateY(0px)';
        });
        
        tile.addEventListener('click', function() {
            const moduleId = this.dataset.id;
            const content = document.getElementById('inwazja-content');
            
            if (moduleId === 'auto-message') {
                // Sprawdź czy moduł auto-message jest już załadowany
                if (typeof window.initializeAutoMessageModule === 'function') {
                    // Moduł już załadowany - po prostu go zainicjuj
                    window.initializeAutoMessageModule(content);
                } else {
                    // Moduł nie załadowany - pokaż loading i załaduj
                    content.innerHTML = `
                        <div style="display:flex; align-items:center; justify-content:center; height:100%; flex-direction:column;">
                            <div style="font-size:14px; opacity:0.7; margin-bottom:10px;">Ładowanie Auto-message...</div>
                            <div style="font-size:11px; opacity:0.5;">auto-message.js</div>
                        </div>
                    `;
                    
                    // Dynamicznie załaduj auto-message.js
                    const script = document.createElement('script');
                    script.src = 'https://raw.githack.com/inwazja-margonem/inwazja-addon/main/auto-message.js';
                    script.onload = function() {
                        if (typeof window.initializeAutoMessageModule === 'function') {
                            window.initializeAutoMessageModule(content);
                        }
                    };
                    script.onerror = function() {
                        content.innerHTML = `
                            <div style="padding:25px;">
                                <h3 style="margin-top:0; color:#eaeff5; font-size:18px;">Auto-message</h3>
                                <div style="opacity:0.8; margin-bottom:15px; font-size:14px; color:#b0b8c5;">Błąd ładowania modułu</div>
                                <div style="font-size:12px; opacity:0.6; color:#b0b8c5;">
                                    Nie udało się załadować modułu z GitHub.
                                </div>
                            </div>
                        `;
                    };
                    document.head.appendChild(script);
                }
            } else {
                // Dla innych modułów
                content.innerHTML = `
                    <div style="padding:25px;">
                        <h3 style="margin-top:0; color:#eaeff5; font-size:18px;">${this.querySelector('div').textContent}</h3>
                        <div style="opacity:0.8; margin-bottom:15px; font-size:14px; color:#b0b8c5;">Moduł w budowie</div>
                        <div style="font-size:12px; opacity:0.6; color:#b0b8c5;">
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
    
    applyOpacity();
    
    console.log('✅ Inwazja Core UI: POPRAWIONY interfejs załadowany');
    
})();
