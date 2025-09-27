// auto-heal.js - NOWY MODUŁ
(function() {
    'use strict';

    if (window.inwazjaAutoHealLoaded) {
        return;
    }
    window.inwazjaAutoHealLoaded = true;

    console.log('✅ Auto-heal module loaded');

    // Konfiguracja
    const CONFIG = window.inwazjaConfig || {
        autoHealEnabled: false,
        combatHealEnabled: true,
        resurrectHealEnabled: true,
        usePotions: true,
        usePercentPotions: false,
        alwaysFullHeal: false,
        healThreshold: 50
    };

    // Funkcja inicjalizacji GUI
    window.initializeAutoHealModule = function(contentElement) {
        contentElement.innerHTML = `
            <div style="
                padding: 15px; 
                height: 100%; 
                display: flex;
                flex-direction: column;
            ">
                <!-- Nagłówek -->
                <div style="margin-bottom: 20px;">
                    <h2 style="color: #eaeff5; margin: 0 0 5px 0; font-size: 18px; font-weight: bold;">
                        Auto-heal
                    </h2>
                    <div style="opacity: 0.8; font-size: 12px; color: #b0b8c5;">
                        Skrypt na automatyczne leczenie gracza podczas walki oraz po śmierci.
                    </div>
                </div>

                <!-- Główny status skryptu -->
                <div style="
                    margin-bottom: 20px; 
                    padding: 12px; 
                    background: rgba(255,255,255,0.03); 
                    border-radius: 6px;
                    font-size: 14px;
                ">
                    <strong style="color: #eaeff5;">Status skryptu:</strong> 
                    <span id="heal-status" style="color: ${CONFIG.autoHealEnabled ? '#00ff88' : '#ff4444'}; font-weight: bold;">
                        ${CONFIG.autoHealEnabled ? 'AKTYWNY' : 'NIEAKTYWNY'}
                    </span>
                </div>

                <!-- Sekcja 1: Podstawowe ustawienia leczenia -->
                <div style="margin-bottom: 20px;">
                    <div style="font-weight: bold; margin-bottom: 12px; color: #eaeff5; font-size: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
                        Podstawowe ustawienia
                    </div>
                    
                    <!-- Leczenie w trakcie walki -->
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.02); border-radius: 4px;">
                        <div>
                            <strong style="color: #eaeff5; font-size: 13px;">Leczenie w trakcie walki:</strong>
                            <div style="font-size: 11px; opacity: 0.7; color: #b0b8c5;">Automatyczne leczenie podczas walki</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span id="combat-heal-status" style="color: ${CONFIG.combatHealEnabled ? '#00ff88' : '#ff4444'}; font-weight: bold; font-size: 13px;">
                                ${CONFIG.combatHealEnabled ? 'AKTYWNE' : 'NIEAKTYWNE'}
                            </span>
                            <label class="switch">
                                <input type="checkbox" id="combat-heal-toggle" ${CONFIG.combatHealEnabled ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>

                    <!-- Leczenie po śmierci -->
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.02); border-radius: 4px;">
                        <div>
                            <strong style="color: #eaeff5; font-size: 13px;">Leczenie postaci po śmierci:</strong>
                            <div style="font-size: 11px; opacity: 0.7; color: #b0b8c5;">Automatyczne leczenie po śmierci</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span id="resurrect-heal-status" style="color: ${CONFIG.resurrectHealEnabled ? '#00ff88' : '#ff4444'}; font-weight: bold; font-size: 13px;">
                                ${CONFIG.resurrectHealEnabled ? 'AKTYWNE' : 'NIEAKTYWNE'}
                            </span>
                            <label class="switch">
                                <input type="checkbox" id="resurrect-heal-toggle" ${CONFIG.resurrectHealEnabled ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Sekcja 2: Opcje leczenia -->
                <div style="margin-bottom: 20px;">
                    <div style="font-weight: bold; margin-bottom: 12px; color: #eaeff5; font-size: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
                        Opcje leczenia
                    </div>
                    
                    <!-- Mikstury -->
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.02); border-radius: 4px;">
                        <div>
                            <strong style="color: #eaeff5; font-size: 13px;">Mikstury:</strong>
                            <div style="font-size: 11px; opacity: 0.7; color: #b0b8c5;">Używaj zwykłych mikstur leczenia</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span id="potions-status" style="color: ${CONFIG.usePotions ? '#00ff88' : '#ff4444'}; font-weight: bold; font-size: 13px;">
                                ${CONFIG.usePotions ? 'AKTYWNE' : 'NIEAKTYWNE'}
                            </span>
                            <label class="switch">
                                <input type="checkbox" id="potions-toggle" ${CONFIG.usePotions ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>

                    <!-- Mikstury procentowe -->
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.02); border-radius: 4px;">
                        <div>
                            <strong style="color: #eaeff5; font-size: 13px;">Mikstury procentowe:</strong>
                            <div style="font-size: 11px; opacity: 0.7; color: #b0b8c5;">Używaj mikstur % leczenia</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span id="percent-potions-status" style="color: ${CONFIG.usePercentPotions ? '#00ff88' : '#ff4444'}; font-weight: bold; font-size: 13px;">
                                ${CONFIG.usePercentPotions ? 'AKTYWNE' : 'NIEAKTYWNE'}
                            </span>
                            <label class="switch">
                                <input type="checkbox" id="percent-potions-toggle" ${CONFIG.usePercentPotions ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>

                    <!-- Zawsze lecz do pełna -->
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; padding: 8px; background: rgba(255,255,255,0.02); border-radius: 4px;">
                        <div>
                            <strong style="color: #eaeff5; font-size: 13px;">Zawsze lecz do pełna:</strong>
                            <div style="font-size: 11px; opacity: 0.7; color: #b0b8c5;">Nawet gdy zmarnujesz część mikstury</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span id="full-heal-status" style="color: ${CONFIG.alwaysFullHeal ? '#00ff88' : '#ff4444'}; font-weight: bold; font-size: 13px;">
                                ${CONFIG.alwaysFullHeal ? 'AKTYWNE' : 'NIEAKTYWNE'}
                            </span>
                            <label class="switch">
                                <input type="checkbox" id="full-heal-toggle" ${CONFIG.alwaysFullHeal ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>

                    <!-- Próg leczenia -->
                    <div style="padding: 10px; background: rgba(255,255,255,0.02); border-radius: 4px;">
                        <div style="margin-bottom: 8px;">
                            <strong style="color: #eaeff5; font-size: 13px;">Lecz gdy życie spadnie poniżej:</strong>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="range" id="heal-threshold" min="1" max="100" value="${CONFIG.healThreshold}" 
                                   style="flex: 1; height: 6px; background: rgba(255,255,255,0.15); border-radius: 3px; cursor: pointer;">
                            <span id="threshold-value" style="color: #00ff88; font-weight: bold; min-width: 30px; text-align: center;">${CONFIG.healThreshold}%</span>
                        </div>
                        <div style="font-size: 10px; opacity: 0.7; margin-top: 5px; color: #b0b8c5;">
                            Ustaw próg życia, poniżej którego ma nastąpić automatyczne leczenie
                        </div>
                    </div>
                </div>

                <!-- Przyciski akcji -->
                <div style="display: flex; gap: 10px; margin-top: auto;">
                    <button id="save-heal-settings" style="
                        padding: 10px 20px; 
                        background: linear-gradient(135deg, #00ff88, #0099ff); 
                        border: none; 
                        border-radius: 4px; 
                        color: #000; 
                        font-weight: bold; 
                        cursor: pointer;
                        font-size: 13px;
                        flex: 1;
                    ">
                        Zapisz ustawienia
                    </button>
                    <button id="toggle-auto-heal" style="
                        padding: 10px 20px; 
                        background: ${CONFIG.autoHealEnabled ? '#ff4444' : '#00ff88'}; 
                        border: none; 
                        border-radius: 4px; 
                        color: #000; 
                        font-weight: bold; 
                        cursor: pointer;
                        font-size: 13px;
                        flex: 1;
                    ">
                        ${CONFIG.autoHealEnabled ? 'Wyłącz auto-heal' : 'Włącz auto-heal'}
                    </button>
                </div>
            </div>

            <style>
                /* Style dla przełączników */
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 40px;
                    height: 20px;
                }

                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ff4444;
                    transition: .3s;
                    border-radius: 20px;
                }

                .slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 2px;
                    bottom: 2px;
                    background-color: white;
                    transition: .3s;
                    border-radius: 50%;
                }

                input:checked + .slider {
                    background-color: #00ff88;
                }

                input:checked + .slider:before {
                    transform: translateX(20px);
                }

                /* Styl dla suwaka progu leczenia */
                #heal-threshold::-webkit-slider-thumb {
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #000000;
                    border: 2px solid rgba(255,255,255,0.3);
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }

                #heal-threshold::-webkit-slider-track {
                    background: rgba(255,255,255,0.15);
                    border-radius: 3px;
                    height: 6px;
                }

                /* Przyciski hover */
                button:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                    transition: all 0.2s ease;
                }
            </style>
        `;

        // Inicjalizacja event listeners
        initializeAutoHeal();
    };

    function initializeAutoHeal() {
        // Główny przełącznik auto-heal
        document.getElementById('toggle-auto-heal')?.addEventListener('click', function() {
            CONFIG.autoHealEnabled = !CONFIG.autoHealEnabled;
            
            const statusElement = document.getElementById('heal-status');
            if (statusElement) {
                statusElement.textContent = CONFIG.autoHealEnabled ? 'AKTYWNY' : 'NIEAKTYWNY';
                statusElement.style.color = CONFIG.autoHealEnabled ? '#00ff88' : '#ff4444';
            }
            
            this.textContent = CONFIG.autoHealEnabled ? 'Wyłącz auto-heal' : 'Włącz auto-heal';
            this.style.background = CONFIG.autoHealEnabled ? '#ff4444' : '#00ff88';
            
            window.inwazjaConfig.autoHealEnabled = CONFIG.autoHealEnabled;
            window.inwazjaSaveConfig(window.inwazjaConfig);
        });

        // Przełącznik leczenia w walce
        setupToggle('combat-heal-toggle', 'combat-heal-status', 'combatHealEnabled');
        
        // Przełącznik leczenia po śmierci
        setupToggle('resurrect-heal-toggle', 'resurrect-heal-status', 'resurrectHealEnabled');
        
        // Przełącznik mikstur
        setupToggle('potions-toggle', 'potions-status', 'usePotions');
        
        // Przełącznik mikstur procentowych
        setupToggle('percent-potions-toggle', 'percent-potions-status', 'usePercentPotions');
        
        // Przełącznik leczenia do pełna
        setupToggle('full-heal-toggle', 'full-heal-status', 'alwaysFullHeal');

        // Suwak progu leczenia
        const thresholdSlider = document.getElementById('heal-threshold');
        const thresholdValue = document.getElementById('threshold-value');
        
        if (thresholdSlider && thresholdValue) {
            thresholdSlider.addEventListener('input', function() {
                const value = this.value;
                thresholdValue.textContent = value + '%';
                CONFIG.healThreshold = parseInt(value);
                
                window.inwazjaConfig.healThreshold = CONFIG.healThreshold;
                window.inwazjaSaveConfig(window.inwazjaConfig);
            });
        }

        // Zapisywanie ustawień
        document.getElementById('save-heal-settings')?.addEventListener('click', function() {
            window.inwazjaSaveConfig(window.inwazjaConfig);
            
            const originalText = this.textContent;
            this.textContent = 'Zapisano.';
            this.style.background = '#00ff88';
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = 'linear-gradient(135deg, #00ff88, #0099ff)';
            }, 1000);
        });

        function setupToggle(toggleId, statusId, configKey) {
            const toggle = document.getElementById(toggleId);
            const status = document.getElementById(statusId);
            
            if (toggle && status) {
                toggle.addEventListener('change', function() {
                    CONFIG[configKey] = this.checked;
                    status.textContent = this.checked ? 'AKTYWNE' : 'NIEAKTYWNE';
                    status.style.color = this.checked ? '#00ff88' : '#ff4444';
                    
                    window.inwazjaConfig[configKey] = CONFIG[configKey];
                    window.inwazjaSaveConfig(window.inwazjaConfig);
                });
            }
        }
    }

})();
