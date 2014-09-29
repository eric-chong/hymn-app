'use strict';

angular.module('hymns')
	.directive('hymnCopyClipboard', ['HymnClipboard', function(HymnClipboard) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
	            $(document).on('keydown', function(event) {
	            	var clipValue = HymnClipboard.get();
	            	if (!clipValue || !(event.ctrlKey || event.metaKey)) return;

					if ($(event.target).is('input:visible,textarea:visible')) return;
					
					//if (window.getSelection().toString()) return;
					_.defer(function() {
						var $clipboardContainer = $('#lyrics-clipboard-container');
        				$clipboardContainer.empty().show();
						$('<textarea id="clipboard"></textarea>')
        					.val(clipValue)
        					.appendTo($clipboardContainer)
        					.focus()
        					.select();
					});
				});

				$(document).on('keyup', function(event) {
					if ($(event.target).is('#clipboard')) $('#lyrics-clipboard-container').empty().hide();
				});
			}
		};
	}])

	.directive('hymnZeroClipboard', [function() {
		return {
			retrict: 'A',
			link: function(scope, elem, attrs) {
				var clip = new ZeroClipboard(elem);
			}
		};
	}])

	.directive('listEntryExpand', ['$window', function($window) {
		return {
			link: function(scope, elem, attrs) {
                angular.element($window).bind('resize', function() {
                    adjustWidth();
                    setLeftOffsetPos();
                    scope.$apply();
                });

                function adjustWidth() {
                	var w = window.innerWidth - 95;
					elem.css('width', window.innerWidth + 'px');
                }

                function setLeftOffsetPos() {
                	// Remove left style first?
                	console.log(elem.offset().left);
                	elem.css('left', -Math.abs(elem.offset().left));
                	console.log(elem.css('left'));
                }

                adjustWidth();
                setLeftOffsetPos();
			}
		};
	}]);