/**
 * AI Proper Use Workbook - Application JavaScript
 * 
 * Handles:
 * - Auto-saving to localStorage
 * - Export/import functionality
 * - Clearing saved data
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'ai-proper-use-workbook-data';
  const SAVE_DEBOUNCE_MS = 1000;
  
  let saveTimeout = null;
  let lastSaveTime = null;

  // ===========================================================================
  // Data Collection
  // ===========================================================================

  function collectFormData() {
    const data = {
      savedAt: new Date().toISOString(),
      version: '1.0.0',
      checkboxes: {},
      textareas: {}
    };

    document.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {
      if (checkbox.id) {
        data.checkboxes[checkbox.id] = checkbox.checked;
      }
    });

    document.querySelectorAll('textarea').forEach(function(textarea) {
      if (textarea.id) {
        data.textareas[textarea.id] = textarea.value;
      }
    });

    return data;
  }

  // ===========================================================================
  // Auto-Save
  // ===========================================================================

  function saveToLocalStorage() {
    const data = collectFormData();
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      lastSaveTime = new Date();
      updateSaveStatus('saved');
    } catch (e) {
      console.warn('Could not save:', e.message);
      updateSaveStatus('error');
    }
  }

  function scheduleSave() {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    updateSaveStatus('saving');
    saveTimeout = setTimeout(saveToLocalStorage, SAVE_DEBOUNCE_MS);
  }

  function loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const data = JSON.parse(stored);

      if (data.checkboxes) {
        Object.keys(data.checkboxes).forEach(function(id) {
          const checkbox = document.getElementById(id);
          if (checkbox) {
            checkbox.checked = data.checkboxes[id];
          }
        });
      }

      if (data.textareas) {
        Object.keys(data.textareas).forEach(function(id) {
          const textarea = document.getElementById(id);
          if (textarea) {
            textarea.value = data.textareas[id];
          }
        });
      }

      if (data.savedAt) {
        lastSaveTime = new Date(data.savedAt);
        updateSaveStatus('loaded');
      }

    } catch (e) {
      console.warn('Could not load:', e.message);
    }
  }

  // ===========================================================================
  // Status Display
  // ===========================================================================

  function updateSaveStatus(status) {
    const statusEl = document.getElementById('save-status');
    if (!statusEl) return;

    switch (status) {
      case 'saving':
        statusEl.textContent = 'Saving...';
        statusEl.className = 'save-status';
        break;
      case 'saved':
        statusEl.textContent = 'Saved';
        statusEl.className = 'save-status saved';
        break;
      case 'loaded':
        statusEl.textContent = 'Loaded';
        statusEl.className = 'save-status saved';
        break;
      case 'error':
        statusEl.textContent = 'Could not save';
        statusEl.className = 'save-status';
        break;
    }
  }

  // ===========================================================================
  // Export / Import
  // ===========================================================================

  function exportToJSON() {
    const data = collectFormData();
    data.exportedAt = new Date().toISOString();
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-workbook-' + new Date().toISOString().split('T')[0] + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importFromJSON(file) {
    const reader = new FileReader();
    
    reader.onload = function(event) {
      try {
        const data = JSON.parse(event.target.result);
        
        if (data.checkboxes) {
          Object.keys(data.checkboxes).forEach(function(id) {
            const checkbox = document.getElementById(id);
            if (checkbox) {
              checkbox.checked = data.checkboxes[id];
            }
          });
        }

        if (data.textareas) {
          Object.keys(data.textareas).forEach(function(id) {
            const textarea = document.getElementById(id);
            if (textarea) {
              textarea.value = data.textareas[id];
            }
          });
        }

        saveToLocalStorage();
        alert('Import successful.');
        
      } catch (e) {
        alert('Could not import file.');
        console.error('Import error:', e);
      }
    };
    
    reader.readAsText(file);
  }

  // ===========================================================================
  // Clear Data
  // ===========================================================================

  function clearAllData() {
    if (!confirm('Clear all saved work?')) {
      return;
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}

    document.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {
      checkbox.checked = false;
    });

    document.querySelectorAll('textarea').forEach(function(textarea) {
      textarea.value = '';
    });

    updateSaveStatus('saved');
  }

  // ===========================================================================
  // Initialization
  // ===========================================================================

  function init() {
    // Auto-save on changes
    document.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {
      checkbox.addEventListener('change', scheduleSave);
    });

    document.querySelectorAll('textarea').forEach(function(textarea) {
      textarea.addEventListener('input', scheduleSave);
    });

    // Export button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportToJSON);
    }

    // Import button
    const importBtn = document.getElementById('import-btn');
    const importInput = document.getElementById('import-input');
    if (importBtn && importInput) {
      importBtn.addEventListener('click', function() {
        importInput.click();
      });
      
      importInput.addEventListener('change', function(event) {
        if (event.target.files && event.target.files[0]) {
          importFromJSON(event.target.files[0]);
          event.target.value = '';
        }
      });
    }

    // Clear button
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', clearAllData);
    }

    // Load saved data
    loadFromLocalStorage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
