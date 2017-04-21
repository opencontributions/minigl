import miniGL from './minigl';
var controls = [
    {
      legend: 'camera',
      fieldsets: [
        {
          legend: 'eye',
          inputs: [
            {
              dataProp: 'eye',
              dataAxis: 'x',
              inputType: 'range',
              min: '-5',
              max: '5',
              val: '0',
              step: '.05'
            },
            {
              dataProp: 'eye',
              dataAxis: 'y',
              inputType: 'range',
              min: '-5',
              max: '5',
              val: '0',
              step: '.05'
            },
            {
              dataProp: 'eye',
              dataAxis: 'z',
              inputType: 'range',
              min: '-20',
              max: '-5',
              val: '0',
              step: '.05'
            }
          ]
        }
      ]
    },
    {
      legend: 'transform',
      fieldsets: [
        {
          legend: 'rotate',
          inputs: [
            {
              dataProp: 'rotate',
              dataAxis: 'x',
              inputType: 'range',
              min: '0',
              max: '6.283',
              val: '0',
              step: '.05'
            },
            {
              dataProp: 'rotate',
              dataAxis: 'y',
              inputType: 'range',
              min: '0',
              max: '6.283',
              val: '0',
              step: '.05'
            },
            {
              dataProp: 'rotate',
              dataAxis: 'z',
              inputType: 'range',
              min: '0',
              max: '6.283',
              val: '0',
              step: '.05'
            }
          ]
        },
        {
          legend: 'scale',
          inputs: [
            {
              dataProp: 'scale',
              dataAxis: 'x',
              inputType: 'range',
              min: '.05',
              max: '2',
              val: '1',
              step: '.05'
            },
            {
              dataProp: 'scale',
              dataAxis: 'y',
              inputType: 'range',
              min: '.05',
              max: '2',
              val: '1',
              step: '.05'
            },
            {
              dataProp: 'scale',
              dataAxis: 'z',
              inputType: 'range',
              min: '.05',
              max: '2',
              val: '1',
              step: '.05'
            }
          ]
        },
        {
          legend: 'translate',
          inputs: [
            {
              dataProp: 'translate',
              dataAxis: 'x',
              inputType: 'range',
              min: '-1',
              max: '1',
              val: '0',
              step: '.05'
            },
            {
              dataProp: 'translate',
              dataAxis: 'y',
              inputType: 'range',
              min: '-1',
              max: '1',
              val: '0',
              step: '.05'
            },
            {
              dataProp: 'translate',
              dataAxis: 'z',
              inputType: 'range',
              min: '-1',
              max: '1',
              val: '0',
              step: '.05'
            }
          ]
        }
      ]
    },
    {
      legend: 'lights',
      fieldsets: [
        {
          legend: 'light 0',
          inputs: [
            {
              dataProp: 'light0Dir',
              dataAxis: 'x',
              inputType: 'range',
              min: '-1',
              max: '1',
              val: '1',
              step: '.05'
            },
            {
              dataProp: 'light0Dir',
              dataAxis: 'y',
              inputType: 'range',
              min: '-1',
              max: '1',
              val: '1',
              step: '.05'
            },
            {
              dataProp: 'light0Dir',
              dataAxis: 'z',
              inputType: 'range',
              min: '-1',
              max: '1',
              val: '-1',
              step: '.05'
            },
            {
              dataProp: 'light0Val',
              inputType: 'color',
              val: '#cccccc'
            }
          ]
        },
        {
          legend: 'light 1',
          inputs: [
            {
              dataProp: 'light1Dir',
              dataAxis: 'x',
              inputType: 'range',
              min: '-1',
              max: '1',
              val: '-1',
              step: '.05'
            },
            {
              dataProp: 'light1Dir',
              dataAxis: 'y',
              inputType: 'range',
              min: '-1',
              max: '1',
              val: '-.5',
              step: '.05'
            },
            {
              dataProp: 'light1Dir',
              dataAxis: 'z',
              inputType: 'range',
              min: '-1',
              max: '1',
              val: '-.5',
              step: '.05'
            },
            {
              dataProp: 'light1Val',
              inputType: 'color',
              val: '#cccccc'
            }
          ]
        }
      ]
    }
  ];

