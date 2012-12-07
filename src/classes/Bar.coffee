class Bar

	constructor: (offset) ->
		console.log "New Bar"
		@xGap = Math.floor(Math.random() * 210 + offset)
		if @xGap < 70 then @xGap = 70
		if @xGap > 230 then @xGap = 230
		@y = 0

	animate: -> @y++
		
	uncover: -> y: @y, xGap: @xGap

module.exports = Bar
