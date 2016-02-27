var map, toolbar, symbol, geomTask, circleMeasure = false, measureUnits;

require([
  "esri/map",
  "esri/toolbars/draw",
  "esri/graphic",
  "dr/drawings",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",

  "dojo/parser", "dijit/registry",

  "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
  "dijit/form/Button", "dijit/WidgetSet","dijit/form/ComboBox", "dojo/domReady!"
], function (
  Map, Draw, Graphic, Drawings,
  SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
  parser, registry
) {
    parser.parse();

    map = new Map("map", {
        basemap: "streets",
        center: [-83.002156, 39.960528],
        zoom: 14
    });
    console.log(map);
    map.on("load", createToolbar);

    // loop through all dijits, connect onClick event
    // listeners for buttons to activate drawing tools
    registry.forEach(function (d) {
        // d is a reference to a dijit
        // could be a layout container or a button
        if (d.declaredClass === "dijit.form.Button") {
            d.on("click", activateTool);
            
        }
    });
    var _has_circle_graphics = false
    function activateTool() {
        //console.log(this.label);
        if (this.label == "Circle")
        {
            circleMeasure = true;
            _has_circle_graphics = true;

            measureUnits = dijit.byId('measureUnits').get('value');
            var dr = new Drawings();
            
            //console.log(dr.measureUnits);
            dr.drawCircleWithMeasurement();
        }
        else {
            _has_circle_graphics = false;
        }
        var tool = this.label.toUpperCase().replace(/ /g, "_");
        toolbar.activate(Draw[tool]);
        map.hideZoomSlider();
    }

    function createToolbar(themap) {
        toolbar = new Draw(map);
        toolbar.on("draw-end", addToMap);
    }

    function addToMap(evt) {
        var symbol;
        toolbar.deactivate();
        //deactivate the draw wih measure
        circleMeasure = false;
        map.showZoomSlider();
        switch (evt.geometry.type) {
            case "point":
            case "multipoint":
                symbol = new SimpleMarkerSymbol();
                break;
            case "polyline":
                symbol = new SimpleLineSymbol();
                break;
            default:
                symbol = new SimpleFillSymbol();
                break;
        }
        var graphic = new Graphic(evt.geometry, symbol);
        if (!_has_circle_graphics) {
            map.graphics.add(graphic);
        }

        
    }
});