window.addEventListener('load', function load(event){
    window.removeEventListener('load', load, false);

    var can = document.getElementById('can');
    var glCtx = can.getContext('webgl') || can.getContext('experimental-webgl');
    var shaders = ['webgl_demo/script_webgl/fragment.gl', 'webgl_demo/script_webgl/vertex.gl'];
    
    var webGl = new miniGL(glCtx);
    webGl.initProgram(shaders, function() {
        var chest = this.createModel(
            ['webgl_demo/models_webgl/model_chest.json'],
            ['webgl_demo/textures_webgl/texture_chest.png'],
            {
                scale: {
                    x: 1,
                    y: 1,
                    z: 1
                },
                rotate: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                translate: {
                    x: 0,
                    y: 0,
                    z: 0
                },
            },
            function() {
    
            }
        );
        var drawersFixed = this.createModel(
            ['webgl_demo/models_webgl/model_drawers_fixed.json'],
            ['webgl_demo/textures_webgl/texture_drawers_fixed.png'],
            {
                scale: {
                    x: 1,
                    y: 1,
                    z: 1
                },
                rotate: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                translate: {
                    x: 0,
                    y: 0,
                    z: 0
                },
            },
            function() {
    
            }
        );
        var drawers = this.createModel(
            ['webgl_demo/models_webgl/model_drawer.json'],
            ['webgl_demo/textures_webgl/texture_drawer.png'],
            {
                scale: {
                    x: 1,
                    y: 1,
                    z: 1
                },
                rotate: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                translate: {
                    x: 0,
                    y: 0,
                    z: 0
                },
            },
            function(model) {
                if (this.rotate.y > Math.PI && model.translate.x < 1) {
                    model.translate.x += .01;
                }
                else if (model.translate.x > 0) {
                    model.translate.x -= .01;
                }
            }
        );
        this.init(function(world) {
            world.rotate.y = (performance.now() / 30000 * 2 * Math.PI) % Math.PI * 2;
        });
        this.animationLoop();
    });

    function hexToRgb(hex) {
        hex = hex.replace(/[^0-9A-F]/gi, '');
        var rgb = parseInt(hex, 16);
        var r = (rgb >> 16) & 255;
        var g = (rgb >> 8) & 255;
        var b = rgb & 255;
        return [r / 255,  g / 255,  b / 255];
    }
    
    function transformInput(e){
        if (this.type === 'color') {
            var rgb = hexToRgb(this.value);
            webGl[this.getAttribute('data-prop')].r = rgb[0];
            webGl[this.getAttribute('data-prop')].g = rgb[1];
            webGl[this.getAttribute('data-prop')].b = rgb[2];
            return;
        }

        webGl[this.getAttribute('data-prop')][this.getAttribute('data-axis')] = this.value;
    }
    function appendEle(parent, eleType) {
        var ele = document.createElement(eleType);
        parent.appendChild(ele);
        return ele;
    }
    var fieldset0, fieldset1, legend, label, input;

    controls.forEach(function(control) {
        fieldset0 = appendEle(document.getElementById('controls'), 'fieldset');
        legend = appendEle(fieldset0, 'legend');
        legend.innerHTML = control.legend;
        control.fieldsets.forEach(function(fieldset) {
            fieldset1 = appendEle(fieldset0, 'fieldset');
            legend = appendEle(fieldset1, 'legend');
            legend.innerHTML = fieldset.legend;
            fieldset.inputs.forEach(function(i) {
                label = appendEle(fieldset1, 'label');
                input = appendEle(label, 'input');
                input.type = i.inputType;
                input.value = i.val;
                input.step = i.step;
                input.min = i.min;
                input.max = i.max;
                input.setAttribute('data-prop', i.dataProp);
                input.setAttribute('data-axis', i.dataAxis);
            });
        });
    });
    var transformRange = document.querySelectorAll('input');
    transformRange.forEach(function(input) {
        input.addEventListener('input', transformInput, false);
    });

},false);