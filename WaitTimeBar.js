(function ( $ ) {
	$.fn.WaitTimeBar = function (options) {
		var _innerDivs = [];
		var _width = "";
		var _height = "";
		var _measurementType = "";
		var _borderRadius = ";"
		var self = this;
		var $elm = $(this);

		$elm.addClass("waittimebar-control");

		options = $.extend({}, $.fn.WaitTimeBar.defaults, options);

		this.setBarItemsWidth = function(items, measurementType) {
			// _innerDivs = [];
			var barItems = items.wtbar;
			var lineItems = items.wtline;
			var totalCount = items.wttotal.value;
			self._getDisplayTime(items, measurementType);

			if(barItems) {
				var smallestNo = barItems[0].value;
				var biggestNo = barItems[0].value;
				var leftoverPercent = 100 - (barItems.length * 10);
				var accumulatedPercent = 100 - (barItems.length * 10)
				var countBiggestNo = 0;
				for(var i = 0; i < barItems.length; i++) {
					//barItems[i].type = "bar";
					barItems[i].width = 10;
					if (barItems[i].value < smallestNo) {
					  smallestNo = barItems[i].value;
					}

					if (barItems[i].value >= biggestNo) {
						if(barItems[i].value == biggestNo) {
							countBiggestNo = countBiggestNo + 1;
						} else {
							countBiggestNo = 1;
						}
						biggestNo = barItems[i].value;
					}
				}

				for(var i = 0; i < barItems.length; i++) {
					if(barItems[i].value != smallestNo) {
						var itemPercent = Math.floor(barItems[i].value / totalCount * leftoverPercent);
						barItems[i].width = barItems[i].width + itemPercent;
						accumulatedPercent = accumulatedPercent - itemPercent;
					}
				}

				if(accumulatedPercent > 0) {
					for(var i = 0; i < barItems.length; i++) {
					  if (barItems[i].value == biggestNo) {
						if (countBiggestNo > 1) {
						  var singleLeftover = Math.floor(accumulatedPercent / countBiggestNo);
						  barItems[i].width = barItems[i].width + singleLeftover;
						} else {
						  barItems[i].width = barItems[i].width + accumulatedPercent;
						}
					  }
					}
				}

				for(var i = 0; i < barItems.length; i++) {
					if(barItems[i].value == 0 || barItems[i].value == "0"){
						barItems[i].color = "";
					}
					var $divItem = {
						"type": "bar",
						"id": barItems[i].value,
						"text": barItems[i].displayTime,
						"width": barItems[i].width,
						"color": barItems[i].color
					};
					_innerDivs.push($divItem);
				}
			}
			if(lineItems) {
				for(var i = 0; i < lineItems.length; i++) {
					//if(lineItems[i].percent == 50 || lineItems[i].percent == 95) {
					if(lineItems[i].percent == 100) {
						for(var x = 0; x < barItems.length; x++) {
							if(lineItems[i].time == barItems[x].time) {
								return;
							}
						}

					}
						var initialTime = 0;
						var width = 0.0;
						for(var x = 0; x < barItems.length; x++) {
							if(lineItems[i].time > initialTime && lineItems[i].time <= barItems[x].time) {
								lineItems[i].width = width + (barItems[x].width / (barItems[x].time - initialTime) * (lineItems[i].time - initialTime)) - 2;
								if((barItems[x].time == lineItems[i].time) && (i==lineItems.length-1)){
									lineItems[i].width = width + (barItems[x].width / (barItems[x].time - initialTime) * (lineItems[i].time - initialTime)) - ((lineItems[i].displayTime).toString().length);
								}
								var $divItem = {
									"type": "line",
									"percent": lineItems[i].percent,
									"text": "▼",
									"id": lineItems[i].displayTime,
									"width": lineItems[i].width,
									"color": lineItems[i].color
								};
								_innerDivs.push($divItem);
								break;
							} else {
								initialTime = barItems[x].time;
								width = width + barItems[x].width;
							}
						}
				}
			}
		};

		this.setStyle = function($div, style, value) {
			if(style == "width" || style == "left") {
				value = value + '%';
			}
			$div.css(style, value);
		};

		this._convertToHr = function(singleItem) {
			var leftoverMin = singleItem.time % 60;
			if(leftoverMin != 0) {
				var fullHr = singleItem.time / 60;
				if(fullHr < 1) {
					singleItem.displayTime = "0:" + singleItem.time;
				} else {
					singleItem.displayTime = Math.floor(fullHr) + ":" + leftoverMin;
				}
			} else {
				singleItem.displayTime = singleItem.time / 60;
			}
			return singleItem;
		};

		this._convertToDay = function(singleItem) {
			var leftoverMin = singleItem.time % 60;
			var fullHr = singleItem.time / 60;
			var leftoverHr = Math.floor(fullHr) % 24;
			if(leftoverMin != 0) {
				if(fullHr < 24) {
					singleItem.displayTime = "0d " + Math.floor(fullHr) + ":" + leftoverMin;
				} else {
					if(leftoverHr != 0) {
						var fullDay = fullHr / 24;
						singleItem.displayTime = Math.floor(fullDay) + "d " + leftoverHr + ":" + leftoverMin;
					} else {
						singleItem.displayTime = Math.floor(fullDay) + "d " + leftoverHr + ":" + leftoverMin;
					}
				}
			} else {
				if(fullHr < 24) {
					singleItem.displayTime = "0d " + Math.floor(fullHr) + ":00";
				} else {
					var fullDay = fullHr / 24;
					if(leftoverHr != 0) {
						singleItem.displayTime = Math.floor(fullDay) + "d " + leftoverHr + ":00";
					} else {
						singleItem.displayTime = Math.floor(fullDay) + "d";
					}
				}
			}
			return singleItem;
		};

		this._getDisplayTime = function(items, measurementType) {
			var barItems = items.wtbar;
			var lineItems = items.wtline;
			if(measurementType != "min") {
				if(measurementType == "hr") {
					for(var i = 0; i < barItems.length; i++) {
						if(lineItems[i]) {
							lineItems[i] = self._convertToHr(lineItems[i]);
						}
						if(barItems[i]) {
							barItems[i] = self._convertToHr(barItems[i]);
						}
					}
				} else if(measurementType == "day") {
					for(var i = 0; i < barItems.length; i++) {
						if(lineItems[i]) {
							lineItems[i] = self._convertToDay(lineItems[i]);
						}
						if(barItems[i]) {
							barItems[i] = self._convertToDay(barItems[i]);
						}
					}
				}
			} else {
				for(var i = 0; i < barItems.length; i++) {
					if(lineItems[i]) {
						lineItems[i].displayTime = lineItems[i].time;
					}
					if(barItems[i]) {
						barItems[i].displayTime = barItems[i].time;
					}
				}
			}
		};

		this.createItem = function(item) {
			var $itemElement = $("<div></div>");
			$elm.append($itemElement);

			$itemElement.addClass("item-" + item.type);
			$itemElement.attr("id", item.id);
			$itemElement.html(item.text);

			if(item.type == "bar") {
				this.setStyle($itemElement, "position", "relative");
				this.setStyle($itemElement, "float", "left");
				this.setStyle($itemElement, "width", item.width);
				this.setStyle($itemElement, "background", item.color);
			} else {
				this.setStyle($itemElement, "position", "absolute");
				this.setStyle($itemElement, "left", item.width);
				this.setStyle($itemElement, "color", item.color);
				this.setStyle($itemElement, "font-weight", "bold")
			}

		};

		this.getWidth = function(){ return _width; };
		this.setWidth = function($width){
			_width = $width;
			$elm.css("width", $width);
		};

		this.getHeight = function(){ return _height; };
		this.setHeight = function($height){
			_height = $height;
			$elm.css("height", $height);
		};

		this.getBorderRadius = function(){ return _borderRadius };
		this.setBorderRadius = function($borderRadius){
			_borderRadius = $borderRadius;
			$elm.css("border-radius", $borderRadius);
		}

		self.setWidth(options.width);
		self.setHeight(options.height);
		self.setBorderRadius(options.borderRadius);

		if(options.source != []) {
			_innerDivs = [];
			$elm.empty();
			this.setBarItemsWidth(options.source, options.measurementType);
		}

		for(var i = 0; i < _innerDivs.length; i++) {
			self.createItem(_innerDivs[i]);
		}

		$elm.find(".item-bar").first().css( {"border-top-left-radius": options.borderRadius, "border-bottom-left-radius": options.borderRadius , "border-left": "none"} );
		$elm.find(".item-bar").last().css( {"border-top-right-radius": options.borderRadius, "border-bottom-right-radius": options.borderRadius} );

		return this;
	};

	$.fn.WaitTimeBar.defaults = {
		width: "80%",
		height: "40%",
		borderRadius: "25px",
		source: [],
		measurementType: "min"
	};

}( jQuery ));
