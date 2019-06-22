define([], function (require, factory) {
    'use strict';
    var  VisTool = (function () {
        var radius = 10;
        var positionOffsetX = 25;
        var positionOffsetY = 15;
        var cornerRadius = 10;
        var defaultCornerFill = 'red';
        var params, x, y, nodeId, nodePosition;
        var network;
        var imgs = {};
        var nodes;
        var orgctx;
        var hover;
        return {
            initEvent: function (p, arr) {
                params = p;
                x = params.pointer.canvas.x;
                y = params.pointer.canvas.y;
                nodeId = params.nodes[0];
                nodePosition = network.getPositions([nodeId]);
                nodes = arr;
            },

            handleNorthEastCorner: function (callback) {
                var centerX = nodePosition[nodeId].x + positionOffsetX;
                var centerY = nodePosition[nodeId].y - positionOffsetY;
                var offsetY = centerY - y;
                var offsetX = centerX - x;
                var node = this.getNodeById(params.nodes[0]);
                if (offsetX * offsetX + offsetY * offsetY < radius * radius && node.g && node.g.ne) {
                    callback(params);
                }
            },

            handleNorthWestCorner: function (callback) {
                var centerX = nodePosition[nodeId].x - positionOffsetX;
                var centerY = nodePosition[nodeId].y - positionOffsetY;
                var offsetY = centerY - y;
                var offsetX = centerX - x;
                var node = this.getNodeById(params.nodes[0]);
                if (offsetX * offsetX + offsetY * offsetY < radius * radius && node.g && node.g.nw) {
                    callback(params);
                }
            },

            handleSouthWestCorner: function (callback) {
                var centerX = nodePosition[nodeId].x - positionOffsetX;
                var centerY = nodePosition[nodeId].y + positionOffsetY;
                var offsetY = centerY - y;
                var offsetX = centerX - x;
                var node = this.getNodeById(params.nodes[0]);
                if (offsetX * offsetX + offsetY * offsetY < radius * radius && node.g && node.g.sw) {
                    callback(params);
                }
            },

            handleSouthEastCorner: function (callback) {
                var centerX = nodePosition[nodeId].x + positionOffsetX;
                var centerY = nodePosition[nodeId].y + positionOffsetY;
                var offsetX = centerX - x;
                var offsetY = centerY - y;
                var node = this.getNodeById(params.nodes[0]);
                if (offsetX * offsetX + offsetY * offsetY < radius * radius && node.g && node.g.se) {
                    callback(params);
                }
            },

            drawCorner: function (obj) {
                var posi = network.canvasToDOM({
                    x: obj.x,
                    y: obj.y
                });
                switch (obj.p) {
                    case 'ne':
                        obj.imgInitX = posi.x + positionOffsetX - cornerRadius;
                        obj.imgInitY = posi.y - positionOffsetY - cornerRadius;
                        obj.imgX = obj.x + positionOffsetX - cornerRadius;
                        obj.imgY = obj.y - positionOffsetY - cornerRadius;
                        obj.cornerX = obj.x + positionOffsetX;
                        obj.cornerY = obj.y - positionOffsetY;
                        this.cornerFactory(obj);
                        break;
                    case 'nw':
                        obj.imgInitX = posi.x - positionOffsetX - cornerRadius;
                        obj.imgInitY = posi.y - positionOffsetY - cornerRadius;
                        obj.imgX = obj.x - positionOffsetX - cornerRadius;
                        obj.imgY = obj.y - positionOffsetY - cornerRadius;
                        obj.cornerX = obj.x - positionOffsetX;
                        obj.cornerY = obj.y - positionOffsetY;
                        this.cornerFactory(obj);
                        break;
                    case 'se':
                        obj.imgInitX = posi.x + positionOffsetX - cornerRadius;
                        obj.imgInitY = posi.y + positionOffsetY - cornerRadius;
                        obj.imgX = obj.x + positionOffsetX - cornerRadius;
                        obj.imgY = obj.y + positionOffsetY - cornerRadius;
                        obj.cornerX = obj.x + positionOffsetX;
                        obj.cornerY = obj.y + positionOffsetY;
                        this.cornerFactory(obj);
                        break;
                    case 'sw':
                        obj.imgInitX = posi.x - positionOffsetX - cornerRadius;
                        obj.imgInitY = posi.y + positionOffsetY - cornerRadius;
                        obj.imgX = obj.x - positionOffsetX - cornerRadius;
                        obj.imgY = obj.y + positionOffsetY - cornerRadius;
                        obj.cornerX = obj.x - positionOffsetX;
                        obj.cornerY = obj.y + positionOffsetY;
                        this.cornerFactory(obj);
                        break;
                    default:
                        break;
                }
            },
            drawBox: function(obj){
                var posi = network.canvasToDOM({
                    x: obj.x,
                    y: obj.y
                });
                  var width = 150;
                  var height = 100;
                  var x = obj.x - 75;
                  var y = obj.y - 40;
                  var radius = 10;
                  obj.ctx.beginPath();
                  obj.ctx.moveTo(x + radius, y);
                  obj.ctx.lineTo(x + width - radius, y);
                  obj.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                  obj.ctx.lineTo(x + width, y + height - radius);
                  obj.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                  obj.ctx.lineTo(x + radius, y + height);
                  obj.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                  obj.ctx.lineTo(x, y + radius);
                  obj.ctx.quadraticCurveTo(x, y, x + radius, y);
                  obj.ctx.closePath();
                  obj.ctx.fillStyle = obj.fillStyle;
                  obj.ctx.globalAlpha = 1;
                  obj.ctx.fill();
            },
            drawProgressBar: function(obj){
                var posi = network.canvasToDOM({
                    x: obj.x,
                    y: obj.y
                });
                var radiusProgress = parseInt(obj.size)+10;
                var circ = Math.PI * 2 ;
                var quart = Math.PI / 2;
                obj.ctx.circle(obj.x, obj.y, radiusProgress);
                obj.ctx.strokeStyle = '#ccc';
                obj.ctx.lineWidth = 6;
                obj.ctx.stroke();
                obj.ctx.beginPath();
                obj.ctx.arc(obj.x, obj.y, radiusProgress, (Math.PI/180) * 270, (Math.PI/180) * (270 + (obj.percent*3.6)));
                obj.ctx.strokeStyle = 'green';
                obj.ctx.lineWidth = '6';
                obj.ctx.stroke();

            },
            cornerFactory: function (obj) {
                var posi = network.canvasToDOM({
                    x: obj.x,
                    y: obj.y
                });
                if (obj.img) {
                    var path = '?id=' + obj.id + '@p=' + obj.p;
                    if (!imgs[obj.img + path]) {
                        var newImage = new Image();
                        newImage.onload = function (a, b) {
                            obj.ctx.drawImage(newImage, obj.imgInitX, obj.imgInitY, 2 * cornerRadius, 2 * cornerRadius);
                        }
                        newImage.src = obj.img;
                        imgs[obj.img + path] = newImage;
                    }
                    else {
                        obj.ctx.drawImage(imgs[obj.img + path], obj.imgX, obj.imgY, 2 * cornerRadius, 2 * cornerRadius);
                    }
                } else {
                    obj.ctx.fillStyle = obj.fillStyle || defaultCornerFill;
                    obj.ctx.circle(obj.cornerX, obj.cornerY, radius);
                    obj.ctx.fill();
                    obj.ctx.strokeStyle = '#000000';
                    obj.ctx.stroke();
                    obj.ctx.textBaseline='middle';
                    obj.ctx.fillStyle = '#000000';
                    obj.ctx.fontSize = '12px';
                    obj.ctx.fillText(obj.fillText,obj.cornerX-8, obj.cornerY);
                }
            },

            nodePreprocess: function (nodeArr, net, ctx) {
                network = net;
                nodeArr.forEach(function (node, index) {
                    if (!node.g) {
                        return;
                    }
                    var nodeId = node.id;
                    var nodePosition = network.getPositions([nodeId]);
                    for (var key in node.g) {
                        if (node.g.hasOwnProperty(key) && nodePosition[nodeId]) {
                            var obj = {
                                p: key,
                                x: nodePosition[nodeId].x,
                                y: nodePosition[nodeId].y,
                                ctx: ctx,
                                network: network,
                                id: node.id
                            };
                            obj = this.mergeObj(obj, node.g[key]);
                            this.drawCorner(obj);
                        }
                    }
                }.bind(this));
            },
            nodeProgressbar: function (node, net, ctx) {
                network = net;
                    var nodeId = node.id;
                    var nodePosition = network.getPositions([nodeId]);
                            var obj = {
                                x: nodePosition[nodeId].x,
                                y: nodePosition[nodeId].y,
                                ctx: ctx,
                                network: network,
                                id: node.id,
                                percent: node.percent,
                                size: node.size
                            };
                            this.drawProgressBar(obj);
            },

            mergeObj: function (obj1, obj2) {
                for (var p in obj2) {
                    if (obj2.hasOwnProperty(p)) {
                        obj1[p] = obj2[p];
                    }
                }
                return obj1;
            },

            getNodeById: function (id) {
                for (var i = 0, len = nodes.length; i < len; i++) {
                    if (nodes[i].id === id) {
                        return nodes[i];
                    }
                }
                return null;
            }
        }
    })();

    return VisTool;
});