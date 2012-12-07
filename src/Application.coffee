colors =
	"blue" : { from: "#8ED6FF", to: "#004CB3" }
	"red": { from: "rgba(256, 20, 80, 0.8)", to: "rgba(150, 10, 30, 1)"}

class Application

	constructor: (name) ->
		document.body.innerHTML = do require "views/login"
		@styles = require "styles/base"
		document.getElementById("loginForm").onsubmit = Application.loadApplication
		link = document.createElement "link"
		link.setAttribute "rel", "stylesheet"
		link.setAttribute "type", "text/css"
		link.href = "http://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:200"
		document.head.appendChild link
		#do Application.fakeLogin

	@loadApplication: (e) =>
		document.body.innerHTML = (require "views/game") name: e.srcElement[0].value, colors: colors, baseSpeed: 15, baseFrequency: 150, baseFilter: 0.5

		( require "classes/Renderer" ) "activate", colors

		document.onresize = ->
			canvas = document.getElementById "gameCanvas"
			canvas.height = window.innerHeight
			( require "classes/Renderer" ) "canvasUpdate"
		do document.onresize

		( document.getElementById "exitGameButton" ).onclick = -> (require "classes/Engine")("exit")
		( document.getElementById "newGameButton" ).onclick = -> (require "classes/Engine")("start")
		( document.getElementById "resetScoreButton" ).onclick = -> (require "classes/Engine")("reset")
		( document.getElementById "pauseGameButton" ).onclick = -> (require "classes/Engine")("pause")


		do e.preventDefault


	@fakeLogin: ->
		document.getElementById("loginForm").onsubmit srcElement: [{value: "Sabin"}],preventDefault: ->


module.exports = Application
