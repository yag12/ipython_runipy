var analysis = new function(){
	this.viewer = null;
	this.name = null;
	this.data = {};

	this.init = function(viewer, name, data){
		this.viewer = viewer;
		this.set(name, data);
		this.html();
		this.png();
		this.params();
	}

	this.set = function(name, data){
		this.name = name;
		this.data = data;
	};

	this.html = function(){
		if(typeof this.data !== "undefined" && this.data.html !== "undefined"){
			for(var no in this.data.html){
				var tableDiv = $("<div />");
				tableDiv.html(this.data.html[no]);
				this.viewer.append(tableDiv);
			}
		}
	};

	this.png = function(){
		if(typeof this.data !== "undefined" && this.data.png !== "undefined"){
			for(var no in this.data.png){
				var imageDiv = $("<div />");
				var img = $("<img />");
				img.attr("src", "data:image/png;base64," + this.data.png[no]);
				imageDiv.append(img);
				this.viewer.append(imageDiv);
			}
		}
	};

	this.params = function(){
		if(typeof this.data !== "undefined" && this.data.params !== "undefined"){
			for(var key in this.data.params){
				var input = $("form[name='" + this.name + "'] input[name='" + key + "']");
				if(input.length){
					var type = input.attr("type");
					switch(type)
					{
						case "text":
							input.val(this.data.params[key]);
							break;
						case "checkbox":
							input.attr("checked", true);
							break;
						case "radio":
							$("form[name='" + this.name + "'] input[name='" + key + "'][value='" + this.data.params[key] + "']").attr("checked", true);
							break;
					}
					continue;
				}

				var selected = $("form[name='" + this.name + "'] select[name='" + key + "']");
				if(selected.length){
					 selected.children("option[value='" + this.data.params[key] + "']").attr("selected", "ture");
					continue;
				}
			}
		}
	};
};

var dispatcher = new function(){
	this.logger = null;

	this.post = function(name, params){
		var viewer = $("form[name='" + name + "']").parent().children("div");
		$("div", viewer).remove();
		var loader = $("<img src='img/ajax-loader.gif' width='160' />");
		viewer.append(loader);

		params = params + "&__L__=" + this.logger + "&__A__=" + name;
		$.post("./ipy/", params, "json").done(function(data){
			loader.remove();
			if(typeof data.result !== "undefined" && data.result === false){
				alert(data.msg);
			}else{
				analysis.init(viewer, name, data);
			}
		});
	};

	this.load = function(){
		if($("div.analysis").length > 0){
			$("div.analysis").each(function(){
				var name = $("form", $(this)).attr("name");
				$(this).append($("<hr />"));
				$(this).append($("<div />"));
			});

			var logger = this.logger;
			$.post("./ipy/", {name:logger}, "json").done(function(data){
				if(data.result === true)
				{
					var url = "./ipy/result/" + logger + ".json";
					$.ajax({
						url: url,
						type: "GET",
						data: {name:logger},
						dataType: "json",
						cache: false
					}).done(function(data){
						$("div.analysis").each(function(){
							var name = $("form", $(this)).attr("name");
							var viewer = $(this).children("div");
							if(typeof data[name] !== "undefined") analysis.init(viewer, name, data[name]);
						});
					});
				}
			});

			$("form").each(function(){
				$(this).submit(function(){
					var name = $(this).attr("name");
					var params = $(this).serialize();
					dispatcher.post(name, params);
					return false;
				});
			});
		}
	};

	this.menu = function(){
		$("li.menulist").load("html/_menu_.html", {}, function(){
			$("#contents>li.menulist>ul>li>a").click(function(){
				var name = $(this).attr("name");
				dispatcher.display(name);
			});
		});
	};

	this.display = function(logger){
		this.logger = logger;
		$("li.display").load("html/" + this.logger + ".html", {}, function(){
			$("input[name$='date']").attr("readonly", true);
			$("input[name$='date']").datepicker({
				dateFormat:"yy-mm-dd",
				dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
				monthNames: ["1 /", "2 /", "3 /", "4 /", "5 /", "6 /", "7 /", "8 /", "9 /", "10 /", "11 /", "12 /"]
			});
			dispatcher.load();
		});
	};

	this.init = function(logger){
		this.menu();
		this.display(logger);
	};
}

$(document).ready(function(){
	dispatcher.init("access");
});
