// ==UserScript==
// @name         Inwazja Add-on | Modułowy Loader
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Ładuje moduły Inwazja Add-on z GitHub Pages
// @author       Anon
// @match        *://*.margonem.pl/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    
    const BASE_URL = "https://inwazja-margonem.github.io/inwazja-addon/";
    const VERSION = "2.0.1";
    
    const modules = [
        "core-ui.js",
        "auto-message.js"
        // Pozostałe moduły dodamy później
    ];
    
    function loadModule(moduleName) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `${BASE_URL}${moduleName}?v=${VERSION}`;
            script.onload = () => {
                console.log(`✅ Inwazja: załadowano ${moduleName}`);
                resolve();
            };
            script.onerror = () => {
                console.error(`❌ Inwazja: błąd ładowania ${moduleName}`);
                reject();
            };
            document.head.appendChild(script);
        });
    }
    
    async function loadAllModules() {
        console.log('🚀 Inwazja Add-on: rozpoczynanie ładowania modułów...');
        
        for (const module of modules) {
            try {
                await loadModule(module);
            } catch (error) {
                console.warn(`⚠️ Inwazja: pominięto ${module} z powodu błędu`);
            }
        }
        
        console.log('🎉 Inwazja Add-on: moduły załadowane');
    }
    
    // Zaczekaj aż strona się załadze
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllModules);
    } else {
        loadAllModules();
    }
})();
