'use strict';

module.exports = {
	app: {
		title: 'Praise & Worship',
		description: '',
		keywords: 'praise, worship, hymn'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				//'public/lib/bootstrap/dist/css/bootstrap.css',
				//'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/foundation/css/foundation.css',
				'public/lib/font-awesome/css/font-awesome.css',
				'public/lib/select2/select2.css',
				'public/lib/animate.css/animate.css'
			],
			js: [
				'public/lib/fastclick/lib.fastclick.js',
				'public/lib/jquery/dist/jquery.js',
				'public/lib/select2/select2.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-ui-select2/src/select2.js',
				'public/lib/underscore/underscore.js',
				//'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/foundation/js/foundation.js',
				'public/lib/modernizr/modernizr.js',
				'public/lib/angular-foundation/mm-foundation-tpls.js',
				'public/lib/zeroclipboard/dist/ZeroClipboard.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};