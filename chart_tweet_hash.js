const spec = {
  "$schema": "https://vega.github.io/schema/vega/v4.json",
  "width": 710,
  "height": 400,
  "padding": 15,
  "myList": [
          "basis",
          "cardinal",
          "catmull-rom",
          "linear",
          "monotone",
          "natural",
          "step",
          "step-after",
          "step-before"
        ],

  "signals": [
    {
      "name": "selected", "value": "tb",
      "bind": {"name": "Topic", "input": "radio", "options":   ["tb","endtb","treatment","research","antibiotic","amr","innovation","mdrtb","unhlmtb","hiv","india","health","aids2018","southafrica","vaccine","malaria","vih","diabetes"]}
    },
    {
      "name": "norm", "value": "self",
      "bind": {"name": "Scale","input": "radio", "options": ["self","peers"]}
    },
    {
      "name": "cutOff", "value": 0,
      "bind": {"name": "Min. favorites","input": "range", "min": 0, "max": 200, "step": 1}
    },
    {
      "name": "interpolate", "value": "basis",
      "bind": {"name":"Style", "input": "radio", "options": [
          "basis",
          "linear",
          "monotone",
          "natural",
          "step"
        ]
      }
    }
  ],
  "data": [
    {
      "name": "steamData",
      "format": {"type": "tsv", "parse": {"pioneer":"number","infirm":"number","retweet":"number","exclude":"number", "week": "number"}},
      "url": "https://raw.githubusercontent.com/repmax/launchpad/master/tb_tweet_steam_v2.tsv",
      "transform": [
        {"type": "formula", "expr": "datum.pioneer", "as": "count"},
        {"type": "formula", "expr": "datum.count+datum.infirm", "as": "count2"},
        {"type": "formula", "expr": "datum.count2+datum.retweet", "as": "count3"},
        {"type": "formula", "expr": "datum.count3+datum.exclude", "as": "total"},
        { "type": "collect", "sort": {"field": ["label", "week"]}}
    ]
    },
    {
      "name": "rangeAxisY",
      "source": "steamData",
      "transform": [
        {"type": "filter", "expr": "norm == 'self' ? datum.label == selected : datum.label == 'tb'"}
      ]
    },
    {
      "name": "rangeAxisX",
      "source": "steamData",
      "transform": [
        {"type": "filter", "expr": "datum.label == 'tb'"}
      ]
    },
    {
      "name": "filterSteam",
      "source": "steamData",
      "transform": [
        {"type": "filter", "expr": "datum.label == selected"}
      ]
    },
    {
      "name": "topData",
      "format": {"type": "tsv", "parse": {"week": "number", "retweet_count":"number", "quoA":"number", "quoB":"number","repA":"number", "repB":"number", "favorite_count":"number"}},
      "url": "https://raw.githubusercontent.com/repmax/launchpad/master/tb_tweet_top_v2.tsv",
       "transform": [
        {"type": "formula", "expr": "datum.retweet_count", "as": "interaction"},
        {"type": "formula", "expr": "'https://twitter.com/statuses' + datum.tid", "as": "url"}
    ]
    },
    {
      "name": "extentAxisZ",
      "source": "topData",      
      "transform": [
        {"type": "filter","expr": "norm == 'self' ? (datum.label == selected) && (datum.interaction >= cutOff) : (datum.label == 'tb') && (datum.interaction >= cutOff)"       },
        {"type": "aggregate", "fields": ["interaction","interaction"], "ops":["max","min"], "as":["maxValue","minValue"]},
        {"type": "formula","expr": "[substring('10000000',0,length(toString(floor(datum.minValue*0.95)))), datum.maxValue*1.2]","as":"extent"},
        {"type": "flatten", "fields": ["extent"]}   
      ]
    },
    {
      "name": "filterTop",
      "source": "topData",
      "transform": [
        {"type": "filter", "expr": "(datum.label == selected) && (datum.interaction >= cutOff)"}
      ]
    }
  ],

  "scales": [
    {
      "name": "x",
      "type": "linear",
      "zero" : false,
      "domain": {"data": "rangeAxisX", "field": "week"},
      "range": "width"
    },
    {
      "name": "y",
      "type": "linear",
      "range": "height",
      "nice": true,
      "zero": true,
      "domain": {"data": "rangeAxisY", "field": "total"}
    },
    {
      "name": "z",
      "type": "log",
      "range": "height",
      "domain": {"data": "extentAxisZ", "field": "extent"}
    }
  ],
  "config": {
    "axisRight": {
      "domain": true,
      "domainColor": "#9999eb",
      "domainWidth": 3,
      "tickWidth": 2
    },
      "axisY": {
      "domain": true,
      "domainColor": "#00bdbd",
      "domainWidth": 3,
      "tickWidth": 2,
      "titleFontSize": 15
    },
      "axisX": {
      "domain": true,
      "domainWidth": 2,
      "tickWidth": 2
    }
  },
  "axes": [
    {"orient": "bottom",
     "scale": "x",
     "grid": true,
     "ticks": true,
     "offset": 15,
     "title": "WEEK 2018",
     "tickCount":15,
     "titlePadding": 10,
     "titleFontSize": 13,
     "titleFontWeight": 100
    },
    {"orient": "left",
     "scale": "y",
      "offset": 35,
      "title": "ACTIVITY",
      "titlePadding": 5,
      "titleFontSize": 13,
      "titleFontWeight": 100
    },
    {
      "orient": "right",
      "scale": "z",
      "title": "RETWEETS",
      "offset": 50,
      "titlePadding": 5,
      "titleFontSize": 13,
      "titleFontWeight": 100
    }
  ],
  "marks": [
    {
      "type": "area",
      "from": {"data": "filterSteam"},
      "encode": {
        "enter": {
          "x": {"scale": "x", "field": "week"},
          "y": {"scale": "y", "field": "count"},
          "y2": {"scale": "y", "value": 0},
          "stroke": {"value": "#ffcc99"},
          "strokeWidth": {"value": 0},
          "strokeOpacity": {"value": 0.8},
          "fill": {"value": "#6c9393"},
          "fillOpacity": {"value": 0.25},
          "interpolate": {"signal": "interpolate"}
        },
        "update": {
          "interpolate": {"signal": "interpolate"}
        }
      }
    },
    {
      "type": "area",
      "from": {"data": "filterSteam"},
      "encode": {
        "enter": {
          "x": {"scale": "x", "field": "week"},
          "y": {"scale": "y", "field": "count2"},
          "y2": {"scale": "y", "field": "count"},
          "stroke": {"value": "#00cc99"},
          "strokeWidth": {"value": 0},
          "strokeOpacity": {"value": 0.5},
          "fill": {"value": "#009988"},
          "fillOpacity": {"value": 0.5},
          "interpolate": {"signal": "interpolate"}
        },
        "update": {
          "interpolate": {"signal": "interpolate"}
        }
      }
    },
    {
      "type": "area",
      "from": {"data": "filterSteam"},
      "encode": {
        "enter": {
          "x": {"scale": "x", "field": "week"},
          "y": {"scale": "y", "field": "count3"},
          "y2": {"scale": "y", "field": "count2"},
          "stroke": {"value": "#00cc99"},
          "strokeWidth": {"value": 0},
          "strokeOpacity": {"value": 0.8},
          "fill": {"value": "#609f9f"},
          "fillOpacity": {"value": 0.18},
          "interpolate": {"signal": "interpolate"}
        },
        "update": {
          "interpolate": {"signal": "interpolate"}
        }
      }
    },
    {
      "type": "area",
      "from": {"data": "filterSteam"},
      "encode": {
        "enter": {
          "x": {"scale": "x", "field": "week"},
          "y": {"scale": "y", "field": "total"},
          "y2": {"scale": "y", "field": "count3" },
          "stroke": {"value": "#a6dba0"},
          "strokeWidth": {"value": 0},
          "strokeOpacity": {"value": 0.5},
          "fill": {"value": "#00bb99"},
          "fillOpacity": {"value": 0.3},
          "interpolate": {"signal": "interpolate"}
        },
        "update": {
          "interpolate": {"signal": "interpolate"}
        }
      }
    },
    {
      "name": "marks",
      "type": "symbol",
      "from": {"data": "filterTop"},
      "encode": {
        "enter": {
          "x": {"scale": "x", "field": "week"},
          "y": {"scale": "z", "field": "interaction"},
          "shape": {"value": "circle"},
          "strokeWidth": {"value": 2},
          "opacity": {"value": 0.8},
          "stroke": {"value": "#7777eb"},
          "fill": {"value": "transparent"}
        },
        "update": {
          "y": {"scale": "z", "field": "interaction"}
        }
      }
    },
    {
      "type": "text",
      "from": {"data": "filterTop"},
      "encode": {
        "enter": {
          "x": {"scale": "x", "field": "week"},
          "y": {"scale": "z", "field": "interaction"},
          "dx":   {"value":10},
          "align": {"value": "left"},
          "baseline":  {"value":"middle"},
          "fill": {"value": "#000"},
          "text": {"field": "screen_name", "type": "text"},
          "fontColor": {"value":"#666666"},
          "font":   {"value":"monospace"},
          "fontSize": {"value":12},
          "href": {"field":"url", "type":"nominal"}
        },
        "update": {
          "y": {"scale": "z", "field": "interaction"},
          "opacity": {"value": 1},
          "tooltip": {"signal": "{title: datum.screen_name, 'Tweet': datum.text ,'Impact': datum.interaction, 'Quotes': datum.quoA+datum.quoB, 'Replies': datum.repA+datum.repB,'Retweets': datum.retB, 'Off. retweets': datum.retweet_count, 'Off. favorites': datum.favorite_count, 'TwitterID': datum.tid}"}
        },
        "hover": {
          "opacity": {"value": 0.5}
        }
      }
    }
  ]
}


draw = function () { 
  vegaEmbed('#vis', spec, {
    renderer: "svg",
    loader: vega.loader({target: '_blank'})
});
}
