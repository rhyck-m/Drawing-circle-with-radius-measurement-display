

var map;


require(["esri/map",
"esri/graphic",
"esri/geometry/Circle",
"esri/geometry/Polyline",
"esri/symbols/SimpleMarkerSymbol",
"esri/symbols/SimpleFillSymbol",
"esri/symbols/SimpleLineSymbol",
"esri/symbols/TextSymbol",
"esri/symbols/Font",
"esri/Color",
"esri/geometry/geometryEngine",
"dojo/domReady!"],


function (Map,
Graphic,
Circle,
Polyline,
SimpleMarkerSymbol,
SimpleFillSymbol,
SimpleLineSymbol,
TextSymbol,
Font,
Color,
geometryEngine) {


    map = new Map("map", {
        basemap: "topo", //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd  
        center: [-120.537, 46.592], // longitude, latitude  
        zoom: 13
    });


    var centerPt = null;
    var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
    new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25])
    );
    var drawCircle = new Graphic(null, sfs, null, null);
    var sls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2)
    var radiusLine = new Graphic(null, sls, null, null);
    var font = new Font("20px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER);
    var ts = new TextSymbol("");
    ts.setFont(font);
    ts.setColor(new Color([255, 0, 0]));
    ts.setOffset(0, 20);
    var radiusText = new Graphic(null, ts, null, null);

    //onDragStart, record the centerPt     
    map.on("mouse-drag-start", function (evt) {
        map.graphics.add(drawCircle);
        map.graphics.add(radiusLine);
        map.graphics.add(radiusText);
        centerPt = evt;
    });


    //onDrag, calculate distance between currentPoint and centerPt     
    map.on("mouse-drag", function (evt) {
        var pl = new Polyline(map.spatialReference);
        pl.addPath([centerPt.mapPoint, evt.mapPoint]);
        var radius = geometryEngine.geodesicLength(pl, "meters");
        var circle = new Circle({ center: centerPt.mapPoint, radius: radius, geodesic: true, spatialReference: map.spatialReference });;
        drawCircle.setGeometry(circle);
        radiusLine.setGeometry(pl);
        ts.setText(radius.toFixed(1) + " meters");
        radiusText.setGeometry(centerPt.mapPoint);
        console.log("radius is:" + radius);
    });


});