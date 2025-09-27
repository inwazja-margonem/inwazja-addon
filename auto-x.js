// auto-x.js - Moduł automatycznego atakowania przeciwników
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
    
    // Główna funkcja inicjalizująca moduł
    window.initializeAutoXModule = function(contentElement) {
        const config = loadAutoXConfig();
        
        contentElement.innerHTML = `
            <div style="padding: 20px; height: 100%; overflow-y: auto;">
                <!-- Nagłówek -->
                <div style="margin-bottom: 25px;">
                    <h3 style="margin: 0 0 8px 0; color: #eaeff5; font-size: 20px; font-weight: bold;">Auto-X</h3>
                    <div style="opacity: 0.8; font-size: 13px; color: #b0b8c5; line-height: 1.4;">
                        Skrypt na automatyczne atakowanie innych przeciwników wg. przedziału poziomów.
                    </div>
                </div>
                
                <!-- Status skryptu -->
                <div style="margin-bottom: 25px; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 14px; color: #eaeff5;">Status skryptu</span>
                        <span id="auto-x-status" style="font-size: 12px; padding: 4px 8px; border-radius: 12px; background: ${config.enabled ? 'rgba(0,255,136,0.2)' : 'rgba(255,50,50,0.2)'}; color: ${config.enabled ? '#00ff88' : '#ff3232'};">${config.enabled ? 'AKTYWNY' : 'NIEAKTYWNY'}</span>
                    </div>
                    <div style="position: relative;">
                        <input type="range" id="auto-x-enabled" ${config.enabled ? 'checked' : ''} 
                            style="width: 100%; height: 6px; background: ${config.enabled ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.1)'}; border-radius: 3px; cursor: pointer; appearance: none; outline: none;">
                        <div style="position: absolute; top: -2px; left: 0; width: ${config.enabled ? '100%' : '0%'}; height: 10px; background: linear-gradient(90deg, #00ff88, #0099ff); border-radius: 5px; transition: width 0.3s ease; pointer-events: none;"></div>
                    </div>
                </div>
                
                <!-- Przedział poziomów -->
                <div style="margin-bottom: 25px; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
                    <div style="font-size: 14px; color: #eaeff5; margin-bottom: 15px;">Przedział poziomów do atakowania</div>
                    
                    <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 15px; align-items: center; margin-bottom: 15px;">
                        <div>
                            <label style="display: block; font-size: 11px; opacity: 0.7; margin-bottom: 5px; color: #b0b8c5;">Poziom minimalny</label>
                            <input type="number" id="auto-x-min-level" min="1" max="300" value="${config.minLevel}" 
                                style="width: 100%; padding: 8px 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: #eaeff5; font-size: 13px;">
                        </div>
                        <div style="text-align: center; opacity: 0.5; font-size: 12px; color: #b0b8c5;">do</div>
                        <div>
                            <label style="display: block; font-size: 11px; opacity: 0.7; margin-bottom: 5px; color: #b0b8c5;">Poziom maksymalny</label>
                            <input type="number" id="auto-x-max-level" min="1" max="300" value="${config.maxLevel}" 
                                style="width: 100%; padding: 8px 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: #eaeff5; font-size: 13px;">
                        </div>
                    </div>
                    
                    <div style="font-size: 11px; opacity: 0.6; color: #b0b8c5; text-align: center; margin-bottom: 15px;">
                        Lub określ konkretny poziom
                    </div>
                    
                    <div>
                        <label style="display: block; font-size: 11px; opacity: 0.7; margin-bottom: 5px; color: #b0b8c5;">Konkretny poziom (opcjonalnie)</label>
                        <input type="number" id="auto-x-target-level" min="1" max="300" value="${config.targetLevel || ''}" placeholder="np. 250" 
                            style="width: 100%; padding: 8px 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: #eaeff5; font-size: 13px;">
                    </div>
                </div>
                
                <!-- Ustawienia zaawansowane -->
                <div style="margin-bottom: 25px; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
                    <div style="font-size: 14px; color: #eaeff5; margin-bottom: 15px;">Ustawienia zaawansowane</div>
                    
                    <!-- Atakuj wszystkich -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 8px 0;">
                        <div>
                            <div style="font-size: 13px; color: #eaeff5;">Atakuj wszystkich</div>
                            <div style="font-size: 11px; opacity: 0.7; color: #b0b8c5;">Atakuj każdego gracza w przedziale</div>
                        </div>
                        <label class="auto-x-switch">
                            <input type="checkbox" id="auto-x-attack-all" ${config.attackAll ? 'checked' : ''}>
                            <span class="auto-x-slider"></span>
                        </label>
                    </div>
                    
                    <!-- Atakuj oprócz klanowiczów -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 8px 0;">
                        <div>
                            <div style="font-size: 13px; color: #eaeff5;">Atakuj wszystkich oprócz klanowiczów</div>
                            <div style="font-size: 11px; opacity: 0.7; color: #b0b8c5;">Pomijaj członków własnego klanu</div>
                        </div>
                        <label class="auto-x-switch">
                            <input type="checkbox" id="auto-x-attack-except-clan" ${config.attackExceptClan ? 'checked' : ''}>
                            <span class="auto-x-slider"></span>
                        </label>
                    </div>
                    
                    <!-- Szybka walka -->
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                        <div>
                            <div style="font-size: 13px; color: #eaeff5;">Szybka walka</div>
                            <div style="font-size: 11px; opacity: 0.7; color: #b0b8c5;">Zmniejsz opóźnienia między atakami</div>
                        </div>
                        <label class="auto-x-switch">
                            <input type="checkbox" id="auto-x-fast-combat" ${config.fastCombat ? 'checked' : ''}>
                            <span class="auto-x-slider"></span>
                        </label>
                    </div>
                </div>
                
                <!-- Informacje i statystyki -->
                <div style="padding: 15px; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 12px; color: #b0b8c5; text-align: center;">
                        <div style="margin-bottom: 5px;">🛡️ Moduł Auto-X v1.0</div>
                        <div style="opacity: 0.6;">Automatyczne atakowanie graczy w określonym przedziale poziomów</div>
                    </div>
                </div>
            </div>
            
            <style>
                /* Style dla przełączników */
                .auto-x-switch {
                    position: relative;
                    display: inline-block;
                    width: 44px;
                    height: 24px;
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
                    border-radius: 24px;
                }
                
                .auto-x-slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .3s;
                    border-radius: 50%;
                }
                
                input:checked + .auto-x-slider {
                    background: linear-gradient(135deg, #00ff88, #0099ff);
                }
                
                input:checked + .auto-x-slider:before {
                    transform: translateX(20px);
                }
                
                /* Style dla input number */
                input[type="number"]::-webkit-outer-spin-button,
                input[type="number"]::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                
                input[type="number"] {
                    -moz-appearance: textfield;
                }
                
                input[type="number"]:focus {
                    outline: none;
                    border-color: rgba(0, 255, 136, 0.3);
                }
                
                /* Suwak enabled */
                #auto-x-enabled::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 2px solid rgba(255,255,255,0.3);
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                }
                
                #auto-x-enabled::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 2px solid rgba(255,255,255,0.3);
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                }
            </style>
        `;
        
        // Inicjalizacja event listenerów
        initializeAutoXEventListeners(config);
    };
    
    function initializeAutoXEventListeners(config) {
        // Suwak aktywności
        const enabledSlider = document.getElementById('auto-x-enabled');
        const statusElement = document.getElementById('auto-x-status');
        
        enabledSlider.addEventListener('input', function(e) {
            const isEnabled = e.target.value > 50;
            config.enabled = isEnabled;
            
            statusElement.textContent = isEnabled ? 'AKTYWNY' : 'NIEAKTYWNY';
            statusElement.style.background = isEnabled ? 'rgba(0,255,136,0.2)' : 'rgba(255,50,50,0.2)';
            statusElement.style.color = isEnabled ? '#00ff88' : '#ff3232';
            
            // Aktualizacja wizualna suwaka
            const progress = document.querySelector('#auto-x-enabled ~ div');
            if (progress) {
                progress.style.width = isEnabled ? '100%' : '0%';
            }
            
            saveAutoXConfig(config);
            updateAutoXBehavior(config);
        });
        
        // Ustawienie początkowej wartości suwaka
        enabledSlider.value = config.enabled ? 100 : 0;
        
        // Poziomy
        document.getElementById('auto-x-min-level').addEventListener('change', function(e) {
            let value = parseInt(e.target.value) || 1;
            value = Math.max(1, Math.min(300, value));
            config.minLevel = value;
            e.target.value = value;
            saveAutoXConfig(config);
            updateAutoXBehavior(config);
        });
        
        document.getElementById('auto-x-max-level').addEventListener('change', function(e) {
            let value = parseInt(e.target.value) || 300;
            value = Math.max(1, Math.min(300, value));
            config.maxLevel = value;
            e.target.value = value;
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
        
        // Przełączniki
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
    }
    
    function updateAutoXBehavior(config) {
        if (!config.enabled) {
            console.log('Auto-X: Skrypt wyłączony');
            return;
        }
        
        console.log('Auto-X: Konfiguracja zaktualizowana', config);
        
        // Tutaj będzie główna logika automatycznego atakowania
        // To jest placeholder dla przyszłej implementacji
        startAutoXEngine(config);
    }
    
    function startAutoXEngine(config) {
        // Główna logika Auto-X - do implementacji
        console.log('Auto-X: Rozpoczynanie automatycznego atakowania z konfiguracją:', config);
        
        // Przykładowa logika (do rozbudowy)
        if (config.targetLevel) {
            console.log(`Auto-X: Celowanie na poziom ${config.targetLevel}`);
        } else {
            console.log(`Auto-X: Celowanie na przedział ${config.minLevel}-${config.maxLevel}`);
        }
        
        if (config.attackExceptClan) {
            console.log('Auto-X: Pomijanie klanowiczów');
        }
        
        if (config.fastCombat) {
            console.log('Auto-X: Tryb szybkiej walki aktywny');
        }
    }
    
    // Eksport funkcji dla core-ui
    console.log('✅ Auto-X Module: Załadowany i gotowy do użycia');
    
})();
