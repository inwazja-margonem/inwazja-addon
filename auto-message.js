// auto-message.js - POPRAWIONA WERSJA Z AUTOMATYCZNYM ZAPISEM
(function() {
    'use strict';

    if (window.inwazjaAutoMessageLoaded) {
        return;
    }
    window.inwazjaAutoMessageLoaded = true;

    console.log('✅ Auto-message module loaded');

    // Konfiguracja
    const CONFIG = window.inwazjaConfig || {
        autoMessages: ["", "", "", "", ""],
        currentMessageTab: 0,
        autoEnabled: false,
        repeatMessage: false,
        scheduleEnabled: false,
        scheduleStart: "08:00",
        scheduleEnd: "22:00",
        ignoredPlayers: []
    };

    // Funkcja inicjalizacji GUI
    window.initializeAutoMessageModule = function(contentElement) {
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
                        Auto-message
                    </h2>
                    <div style="opacity: 0.8; font-size: 12px; color: #b0b8c5;">
                        Skrypt na automatyczne odpisywanie graczom podczas nieobecności.
                    </div>
                </div>

                <!-- Zakładki wiadomości -->
                <div style="display: flex; gap: 4px; margin-bottom: 20px;">
                    ${[1,2,3,4,5].map(i => `
                        <div class="message-tab ${i === CONFIG.currentMessageTab + 1 ? 'active' : ''}" 
                             data-tab="${i-1}"
                             style="
                                 padding: 6px 10px; 
                                 background: rgba(255,255,255,0.05); 
                                 border-radius: 4px; 
                                 cursor: pointer; 
                                 font-size: 11px; 
                                 border: 1px solid rgba(255,255,255,0.1);
                                 transition: all 0.2s ease;
                                 flex: 1;
                                 text-align: center;
                             ">
                            ${i}
                        </div>
                    `).join('')}
                </div>

                <!-- Status skryptu -->
                <div style="
                    margin-bottom: 15px; 
                    padding: 12px; 
                    background: rgba(255,255,255,0.03); 
                    border-radius: 6px;
                    font-size: 14px;
                ">
                    <strong style="color: #eaeff5;">Status skryptu:</strong> 
                    <span id="auto-status" style="color: ${CONFIG.autoEnabled ? '#00ff88' : '#ff4444'}; font-weight: bold;">
                        ${CONFIG.autoEnabled ? 'AKTYWNY' : 'NIEAKTYWNY'}
                    </span>
                </div>

                <!-- Treść wiadomości -->
                <div style="margin-bottom: 15px;">
                    <div style="font-weight: bold; margin-bottom: 6px; color: #eaeff5; font-size: 13px;">
                        Treść wiadomości:
                    </div>
                    <textarea id="message-input" 
                              style="
                                  width: 100%; 
                                  height: 70px; 
                                  background: rgba(255,255,255,0.05); 
                                  border: 1px solid rgba(255,255,255,0.1); 
                                  border-radius: 4px; 
                                  color: #eaeff5; 
                                  padding: 8px; 
                                  font-family: Arial; 
                                  resize: none;
                                  font-size: 12px;
                                  box-sizing: border-box;
                              "
                              placeholder="Wpisz wiadomość, która będzie automatycznie wysyłana do graczy...">${CONFIG.autoMessages[CONFIG.currentMessageTab] || ''}</textarea>
                    <div style="font-size: 10px; opacity: 0.7; margin-top: 4px; color: #b0b8c5;">
                        Maksymalnie 200 znaków | <span id="current-tab-info">Zakładka ${CONFIG.currentMessageTab + 1}/5</span>
                    </div>
                </div>

                <!-- Powtarzaj wiadomość -->
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <strong style="color: #eaeff5; font-size: 13px;">Powtarzaj wiadomość:</strong> 
                        <span id="repeat-status" style="color: ${CONFIG.repeatMessage ? '#00ff88' : '#ff4444'}; font-weight: bold; font-size: 13px;">
                            ${CONFIG.repeatMessage ? 'AKTYWNE' : 'NIEAKTYWNE'}
                        </span>
                        <label class="switch" style="margin-left: auto;">
                            <input type="checkbox" id="repeat-toggle" ${CONFIG.repeatMessage ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div style="font-size: 10px; opacity: 0.7; color: #b0b8c5;">
                        Jeśli aktywne, wiadomość będzie wysyłana wielokrotnie do tego samego gracza
                    </div>
                </div>

                <!-- Harmonogram -->
                <div style="margin-bottom: 15px;">
                    <div style="font-weight: bold; margin-bottom: 6px; color: #eaeff5; font-size: 13px;">
                        Harmonogram aktywności
                    </div>
                    <div style="font-size: 10px; opacity: 0.8; margin-bottom: 8px; color: #b0b8c5;">
                        Określ godziny, w których skrypt ma automatycznie odpowiadać
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 4px; font-size: 12px;">
                            <span style="color: #eaeff5;">Od:</span>
                            <input type="time" id="schedule-start" value="${CONFIG.scheduleStart}" 
                                   style="
                                       background: rgba(255,255,255,0.05); 
                                       border: 1px solid rgba(255,255,255,0.1); 
                                       border-radius: 4px; 
                                       color: #eaeff5; 
                                       padding: 4px;
                                       font-size: 11px;
                                       width: 80px;
                                   ">
                        </div>
                        <div style="display: flex; align-items: center; gap: 4px; font-size: 12px;">
                            <span style="color: #eaeff5;">Do:</span>
                            <input type="time" id="schedule-end" value="${CONFIG.scheduleEnd}" 
                                   style="
                                       background: rgba(255,255,255,0.05); 
                                       border: 1px solid rgba(255,255,255,0.1); 
                                       border-radius: 4px; 
                                       color: #eaeff5; 
                                       padding: 4px;
                                       font-size: 11px;
                                       width: 80px;
                                   ">
                        </div>
                        <label class="switch" style="margin-left: auto;">
                            <input type="checkbox" id="schedule-toggle" ${CONFIG.scheduleEnabled ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <!-- Podgląd wiadomości -->
                <div style="
                    margin-top: 20px; 
                    padding: 10px; 
                    background: rgba(255,255,255,0.02); 
                    border-radius: 6px; 
                    border: 1px solid rgba(255,255,255,0.05);
                ">
                    <div style="font-weight: bold; margin-bottom: 6px; color: #eaeff5; font-size: 13px;">
                        <span id="preview-label">Podgląd wiadomości (zakładka ${CONFIG.currentMessageTab + 1}):</span>
                    </div>
                    <div id="message-preview" style="
                        padding: 8px; 
                        background: rgba(0,0,0,0.2); 
                        border-radius: 4px; 
                        border-left: 3px solid rgba(0, 255, 136, 0.5); 
                        color: #b0b8c5; 
                        font-style: italic;
                        font-size: 12px;
                        min-height: 20px;
                    ">
                        ${CONFIG.autoMessages[CONFIG.currentMessageTab] || 'Brak wiadomości...'}
                    </div>
                </div>

                <!-- Przyciski akcji -->
                <div style="display: flex; gap: 8px; margin-top: 20px;">
                    <button id="save-all-settings" style="
                        padding: 8px 16px; 
                        background: linear-gradient(135deg, #00ff88, #0099ff); 
                        border: none; 
                        border-radius: 4px; 
                        color: #000; 
                        font-weight: bold; 
                        cursor: pointer;
                        font-size: 12px;
                        flex: 1;
                    ">
                        Zapisz wszystkie zmiany
                    </button>
                    <button id="toggle-auto" style="
                        padding: 8px 16px; 
                        background: ${CONFIG.autoEnabled ? '#ff4444' : '#00ff88'}; 
                        border: none; 
                        border-radius: 4px; 
                        color: #000; 
                        font-weight: bold; 
                        cursor: pointer;
                        font-size: 12px;
                        flex: 1;
                    ">
                        ${CONFIG.autoEnabled ? 'Wyłącz auto-odpowiadanie' : 'Włącz auto-odpowiadanie'}
                    </button>
                </div>
            </div>

            <style>
                /* Style dla zakładek */
                .message-tab.active {
                    background: linear-gradient(135deg, #00ff88, #0099ff) !important;
                    color: #000 !important;
                    font-weight: bold;
                    border-color: rgba(0, 255, 136, 0.5) !important;
                }

                .message-tab:hover {
                    background: rgba(255,255,255,0.1) !important;
                    transform: translateY(-1px);
                }

                /* Style dla przełączników */
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 36px;
                    height: 18px;
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
                    border-radius: 18px;
                }

                .slider:before {
                    position: absolute;
                    content: "";
                    height: 14px;
                    width: 14px;
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
                    transform: translateX(18px);
                }

                /* Focus styles */
                textarea:focus, input:focus {
                    outline: none;
                    border-color: rgba(0, 255, 136, 0.5) !important;
                    box-shadow: 0 0 0 2px rgba(0, 255, 136, 0.1);
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
        initializeMessageTabs();
        initializeAutoMessage();
    };

    function initializeMessageTabs() {
        document.querySelectorAll('.message-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const tabIndex = parseInt(this.dataset.tab);
                
                // AUTOMATYCZNE ZAPISANIE aktualnej wiadomości przed zmianą zakładki
                const currentMessage = document.getElementById('message-input').value.substring(0, 200);
                CONFIG.autoMessages[CONFIG.currentMessageTab] = currentMessage;
                
                // Zmiana zakładki
                CONFIG.currentMessageTab = tabIndex;
                
                // Update UI
                document.querySelectorAll('.message-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Update message input and preview z NOWEJ zakładki
                document.getElementById('message-input').value = CONFIG.autoMessages[tabIndex] || '';
                document.getElementById('message-preview').textContent = CONFIG.autoMessages[tabIndex] || 'Brak wiadomości...';
                
                // Update labels - POPRAWIONE!
                document.getElementById('current-tab-info').textContent = `Zakładka ${tabIndex + 1}/5`;
                document.getElementById('preview-label').textContent = `Podgląd wiadomości (zakładka ${tabIndex + 1}):`;
                
                // AUTOMATYCZNE ZAPISANIE konfiguracji
                window.inwazjaConfig.autoMessages = CONFIG.autoMessages;
                window.inwazjaConfig.currentMessageTab = CONFIG.currentMessageTab;
                window.inwazjaSaveConfig(window.inwazjaConfig);
            });
        });
    }

    function initializeAutoMessage() {
        // ZAPISZ WSZYSTKIE ZMIANY (teraz służy do ręcznego zapisu przed zmianą modułu)
        document.getElementById('save-all-settings')?.addEventListener('click', function() {
            // Zapisz aktualną wiadomość
            const currentMessage = document.getElementById('message-input').value.substring(0, 200);
            CONFIG.autoMessages[CONFIG.currentMessageTab] = currentMessage;
            
            window.inwazjaConfig.autoMessages = CONFIG.autoMessages;
            window.inwazjaSaveConfig(window.inwazjaConfig);
            
            // Pokaz potwierdzenie
            const originalText = this.textContent;
            this.textContent = 'Zapisano.';
            this.style.background = '#00ff88';
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = 'linear-gradient(135deg, #00ff88, #0099ff)';
            }, 1000);
        });

        // Przełącznik powtarzania wiadomości
        document.getElementById('repeat-toggle')?.addEventListener('change', function() {
            CONFIG.repeatMessage = this.checked;
            const statusElement = document.getElementById('repeat-status');
            statusElement.textContent = this.checked ? 'AKTYWNE' : 'NIEAKTYWNE';
            statusElement.style.color = this.checked ? '#00ff88' : '#ff4444';
            
            window.inwazjaConfig.repeatMessage = CONFIG.repeatMessage;
            window.inwazjaSaveConfig(window.inwazjaConfig);
        });

        // Przełącznik harmonogramu
        document.getElementById('schedule-toggle')?.addEventListener('change', function() {
            CONFIG.scheduleEnabled = this.checked;
            window.inwazjaConfig.scheduleEnabled = CONFIG.scheduleEnabled;
            window.inwazjaSaveConfig(window.inwazjaConfig);
        });

        // Zapisywanie harmonogramu
        document.getElementById('schedule-start')?.addEventListener('change', function() {
            CONFIG.scheduleStart = this.value;
            window.inwazjaConfig.scheduleStart = CONFIG.scheduleStart;
            window.inwazjaSaveConfig(window.inwazjaConfig);
        });

        document.getElementById('schedule-end')?.addEventListener('change', function() {
            CONFIG.scheduleEnd = this.value;
            window.inwazjaConfig.scheduleEnd = CONFIG.scheduleEnd;
            window.inwazjaSaveConfig(window.inwazjaConfig);
        });

        // Główny przełącznik auto-odpowiadania
        document.getElementById('toggle-auto')?.addEventListener('click', function() {
            CONFIG.autoEnabled = !CONFIG.autoEnabled;
            
            const statusElement = document.getElementById('auto-status');
            statusElement.textContent = CONFIG.autoEnabled ? 'AKTYWNY' : 'NIEAKTYWNY';
            statusElement.style.color = CONFIG.autoEnabled ? '#00ff88' : '#ff4444';
            
            this.textContent = CONFIG.autoEnabled ? 'Wyłącz auto-odpowiadanie' : 'Włącz auto-odpowiadanie';
            this.style.background = CONFIG.autoEnabled ? '#ff4444' : '#00ff88';
            
            window.inwazjaConfig.autoEnabled = CONFIG.autoEnabled;
            window.inwazjaSaveConfig(window.inwazjaConfig);
        });

        // Live preview wiadomości
        document.getElementById('message-input')?.addEventListener('input', function() {
            const preview = this.value.substring(0, 200);
            document.getElementById('message-preview').textContent = preview || 'Brak wiadomości...';
        });
    }

})();
