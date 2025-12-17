define(['jquery'], function($) {
  'use strict';

  // Variáveis globais para controlar a piscada
  window.kpiBlinkInterval = window.kpiBlinkInterval || null;

  return {
    definition: {
      type: "items",
      component: "accordion",
      items: {
        settings: {
          uses: "settings",
          items: {
            kpiId: {
              type: "string",
              label: "ID do KPI (tid)",
              ref: "kpiId",
              defaultValue: "bZAkw"
            },
            velocidade: {
              type: "number",
              label: "Velocidade (ms)",
              ref: "velocidade",
              defaultValue: 500
            }
          }
        }
      }
    },

    paint: function($element, layout) {
      var kpiId = layout.kpiId || 'bZAkw';
      var velocidade = layout.velocidade || 500;
      
      // Mostrar status
      $element.html(
        '<div style="padding:15px; background:#27ae60; color:white; text-align:center; font-weight:bold; border-radius:5px;">' +
        '✅ KPI Piscando Ativo<br>' +
        '<small>ID: ' + kpiId + ' | Velocidade: ' + velocidade + 'ms</small>' +
        '</div>'
      );
      
      // Parar intervalo anterior
      if (window.kpiBlinkInterval) {
        clearInterval(window.kpiBlinkInterval);
        window.kpiBlinkInterval = null;
      }
      
      // Variável para controlar visibilidade
      var isVisible = true;
      
      // CÓDIGO EXATO QUE FUNCIONOU NO CONSOLE
      window.kpiBlinkInterval = setInterval(function() {
        // Buscar o KPI usando vários seletores
        var kpiElement = document.querySelector('article[tid="' + kpiId + '"]') || 
                        document.querySelector('[tid="' + kpiId + '"]') ||
                        document.querySelector('article[data-qlik-id="' + kpiId + '"]') ||
                        document.querySelector('[data-qlik-id="' + kpiId + '"]');
        
        if (kpiElement) {
          kpiElement.style.opacity = isVisible ? '0.2' : '1';
          kpiElement.style.transition = 'opacity 0.3s';
          isVisible = !isVisible;
        } else {
          // Se não encontrar, tentar procurar em todos os KPIs
          var kpis = document.querySelectorAll('.qv-object-kpi');
          kpis.forEach(function(kpi) {
            var article = kpi.closest('article');
            if (article) {
              var tid = article.getAttribute('tid') || article.getAttribute('data-qlik-id');
              if (tid === kpiId) {
                article.style.opacity = isVisible ? '0.2' : '1';
                article.style.transition = 'opacity 0.3s';
                isVisible = !isVisible;
              }
            }
          });
        }
      }, velocidade);
      
      console.log('✅ Extensão KPI Piscante ativada para:', kpiId, 'Velocidade:', velocidade + 'ms');
      
      return;
    },
    
    destroy: function() {
      // Parar quando remover a extensão
      if (window.kpiBlinkInterval) {
        clearInterval(window.kpiBlinkInterval);
        window.kpiBlinkInterval = null;
        console.log('❌ Extensão KPI Piscante desativada');
      }
    }
  };
});
