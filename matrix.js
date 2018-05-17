const spec = {
  "$schema": "https://vega.github.io/schema/vega/v3.0.json",
  "autosize": "pad",
  "padding": 5,
  "style": "cell",
  "signals": [
      {
      "name": "currentTid", "value": ["t0","t1","t2","t3","t5","t6"],
      "bind": {"name": "Topic groups:", "input": "radio", "options":  [
          ["t0","t1","t2","t3","t5","t6"],
          ["t1_s0","t1_s2","t1_s5","t1_s6"],
          ["t5_s2","t5_s3","t5_s5"]
        ]}
      },
    {"name": "x_step", "value": 12},
    {
      "name": "width",
      "update": "bandspace(domain('x').length, 0.1, 0.05) * x_step"
    },
    {"name": "y_step", "value": 15},
    {
      "name": "height",
      "update": "bandspace(domain('y').length, 0.1, 0.05) * y_step"
    }
  ],  
  "data": [
    {
      "name": "source_in",
      "url": "https://raw.githubusercontent.com/repmax/launchpad/master/heat_topic.csv",
      "format": {
        "type": "csv",
        "parse": {"normal": "number"},
        "delimiter": ","
      },
      "transform": [
        {"type": "filter", "expr": "0 <= indexof(currentTid, datum.id_top)"},
        {"type": "formula", "as": "log_normal", "expr": "log(datum.normal)"}
      ]
    }
  ],
  "marks": [
    {
      "name": "marks",
      "type": "rect",
      "style": ["rect"],
      "from": {"data": "source_in"},
      "encode": {
        "update": {
          "fill": {"scale": "color", "field": "log_normal"},
          "x": {"scale": "x", "field": "keyword"},
          "width": {"scale": "x", "band": true},
          "y": {"scale": "y", "field": "topic"},
          "height": {"scale": "y", "band": true}
        }
      }
    }
  ],
  "scales": [
    {
      "name": "x",
      "type": "band",
      "domain": {"data": "source_in", "field": "keyword", "sort": false},
      "range": {"step": {"signal": "x_step"}},
      "paddingInner": 0.1,
      "paddingOuter": 0.05
    },
    {
      "name": "y",
      "type": "band",
      "domain": {"data": "source_in", "field": "topic", "sort": false},
      "range": {"step": {"signal": "y_step"}},
      "paddingInner": 0.1,
      "paddingOuter": 0.05
    },
    {
      "name": "color",
      "type": "sequential",
      "domain": {"data": "source_in", "field": "log_normal"},
      "range": "heatmap",
      "nice": false,
      "zero": false
    }
  ],
  "axes": [
    {
      "scale": "x",
      "orient": "bottom",
      "title": "keyword",
      "labelOverlap": false,
      "encode": {
        "labels": {
          "update": {
            "angle": {"value": 310},
            "align": {"value": "right"},
            "baseline": {"value": "middle"}
          }
        }
      },
      "zindex": 1
    },
    {"scale": "y", "orient": "left", "title": "topic", "zindex": 1}
  ],
  "legends": [{"orient": "right", "offset": 10, "fill": "color", "title": "frequency", "type": "gradient"}],
  "config": {"axisY": {"minExtent": 30}}
}

draw = function () { 
  vegaEmbed('#vis', spec, {renderer: "svg"});
}
