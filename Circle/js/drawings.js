

/*
  Drawing circle with measurements
  by Richard Moussopo
  Contributor:  tsellste from Javascript API Forum 
 */
define([
    "dojo/_base/declare", "dojo/_base/lang",
    "dojo/dom", "dojo/on",
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
    function (
        declare, lang, dom, on,
        Graphic,
        Circle,
        Polyline,
        SimpleMarkerSymbol,
        SimpleFillSymbol,
        SimpleLineSymbol,
        TextSymbol,
        Font,
        Color,
        geometryEngine
        ) {
        return declare(null, {
            measureUnits: "meters",
            constructor: function(kwArgs){
                lang.mixin(this, kwArgs);
            },
            sayHello: function () {
                console.log("Hello there!");
            },
            drawCircleWithMeasurement: function () {
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
                    if (circleMeasure) {
                        map.graphics.add(drawCircle);
                        map.graphics.add(radiusLine);
                        map.graphics.add(radiusText);
                        centerPt = evt;
                    }
                });


                //onDrag, calculate distance between currentPoint and centerPt     
                map.on("mouse-drag", function (evt) {
                    if (circleMeasure) {
                        var pl = new Polyline(map.spatialReference);
                        pl.addPath([centerPt.mapPoint, evt.mapPoint]);
                        var radius = geometryEngine.geodesicLength(pl, measureUnits);
                        var circle = new Circle({ center: centerPt.mapPoint, radius: radius, geodesic: true, spatialReference: map.spatialReference });
                        drawCircle.setGeometry(circle);
                        radiusLine.setGeometry(pl);
                        ts.setText("Radius: " + radius.toFixed(1) + " " + measureUnits);
                        radiusText.setGeometry(centerPt.mapPoint);
                        //console.log("radius is:" + radius);
                    }
                });
            }
        })
    })
