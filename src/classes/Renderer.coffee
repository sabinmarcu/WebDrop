class Renderer extends IS.Object
	@activate: ->
		@canvas = document.getElementById "gameCanvas"
		if !@canvas then return throw RendererErrorReporter.generate 1
		@canvas = @canvas.getContext "2d"
		do @getCanvasSize
		setInterval (@proxy @draw, @), 50

	@getCanvasSize: ->
		canvas = document.getElementById "gameCanvas"
		size = x: canvas.width, y: canvas.height
		@canvas.size = size

	@draw: ->
		do @drawBackground
		@offset = 0 if not @offset? or @offset == 250
		@drawBar 100 - @offset, 50
		@drawBar 200 - @offset, 55
		@drawBar 300 - @offset, 75
		@drawBar 400 - @offset, 100
		@drawBar 500 - @offset, 150
		@drawBar 600 - @offset, 225
		@drawBar 700 - @offset, 200
		@drawBar 800 - @offset, 125
		@offset += 1
		do @drawShadows

	@drawBar: (y, xGap) ->
		gradient = @canvas.createLinearGradient 0, y, 0, y + 10
		gradient.addColorStop 0, "rgba(0, 30, 256, 0.5)"
		gradient.addColorStop 1, "rgba(0, 30, 256, 0.1)"
		@canvas.fillStyle = gradient
		@canvas.fillRect 0, y, xGap - 15, 10
		@canvas.fillRect xGap + 15, y, @canvas.size.x, 10
	@drawBackground: ->
		@canvas.fillStyle = "f6f6f6"
		@canvas.fillRect 0, 0, @canvas.size.x, @canvas.size.y

	@drawShadows: ->
		gradient = @canvas.createLinearGradient 0, 0, 0, 50
		gradient.addColorStop 0, "rgba(506, 506, 506, 1)"
		gradient.addColorStop 1, "rgba(506, 506, 506, 0)"
		@canvas.fillStyle = gradient
		@canvas.fillRect 0, 0, @canvas.size.x, 50
		gradient = @canvas.createLinearGradient 0, @canvas.size.y - 50, 0, @canvas.size.y
		gradient.addColorStop 0, "rgba(506, 506, 506, 0)"
		gradient.addColorStop 1, "rgba(506, 506, 506, 1)"
		@canvas.fillStyle = gradient
		@canvas.fillRect 0, @canvas.size.y - 50, @canvas.size.x, @canvas.size.y
		gradient = @canvas.createLinearGradient 0, 0, 50, 0
		gradient.addColorStop 0, "rgba(506, 506, 506, 1)"
		gradient.addColorStop 1, "rgba(506, 506, 506, 0)"
		@canvas.fillStyle = gradient
		@canvas.fillRect 0, 0, 50, @canvas.size.y
		gradient = @canvas.createLinearGradient @canvas.size.x - 50, 0, @canvas.size.x, 0
		gradient.addColorStop 0, "rgba(506, 506, 506, 0)"
		gradient.addColorStop 1, "rgba(506, 506, 506, 1)"
		@canvas.fillStyle = gradient
		@canvas.fillRect @canvas.size.x - 50, 0, @canvas.size.x, @canvas.size.y


class RendererErrorReporter extends IS.Object

	@errorGroups = [ "CanvasError" ]
	@errorGroupMap = [ 1 ]
	@errorMessages = [ "The canvas could not be hooked" ]

	@extend IS.ErrorReporter

window._r = Renderer

activated = false
offset = 0
module.exports = ->
	switch activated
		when false
			do Renderer.proxy Renderer.activate, Renderer
			activated = true
		when true
			do Renderer.proxy Renderer.getCanvasSize, Renderer
