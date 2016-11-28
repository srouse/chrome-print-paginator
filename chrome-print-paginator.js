//==========================================================
//==========================MICROTEMPLATE===================
//==========================================================

function Microtemplate ( content , templateName )
{
	this._tmplCache = {};
	this.content = Microtemplate.unescape( content );
	this.template_name = templateName;
}

Microtemplate.isNull = function ( value ) {
	if ( value === null ) {
		return true;
	}else if ( typeof( value ) == "undefined" ) {
		return true;
	}else{
		return false;
	}
}

Microtemplate.escape = function( str ) {
      if ( !Microtemplate.isNull( str ) ) {
        return (''+str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g,'&#x2F;');
      }else{
          return "";
      }
};

Microtemplate.unescape = function( str ) {
      if ( !Microtemplate.isNull( str ) ) {
        return (''+str)
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>');
      }else{
          return "";
      }
};

Microtemplate.prototype.parse = function( data ) {
	var str = this.content;
	var err = "";
	try {
		var func = this._tmplCache[str];
		if (!func) {
			var strFunc =
			    "var __tmplObj44=[],print=function(){__tmplObj44.push.apply(__tmplObj44,arguments);};" +
			                "with(obj){__tmplObj44.push('" +
			    str.replace(/[\r\t\n]/g, " ")
			       .replace(/'(?=[^#]*#>)/g, "\t")
			       .split("'").join("\\'")
			       .split("\t").join("'")
			     .replace(/<#==(.+?)#>/g, "',$1,'")
			       .replace(/<#=(.+?)#>/g, "',Microtemplate.escape($1),'")
			       .split("<#").join("');")
			       .split("#>").join("__tmplObj44.push('")
			       + "');}return __tmplObj44.join('');";

			func = new Function("obj", strFunc);
			this._tmplCache[str] = func;
		}
		data['template_name'] = this.template_name;
		return func(data);
	} catch (e) { err = e.message; console.log( e ); }
	return "< # ERROR: [" + err + "] template:" + this.template_name + " # >";
};

/*
//==========================================================
//==========================SIMPLE PIES===================
//==========================================================

processCanvasPies = function(){
	function degreesToRadians(degrees) {
	    return (degrees * Math.PI)/180;
	}
	function sumTo(a, i) {
	    var sum = 0;
	    for (var j = 0; j < i; j++) {
	      sum += a[j];
	    }
	    return sum;
	}
	function drawSegment(canvas, context, i, values, colors ) {
	    context.save();
		context.mozImageSmoothingEnabled = true;
		context.webkitImageSmoothingEnabled = true;
		context.msImageSmoothingEnabled = true;
		context.imageSmoothingEnabled = true;

	    var centerX = Math.floor(canvas.width / 2);
	    var centerY = Math.floor(canvas.height / 2);
	    radius = Math.floor(canvas.width / 2);

	    var startingAngle = degreesToRadians(sumTo(values, i)-90);
	    var arcSize = degreesToRadians(values[i]);
	    var endingAngle = startingAngle + arcSize;

	    context.beginPath();
	    context.moveTo(centerX, centerY);
	    context.arc(centerX, centerY, radius,
	                startingAngle, endingAngle, false);
	    context.closePath();

		var color_dom = $("<div class='"+colors[i]+"'></div>").hide().appendTo("body");
		var color = color_dom.css("backgroundColor");
		color_dom.remove();
	    context.fillStyle = color;//colors[i];
	    context.fill();

	    context.restore();
	}

	function renderPie( pie ) {
		var pie = $(pie);
		var values = pie.data("pie_values");// [120, 100, 140];
		var total_values = values.reduce(function(a, b) { return a + b; }, 0);
		values = values.map(function(value){
			return value/total_values * 360;
		});

		var colors = pie.data("pie_colors");

		var canvas = $("<canvas width='"+(pie.width()*4)+"px' height='"+(pie.height()*4)+"px' style='width:"+pie.width()+"px; height:"+pie.height()+"px;'></canvas>");
		$(pie).append( canvas );
		var context = canvas[0].getContext("2d");
		for (var i = 0; i < values.length; i++) {
		    drawSegment(canvas[0], context, i, values, colors );
		}
	}

	var pies = document.querySelectorAll('[data-pie_values]');

	for (i = 0; i < pies.length; i++) { renderPie(pies[i]); }
}
*/

//==========================================================
//==========================PAGINATION===================
//==========================================================

var print_selector = "cpp";
var templates_selector = "cpp-templates";

var print_done_class = "cpp--done";
var page_selector = "cpp-page";
var full_page_class = "cpp-page--fullpage";
var header_selector = "cpp-header";
var footer_selector = "cpp-footer";
var body_selector = "cpp-page-body";

var section_selector = "cpp-page-section";
var section_header_selector = "cpp-page-section-header";
var section_footer_selector = "cpp-page-section-footer";
var section_body_selector = "cpp-page-section-body";
var section_section_selector = "cpp-page-section-section";

var section_page_class = "cpp-page-section--page";
var section_page_selector = "." + section_page_class;//, cpp-section-page";

var page_number_selector = ".total-pages-variable";

//======================V2======================

var do_slow_iteration = false;//true;//false;

function __childSlowIterate ( arr , funk, doneFunk, index ) {
	if ( !index ) {
		index = 0;
	}
	if ( arr.length > index ) {
		funk( arr[index], function() { __childSlowIterate( arr, funk, doneFunk, index+1 ) } );
	}else{
		if ( doneFunk )
			doneFunk();
	}
}

function __slowIterate ( arr , funk, doneFunk, index ) {
	if ( !index ) {
		index = 0;
	}
	if ( arr.length > index ) {
		setTimeout( function(){
			funk( arr[index], index );
			__slowIterate( arr, funk, doneFunk, index+1 );
		},500);
	}else{
		if ( doneFunk )
			doneFunk();
	}
}

function processTemplates () {
	paginator.templates = $(templates_selector);
	paginator.templates.detach();

	paginator.content_list = $(page_selector);
	paginator.content_list.detach();
}

function createNewPage ( content ) {
	paginator.template_data.page_number++;
	paginator.template_data._total_pages++;

	var header = content.find( header_selector );
	var footer = content.find( footer_selector );

	var new_page = $("<cpp-page></cpp-page>");

	new_page.append(
		$(new Microtemplate( "<cpp-header>" + header.html() + "</cpp-header>" , "header" ).parse(paginator.template_data))
	);
	new_page.append(
		$("<cpp-page-body></cpp-page-body>")
	);
	new_page.append(
		$(new Microtemplate( "<cpp-footer>" + footer.html() + "</cpp-footer>" , "footer" ).parse(paginator.template_data))
	);

	$( print_selector ).append( new_page );

	paginator.focused_page = new_page;
	paginator.focused_body = paginator.focused_page.find( body_selector );
}

function renderContentList ( doneFunk ) {
	if ( do_slow_iteration ) {
		__childSlowIterate( paginator.content_list , renderContent, doneFunk );
	}else{
		for ( var i=0; i<paginator.content_list.length; i++ ) {
			renderContent( paginator.content_list[i] );
		}
	}
}

	function renderContent ( content, doneFunk ) {
		content = $(content);

		if ( !paginator.focused_page ) {
			createNewPage( content );
		}

		if ( content.data("is_single_page") === true ) {
			var body = content.find( body_selector );
			paginator.focused_body.html( body.html() ).addClass( body.attr('class') );;
			// ok, maybe it still doesn't fit...surprise, surprise.
			// iterate 5 times adding a special, incremental class that can adjust
			for ( var i=0; i<5; i++ ) {
				var pageHeight = paginator.focused_body.height();
				var pageScrollHeight = paginator.focused_body[0].scrollHeight;

				if ( pageScrollHeight > pageHeight ) {
					paginator.focused_page
						//.removeClass( "cpp--shrink-" + i )
						.addClass( "cpp--shrink-" + (i+1) );
				}
			}

			return;
		}

		var sections = content.find( section_selector );

		if ( do_slow_iteration ) {
			__slowIterate( sections,
				function( section, index ){
					section = $(section);

					var section_is_sectionable = section.hasClass( section_page_class );
					if ( section_is_sectionable ) {
						appendSectionableSection( section, content );
					}else{
						var section_clone = section.clone();
						paginator.focused_body.append( section_clone );

						var pageHeight = paginator.focused_body.height();
					    var pageScrollHeight = paginator.focused_body[0].scrollHeight;

						if ( pageScrollHeight > pageHeight ) {
							createNewPage( content );
							// assumes section isn't larger than page...
							paginator.focused_body.append( section_clone );
						}
					}
				},
				function() {
					paginator.focused_page = false;
					doneFunk();
				}
			);
		}else{
			var section;
			for ( var t=0; t<sections.length; t++ ) {
				section = $(sections[t]);

				var section_is_sectionable = section.hasClass( section_page_class );
				if ( section_is_sectionable ) {
					appendSectionableSection( section, content );
				}else{
					var section_clone = section.clone();
					paginator.focused_body.append( section_clone );

					var pageHeight = paginator.focused_body.height();
				    var pageScrollHeight = paginator.focused_body[0].scrollHeight;

					if ( pageScrollHeight > pageHeight ) {
						createNewPage( content );
						// assumes section isn't larger than page...
						paginator.focused_body.append( section_clone );
					}
				}
			}
		}

		//start new content on new page....
		paginator.focused_page = false;
	}

		function appendSectionableSection ( section, content ) {
			var section_data = section.data("template_data");

			if ( !section_data ) {
				section_data = {
					continued:false,
					section_number:0
				};
			}

			section_data.section_number++;

			section.data("template_data",section_data);

			var headers = section.find( section_header_selector );
			var footers = section.find( section_footer_selector );

			var clone = section.clone();

			var clone_header = clone.find( section_header_selector );
			var clone_body = clone.find( section_body_selector );
			var clone_footer = clone.find( section_footer_selector );

			section_data = $.extend( section_data, paginator.template_data );

			clone_header.each(function( index, ele ){
				processTemplatedElement( ele, headers[index], section_data );
			});
			clone_body.html("");
			clone_footer.each(function( index, ele ){
				processTemplatedElement( ele, footers[index], section_data );
			});

			paginator.focused_body.append( clone );
			var pageHeight = paginator.focused_body.height();
			var pageScrollHeight = paginator.focused_body[0].scrollHeight;

			if ( pageScrollHeight > pageHeight ) {
				clone.detach();
				// start over on new page...
				section.data("template_data",false);
				createNewPage( content );
				appendSectionableSection( section, content );
			}else{
				var sub_sections = section.find( section_section_selector );

				// redo footer...something changed
				section_data.continued = true;
				clone_footer.each(function( index, ele ){
					processTemplatedElement( ele, footers[index], section_data );
				});

				var sub_section,clone_sub_section;
				for ( var s=0; s<sub_sections.length; s++ ) {
					sub_section = $(sub_sections[s]);
					clone_sub_section = sub_section.clone();

					clone_body.append( clone_sub_section );

					pageHeight = paginator.focused_body.height();
					pageScrollHeight = paginator.focused_body[0].scrollHeight;

					if ( pageScrollHeight > pageHeight ) {
						if ( s == 0 ) {
							// if it is the first one, give up on whole thing
							clone.detach();
						}else{
							clone_sub_section.detach();
						}

						// it will start on new page with whatever is left in source section
						createNewPage( content );
						section_data.continued = true;
						appendSectionableSection( section, content );
						return;
						break;
					}else{
						// take away from source...
						// after a redo it will start with whatever it has left....
						sub_section.detach();
					}
				}

				// ones that made it this far are all good...
				section_data.continued = false;
				clone_footer.each(function( index, ele ){
					processTemplatedElement( ele, footers[index], section_data );
				});
			}
		}

		function processTemplatedElement ( target_ele, template_ele, data ) {
			var target = $( target_ele );
			var template_ele = $( template_ele );

			var template = findTemplate( template_ele );
			target.html(
				new Microtemplate(
					template.html() , "templated element"
				).parse( $.extend( data , template.data() ) )
			).addClass( template.attr('class') );
		}

	function findTemplate( element ) {
		var template_id = element.data('template');

		if ( template_id ) {
			var template = paginator.templates.find("#"+ template_id );
			if ( template ) {
				template.data( element.data() );
				return template;
			}else{
				console.log( "DIDN'T FIND TEMPLATE :" + template_id );
				console.log( element );
				return element;
			}
		}else{
			return element;
		}
	}


function postProcessVariables() {
	$(page_number_selector).html( paginator.template_data._total_pages );
}


var overlay = 0;
function toggleOverlay() {
	if ( overlay == 1 ) {
		$("cpp-overlay").css("opacity","0");
		setTimeout(function(){
			$("cpp-overlay").hide();
		},300);
		overlay = 0;
		//$("cpp-overlay").fadeOut();
	}else if ( overlay == .3 ) {
		//$("cpp-overlay").fadeIn();
		$("cpp-overlay").show();
		$("cpp-overlay").css("opacity","0");
		$("cpp-overlay").css("opacity","1");
		overlay = 1;
	}else{
		$("cpp-overlay").show();
		$("cpp-overlay").css("opacity","0");
		$("cpp-overlay").css("opacity",".3");
		overlay = .3;
	}
}
function renderOverlay () {
	var target = $('[data-do_toggle_overlay="true"]');

	if ( target.length > 0 ) {
		target.click(function(){
						toggleOverlay();
					});
		$("cpp-page").prepend($("<cpp-overlay></cpp-overlay>"));
	}
}
//var template;

var paginator = {
	templates:$("<div></div>"),
	content:[],
	rendered_pages:[],
	focused_page:false,
	template_data:{
		page_number:0,
		total_pages:"<span class='total-pages-variable'></span>",
		_total_pages:0
	}
};

$(window).ready(function () {
	processTemplates();
	$(print_selector).addClass(print_done_class);

	if ( do_slow_iteration ) {
		renderContentList(function(){
			postProcessVariables();
			//processCanvasPies();

			renderOverlay();
		});
	}else{
		renderContentList();
		postProcessVariables();
		//processCanvasPies();

		renderOverlay();
	}


});
