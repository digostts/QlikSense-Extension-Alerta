define(['jquery'], function($) {
  'use strict';

  window.kpiBlinkInterval = window.kpiBlinkInterval || null;
  window.kpiBlinkElements = window.kpiBlinkElements || {};

  return {
    initialProperties: {
      qHyperCubeDef: {
        qDimensions: [],
        qMeasures: [],
        qInitialDataFetch: [{
          qWidth: 0,
          qHeight: 0
        }]
      },
      showTitles: false,
      title: "",
      subtitle: "",
      footnote: ""
    },
    
    definition: {
      type: "items",
      component: "accordion",
      items: {
        settings: {
          uses: "settings",
          items: {
            kpiIds: {
              type: "string",
              label: "IDs dos Objetos (separados por vírgula)",
              ref: "kpiIds",
              defaultValue: "",
              expression: "optional"
            },
            tipoObjeto: {
              type: "string",
              component: "dropdown",
              label: "Tipo de objeto:",
              ref: "tipoObjeto",
              options: [
                { value: "objeto-inteiro", label: "Objeto inteiro (KPI, gráfico)" },
                { value: "elementos-internos", label: "Elementos internos (mapas, barras)" }
              ],
              defaultValue: "objeto-inteiro"
            },
            corParaPiscar: {
              type: "string",
              component: "dropdown",
              label: "Piscar quando a cor for:",
              ref: "corParaPiscar",
              options: [
                { value: "todas", label: "Todas as cores (sempre piscar)" },
                { value: "vermelho", label: "Vermelho" },
                { value: "verde", label: "Verde" },
                { value: "amarelo", label: "Amarelo" },
                { value: "azul", label: "Azul" },
                { value: "laranja", label: "Laranja" },
                { value: "custom", label: "Cor personalizada (RGB/HEX)" }
              ],
              defaultValue: "todas"
            },
            corCustomizada: {
              type: "string",
              label: "Cor personalizada (ex: rgb(255,0,0) ou #FF0000)",
              ref: "corCustomizada",
              defaultValue: "",
              show: function(layout) {
                return layout.corParaPiscar === "custom";
              }
            },
            velocidade: {
              type: "number",
              label: "Velocidade da piscada (ms)",
              ref: "velocidade",
              defaultValue: 500
            },
            opacidadeMinima: {
              type: "number",
              label: "Opacidade mínima (0 a 1)",
              ref: "opacidadeMinima",
              defaultValue: 0.2
            },
            modoDebug: {
              type: "boolean",
              label: "Modo Debug (ATIVE PARA VER O QUE ACONTECE)",
              ref: "modoDebug",
              defaultValue: true
            },
            mostrarStatus: {
              type: "boolean",
              label: "Mostrar status no painel (para debug visual)",
              ref: "mostrarStatus",
              defaultValue: false
            }
          }
        }
      }
    },

    support: {
      snapshot: false,
      export: false,
      exportData: false
    },

    paint: function($element, layout) {
      var kpiIds = layout.kpiIds ? layout.kpiIds.split(',').map(function(id) { return id.trim(); }) : [];
      var tipoObjeto = layout.tipoObjeto || 'objeto-inteiro';
      var corParaPiscar = layout.corParaPiscar || 'todas';
      var corCustomizada = layout.corCustomizada || '';
      var velocidade = layout.velocidade || 500;
      var opacidadeMinima = layout.opacidadeMinima || 0.2;
      var modoDebug = layout.modoDebug || false;
      var mostrarStatus = layout.mostrarStatus || false;
      
      // FUNÇÃO PARA FORÇAR TRANSPARÊNCIA TOTAL
      function forcarTransparencia() {
        $element.empty();
        
        var elementoDOM = $element[0];
        if (elementoDOM) {
          elementoDOM.setAttribute('style', 
            'background: transparent !important; ' +
            'background-color: transparent !important; ' +
            'background-image: none !important; ' +
            'border: none !important; ' +
            'box-shadow: none !important; ' +
            'outline: none !important; ' +
            'padding: 0 !important; ' +
            'margin: 0 !important; ' +
            'width: 100% !important; ' +
            'height: 100% !important; ' +
            'min-height: 0 !important; ' +
            'overflow: hidden !important;'
          );
        }
        
        var parent = $element.parent()[0];
        if (parent) {
          parent.setAttribute('style',
            'background: transparent !important; ' +
            'background-color: transparent !important; ' +
            'background-image: none !important; ' +
            'border: none !important; ' +
            'box-shadow: none !important; ' +
            'padding: 0 !important;'
          );
        }
        
        var article = $element.closest('article')[0];
        if (article) {
          article.setAttribute('style',
            'background: transparent !important; ' +
            'background-color: transparent !important; ' +
            'background-image: none !important; ' +
            'border: none !important; ' +
            'box-shadow: none !important;'
          );
        }
        
        var qvObject = $element.closest('.qv-object')[0];
        if (qvObject) {
          qvObject.setAttribute('style',
            'background: transparent !important; ' +
            'background-color: transparent !important; ' +
            'background-image: none !important; ' +
            'border: none !important; ' +
            'box-shadow: none !important;'
          );
        }
      }
      
      if (mostrarStatus) {
        var statusHtml = '<div style="padding:15px; background:#27ae60 !important; color:white; border-radius:5px;">' +
          '<div style="font-weight:bold; font-size:16px; margin-bottom:10px;">✅ KPI Piscante Ativo</div>' +
          '<div style="background:rgba(0,0,0,0.2) !important; padding:10px; border-radius:3px; font-size:12px;">' +
          '<strong>IDs:</strong> ' + (kpiIds.length > 0 ? kpiIds.join(', ') : 'Nenhum') + '<br>' +
          '<strong>Tipo:</strong> ' + tipoObjeto + '<br>' +
          '<strong>Cor:</strong> ' + corParaPiscar + (corParaPiscar === 'custom' ? ' (' + corCustomizada + ')' : '') + '<br>' +
          '<strong>Velocidade:</strong> ' + velocidade + 'ms<br>' +
          '<strong>Opacidade:</strong> ' + opacidadeMinima + '<br>' +
          '<strong>Debug:</strong> ' + (modoDebug ? 'ON' : 'OFF') +
          '</div></div>';
        $element.html(statusHtml);
      } else {
        forcarTransparencia();
        setTimeout(forcarTransparencia, 100);
        setTimeout(forcarTransparencia, 500);
      }
      
      // Parar intervalo anterior
      if (window.kpiBlinkInterval) {
        clearInterval(window.kpiBlinkInterval);
        window.kpiBlinkInterval = null;
      }
      
      // Limpar elementos armazenados
      window.kpiBlinkElements = {};
      
      // Função para normalizar cor RGB
      function normalizarCor(cor) {
        if (!cor) return '';
        return cor.replace(/\s+/g, '').toLowerCase();
      }
      
      // Função para converter HEX para RGB
      function hexParaRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
          'rgb(' + parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) + ')' : 
          null;
      }
      
      // Mapa de cores expandido
      var mapaCoresTodas = {
        'vermelho': [
          'rgb(255,0,0)', 'rgb(255,00,00)', 'rgb(139,0,0)', 'rgb(128,0,0)', 
          'rgb(165,42,42)', 'rgb(178,34,34)', 'rgb(220,20,60)', 'rgb(200,0,0)',
          'rgb(220,53,69)', 'rgb(244,67,54)', 'rgb(211,47,47)', 'rgb(229,57,53)', 
          'rgb(239,83,80)', 'rgb(255,82,82)', 'rgb(198,40,40)', 'rgb(183,28,28)', 
          'rgb(213,0,0)', 'rgb(255,99,71)', 'rgb(255,69,0)', 'rgb(255,127,80)',
          'rgb(233,69,96)', 'rgb(240,98,146)', 'rgba(255,0,0,1)', 'rgba(244,67,54,1)', 
          'rgba(220,53,69,1)', 'rgb(227,26,28)', 'rgb(251,154,153)', 'rgb(197,17,98)'
        ],
        'verde': [
          'rgb(0,255,0)', 'rgb(0,128,0)', 'rgb(34,139,34)', 'rgb(0,100,0)', 
          'rgb(25,135,84)', 'rgb(46,125,50)', 'rgb(27,94,32)', 'rgb(56,142,60)', 
          'rgb(67,160,71)', 'rgb(30,70,32)', 'rgb(40,167,69)', 'rgb(76,175,80)', 
          'rgb(102,187,106)', 'rgb(76,217,100)', 'rgb(52,168,83)', 'rgb(28,200,138)',
          'rgb(72,187,120)', 'rgb(38,166,154)', 'rgb(0,150,136)', 'rgb(144,238,144)', 
          'rgb(152,251,152)', 'rgb(124,252,0)', 'rgb(127,255,0)', 'rgb(173,255,47)', 
          'rgb(50,205,50)', 'rgb(129,199,132)', 'rgb(165,214,167)', 'rgba(0,255,0,1)', 
          'rgba(76,175,80,1)', 'rgba(40,167,69,1)', 'rgb(16,185,129)', 'rgb(5,150,105)', 
          'rgb(4,120,87)', 'rgb(0,152,69)'
        ],
        'amarelo': [
          'rgb(255,255,0)', 'rgb(255,215,0)', 'rgb(255,223,0)', 'rgb(218,165,32)', 
          'rgb(184,134,11)', 'rgb(205,133,63)', 'rgb(238,232,170)', 'rgb(240,230,140)', 
          'rgb(189,183,107)', 'rgb(255,193,7)', 'rgb(251,192,45)', 'rgb(255,235,59)',
          'rgb(253,216,53)', 'rgb(255,238,88)', 'rgb(255,241,118)', 'rgb(255,213,79)', 
          'rgb(255,196,12)', 'rgb(255,255,224)', 'rgb(255,250,205)', 'rgb(250,250,210)',
          'rgb(255,239,213)', 'rgb(255,228,181)', 'rgba(255,255,0,1)', 'rgba(255,193,7,1)', 
          'rgba(251,192,45,1)', 'rgb(234,179,8)', 'rgb(202,138,4)', 'rgb(161,98,7)'
        ],
        'azul': [
          'rgb(0,0,255)', 'rgb(0,0,128)', 'rgb(25,25,112)', 'rgb(0,0,139)', 
          'rgb(0,0,205)', 'rgb(0,82,204)', 'rgb(25,118,210)', 'rgb(30,136,229)', 
          'rgb(21,101,192)', 'rgb(13,71,161)', 'rgb(26,35,126)', 'rgb(13,27,42)',
          'rgb(0,123,255)', 'rgb(33,150,243)', 'rgb(66,165,245)', 'rgb(41,182,246)', 
          'rgb(3,169,244)', 'rgb(2,136,209)', 'rgb(1,87,155)', 'rgb(100,181,246)', 
          'rgb(79,195,247)', 'rgb(135,206,250)', 'rgb(173,216,230)', 'rgb(176,224,230)',
          'rgb(175,238,238)', 'rgb(240,248,255)', 'rgb(230,230,250)', 'rgb(63,81,181)', 
          'rgb(92,107,192)', 'rgb(121,134,203)', 'rgba(0,0,255,1)', 'rgba(33,150,243,1)', 
          'rgba(0,123,255,1)', 'rgb(37,99,235)', 'rgb(29,78,216)', 'rgb(30,64,175)'
        ],
        'laranja': [
          'rgb(255,165,0)', 'rgb(255,140,0)', 'rgb(255,127,80)', 'rgb(255,69,0)', 
          'rgb(230,81,0)', 'rgb(239,108,0)', 'rgb(245,124,0)', 'rgb(251,140,0)', 
          'rgb(255,111,0)', 'rgb(221,107,32)', 'rgb(191,87,0)', 'rgb(255,152,0)', 
          'rgb(255,167,38)', 'rgb(251,192,45)', 'rgb(255,179,0)', 'rgb(255,160,0)', 
          'rgb(255,143,0)', 'rgb(244,81,30)', 'rgb(230,74,25)', 'rgb(255,218,185)', 
          'rgb(255,228,196)', 'rgb(255,239,213)', 'rgb(255,222,173)', 'rgb(255,235,205)',
          'rgba(255,165,0,1)', 'rgba(255,152,0,1)', 'rgba(251,140,0,1)', 'rgb(249,115,22)', 
          'rgb(234,88,12)', 'rgb(194,65,12)'
        ]
      };
      
      // Função para verificar se uma cor específica corresponde ao alvo
      function verificarCorElemento(corElemento, corAlvo) {
        if (corAlvo === 'todas') return true;
        
        if (corAlvo === 'custom') {
          var corTemp = corCustomizada;
          if (corTemp.indexOf('#') === 0) {
            corTemp = hexParaRgb(corTemp);
          }
          return normalizarCor(corTemp) === corElemento;
        }
        
        var coresAlvo = (mapaCoresTodas[corAlvo] || []).map(normalizarCor);
        return coresAlvo.indexOf(corElemento) !== -1;
      }
      
// Substituir APENAS a função buscarElementosComCor:

function buscarElementosComCor(container, corAlvo, kpiId) {
  var elementosEncontrados = [];
  
  if (modoDebug) {
    console.log('═══════════════════════════════════════════════════');
    console.log('🔍 BUSCA EM CONTAINERS INTERNOS DO QLIK');
    console.log('Container original:', container);
    console.log('═══════════════════════════════════════════════════');
  }
  
  // ESTRATÉGIA: Buscar em containers internos do Qlik
  var possiveisContainers = [
    container.querySelector('.qv-object-content-container'),
    container.querySelector('.qv-object-content'),
    container.querySelector('.cell-content'),
    container.querySelector('.object-wrapper'),
    container.querySelector('svg'),
    container // fallback
  ];
  
  var containerReal = null;
  
  // Pegar o primeiro container válido
  for (var i = 0; i < possiveisContainers.length; i++) {
    if (possiveisContainers[i]) {
      containerReal = possiveisContainers[i];
      if (modoDebug) {
        console.log('✅ Container encontrado:', containerReal.className || containerReal.tagName);
      }
      break;
    }
  }
  
  if (!containerReal) {
    console.error('❌ Nenhum container válido encontrado!');
    return [];
  }
  
  // Buscar SVG dentro do container real
  var svgs = containerReal.querySelectorAll('svg');
  
  if (modoDebug) {
    console.log('📊 SVGs encontrados:', svgs.length);
  }
  
  // Se tem SVG, usar ele. Senão, usar o container real
  var containerFinal = svgs.length > 0 ? svgs[0] : containerReal;
  
  if (modoDebug) {
    console.log('Container final para busca:', containerFinal.tagName);
    console.log('──────────────────────────────────────────');
  }
  
  // Pegar TODOS os elementos
  var todosElementos = containerFinal.querySelectorAll('*');
  
  if (modoDebug) {
    console.log('📊 Total de elementos:', todosElementos.length);
    console.log('──────────────────────────────────────────');
    console.log('PRIMEIROS 100 ELEMENTOS:');
  }
  
  var contadorMostrado = 0;
  
  for (var i = 0; i < todosElementos.length; i++) {
    var el = todosElementos[i];
    var tagName = el.tagName ? el.tagName.toLowerCase() : '';
    
    // Pegar TODAS as propriedades de cor
    var fillAttr = el.getAttribute('fill');
    var fillStyle = window.getComputedStyle(el).fill;
    var strokeAttr = el.getAttribute('stroke');
    var strokeStyle = window.getComputedStyle(el).stroke;
    var bgColor = window.getComputedStyle(el).backgroundColor;
    var color = window.getComputedStyle(el).color;
    
    // Mostrar no debug
    if (modoDebug && contadorMostrado < 100) {
      console.log('Elemento #' + i + ' <' + tagName + '>');
      console.log('  fill (attr):', fillAttr);
      console.log('  fill (style):', fillStyle);
      console.log('  stroke (attr):', strokeAttr);
      console.log('  stroke (style):', strokeStyle);
      console.log('  background:', bgColor);
      console.log('  color:', color);
      console.log('  classes:', el.className);
      console.log('──────────────────────────────────────────');
      contadorMostrado++;
    }
    
    var cores = [fillAttr, fillStyle, strokeAttr, strokeStyle, bgColor, color];
    
    var corEncontrada = null;
    cores.forEach(function(cor) {
      if (cor && cor !== 'none' && cor !== 'transparent' && 
          cor !== 'rgba(0, 0, 0, 0)' && cor !== 'rgba(0,0,0,0)' &&
          cor !== 'rgb(0, 0, 0)' && cor !== 'rgb(89, 89, 89)') {
        var corNormalizada = normalizarCor(cor);
        
        if (verificarCorElemento(corNormalizada, corAlvo)) {
          corEncontrada = corNormalizada;
        }
      }
    });
    
    if (corEncontrada) {
      if (elementosEncontrados.indexOf(el) === -1) {
        elementosEncontrados.push(el);
        
        if (modoDebug) {
          console.log('🎯🎯🎯 MATCH ENCONTRADO!');
          console.log('  Tag:', tagName);
          console.log('  Cor:', corEncontrada);
          console.log('  Elemento:', el);
        }
      }
    }
  }
  
  if (modoDebug) {
    console.log('═══════════════════════════════════════════════════');
    console.log('📊 RESULTADO FINAL:');
    console.log('  Total analisado:', todosElementos.length);
    console.log('  MATCHES encontrados:', elementosEncontrados.length);
    console.log('  Lista completa:', elementosEncontrados);
    console.log('═══════════════════════════════════════════════════\n');
    
    // Se não encontrou, mostrar estrutura
    if (elementosEncontrados.length === 0) {
      console.log('❌ AINDA SEM MATCH!');
      console.log('HTML do container final:');
      console.log(containerFinal.innerHTML.substring(0, 1000));
    }
  }
  
  return elementosEncontrados;
}


      
      var isVisible = true;
      
      window.kpiBlinkInterval = setInterval(function() {
        kpiIds.forEach(function(kpiId) {
          if (!kpiId) return;
          
          var kpiElement = document.querySelector('[tid="' + kpiId + '"]') ||
                          document.querySelector('article[tid="' + kpiId + '"]') ||
                          document.querySelector('[data-qlik-id="' + kpiId + '"]') ||
                          document.querySelector('article[data-qlik-id="' + kpiId + '"]');
          
          if (kpiElement) {
            if (tipoObjeto === 'elementos-internos') {
              if (!window.kpiBlinkElements[kpiId] || !window.kpiBlinkElements[kpiId].timestamp || 
                  (Date.now() - window.kpiBlinkElements[kpiId].timestamp > 10000)) {
                
                var elementos = buscarElementosComCor(kpiElement, corParaPiscar, kpiId);
                window.kpiBlinkElements[kpiId] = {
                  elementos: elementos,
                  timestamp: Date.now()
                };
              }
              
              var dados = window.kpiBlinkElements[kpiId];
              if (dados && dados.elementos && dados.elementos.length > 0) {
                dados.elementos.forEach(function(el) {
                  if (el && el.style) {
                    el.style.opacity = isVisible ? opacidadeMinima : '1';
                    el.style.transition = 'opacity 0.3s';
                  }
                });
              } else if (modoDebug) {
                console.warn('⚠️ Nenhum elemento vermelho encontrado!');
              }
            }
          }
        });
        
        isVisible = !isVisible;
      }, velocidade);
      
      console.log('✅ Extensão ativada');
      return;
    },
    
    destroy: function() {
      if (window.kpiBlinkInterval) {
        clearInterval(window.kpiBlinkInterval);
        window.kpiBlinkInterval = null;
        
        var allElements = document.querySelectorAll('*');
        allElements.forEach(function(el) {
          el.style.opacity = '1';
        });
        
        window.kpiBlinkElements = {};
        console.log('❌ Extensão desativada');
      }
    }
  };
});
