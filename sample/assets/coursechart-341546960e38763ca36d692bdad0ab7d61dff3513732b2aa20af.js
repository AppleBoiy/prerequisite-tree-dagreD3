var OPACITY_DURATION = 500, DEFAULT_HEIGHT = 700, generateChart = function (t, e, r) {
    var o = [], n = [], i = {}, a = [], d = {}, s = 0, c = DEFAULT_HEIGHT, u = e.parent().width(), l = 30, p = 6 * l;
    e = e[0];
    var f, h = function (t) {
        a.indexOf(t.type_id) < 0 && a.push(t.type_id), s = t.depth > s ? t.depth : s, t.bias_x !== undefined && null !== t.bias_x || (t.bias_x = 0), t.bias_y !== undefined && null !== t.bias_y || (t.bias_y = 0), t.link !== undefined && null !== t.link || (t.link = "/"), prereq = t.prereqs, prereq !== undefined && null !== prereq || (prereq = []), newclass = {
            id: t.id,
            name: t.name.toUpperCase(),
            type: t.type_id,
            radius: l,
            depth: t.depth,
            prereqs: t.prereqs,
            link: t.link,
            bias_x: t.bias_x,
            bias_y: t.bias_y,
            y: t.startY,
            x: t.startX
        }, o.push(newclass), i[t.id] = newclass
    };
    2 == r ? f = t.cs_courses : 1 == r && (f = t.ee_courses);
    for (var x = 0; x < f.length; x++) h(f[x]);
    o.forEach(function (e) {
        console.log("(" + e.x + ", " + e.y + ")"), e.prereqs.forEach(function (t) {
            i[t.prereq_id] !== undefined && n.push({source: i[t.prereq_id], target: e, recommended: t.is_recommended})
        })
    }), a.forEach(function (e) {
        d[e] = t.types.filter(function (t) {
            return t.id == e
        })[0]
    });
    var y = d3.select(e).append("svg").attr("height", c).attr("width", u),
        g = d3.layout.force().nodes(o).charge(-450).linkDistance(function (t) {
            return t.source.type == t.target.type ? 50 : 300
        }).alpha(.01).size([u, c]), m = function (t) {
            var e = "edge";
            return t.recommended ? e += " recommended" : e += " required", e
        }, _ = function (e) {
            T.attr("class", function (t) {
                if (t.type == e.id) return "course highlight"
            })
        }, v = function (r) {
            var n = [], a = [], e = function (t) {
                n.push(t.id), t.prereqs.forEach(function (t) {
                    e(i[t.prereq_id])
                })
            };
            e(r), o.forEach(function (e) {
                e.prereqs.forEach(function (t) {
                    t.prereq_id == r.id && a.push(e.id)
                })
            }), k.attr("class", function (t) {
                var e = m(t);
                return -1 < n.indexOf(t.target.id) && (e += " prereq"), (-1 < n.indexOf(t.target.id) || -1 < a.indexOf(t.target.id) && t.source.id == r.id) && (e += " highlight"), -1 < a.indexOf(t.target.id) && t.source.id == r.id && (e += " post"), e
            }), k.transition().attr("opacity", function (t) {
                return -1 < n.indexOf(t.target.id) || -1 < a.indexOf(t.target.id) && t.source.id == r.id ? 1 : .2
            }).duration(OPACITY_DURATION), T.attr("class", function (t) {
                var e = "course";
                return (-1 < n.indexOf(t.id) || -1 < a.indexOf(t.id)) && (e += " highlight"), (-1 < n.indexOf(t.id) || -1 < a.indexOf(t.id)) && (e += " prereq"), e
            }), T.transition().attr("opacity", function (t) {
                return -1 < n.indexOf(t.id) || -1 < a.indexOf(t.id) ? 1 : .2
            }).duration(OPACITY_DURATION), I.transition().attr("opacity", function (t) {
                return -1 < n.indexOf(t.id) || -1 < a.indexOf(t.id) ? 1 : .2
            }).duration(OPACITY_DURATION)
        }, O = function () {
            k.transition().attr("opacity", 1).duration(OPACITY_DURATION), k.attr("class", m), I.transition().attr("opacity", 1).duration(OPACITY_DURATION), T.attr("class", "course"), T.transition().attr("opacity", 1).duration(OPACITY_DURATION)
        }, A = function (t) {
            d3.event.defaultPrevented || window.open(t.link, "_blank")
        }, k = y.selectAll("line").data(n).enter().append("line").attr("class", m).attr("marker-end", "url(#end)");
    y.append("svg:defs").selectAll("marker").data(["end"]).enter().append("svg:marker").attr("id", String).attr("viewBox", "0 -5 10 10").attr("refX", 0).attr("refY", 0).attr("markerWidth", 8).attr("markerHeight", 8).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto").append("svg:path").attr("d", "M0,-5L10,0L0,5");
    var q = y.selectAll("g.nodes").data(o).enter().append("g").attr("class", "nodes").on("mouseover", v).on("mouseleave", O).on("click", A),
        T = q.append("circle").attr("r", l).attr("class", "course").attr("opacity", 1).attr("id", function (t) {
            return t.name
        }).style("fill", function (t) {
            return d[t.type].color
        }), I = q.append("text").attr("class", "courseNames").attr("id", function (t) {
            return t.name
        }).attr("text-anchor", "middle").text(function (t) {
            return t.name
        }), b = [];
    a.forEach(function (t, e) {
        b.push({id: t, name: d[t].name, index: e, color: d[t].color})
    });
    y.selectAll("circle.colorLegend").data(b).enter().append("circle").attr("class", "colorLegend").attr("cx", function (t) {
        return (u - 3 * l) * t.index / (b.length - 1) + l
    }).attr("cy", l + 5).attr("r", l).on("mouseover", _).on("mouseout", O).style("fill", function (t) {
        return t.color
    }), y.selectAll("text.textLegend").data(b).enter().append("text").attr("class", "legendText").attr("x", function (t) {
        return (u - 3 * l) * t.index / (b.length - 1) + l
    }).attr("y", 3 * l).attr("text-anchor", "middle").text(function (t) {
        return t.name
    }), y.selectAll("g.arrowLegend").data([{name: "Recommended", "stroke-dasharray": "5, 5"}, {
        name: "Required",
        "stroke-dasharray": null
    }]).enter().append("g").attr("x", u - 100).attr("y", 25).attr("height", 50).attr("width", 100).each(function (t, e) {
        var r = d3.select(this);
        r.append("text").attr("class", "legendText").attr("x", u - 80).attr("y", c - 25 * e).attr("text-anchor", "end").text(t.name), r.append("line").attr("class", "highlight").style("stroke-dasharray", t["stroke-dasharray"]).attr("x1", u - 70).attr("y1", c - 25 * e - 4).attr("x2", u - 30).attr("y2", c - 25 * e - 4).attr("marker-end", "url(#end)")
    });
    g.on("tick", function (t) {
        k.each(function (t) {
            var e = t.source.x, r = t.source.y, n = t.target.x, a = t.target.y,
                i = Math.atan(Math.abs((a - r) / (n - e)));
            n += (e < n ? -1 : 1) * (l + 9) * Math.cos(i), a += (r < a ? -1 : 1) * (l + 9) * Math.sin(i), d3.select(this).attr({
                x1: e,
                y1: r,
                x2: n,
                y2: a
            })
        });
        var a = .1 * t.alpha;
        o.forEach(function (t) {
            var e = c - p - 2 * l, r = 0, n = 0;
            n += u * d[t.type].chart_pref_x, r += e * d[t.type].chart_pref_y, r += (t.depth - 1) * e / (s - 1), n += t.bias_x, r += t.bias_y, r += p + 2 * l, t.y += (r - t.y) * a, t.x += (n - t.x) * a, T.attr("cx", function (t) {
                return t.x
            }).attr("cy", function (t) {
                return t.y
            }), I.attr("transform", function (t) {
                return "translate(" + t.x + "," + t.y + ")"
            })
        });
        for (var e = function (c) {
            var t = c.radius + 16;
            return nx1 = c.x - t, nx2 = c.x + t, ny1 = c.y - t, ny2 = c.y + t, function (t, e, r, n, a) {
                if (t.point && t.point !== c) {
                    var i = c.x - t.point.x, o = c.y - t.point.y, d = Math.sqrt(i * i + o * o),
                        s = c.radius + t.point.radius;
                    d < s && (d = (d - s) / d * .5, c.x -= i *= d, c.y -= o *= d, t.point.x += i, t.point.y += o)
                }
                return e > nx2 || n < nx1 || r > ny2 || a < ny1
            }
        }, r = d3.geom.quadtree(o), n = 0, i = o.length; ++n < i;) r.visit(e(o[n]));
        y.selectAll("circle.course").attr("cx", function (t) {
            return t.x
        }).attr("cy", function (t) {
            return t.y
        })
    });
    var E = !1;
    g.on("end", function () {
        E = !0, g.stop();
        var r = [];
        o.forEach(function (t) {
            var e = {id: t.id, startX: t.x, startY: t.y};
            r.push(e)
        }), console.log(r), jQuery.ajax("/courseguides/chart_pos_update", {
            data: {data: r},
            method: "POST",
            success: function (t) {
                console.log(t)
            }
        })
    }), g.on("start", function () {
        for (; !E;) {
            var e = 10;
            requestAnimationFrame(function r() {
                for (var t = 0; t < e; t++) g.tick();
                0 < g.alpha() && requestAnimationFrame(r)
            })
        }
    }), g.start()
};