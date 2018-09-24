const spec = {
  "$schema": "https://vega.github.io/schema/vega/v4.json",
  "width": 710,
  "height": 400,
  "padding": 5,
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
      "name": "selected", "value": "#mdrtb",
      "bind": {"name": "Topic", "input": "radio", "options":  [
          "#mdrtb",
          "#unhlmtb",
          "#hiv",
          "#india",
          "#health",
          "#aids2018",
          "#southafrica",
          "#vaccine",
          "#malaria",
          "#vih",
          "#diabetes",
          "@StopTB",
          "@paimadhu",
          "@acTBistas",
          "@AIDSPortal",
          "@cns_health",
          "//top-10-copd-conferences-c",
          "all"
        ]}
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
      "format": {"type": "tsv", "parse": {"count":"number", "week": "number"}},
      "url": "https://raw.githubusercontent.com/repmax/launchpad/master/tb_tweet_steam.tsv",
      "transform": [
        { "type": "collect", "sort": {"field": ["label", "week"]}}
    ]
    },
    {
      "name": "rangeAxisY",
      "source": "steamData",
      "transform": [
        {"type": "filter", "expr": "norm == 'self' ? datum.label == selected : datum.label == 'all'"}
      ]
    },
    {
      "name": "rangeAxisX",
      "source": "steamData",
      "transform": [
        {"type": "filter", "expr": "datum.label == 'all'"}
      ]
    },
    {
      "name": "filteredSteam",
      "source": "steamData",
      "transform": [
        {"type": "filter", "expr": "datum.label == selected"}
      ]
    },
    {
      "name": "topData",
      "format": {"type": "tsv", "parse": {"week": "number", "favorite_count":"number", "retweet_count":"number"}},
      "url": "https://raw.githubusercontent.com/repmax/launchpad/master/tb_tweet_top.tsv",
       "transform": [
        {"type": "formula", "expr": "'https://twitter.com/statuses' + datum.tid", "as": "url"}
    ]
    },
    {
      "name": "rangeAxisZ",
      "source": "topData",
      "transform": [
        {"type": "filter", "expr": "norm == 'self' ? datum.label == selected : datum.label == 'all'"}
      ]
    },
    {
      "name": "filteredTop",
      "source": "topData",
      "transform": [
        {"type": "filter", "expr": "(datum.label == selected) && (datum.favorite_count >= cutOff)"}
      ]
    }
  ],

  "scales": [
    {
      "name": "x",
      "type": "linear",
      "nice" : true,
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
      "domain": {"data": "rangeAxisY", "field": "count"}
    },
    {
      "name": "z",
      "type": "linear",
      "range": "height",
      "nice": true,
      "zero": true,
      "domain": {"data": "rangeAxisZ", "field": "favorite_count"}
    }
  ],
  "config": {
    "axisRight": {
      "domain": true,
      "domainColor": "#9942f0",
      "domainWidth": 3,
      "tickWidth": 2
    },
      "axisY": {
      "domain": true,
      "domainColor": "#00cc99",
      "domainWidth": 3,
      "tickWidth": 2,
      "titleFontSize": 15,
      "titleFontWeight": 500
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
     "offset": 10,
     "tickCount":20
    },
    {"orient": "left",
     "scale": "y",
      "offset": 10,
      "title": "Tweets per week",
      "titlePadding": 10
    },
    {
      "orient": "right",
      "scale": "z",
      "title": "Favorite count",
      "offset": 50,
      "titlePadding": 10
    }
  ],
  "marks": [
    {
      "type": "line",
      "from": {"data": "filteredSteam"},
      "encode": {
        "enter": {
          "x": {"scale": "x", "field": "week"},
          "y": {"scale": "y", "field": "count"},
          "stroke": {"value": "#00cc99"},
          "strokeWidth": {"value": 4},
          "strokeOpacity": {"value": 0.8}
        },
        "update": {
          "x": {"scale": "x", "field": "week"},
          "y": {"scale": "y", "field": "count"},
          "interpolate": {"signal": "interpolate"}
        }
      }
    },
    {
      "name": "marks",
      "type": "symbol",
      "from": {"data": "filteredTop"},
      "encode": {
        "enter": {
          "x": {"scale": "x", "field": "week"},
          "y": {"scale": "z", "field": "favorite_count"},
          "shape": {"value": "circle"},
          "strokeWidth": {"value": 2},
          "opacity": {"value": 0.8},
          "stroke": {"value": "#9942f0"},
          "fill": {"value": "transparent"}
        },
        "update": {
          "x": {"scale": "x", "field": "week"},
          "y": {"scale": "z", "field": "favorite_count"}
        }
      }
    },
    {
      "type": "text",
      "from": {"data": "filteredTop"},
      "encode": {
        "enter": {
          "fill": {"value": "#000"},
          "text": {"field": "screen_name", "type": "text"},
          "fontColor": {"value":"#666666"},
          "font":   {"value":"monospace"},
          "fontSize": {"value":12},
          "href": {"field":"url", "type":"nominal"}
        },
        "update": {
          "opacity": {"value": 1},
          "x": {"scale": "x", "field": "week"},
          "y": {"scale": "z", "field": "favorite_count"},
          "tooltip": {"signal": "{title: datum.screen_name, 'Tweet': datum.text , 'Favorites': datum.favorite_count, 'Retweets': datum.retweet_count, 'Week': datum.week, 'TwitterID': datum.tid}"},
          "dx":   {"value":10},
          "align": {"value": "left"},
          "baseline":  {"value":"middle"}
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
