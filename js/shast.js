(function ( $ ) {

	$.fn.shast = function( _options ) {

		this.options = $.extend({
			// These are the defaults.
			scale: 1.2,
			vertical: false,
			slices: 3
		}, _options );

		var _self = this;

		return this.each(function(){
			var thiis		= this;
			var el 			= $(this);
			var ImageSrc 	= el.attr('data-src');

			if( el.css('position') != 'absolute'
				&&
				el.css('position') != 'relative'
				)
				el.css('position','relative');
			el.css('overflow','hidden');

			if(_self.options.vertical)
			{
				var DivWidth 	= el.width()  / _self.options.slices;
				var DivHeight 	= el.height() * _self.options.scale;
				var Diff 		= DivHeight - el.height();
			}
			else
			{
				var DivWidth 	= el.width()	* _self.options.scale;
				var DivHeight 	= el.height() / _self.options.slices;
				var Diff 		= DivWidth - el.width();
			}
			var AnimTo 		= Diff / 2 * -1;
			var Direction 	= true;

			for(i = 1; i <= _self.options.slices; i++){ // let's create an slice and append it

				var DivDiff = ((Direction ? 1 : 0) * -1 * Diff) + 'px';

				var ImageDiv = $("<div></div>").css({
					position: 'relative',
					overflow: 'hidden'
				}).width(DivWidth).height(DivHeight).attr('data-diff',DivDiff);

				if(_self.options.vertical)
					ImageDiv.css({
						marginTop: DivDiff,
						float: 'left'
					});
				else
					ImageDiv.css({
						marginLeft: DivDiff
					});

				var ImageEl = $("<img/>").css({
						display: 'block',
						position: 'absolute'
					}).attr('src',ImageSrc);

				if(_self.options.vertical)
					ImageEl.css({
						left: -1 * ((i - 1) * DivWidth) + 'px'
					}).height(DivHeight);
				else
					ImageEl.css({
						top: -1 * ((i - 1) * DivHeight) + 'px'
					}).width(DivWidth);

				ImageDiv.append(ImageEl).appendTo(el);

				Direction = !Direction;
			}

			el.hover(function(){
				var Childs = $(this).children('div');
				Childs.stop();
				if(_self.options.vertical)
					Childs.animate({
						marginTop: AnimTo + 'px'
					});
				else
					Childs.animate({
						marginLeft: AnimTo + 'px'
					});
			},function(){
				var Childs = $(this).children('div');
				Childs.stop().each(function(){
					if(_self.options.vertical)
						$(this).animate({
							marginTop: $(this).attr('data-diff')
						});
					else
						$(this).animate({
							marginLeft: $(this).attr('data-diff')
						});
				});
			});

			this.ResizeHandler = false;
			$(window).resize(function(){
				if(thiis.ResizeHandler != false){
					clearTimeout(thiis.ResizeHandler);
					thiis.ResizeHandler = false;
				}
				thiis.ResizeHandler = setTimeout(function(){ el.html('').off('mouseenter mouseleave').shast(_self.options); }, 200);
			});

		});
	};

}( jQuery ));