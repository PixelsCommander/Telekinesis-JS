(function (w) {
    var GameField = function () {

    }

    var p = GameField.prototype = new DisplayList();
    p.columns = 16;
    p.rows = 16;

    p.init = function (asset) {
        for (var col = 0; col < this.columns; col++){
            for (var row = 0; row < this.rows; row++){
                var tile = new DisplayObject();
                this.addChild(tile);
                tile.setImage(asset);
                tile.x = tile._height * col;
                tile.y = tile._width * row;

            }
        }
    }

    w.GameField = GameField;
})(window || global);