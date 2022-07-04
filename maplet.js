var Maplet = function(){ this.init(); return this; };
Maplet.prototype = {
	data : {},
	params : {},
	init : function(){
		this.setparams();
		this.extend(this.data, this.params);
	},
	onload : function(func){
		if(!window) return false;
		window.addEventListener('load', func);
		return true;
	},
	each : function(obj, func){
		var ret = [];
		for(var key in obj){
			ret.push(func(obj[key], key));
		}
		return ret;
	},
	extend : function(base, add){
		if(!base || !add) return false;
		for(var key in add){
			base[key] = add[key];
		}
		return base;
	},
	applyshow : function(){
		this.attreach("ml-show", function(elem, ret){
			if(!ret) elem.style.display = "none";
		});
	},
	exec : function(){
		var self = this;
		return this.onload(function(){
			self.mapping();
			self.applyshow();
		});
	},
	attreach : function(selector, func){
		var self = this;
		var doc = document.querySelectorAll("[" + selector + "]");
		var arr = [].slice.call(doc);
		arr.forEach(function(elem){
			var exec = elem.getAttribute(selector).replace(/;? *$/, ";");
			var fn = new Function("data", "return " + exec);
			var ret = fn(self.data);
			return func(elem, ret);
		});
	},
	mapping : function(){
		var self = this;
		var doc = document.querySelectorAll("body");
		var arr = [].slice.call(doc);
		arr.forEach(function(elem){
			elem.innerHTML = elem.innerHTML.replace(/\$\{([^\}]+)\}/g, function(match, key){
				var exec = key.replace(/;? *$/, ";");
				var fn = new Function("data", "return " + exec);
				var ret = fn(self.data);
				return ret ? ret : match;
			})
		});
	},
	setparams : function(){
		if(!document.location.search) return false;
		var self = this;
		var argv = document.location.search.replace(/^\?/, "");
		var params = argv.split("&");
		params.forEach(function(arg){
			var arr = arg.split("=");
			var key = arr[0];
			var val = arr[1];
			self.params[key] = val;
		});
		return true;
	}
};
var ml = new Maplet();
