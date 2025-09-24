// modules/auto-message.js
(function() {
    'use strict';
    
    if (window.inwazjaAutoMessageLoaded) return;
    window.inwazjaAutoMessageLoaded = true;
    
    function initAutoMessage() {
        // Sprawdź czy core UI jest załadowany
        if (!window.inwazjaCoreLoaded) {
            setTimeout(initAutoMessage, 100);
            return;
        }
        
        function showAutoMessage(content, title, subtitle) {
            const cfg = window.inwazjaConfig;
            
            content.innerHTML = `
                <div class="auto-container">
                    <h3 style="margin-top:0; margin-bottom: 12px; font-size:14px;">${title}</h3>
                    <div style="opacity:.9; margin-bottom: 16px; font-size:12px;">${subtitle}</div>

                    <!-- Zakładki wiadomości 1-5 z przyciskiem czyszczenia -->
                    <div class="message-tabs-container">
                        <div class="message-tabs" id="messageTabs">
                            <div class="message-tab ${cfg.currentMessageTab === 0 ? 'active' : ''}" data-tab="0">1</div>
                            <div class="message-tab ${cfg.currentMessageTab === 1 ? 'active' : ''}" data-tab="1">2</div>
                            <div class="message-tab ${cfg.currentMessageTab === 2 ? 'active' : ''}" data-tab="2">3</div>
                            <div class="message-tab ${cfg.currentMessageTab === 3 ? 'active' : ''}" data-tab="3">4</div>
                            <div class="message-tab ${cfg.currentMessageTab === 4 ? 'active' : ''}" data-tab="4">5</div>
                        </div>
                        <div class="clear-button" id="clearButton" title="Wyczyść treść aktualnej zakładki">🗑️</div>
                    </div>

                    <div class="message-content">
                        <!-- Status skryptu -->
                        <div class="auto-status">
                            <div class="auto-toggle ${cfg.autoEnabled ? 'active' : ''}" id="autoToggle"></div>
                            <div class="status-text ${cfg.autoEnabled ? 'active' : 'inactive'}" id="autoStatusText">
                                Status skryptu: <strong>${cfg.autoEnabled ? 'AKTYWNY' : 'NIEAKTYWNY'}</strong>
                            </div>
                        </div>

                        <!-- Treść wiadomości -->
                        <div>
                            <div style="margin-bottom: 6px; font-weight: 600; font-size:12px;">Treść wiadomości:</div>
                            <textarea class="auto-textarea" id="autoMessageText" placeholder="Wpisz wiadomość, która będzie automatycznie wysyłana do graczy...">${cfg.autoMessages[cfg.currentMessageTab] || ''}</textarea>
                            <div class="auto-info">Maksymalnie 200 znaków | Zakładka ${cfg.currentMessageTab + 1}/5</div>
                        </div>

                        <!-- Powtarzaj wiadomość -->
                        <div class="checkbox-container">
                            <div class="custom-checkbox ${cfg.repeatMessage ? 'checked' : ''}" id="repeatCheckbox"></div>
                            <div class="checkbox-label ${cfg.repeatMessage ? 'checked' : ''}" id="repeatLabel">
                                Powtarzaj wiadomość: <strong>${cfg.repeatMessage ? 'AKTYWNE' : 'NIEAKTYWNE'}</strong>
                            </div>
                        </div>

                        <!-- Harmonogram -->
                        <div class="schedule-container">
                            <div class="schedule-header">
                                <div class="schedule-toggle ${cfg.scheduleEnabled ? 'active' : ''}" id="scheduleToggle"></div>
                                <div style="font-size:12px; font-weight:600;">Harmonogram aktywności</div>
                            </div>
                            <div style="font-size:11px; opacity:0.8; margin-bottom:10px;">
                                Określ godziny, w których skrypt ma automatycznie odpowiadać
                            </div>

                            <div class="schedule-time">
                                <span style="font-size:11px;">Od:</span>
                                <input type="time" class="time-input" id="scheduleStart" value="${cfg.scheduleStart}" ${!cfg.scheduleEnabled ? 'disabled' : ''}>
                                <span style="font-size:11px;">Do:</span>
                                <input type="time" class="time-input" id="scheduleEnd" value="${cfg.scheduleEnd}" ${!cfg.scheduleEnabled ? 'disabled' : ''}>
                            </div>
                        </div>

                        <!-- Podgląd wiadomości -->
                        <div>
                            <div style="margin-bottom: 6px; font-weight: 600; font-size:12px;">Podgląd wiadomości (zakładka ${cfg.currentMessageTab + 1}):</div>
                            <div class="auto-preview" id="autoPreview">
                                ${cfg.autoMessages[cfg.currentMessageTab] ? cfg.autoMessages[cfg.currentMessageTab] : 'Brak wiadomości...'}
                            </div>
                        </div>

                        <!-- Ignorowanie graczy -->
                        <div class="ignore-container">
                            <div class="ignore-header">Ignorowanie wysyłania wiadomości do graczy:</div>
                            <div class="ignore-input-container">
                                <input type="text" class="ignore-input" id="ignoreInput" placeholder="Wpisz nick gracza i naciśnij Enter" maxlength="20">
                            </div>
                            <div class="ignore-list" id="ignoreList">
                                ${cfg.ignoredPlayers.map(player => `
                                    <div class="ignore-item">
                                        <span class="ignore-player">${player}</span>
                                        <div class="ignore-remove" data-player="${player}">×</div>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="ignore-info">Maksymalnie 5 graczy. Wiadomości nie będą wysyłane do ignorowanych graczy.</div>
                            <div class="ignore-limit ${cfg.ignoredPlayers.length >= 5 ? 'show' : ''}" id="ignoreLimit">
                                Osiągnięto limit dodanych graczy - usuń kogoś i spróbuj ponownie.
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 8px; font-size: 11px; opacity: 0.7;">
                        ⓘ System będzie automatycznie odpowiadał na prywatne wiadomości zgodnie z ustawieniami.
                    </div>
                </div>
            `;

            // Inicjalizacja elementów Auto-message
            const autoToggle = document.getElementById('autoToggle');
            const autoStatusText = document.getElementById('autoStatusText');
            const autoMessageText = document.getElementById('autoMessageText');
            const autoPreview = document.getElementById('autoPreview');
            const repeatCheckbox = document.getElementById('repeatCheckbox');
            const repeatLabel = document.getElementById('repeatLabel');
            const scheduleToggle = document.getElementById('scheduleToggle');
            const scheduleStart = document.getElementById('scheduleStart');
            const scheduleEnd = document.getElementById('scheduleEnd');
            const messageTabs = document.getElementById('messageTabs');
            const clearButton = document.getElementById('clearButton');
            const ignoreInput = document.getElementById('ignoreInput');
            const ignoreList = document.getElementById('ignoreList');
            const ignoreLimit = document.getElementById('ignoreLimit');

            // Funkcja aktualizacji listy ignorowanych graczy
            function updateIgnoreList() {
                ignoreList.innerHTML = cfg.ignoredPlayers.map(player => `
                    <div class="ignore-item">
                        <span class="ignore-player">${player}</span>
                        <div class="ignore-remove" data-player="${player}">×</div>
                    </div>
                `).join('');

                // Dodaj event listeners do przycisków usuwania
                ignoreList.querySelectorAll('.ignore-remove').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const playerToRemove = this.dataset.player;
                        cfg.ignoredPlayers = cfg.ignoredPlayers.filter(p => p !== playerToRemove);
                        window.inwazjaSaveConfig(cfg);
                        updateIgnoreList();
                        ignoreLimit.classList.toggle('show', cfg.ignoredPlayers.length >= 5);
                    });
                });
            }

            // Obsługa zakładek wiadomości
            messageTabs.querySelectorAll('.message-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabIndex = parseInt(tab.dataset.tab);

                    // Zapisz aktualną wiadomość przed zmianą zakładki
                    cfg.autoMessages[cfg.currentMessageTab] = autoMessageText.value;

                    // Zmień zakładkę
                    cfg.currentMessageTab = tabIndex;

                    // Zaktualizuj UI
                    messageTabs.querySelectorAll('.message-tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');

                    // Załaduj wiadomość z nowej zakładki
                    autoMessageText.value = cfg.autoMessages[tabIndex] || '';
                    autoPreview.textContent = cfg.autoMessages[tabIndex] || 'Brak wiadomości...';

                    // Zaktualizuj informację o zakładce
                    const infoElement = autoMessageText.nextElementSibling;
                    if (infoElement && infoElement.classList.contains('auto-info')) {
                        infoElement.textContent = `Maksymalnie 200 znaków | Zakładka ${tabIndex + 1}/5`;
                    }

                    const previewTitle = autoPreview.previousElementSibling;
                    if (previewTitle) {
                        previewTitle.textContent = `Podgląd wiadomości (zakładka ${tabIndex + 1}):`;
                    }

                    window.inwazjaSaveConfig(cfg);
                });
            });

            // Przycisk czyszczenia aktualnej zakładki
            clearButton.addEventListener('click', () => {
                cfg.autoMessages[cfg.currentMessageTab] = '';
                autoMessageText.value = '';
                autoPreview.textContent = 'Brak wiadomości...';
                window.inwazjaSaveConfig(cfg);
            });

            // Toggle głównego skryptu
            autoToggle.addEventListener('click', () => {
                cfg.autoEnabled = !cfg.autoEnabled;
                autoToggle.classList.toggle('active');
                autoStatusText.textContent = `Status skryptu: ${cfg.autoEnabled ? 'AKTYWNY' : 'NIEAKTYWNY'}`;
                autoStatusText.className = `status-text ${cfg.autoEnabled ? 'active' : 'inactive'}`;
                window.inwazjaSaveConfig(cfg);
            });

            // Textarea wiadomości
            autoMessageText.addEventListener('input', (e) => {
                const message = e.target.value.slice(0, 200);
                e.target.value = message;
                cfg.autoMessages[cfg.currentMessageTab] = message;
                autoPreview.textContent = message || 'Brak wiadomości...';
                window.inwazjaSaveConfig(cfg);
            });

            // Checkbox powtarzania wiadomości
            repeatCheckbox.addEventListener('click', () => {
                cfg.repeatMessage = !cfg.repeatMessage;
                repeatCheckbox.classList.toggle('checked');
                repeatLabel.textContent = `Powtarzaj wiadomość: ${cfg.repeatMessage ? 'AKTYWNE' : 'NIEAKTYWNE'}`;
                repeatLabel.className = `checkbox-label ${cfg.repeatMessage ? 'checked' : ''}`;
                window.inwazjaSaveConfig(cfg);
            });

            // Toggle harmonogramu
            scheduleToggle.addEventListener('click', () => {
                cfg.scheduleEnabled = !cfg.scheduleEnabled;
                scheduleToggle.classList.toggle('active');
                scheduleStart.disabled = !cfg.scheduleEnabled;
                scheduleEnd.disabled = !cfg.scheduleEnabled;
                window.inwazjaSaveConfig(cfg);
            });

            // Zmiana godzin harmonogramu
            scheduleStart.addEventListener('change', (e) => {
                cfg.scheduleStart = e.target.value;
                window.inwazjaSaveConfig(cfg);
            });

            scheduleEnd.addEventListener('change', (e) => {
                cfg.scheduleEnd = e.target.value;
                window.inwazjaSaveConfig(cfg);
            });

            // Dodawanie graczy do listy ignorowanych
            ignoreInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const playerName = ignoreInput.value.trim();
                    if (playerName) {
                        if (cfg.ignoredPlayers.length >= 5) {
                            // Pokazujemy komunikat o limicie
                            ignoreLimit.classList.add('show');
                            return;
                        }

                        if (!cfg.ignoredPlayers.includes(playerName)) {
                            cfg.ignoredPlayers.push(playerName);
                            window.inwazjaSaveConfig(cfg);
                            ignoreInput.value = '';
                            updateIgnoreList();
                            ignoreLimit.classList.toggle('show', cfg.ignoredPlayers.length >= 5);
                        }
                    }
                }
            });

            // Inicjalizacja
            autoPreview.textContent = cfg.autoMessages[cfg.currentMessageTab] || 'Brak wiadomości...';
            updateIgnoreList();
        }
        
        // Nasłuchuj zmiany modułu
        window.addEventListener('inwazjaModuleChange', (event) => {
            if (event.detail.moduleId === 'auto-message') {
                const content = document.getElementById('inwazja-content');
                if (content) {
                    showAutoMessage(content, event.detail.title, event.detail.subtitle);
                }
            }
        });
        
        // Jeśli auto-message jest aktywnym tabem przy starcie
        if (window.inwazjaConfig.activeTab === 'auto-message') {
            setTimeout(() => {
                const content = document.getElementById('inwazja-content');
                if (content) {
                    showAutoMessage(content, 'Auto-message', 'Skrypt na automatyczne odpisywanie graczom podczas nieobecności.');
                }
            }, 500);
        }
        
        console.log('✅ Inwazja Add-on: Auto-message załadowany');
    }
    
    // Opóźnij inicjalizację aby core UI na pewno był gotowy
    setTimeout(initAutoMessage, 50);
})();
