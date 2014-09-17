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
	}]);