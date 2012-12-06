class Application
	constructor: (name) ->
		document.body.innerHTML = do require "views/login"
		@styles = require "styles/base"
		document.getElementById("loginForm").onsubmit = (e) ->
			document.body.innerHTML = (require "views/game") name: e.srcElement[0].value
			do require "classes/Renderer"
			document.onresize = ->
				canvas = document.getElementById "gameCanvas"
				canvas.height = window.innerHeight
				do require "classes/Renderer"
			do document.onresize
			do e.preventDefault
		#document.getElementById("loginForm").onsubmit srcElement: [{value: "Sabin"}], preventDefault: ->

module.exports = Application
