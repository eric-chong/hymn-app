'use strict';

module.exports = {
	app: {
		title: 'MEAN.JS',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'mongodb, express, angularjs, node.js, mongoose, passport'
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
				'public/lib/select2/select2.css'
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
				'public/lib/angular-foundation/mm-foundation-tpls.js'
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