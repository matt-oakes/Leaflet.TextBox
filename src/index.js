/*
 * Leaflet.TextBox - Shows text inside a box
 * Based on Makina Corpus Leaflet.TextPath library:
 * https://github.com/makinacorpus/Leaflet.TextPath
 * Which was inspired by Tom Mac Wright article :
 * http://mapbox.com/osmdev/2012/11/20/getting-serious-about-svg/
 */

(function () {

var __onAdd = L.Rectangle.prototype.onAdd,
    __onRemove = L.Rectangle.prototype.onRemove,
    __updatePath = L.Rectangle.prototype._updatePath,
    __bringToFront = L.Rectangle.prototype.bringToFront;


var TextBox = {

    onAdd: function (map) {
        __onAdd.call(this, map);
        this._textRedraw();
    },

    onRemove: function (map) {
        map = map || this._map;
        if (map && this._textNode)
            map._pathRoot.removeChild(this._textNode);
        __onRemove.call(this, map);
    },

    bringToFront: function () {
        __bringToFront.call(this);
        this._textRedraw();
    },

    _updatePath: function () {
        __updatePath.call(this);
        this._textRedraw();
    },

    _textRedraw: function () {
        var text = this._text,
            options = this._textOptions;
        if (text) {
            this.setText(null).setText(text, options);
        }
    },

    setText: function (text, options) {
        this._text = text;
        this._textOptions = options;

        /* If not in SVG mode or Rectangle not added to map yet return */
        /* setText will be called by onAdd, using value stored in this._text */
        if (!L.Browser.svg || typeof this._map === 'undefined') {
          return this;
        }

        var defaults = {
            repeat: false,
            fillColor: 'black',
            attributes: {},
            below: false,
        };
        options = L.Util.extend(defaults, options);

        var svg = this._map.getRenderer(this)._container;

        /* If empty text, hide */
        if (!text) {
            if (this._textNode && this._textNode.parentNode) {
                svg.removeChild(this._textNode);

                /* delete the node, so it will not be removed a 2nd time if the layer is later removed from the map */
                delete this._textNode;
            }
            return this;
        }

        text = text.replace(/ /g, '\u00A0');  // Non breakable spaces
        var id = 'pathdef-' + L.Util.stamp(this);
        this._path.setAttribute('id', id);

        /* Put it along the path using textPath */
        var textNode = L.SVG.create('text');

        textNode.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", '#' + id);
        for (var attr in options.attributes) {
            textNode.setAttribute(attr, options.attributes[attr]);
        }
        var northWest = this.getBounds().getNorthWest();
        var point = this._map.latLngToLayerPoint(northWest);
        console.log(northWest);
        console.log(point);
        textNode.setAttribute('x', point.x);
        textNode.setAttribute('y', point.y);
        textNode.appendChild(document.createTextNode(text));
        this._textNode = textNode;

        svg.appendChild(textNode);

        /* Initialize mouse events for the additional nodes */
        if (this.options.clickable) {
            if (L.Browser.svg || !L.Browser.vml) {
                textPath.setAttribute('class', 'leaflet-clickable');
            }

            L.DomEvent.on(textNode, 'click', this._onMouseClick, this);

            var events = ['dblclick', 'mousedown', 'mouseover',
                          'mouseout', 'mousemove', 'contextmenu'];
            for (var i = 0; i < events.length; i++) {
                L.DomEvent.on(textNode, events[i], this._fireMouseEvent, this);
            }
        }

        return this;
    }
};

L.Rectangle.include(TextBox);

L.LayerGroup.include({
    setText: function(text, options) {
        for (var layer in this._layers) {
            if (typeof this._layers[layer].setText === 'function') {
                this._layers[layer].setText(text, options);
            }
        }
        return this;
    }
});

})();
