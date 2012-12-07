require "isf" # We're gonna need the ISF framework to help with ErrorReporting (for now)

# Defining the Server Bootstrap class (the actual work is done by Express)
class Server

	# On construction we need an address and a port to start the server on
	# @param data Object An Object containing the address and port (both strings)
	# @return Server The server instance
	constructor: (data) ->

		# Testing to check for the right value
		return throw ServerErrorReporter.generate 1 if not data.address?
		return throw ServerErrorReporter.generate 2 if not data.port?
		return throw ServerErrorReporter.generate 3 if not data.address.substr?
		return throw ServerErrorReporter.generate 4 if not data.port.substr?

		# Going forward with the construction
		@address = data.address
		@port = data.port

	# Connect a compiler or other objects (if some other dev enables it)
	# @param CompilerObject Compiler The compiler object to be attached to the static server.
	# @return Server The current server instance
	connect: (CompilerObject) ->

		# Checking for the right object
		return throw ServerErrorReporter.generate 5 if not CompilerObject?
		return throw ServerErrorReporter.generate 6 if not CompilerObject.compile?

		# Moving forward
		@compiler = CompilerObject
		@

	# Start the server on the address and port specified when constructing it
	# @return Server The current server instance
	start: ->

		# Grabbing Express and checking if it is there
		Express = require "express"
		return throw ServerErrorReporter.generate 7 if not Express?

		try # Attempt to configure the server and return an error
			App = do Express.createServer
			App.configure =>
				App.use App.router
				App.use Express.static "./public"
				if @compiler? then App.get "/js/g.js", (req, res) => @compiler.compile null, (source) ->
					res.send source, {"Content-Type": "text/javascript"}, 201
		catch e then return throw ServerErrorReporter.generate 8, ServerErrorReporter.wrapCustomError e

		# Finally launch the server
		App.listen @port
		console.log "Started the static server on address : #{@address}, and port : #{@port}"
		console.log "Instant compiling is enabled." if @compiler
		@

# Defining the ErrorReporting for the Server class
class ServerErrorReporter extends IS.Object

	# Defining the error messages, assigning them to groups and naming them.
	@errorGroups = [ "ConstructorError", "CompileConnectionrError", "InternalError" ]
	@errorGroupMap = [ 1, 1, 1, 1, 2, 2, 3, 3 ]
	@errorMessages = [
		"There is no address supplied"
		"There is no port supplied"
		"The address is not a string"
		"The port is not a string"
		"There was no object supplied"
		"The object supplied was not compatible"
		"Express module was not installed"
		"Error at configuring the server"
	]

	# Making sure it behaves as it should
	@extend IS.ErrorReporter


# Exporting the server
module.exports = Server

