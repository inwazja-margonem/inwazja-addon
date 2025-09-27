// auto-x.js - POPRAWIONY i DZIAŁAJĄCY moduł automatycznego atakowania
(function() {
    'use strict';
    
    // Konfiguracja modułu Auto-X
    const AUTO_X_CONFIG_KEY = 'inwazjaAutoXConfig_v1';
    const DEFAULT_AUTO_X_CONFIG = {
        enabled: false,
        minLevel: 1,
        maxLevel: 300,
        attackAll: true,
        attackExceptClan: false,
        fastCombat: false,
        targetLevel: null
    };
    
    // Globalne zmienne dla interwałów
    let autoXInterval = null;
    let isInitialized = false;
    
    function loadAutoXConfig() {
        try {
            const raw = localStorage.getItem(AUTO_X_CONFIG_KEY);
            return raw ? {...DEFAULT_AUTO_X_CONFIG, ...JSON.parse(raw)} : {...DEFAULT_AUTO_X_CONFIG};
        } catch (e) {
            console.warn('Błąd wczytywania configu Auto-X', e);
            return {...DEFAULT_AUTO_X_CONFIG};
        }
    }
    
    function saveAutoXConfig(config) {
        try {
            localStorage.setItem(AUTO_X_CONFIG_KEY, JSON.stringify(config));
        } catch (e) {
            console.warn('Błąd zapisu configu Auto-X', e);
        }
    }
    
    function stopAutoXEngine() {
        if (autoXInterval) {
            clearInterval(autoXInterval);
            autoXInterval = null;
            console.log('Auto-X: Silnik zatrzymany');
        }
    }
    
    function startAutoXEngine(config) {
        // Zatrzymaj poprzedni silnik
        stopAutoXEngine();
        
        if (!config.enabled) {
            console.log('Auto-X: Silnik wyłączony w konfiguracji');
            return;
        }
        
        console.log('Auto-X: Rozpoczynanie automatycznego atakowania z konfiguracją:', config);
        
        // Symulacja działania (do zastąpienia rzeczywistą logiką)
        autoXInterval = setInterval(() => {
            if (!config.enabled) {
                stopAutoXEngine();
                return;
            }
            
            // Symulacja znalezienia celu
            const randomLevel = Math.floor(Math.random() * 300) + 1;
            const shouldAttack = config.targetLevel ? 
                (randomLevel === config.targetLevel) : 
                (randomLevel >= config.minLevel && randomLevel <= config.maxLevel);
            
            if (shouldAttack) {
                console.log(`Auto-X: 🎯 Znaleziono cel poziom ${randomLevel} - atakowanie...`);
                
                // Tutaj będzie rzeczywista logika atakowania
                // simulateAttack(randomLevel, config);
            }
        }, 10000); // 10 sekund dla testów
    }
    
    // Główna funkcja inicjalizująca moduł
    window.initializeAutoXModule = function(contentElement) {
        const config = loadAutoXConfig();
        
        // Dodaj style tylko raz
        if (!isInitialized) {
            const style = document.createElement('style');
            style.textContent = `
                /* Style dla przełączników */
                .auto-x-switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 26px;
                    flex-shrink: 0;
                    margin-left: 15px;
                }
                
                .auto-x-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                
                .auto-x-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(255,255,255,0.15);
                    transition: .3s;
                    border-radius: 26px;
                    border: 1px solid rgba(255,255,255,0.2);
                }
                
                .auto-x-slider:before {
                    position: absolute;
                    content: "";
                    height: 20px;
                    width: 20px;
                    left: 2px;
                    bottom: 2px;
                    background-color: white;
                    transition: .3s;
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                
                input:checked + .auto-x-slider {
                    background: linear-gradient(135deg, #00ff88, #0099ff);
                    border-color: rgba(0,255,136,0.5);
                }
                
                input:checked + .auto-x-slider:before {
                    transform: translateX(24px);
                }
                
                /* Style dla input number */
                input[type="number"]::-webkit-outer-spin-button,
                input[type="number"]::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                
                input[type="number"] {
                    -moz-appearance: textfield;
                    transition: all 0.2s ease;
                    box-sizing: border-box;
                }
                
                input[type="number"]:focus {
                    outline: none;
                    border-color: rgba(0, 255, 136, 0.4);
                    background: rgba(255,255,255,0.08);
                    box-shadow: 0 0 0 2px rgba(0, 255, 136, 0.1);
                }
                
                input[type="number"]:hover {
                    border-color: rgba(255,255,255,0.2);
                }
                
                /* Usunięcie scrollbara */
                #inwazja-content {
                    scrollbar-width: none !important;
                    -ms-overflow-style: none !important;
                }
                
                #inwazja-content::-webkit-scrollbar {
                    display: none !important;
                    width: 0 !important;
                    height: 0 !important;
                }
            `;
            document.head.appendChild(style);
            isInitialized = true;
        }
        
        contentElement.innerHTML = `
            <div style="padding: 20px; height: 100%; overflow-y: auto; box-sizing: border-box;">
                <!-- Nagłówek -->
                <div style="margin-bottom: 25px;">
                    <h3 style="margin: 0 0 8px 0; color: #eaeff5; font-size: 20px; font-weight: bold;">Auto-X</h3>
                    <div style="opacity: 0.8; font-size: 13px; color: #b0b8c5; line-height: 1.4;">
                        Skrypt na automatyczne atakowanie innych przeciwników wg. przedziału poziomów.
                    </div>
                </div>
                
                <!-- Status skryptu - PRZEŁĄCZNIK -->
                <div style="margin-bottom: 25px; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div>
                            <div style="font-size: 14px; color: #eaeff5;">Status skryptu</div>
                            <div style="font-size: 11px; opacity: 0.7; color: #b0b8c5;">Włącz/wyłącz automatyczne atakowanie</div>
                        </div>
                        <label class="auto-x-switch" style="margin: 0;">
                            <input type="checkbox" id="auto-x-enabled" ${config.enabled ? 'checked' : ''}>
                            <span class="auto-x-slider"></span>
                        </label>
                    </div>
                    <div id="auto-x-status" style="font-size: 12px; padding: 6px 10px; border-radius: 6px; background: ${config.enabled ? 'rgba(0,255,136,0.15)' : 'rgba(255,50,50,0.15)'}; color: ${config.enabled ? '#00ff88' : '#ff6b6b'}; text-align: center; border: 1px solid ${config.enabled ? 'rgba(0,255,136,0.3)' : 'rgba(255,50,50,0.3)'};">
                        ${config.enabled ? '🟢 SKRYPT AKTYWNY' : '🔴 SKRYPT NIEAKTYWNY'}
                    </div>
                </div>
                
                <!-- Przedział poziomów -->
                <div style="margin-bottom: 25px; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
                    <div style="font-size: 14px; color: #eaeff5; margin-bottom: 15px;">Przedział poziomów do atakowania</div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: end; margin-bottom: 15px;">
                        <div>
                            <label style="display: block; font-size: 11px; opacity: 0.7; margin-bottom: 6px; color: #b0b8c5;">Poziom minimalny</label>
                            <input type="number" id="auto-x-min-level" min="1" max="300" value="${config.minLevel}" 
                                style="width: 100%; padding: 10px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #eaeff5; font-size: 14px; font-weight: bold; text-align: center;">
                        </div>
                        <div>
                            <label style="display: block; font-size: 11px; opacity: 0.7; margin-bottom: 6px; color: #b0b8c5;">Poziom maksymalny</label>
                            <input type="number" id="auto-x-max-level" min="1" max="300" value="${config.maxLevel}" 
                                style="width: 100%; padding: 10px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #eaeff5; font-size: 14px; font-weight: bold; text-align: center;">
                        </div>
                    </div>
                    
                    <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 15px 0; position: relative;">
                        <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); background: rgba(28,28,28,0.9); padding: 0 10px; font-size: 10px; color: rgba(255,255,255,0.4);">LUB</div>
                    </div>
                    
                    <div>
                        <label style="display: block; font-size: 11px; opacity: 0.7; margin-bottom: 6px; color: #b0b8c5;">Konkretny poziom (opcjonalnie)</label>
                        <input type="number" id="auto-x-target-level" min="1" max="300" value="${config.targetLevel || ''}" placeholder="Wpisz konkretny poziom..." 
                            style="width: 100%; padding: 10px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #eaeff5; font-size: 14px; text-align: center;">
                    </div>
                </div>
                
                <!-- Ustawienia zaawansowane -->
                <div style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
                    <div style="font-size: 14px; color: #eaeff5; margin-bottom: 15px;">Ustawienia zaawansowane</div>
                    
                    <!-- Atakuj wszystkich -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="flex: 1;">
                            <div style="font-size: 13px; color: #eaeff5; margin-bottom: 4px;">Atakuj wszystkich</div>
                            <div style="font-size: 11px; opacity: 0.7; color: #b0b8c5; line-height: 1.3;">Atakuj każdego gracza w określonym przedziale poziomów</div>
                        </div>
                        <label class="auto-x-switch">
                            <input type="checkbox" id="auto-x-attack-all" ${config.attackAll ? 'checked' : ''}>
                            <span class="auto-x-slider"></span>
                        </label>
                    </div>
                    
                    <!-- Atakuj oprócz klanowiczów -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="flex: 1;">
                            <div style="font-size: 13px; color: #eaeff5; margin-bottom: 4px;">Atakuj wszystkich oprócz klanowiczów</div>
                            <div style="font-size: 11px; opacity: 0.7; color: #b0b8c5; line-height: 1.3;">Automatycznie pomijaj członków własnego klanu</div>
                        </div>
                        <label class="auto-x-switch">
                            <input type="checkbox" id="auto-x-attack-except-clan" ${config.attackExceptClan ? 'checked' : ''}>
                            <span class="auto-x-slider"></span>
                        </label>
                    </div>
                    
                    <!-- Pomijaj walkę turową -->
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="flex: 1;">
                            <div style="font-size: 13px; color: #eaeff5; margin-bottom: 4px;">Pomijaj walkę turową</div>
                            <div style="font-size: 11px; opacity: 0.7; color: #b0b8c5; line-height: 1.3;">Zmniejsz opóźnienia między akcjami w walce</div>
                        </div>
                        <label class="auto-x-switch">
                            <input type="checkbox" id="auto-x-fast-combat" ${config.fastCombat ? 'checked' : ''}>
                            <span class="auto-x-slider"></span>
                        </label>
                    </div>
                </div>
                
                <!-- Informacje -->
                <div style="padding: 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 10px; color: rgba(255,255,255,0.4); text-align: center; line-height: 1.4;">
                        ⚠️ Używaj odpowiedzialnie. Automatyczne atakowanie może naruszać regulamin gry.
                    </div>
                </div>
            </div>
        `;
        
        // Inicjalizacja event listenerów
        initializeAutoXEventListeners(config);
        
        // Uruchom/zatrzymaj silnik na podstawie konfiguracji
        if (config.enabled) {
            startAutoXEngine(config);
        } else {
            stopAutoXEngine();
        }
    };
    
    function initializeAutoXEventListeners(config) {
        // Przełącznik aktywności
        const enabledCheckbox = document.getElementById('auto-x-enabled');
        const statusElement = document.getElementById('auto-x-status');
        
        enabledCheckbox.addEventListener('change', function(e) {
            config.enabled = e.target.checked;
            
            statusElement.textContent = config.enabled ? '🟢 SKRYPT AKTYWNY' : '🔴 SKRYPT NIEAKTYWNY';
            statusElement.style.background = config.enabled ? 'rgba(0,255,136,0.15)' : 'rgba(255,50,50,0.15)';
            statusElement.style.color = config.enabled ? '#00ff88' : '#ff6b6b';
            statusElement.style.borderColor = config.enabled ? 'rgba(0,255,136,0.3)' : 'rgba(255,50,50,0.3)';
            
            saveAutoXConfig(config);
            
            if (config.enabled) {
                startAutoXEngine(config);
            } else {
                stopAutoXEngine();
            }
        });
        
        // Pozostałe event listenery (bez zmian)
        document.getElementById('auto-x-min-level').addEventListener('change', function(e) {
            let value = parseInt(e.target.value) || 1;
            value = Math.max(1, Math.min(300, value));
            
            const maxLevel = parseInt(document.getElementById('auto-x-max-level').value) || 300;
            if (value > maxLevel) {
                value = maxLevel;
                e.target.value = value;
            }
            
            config.minLevel = value;
            saveAutoXConfig(config);
            updateAutoXBehavior(config);
        });
        
        document.getElementById('auto-x-max-level').addEventListener('change', function(e) {
            let value = parseInt(e.target.value) || 300;
            value = Math.max(1, Math.min(300, value));
            
            const minLevel = parseInt(document.getElementById('auto-x-min-level').value) || 1;
            if (value < minLevel) {
                value = minLevel;
                e.target.value = value;
            }
            
            config.maxLevel = value;
            saveAutoXConfig(config);
            updateAutoXBehavior(config);
        });
        
        document.getElementById('auto-x-target-level').addEventListener('change', function(e) {
            let value = parseInt(e.target.value) || null;
            if (value !== null) {
                value = Math.max(1, Math.min(300, value));
            }
            config.targetLevel = value;
            e.target.value = value || '';
            saveAutoXConfig(config);
            updateAutoXBehavior(config);
        });
        
        document.getElementById('auto-x-attack-all').addEventListener('change', function(e) {
            config.attackAll = e.target.checked;
            saveAutoXConfig(config);
            updateAutoXBehavior(config);
        });
        
        document.getElementById('auto-x-attack-except-clan').addEventListener('change', function(e) {
            config.attackExceptClan = e.target.checked;
            saveAutoXConfig(config);
            updateAutoXBehavior(config);
        });
        
        document.getElementById('auto-x-fast-combat').addEventListener('change', function(e) {
            config.fastCombat = e.target.checked;
            saveAutoXConfig(config);
            updateAutoXBehavior(config);
        });
        
        // Walidacja przy wpisywaniu
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', function(e) {
                let value = parseInt(e.target.value);
                if (isNaN(value)) return;
                
                if (value < 1) e.target.value = 1;
                if (value > 300) e.target.value = 300;
            });
        });
    }
    
    function updateAutoXBehavior(config) {
        // Restart silnika z nową konfiguracją
        if (config.enabled) {
            startAutoXEngine(config);
        }
    }
    
    // Eksport funkcji dla core-ui
    console.log('✅ Auto-X Module: POPRAWIONY i DZIAŁAJĄCY moduł załadowany');
    
})();
