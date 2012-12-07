movement = 0

class Engine extends IS.Object

	@bars = []
	@ball = {}
	@score = 0

	@reset = ->
		@bars = []
		@ball = {}
		@score = 0
		( document.getElementById "sessionScore" ).innerHTML = ""

	@New = (speed = null)->
		@speed = ( document.getElementById "speedControl" ).value
		@genFreq = ( document.getElementById "frequencyControl" ).value
		@ball = x: 150, y: 30, ax: 0, ay: 0
		do @generate
		window.clearInterval @animateTimer if @animateTimer?
		window.clearInterval @generateTimer if @generateTimer?
		@animateTimer = setInterval ( @proxy @tick, @), @speed
		@generateTimer = setInterval ( @proxy @generate, @), @speed * @genFreq

	@tick: ->
		if @bars[0]? and @bars[0].x >= window.innerHeight then do @bars.shift
		do @accelerateBall
		do @moveBallX
		do @moveBallY
		if @ball.y is 10 then alert "GAME OVER : Your Score is #{@score}"; @reset()
		do bar.animate for bar in @bars

	@accelerateBall: () ->
		return if not @ball.x?
		filter = ( document.getElementById "filterControl" ).value * 1
		@ball.ax += filter * movement
		@ball.ay += filter * 0.15 if @ball.ay <= 5

	@moveBallX: ->
		@ball.x += @ball.ax
		if @ball.x < 15
			@ball.ax -= 3 * @ball.ax
			@ball.x = 15
		if @ball.x > 285
			@ball.ax -= 3 * @ball.ax
			@ball.x = 285
		@ball.ax *= 0.85

	@moveBallY: ->
		w = window.innerHeight / 1.6
		@ball.y += @ball.ay
		@ball.y = w - 10 if @ball.y > w - 15
		for bar in @bars
			continue if @ball.skipbar? and @ball.skipbar is bar
			s = window.innerHeight - bar.y
			s = s / 1.6 - 15
			ycond = @ball.y >= s and @ball.y <= s + 15
			xcond = not (@ball.x >= bar.xGap - 16 and @ball.x <= bar.xGap + 16)
			if !xcond and ycond then @ball.skipbar = bar; @score += 10; do @updateScore
			if ycond and xcond then @ball.y = s; @ball.ay -= @ball.ay * 1.7


	@generate: ->
		@bars.push new (require "classes/Bar")(Math.floor(Math.random() * 25))

	@uncover: (what) -> @[what]

	@updateScore: -> ( document.getElementById "sessionScore" ).innerHTML = @score

class EngineErrorReporter extends IS.Object

	@errorGroups = [ "ProcedureError" ]
	@errorGroupMap = [ 1 ]
	@errorMessages = [ "Unknown Procedure" ]

	@extend IS.ErrorReporter

window._e = Engine

window.onkeydown = (e) ->
	switch e.keyCode
		when 37 then movement = -1
		when 39 then movement = 1
window.onkeyup = -> movement = 0


module.exports = (what, args...) ->
	switch what
		when "reset"
			console.log "Reset Score Stub"
		when "start"
			do Engine.reset
			do Engine.New
		when "pause"
			alert "Press OK when you wanna return to the game!"
		when "exit"
			if confirm "Do you really wanna close?"
				window.open "", "_self", ""
				window.close()
		when "uncover"
			Engine.uncover.apply Engine, args


