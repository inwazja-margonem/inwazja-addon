// auto-message.js
(function() {
    'use strict';
    
    if (window.inwazjaAutoMessageLoaded) return;
    window.inwazjaAutoMessageLoaded = true;
    
    const autoMessageCSS = `
     // auto-message.js - DODAJ NA POCZĄTKU
const autoMessageCSS = `
/* --- STYLE DLA AUTO-MESSAGE --- */
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

/* --- STYLE DLA LISTY IGNOROWANYCH GRACZY --- */
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
;
    
    function addAutoMessageStyles() {
        if (document.getElementById('inwazja-auto-message-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'inwazja-auto-message-styles';
        style.textContent = autoMessageCSS;
        document.head.appendChild(style);
    }
    
    function initAutoMessage() {

        function addAutoMessageStyles() {
    if (document.getElementById('inwazja-auto-message-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'inwazja-auto-message-styles';
    style.textContent = autoMessageCSS;
    document.head.appendChild(style);
}
        // Sprawdź czy core UI jest załadowany
        if (!window.inwazjaCoreLoaded) {
            setTimeout(initAutoMessage, 100);
            return;
        }
        
        // Dodaj style auto-message
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

                    <!-- Zakładki wiadomości -->
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

                        <!-- Pozostała część kodu bez zmian ... -->
                    </div>
                </div>
            `;
            
            // ... (reszta kodu bez zmian)
        }
        
        // Nasłuchuj zmiany modułu
        window.addEventListener('inwazjaModuleChange', (event) => {
            if (event.detail.moduleId === 'auto-message') {
                console.log('📢 Auto-message: otrzymano event zmiany modułu');
                showAutoMessage(event.detail.title, event.detail.subtitle);
            }
        });
        
        console.log('✅ Inwazja Add-on: Auto-message zainicjalizowany');
    }
    
    setTimeout(initAutoMessage, 500);
})();
