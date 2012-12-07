reqAnimFrame = window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or window.oRequestAnimationFrame or window.msRequestAnimationFrame or (callback) -> setTimeout callback, 1000 / 60


class Renderer extends IS.Object
	@activate: (@colors) ->
		@color = "red"
		@canvas = document.getElementById "gameCanvas"
		if !@canvas then return throw RendererErrorReporter.generate 1
		@canvas = @canvas.getContext "2d"
		if !@canvas then return throw RendererErrorReporter.generate 2
		( document.getElementById "ballColors" ).onchange = (e) =>
			@color = e.srcElement.value
		do @getCanvasSize
		do @loop

	@loop: ->
		reqAnimFrame @proxy @loop, @
		do @draw

	@getCanvasSize: ->
		canvas = document.getElementById "gameCanvas"
		size = x: canvas.width, y: canvas.height
		@canvas.size = size

	@draw: ->
		do @drawBackground
		do @drawBars
		do @drawBall
		do @drawShadows

	@drawBall: ->
		ball = (require "classes/Engine")("uncover", "ball")
		return if not ball.x? or not ball.x
		x = ball.x
		y = ball.y
		do @canvas.save
		@canvas.scale 1, 1.6
		gradient = @canvas.createRadialGradient x - 3, y - 3, 0, x, y, 15
		gradient.addColorStop 0, @colors[@color].from
		gradient.addColorStop 1, @colors[@color].to
		@canvas.fillStyle = gradient
		@canvas.beginPath()
		@canvas.arc(x, y, 15, 0, Math.PI * 2, false)
		@canvas.fill()
		@canvas.closePath()
		do @canvas.restore

	@drawBars: ->
		bars = (require "classes/Engine")("uncover", "bars")
		return if not bars.length
		@drawBar bar for bar in bars

	@drawBar: (bar) ->
		y = @canvas.size.y - bar.y
		xGap = bar.xGap
		gradient = @canvas.createLinearGradient 0, y, 0, y + 10
		gradient.addColorStop 0, "rgba(0, 30, 256, 0.5)"
		gradient.addColorStop 1, "rgba(0, 30, 256, 0.1)"
		@canvas.fillStyle = gradient
		@canvas.fillRect 0, y, xGap - 25, 10
		@canvas.fillRect xGap + 25, y, @canvas.size.x, 10

	@drawBackground: ->
		@canvas.fillStyle = "#f6f6f6"
		@canvas.fillRect 0, 0, @canvas.size.x, @canvas.size.y

	@drawShadows: ->
		gradient = @canvas.createLinearGradient 0, 0, 0, @canvas.size.y
		gradient.addColorStop 0, "rgba(256, 256, 256, 1)"
		gradient.addColorStop 50 / @canvas.size.y, "rgba(256, 256, 256, 0)"
		gradient.addColorStop (@canvas.size.y - 50) / @canvas.size.y, "rgba(256, 256, 256, 0)"
		gradient.addColorStop 1, "rgba(256, 256, 256, 1)"
		@canvas.fillStyle = gradient
		@canvas.fillRect 0, 0, @canvas.size.x, @canvas.size.y

		gradient = @canvas.createLinearGradient 0, 0, @canvas.size.x, 0
		gradient.addColorStop 0, "rgba(256, 256, 256, 1)"
		gradient.addColorStop 50 / @canvas.size.y, "rgba(256, 256, 256, 0)"
		gradient.addColorStop (@canvas.size.y - 50) / @canvas.size.y, "rgba(256, 256, 256, 0)"
		gradient.addColorStop 1, "rgba(256, 256, 256, 1)"
		@canvas.fillStyle = gradient
		@canvas.fillRect 0, 0, @canvas.size.x, @canvas.size.y

class RendererErrorReporter extends IS.Object

	@errorGroups = [ "CanvasError" ]
	@errorGroupMap = [ 1 ]
	@errorMessages = [ "The canvas could not be hooked" ]

	@extend IS.ErrorReporter

window._r = Renderer

module.exports = (what, args...) ->
	switch what
		when "activate"
			Renderer.activate.apply Renderer, args
		when "canvasUpdate"
			Renderer.getCanvasSize.apply Renderer
