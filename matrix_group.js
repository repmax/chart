const spec = {
  "$schema": "https://vega.github.io/schema/vega/v4.json",
  "width": 770,
  "height": 770,
  "padding": 2,
  "signals": [
    {
      "name": "cellSize",
      "value": 30,
      "bind": {
        "name": "MATRIX SIZE",
        "input": "range",
        "min": 15,
        "max": 50,
        "step": 1
      }
    },
    {"name": "maxCircle", "update": "(cellSize-6)*(cellSize-6)"},
    {"name": "cellSizeHalf", "update": "cellSize/2"},
    {"name": "fontScale", "update": "toNumber(cellSize/2)+2"},
    {"name": "count", "update": "length(data('nodes'))"},
    {"name": "width", "update": "span(range('position'))"},
    {"name": "height", "update": "width"}
  ],
  "data": [
    {
      "name": "groupColor",
      "url": "https://raw.githubusercontent.com/repmax/launchpad/master/tmp/hierarchy_all.json",
      "format": {"type": "json", "property": "groupColor"}
}, 
    {
      "name": "nodes",
      "url": "https://raw.githubusercontent.com/repmax/launchpad/master/tmp/hierarchy_all.json",
      "format": {"type": "json", "property": "nodes"},
      "transform": [
        {
          "type": "lookup",
          "from": "groupColor",
          "key": "group",
          "fields": ["group"],
          "as": ["colorPointer"]
        },
        {"type": "formula", "as": "score", "expr": "datum.index"},
        {
          "type": "window",
          "sort": {"field": "score"},
          "ops": ["row_number"],
          "as": ["order"]
        }
      ]
    },
    {
      "name": "edges",
      "url": "https://raw.githubusercontent.com/repmax/launchpad/master/tmp/hierarchy_all.json",
      "format": {"type": "json", "property": "edges"},
      "transform": [
        {
          "type": "lookup",
          "from": "nodes",
          "key": "index",
          "fields": ["source", "target"],
          "as": ["sourceNode", "targetNode"]
        }
      ]
    },
    {"name": "cross", "source": "nodes", "transform": [{"type": "cross"}]}
  ],
  "scales": [
    {
      "name": "position",
      "type": "band",
      "domain": {"data": "nodes", "field": "order", "sort": true},
      "range": {"step": {"signal": "cellSize"}}
    },
    {
      "name": "color2",
      "type": "sequential",
      "domain": {"data": "edges", "field": "value"},
      "range": {"scheme": "greys"},
      "nice": false,
      "reverse": true,
      "zero": true
    },
    {
      "name": "sizeScale",
      "type": "linear",
      "zero": false,
      "domain": {"data": "edges", "field": "size"},
      "range": [0, {"signal": "maxCircle"}]
    }
  ],
  "marks": [
    {
      "type": "rect",
      "from": {"data": "cross"},
      "encode": {
        "update": {
          "x": {"scale": "position", "field": "a.order"},
          "y": {"scale": "position", "field": "b.order"},
          "width": {"scale": "position", "band": 1, "offset": -1},
          "height": {"scale": "position", "band": 1, "offset": -1},
          "strokeWidth": {"value": 1},
          "strokeOpacity": [
            {"test": "datum.a.group !== datum.b.group", "value": 0},
            {"value": 1}
          ],
          "stroke": [
            {"test": "datum.a.group !== datum.b.group", "value": "#777"},
            {"field":"a.colorPointer.color"}
          ],          
          "fill": [
            {"test": "datum.a.group !== datum.b.group", "value": "#555"},
            {"value": "#444"}
          ]
        }
      }
    },
    {
      "type": "symbol",
      "style": ["point"],
      "from": {"data": "edges"},
      "encode": {
        "update": {
          "x": {
            "scale": "position",
            "field": "targetNode.order",
            "offset": {"signal": "cellSizeHalf"}
          },
          "y": {
            "scale": "position",
            "field": "sourceNode.order",
            "offset": {"signal": "cellSizeHalf"}
          },
          "stroke": {"value": "#aaa"},
          "strokeWidth": {"value": 1},
          "fill": {"scale": "color2", "field": "value"},
          "size": {"scale": "sizeScale", "field": "size"},
          "tooltip": {"field": "value", "type": "quantitative"}
        }
      }
    },
    {
      "type": "symbol",
      "style": ["point"],
      "from": {"data": "edges"},
      "encode": {
        "update": {
          "x": {
            "scale": "position",
            "field": "sourceNode.order",
            "offset": {"signal": "cellSizeHalf"}
          },
          "y": {
            "scale": "position",
            "field": "targetNode.order",
            "offset": {"signal": "cellSizeHalf"}
          },
          "stroke": {"value": "#aaa"},
          "strokeWidth": {"value": 1},
          "fill": {"scale": "color2", "field": "value"},
          "size": {"scale": "sizeScale", "field": "size"},
          "tooltip": {"field": "value", "type": "quantitative"}
        }
      }
    },
    {
      "type": "text",
      "name": "columns",
      "from": {"data": "nodes"},
      "encode": {
        "update": {
          "x": {"scale": "position", "field": "order", "band": 0.5},
          "y": {"offset": -6},
          "text": {"field": "name"},
          "fontSize": {"signal": "fontScale"},
          "fontWeight": {"value": "normal"},
          "angle": {"value": -90},
          "align": {"value": "left"},
          "baseline": {"value": "middle"},
          "fill": {"field": "colorPointer.color"}
        }
      }
    },
    {
      "type": "text",
      "name": "rows",
      "from": {"data": "nodes"},
      "encode": {
        "update": {
          "x": {"offset": -6},
          "y": {"scale": "position", "field": "order", "band": 0.5},
          "text": {"field": "name"},
          "fontSize": {"signal": "fontScale"},
          "fontWeight": {"value": "normal"},
          "align": {"value": "right"},
          "baseline": {"value": "middle"},
          "fill": {"field": "colorPointer.color"}
        }
      }
    }
  ],
  "legends": [
    {
      "orient": "none",
      "encode": {
        "legend": {
          "update": {
          	"x": {"signal": "width", "offset": 20}, 
          	"y": {"value": 0}
         	}
        }
      },
      "fill": "color2",
      "title": "Links",
      "type": "gradient",
      "titleFontSize": 12,
      "gradientLength": {"signal": "height - 20"}
    },
    {
      "orient": "none",     
      "size": "sizeScale",
      "title": "Volume",
      "format": "s",
      "encode": {
        "symbols": {
          "update": {
            "strokeWidth": {"value": 2},
            "stroke": {"value": "#666"},
            "shape": {"value": "circle"}
          }
        },
        "legend": {
          "update": {
          	"x": {"signal": "width", "offset": 70}, 
          	"y": {"value": 0}
         	}
        }
      }
    }
  ]
}

draw = function () { 
  vegaEmbed('#vis', spec, {renderer: "svg"});
}