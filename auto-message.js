// auto-message.js
(function() {
    'use strict';
    
    if (window.inwazjaAutoMessageLoaded) return;
    window.inwazjaAutoMessageLoaded = true;
    
    const autoMessageCSS = `
.auto-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 8px;
}

.message-tabs-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.message-tabs {
    display: flex;
    gap: 4px;
}

.message-tab {
    padding: 6px 12px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.3s ease;
    min-width: 30px;
    text-align: center;
}

.message-tab:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.2);
}

.message-tab.active {
    background: rgba(100, 255, 100, 0.2);
    border-color: rgba(100, 255, 100, 0.5);
    color: #4CAF50;
}

.clear-button {
    padding: 4px 8px;
    background: rgba(255,100,100,0.1);
    border: 1px solid rgba(255,100,100,0.3);
    border-radius: 4px;
    color: #ff6b6b;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.clear-button:hover {
    background: rgba(255,100,100,0.2);
    border-color: rgba(255,100,100,0.5);
}

.message-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.auto-status {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: rgba(255,255,255,0.02);
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.05);
}

.status-text {
    font-size:12px;
    transition: color 0.3s ease;
}

.status-text.active {
    color: #4CAF50;
}

.status-text.inactive {
    color: #f44336;
}

.auto-toggle {
    position: relative;
    width: 45px;
    height: 22px;
    background: rgba(255,255,255,0.1);
    border-radius: 11px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.auto-toggle.active {
    background: rgba(100, 255, 100, 0.3);
}

.auto-toggle::before {
    content: '';
    position: absolute;
    top: 1px;
    left: 1px;
    width: 20px;
    height: 20px;
    background: rgba(255,255,255,0.8);
    border-radius: 50%;
    transition: transform 0.3s ease;
}

.auto-toggle.active::before {
    transform: translateX(23px);
    background: rgba(100, 255, 100, 1);
}

.checkbox-container {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    background: rgba(255,255,255,0.02);
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.05);
}

.custom-checkbox {
    position: relative;
    width: 18px;
    height: 18px;
    background: rgba(255,255,255,0.05);
    border: 2px solid rgba(255,255,255,0.2);
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.custom-checkbox.checked {
    background: rgba(100, 255, 100, 0.3);
    border-color: rgba(100, 255, 100, 0.6);
}

.custom-checkbox.checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #4CAF50;
    font-size: 12px;
    font-weight: bold;
}

.checkbox-label {
    font-size: 12px;
    transition: color 0.3s ease;
}

.checkbox-label.checked {
    color: #4CAF50;
}

.schedule-container {
    padding: 12px;
    background: rgba(255,255,255,0.02);
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.05);
}

.schedule-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
}

.schedule-toggle {
    position: relative;
    width: 35px;
    height: 18px;
    background: rgba(255,255,255,0.1);
    border-radius: 9px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.schedule-toggle.active {
    background: rgba(100, 255, 100, 0.3);
}

.schedule-toggle::before {
    content: '';
    position: absolute;
    top: 1px;
    left: 1px;
    width: 16px;
    height: 16px;
    background: rgba(255,255,255,0.8);
    border-radius: 50%;
    transition: transform 0.3s ease;
}

.schedule-toggle.active::before {
    transform: translateX(17px);
    background: rgba(100, 255, 100, 1);
}

.schedule-time {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
}

.time-input {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 4px;
    padding: 6px 8px;
    color: #eaeff5;
    font-family: inherit;
    font-size: 12px;
    width: 70px;
    outline: none;
}

.time-input:focus {
    border-color: rgba(255,255,255,0.3);
}

.auto-textarea {
    width: 100%;
    min-height: 80px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 5px;
    padding: 8px;
    color: #eaeff5;
    font-family: inherit;
    font-size: 13px;
    resize: vertical;
    outline: none;
}

.auto-textarea:focus {
    border-color: rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.08);
}

.auto-preview {
    padding: 10px;
    background: rgba(0,0,0,0.2);
    border-radius: 5px;
    border-left: 2px solid rgba(255,255,255,0.2);
    font-size: 12px;
    line-height: 1.4;
}

.auto-info {
    font-size: 11px;
    opacity: 0.7;
    margin-top: 6px;
}

.ignore-container {
    padding: 12px;
    background: rgba(255,255,255,0.02);
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.05);
}

.ignore-header {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 8px;
}

.ignore-input-container {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
}

.ignore-input {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 4px;
    padding: 6px 8px;
    color: #eaeff5;
    font-family: inherit;
    font-size: 12px;
    outline: none;
}

.ignore-input:focus {
    border-color: rgba(255,255,255,0.3);
}

.ignore-input::placeholder {
    color: rgba(255,255,255,0.4);
}

.ignore-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-height: 30px;
}

.ignore-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 8px;
    background: rgba(255,255,255,0.03);
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.05);
}

.ignore-player {
    font-size: 11px;
    color: #eaeff5;
}

.ignore-remove {
    background: rgba(255,100,100,0.1);
    border: 1px solid rgba(255,100,100,0.3);
    border-radius: 3px;
    color: #ff6b6b;
    font-size: 10px;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.ignore-remove:hover {
    background: rgba(255,100,100,0.2);
    border-color: rgba(255,100,100,0.5);
}

.ignore-limit {
    font-size: 10px;
    color: #ff6b6b;
    margin-top: 6px;
    opacity: 0.8;
    display: none;
}

.ignore-limit.show {
    display: block;
}

.ignore-info {
    font-size: 10px;
    opacity: 0.7;
    margin-top: 4px;
}
    `;
    
    function addAutoMessageStyles() {
        if (document.getElementById('inwazja-auto-message-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'inwazja-auto-message-styles';
        style.textContent = autoMessageCSS;
        document.head.appendChild(style);
    }
    
    function initAutoMessage() {
        if (!window.inwazjaCoreLoaded) {
            setTimeout(initAutoMessage, 100);
            return;
        }
        
        addAutoMessageStyles();
        
        function showAutoMessage(title, subtitle) {
            const cfg = window.inwazjaConfig;
            const content = document.getElementById('inwazja-content');
            
            if (!content) {
                setTimeout(() => showAutoMessage(title, subtitle), 100);
                return;
            }
            
            content.innerHTML = `
                <div class="auto-container">
                    <h3 style="margin-top:0; margin-bottom: 12px; font-size:14px;">${title}</h3>
                    <div style="opacity:.9; margin-bottom: 16px; font-size:12px;">${subtitle}</div>

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
                        <div class="auto-status">
                            <div class="auto-toggle ${cfg.autoEnabled ? 'active' : ''}" id="autoToggle"></div>
                            <div class="status-text ${cfg.autoEnabled ? 'active' : 'inactive'}" id="autoStatusText">
                                Status skryptu: <strong>${cfg.autoEnabled ? 'AKTYWNY' : 'NIEAKTYWNY'}</strong>
                            </div>
                        </div>

                        <div>
                            <div style="margin-bottom: 6px; font-weight: 600; font-size:12px;">Treść wiadomości:</div>
                            <textarea class="auto-textarea" id="autoMessageText" placeholder="Wpisz wiadomość, która będzie automatycznie wysyłana do graczy...">${cfg.autoMessages[cfg.currentMessageTab] || ''}</textarea>
                            <div class="auto-info">Maksymalnie 200 znaków | Zakładka ${cfg.currentMessageTab + 1}/5</div>
                        </div>

                        <div class="checkbox-container">
                            <div class="custom-checkbox ${cfg.repeatMessage ? 'checked' : ''}" id="repeatCheckbox"></div>
                            <div class="checkbox-label ${cfg.repeatMessage ? 'checked' : ''}" id="repeatLabel">
                                Powtarzaj wiadomość: <strong>${cfg.repeatMessage ? 'AKTYWNE' : 'NIEAKTYWNE'}</strong>
                            </div>
                        </div>

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

                        <div>
                            <div style="margin-bottom: 6px; font-weight: 600; font-size:12px;">Podgląd wiadomości (zakładka ${cfg.currentMessageTab + 1}):</div>
                            <div class="auto-preview" id="autoPreview">
                                ${cfg.autoMessages[cfg.currentMessageTab] ? cfg.autoMessages[cfg.currentMessageTab] : 'Brak wiadomości...'}
                            </div>
                        </div>

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

            function updateIgnoreList() {
                if (!ignoreList) return;
                
                ignoreList.innerHTML = cfg.ignoredPlayers.map(player => `
                    <div class="ignore-item">
                        <span class="ignore-player">${player}</span>
                        <div class="ignore-remove" data-player="${player}">×</div>
                    </div>
                `).join('');

                ignoreList.querySelectorAll('.ignore-remove').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const playerToRemove = this.dataset.player;
                        cfg.ignoredPlayers = cfg.ignoredPlayers.filter(p => p !== playerToRemove);
                        window.inwazjaSaveConfig(cfg);
                        updateIgnoreList();
                        if (ignoreLimit) ignoreLimit.classList.toggle('show', cfg.ignoredPlayers.length >= 5);
                    });
                });
            }

            if (messageTabs) {
                messageTabs.querySelectorAll('.message-tab').forEach(tab => {
                    tab.addEventListener('click', () => {
                        const tabIndex = parseInt(tab.dataset.tab);

                        cfg.autoMessages[cfg.currentMessageTab] = autoMessageText.value;
                        cfg.currentMessageTab = tabIndex;

                        messageTabs.querySelectorAll('.message-tab').forEach(t => t.classList.remove('active'));
                        tab.classList.add('active');

                        autoMessageText.value = cfg.autoMessages[tabIndex] || '';
                        if (autoPreview) autoPreview.textContent = cfg.autoMessages[tabIndex] || 'Brak wiadomości...';

                        const infoElement = autoMessageText.nextElementSibling;
                        if (infoElement && infoElement.classList.contains('auto-info')) {
                            infoElement.textContent = `Maksymalnie 200 znaków | Zakładka ${tabIndex + 1}/5`;
                        }

                        const previewTitle = autoPreview ? autoPreview.previousElementSibling : null;
                        if (previewTitle) {
                            previewTitle.textContent = `Podgląd wiadomości (zakładka ${tabIndex + 1}):`;
                        }

                        window.inwazjaSaveConfig(cfg);
                    });
                });
            }

            if (clearButton) {
                clearButton.addEventListener('click', () => {
                    cfg.autoMessages[cfg.currentMessageTab] = '';
                    autoMessageText.value = '';
                    if (autoPreview) autoPreview.textContent = 'Brak wiadomości...';
                    window.inwazjaSaveConfig(cfg);
                });
            }

            if (autoToggle) {
                autoToggle.addEventListener('click', () => {
                    cfg.autoEnabled = !cfg.autoEnabled;
                    autoToggle.classList.toggle('active');
                    if (autoStatusText) {
                        autoStatusText.textContent = `Status skryptu: ${cfg.autoEnabled ? 'AKTYWNY' : 'NIEAKTYWNY'}`;
                        autoStatusText.className = `status-text ${cfg.autoEnabled ? 'active' : 'inactive'}`;
                    }
                    window.inwazjaSaveConfig(cfg);
                });
            }

            if (autoMessageText) {
                autoMessageText.addEventListener('input', (e) => {
                    const message = e.target.value.slice(0, 200);
                    e.target.value = message;
                    cfg.autoMessages[cfg.currentMessageTab] = message;
                    if (autoPreview) autoPreview.textContent = message || 'Brak wiadomości...';
                    window.inwazjaSaveConfig(cfg);
                });
            }

            if (repeatCheckbox) {
                repeatCheckbox.addEventListener('click', () => {
                    cfg.repeatMessage = !cfg.repeatMessage;
                    repeatCheckbox.classList.toggle('checked');
                    if (repeatLabel) {
                        repeatLabel.textContent = `Powtarzaj wiadomość: ${cfg.repeatMessage ? 'AKTYWNE' : 'NIEAKTYWNE'}`;
                        repeatLabel.className = `checkbox-label ${cfg.repeatMessage ? 'checked' : ''}`;
                    }
                    window.inwazjaSaveConfig(cfg);
                });
            }

            if (scheduleToggle) {
                scheduleToggle.addEventListener('click', () => {
                    cfg.scheduleEnabled = !cfg.scheduleEnabled;
                    scheduleToggle.classList.toggle('active');
                    if (scheduleStart) scheduleStart.disabled = !cfg.scheduleEnabled;
                    if (scheduleEnd) scheduleEnd.disabled = !cfg.scheduleEnabled;
                    window.inwazjaSaveConfig(cfg);
                });
            }

            if (scheduleStart) {
                scheduleStart.addEventListener('change', (e) => {
                    cfg.scheduleStart = e.target.value;
                    window.inwazjaSaveConfig(cfg);
                });
            }

            if (scheduleEnd) {
                scheduleEnd.addEventListener('change', (e) => {
                    cfg.scheduleEnd = e.target.value;
                    window.inwazjaSaveConfig(cfg);
                });
            }

            if (ignoreInput) {
                ignoreInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const playerName = ignoreInput.value.trim();
                        if (playerName) {
                            if (cfg.ignoredPlayers.length >= 5) {
                                if (ignoreLimit) ignoreLimit.classList.add('show');
                                return;
                            }

                            if (!cfg.ignoredPlayers.includes(playerName)) {
                                cfg.ignoredPlayers.push(playerName);
                                window.inwazjaSaveConfig(cfg);
                                ignoreInput.value = '';
                                updateIgnoreList();
                                if (ignoreLimit) ignoreLimit.classList.toggle('show', cfg.ignoredPlayers.length >= 5);
                            }
                        }
                    }
                });
            }

            if (autoPreview) autoPreview.textContent = cfg.autoMessages[cfg.currentMessageTab] || 'Brak wiadomości...';
            updateIgnoreList();
        }
        
        window.addEventListener('inwazjaModuleChange', (event) => {
            if (event.detail.moduleId === 'auto-message') {
                showAutoMessage(event.detail.title, event.detail.subtitle);
            }
        });
        
        if (window.inwazjaConfig.activeTab === 'auto-message') {
            setTimeout(() => {
                showAutoMessage('Auto-message', 'Skrypt na automatyczne odpisywanie graczom podczas nieobecności.');
            }, 1000);
        }
        
        console.log('✅ Inwazja Add-on: Auto-message załadowany');
    }
    
    setTimeout(initAutoMessage, 500);
})();
