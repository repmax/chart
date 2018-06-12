const spec = 	{
  "$schema": "https://vega.github.io/schema/vega/v3.0.json",
  "autosize": "pad",
  "padding": 5,
  "style": "cell",
  "signals": [
    {
      "name": "currentTid",
      "value": "t0",
      "bind": {
        "name": "Topic:",
        "input": "radio",
        "options": [
          "t0",
          "t1",
          "t2",
          "t3",
          "t5",
          "t6",
          "t1_s0",
          "t1_s2",
          "t1_s5",
          "t1_s6",
          "t5_s2",
          "t5_s3",
          "t5_s5"
        ]
      }
    },
    {"name": "x_step", "value": 20},
    {
      "name": "width",
      "update": "bandspace(domain('x').length, 0.1, 0.05) * x_step"
    },
    {"name": "y_step", "value": 20},
    {
      "name": "height",
      "update": "bandspace(domain('y').length, 0.1, 0.05) * y_step"
    }
  ],
  "data": [
    {
      "name": "source_raw",
      "url": "https://raw.githubusercontent.com/repmax/launchpad/master/community-topic.tsv",
      "format": {
        "type": "tsv",
        "parse": {"activity": "number", "year": "string"}
      }
    },
    {
      "name": "source_scale",
      "source": "source_raw",
      "transform": [{"type": "filter", "expr": "datum.id_top == currentTid"}]
    }
  ],
  "marks": [
    {
      "name": "marks",
      "type": "rect",
      "style": ["rect"],
      "from": {"data": "source_scale"},
      "encode": {
        "update": {
          "fill": {"scale": "color", "field": "activity"},
          "x": {"scale": "x", "field": "year"},
          "width": {"scale": "x", "band": true},
          "y": {"scale": "y", "field": "community"},
          "height": {"scale": "y", "band": true}
        }
      }
    }
  ],
  "scales": [
    {
      "name": "x",
      "type": "band",
      "domain": [
        1995,
        1996,
        1997,
        1998,
        1999,
        2000,
        2001,
        2002,
        2003,
        2004,
        2005,
        2006,
        2007,
        2008,
        2009,
        2010,
        2011,
        2012,
        2013,
        2014,
        2015,
        2016,
        2017
      ],
      "range": {"step": {"signal": "x_step"}},
      "paddingInner": 0.1,
      "paddingOuter": 0.05
    },
    {
      "name": "y",
      "type": "band",
      "domain": [
        "27",
        "139",
        "12",
        "41",
        "126",
        "24",
        "91",
        "106",
        "75",
        "8",
        "64",
        "145",
        "17",
        "40",
        "127"
      ],
      "range": {"step": {"signal": "y_step"}},
      "paddingInner": 0.1,
      "paddingOuter": 0.05
    },
    {
      "name": "color",
      "type": "sequential",
      "range": {"scheme": "YellowOrangeRed"},
      "domain": {"data": "source_scale", "field": "activity"},
      "nice": false,
      "zero": true
    }
  ],
  "axes": [
    {
      "scale": "x",
      "orient": "bottom",
      "title": "year",
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
    {"scale": "y", "orient": "left", "title": "author community", "zindex": 1}
  ],
  "legends": [
    {
      "orient": "right",
      "offset": 10,
      "fill": "color",
      "title": "activity",
      "type": "gradient"
    }
  ],
  "config": {"axisY": {"minExtent": 30}}
}
draw = function () { 
  vegaEmbed('#vis', spec, {renderer: "svg"});
}
