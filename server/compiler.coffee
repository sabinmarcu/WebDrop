# Including some base necessities and creating the compilation package (anonymously)
require "isf"
stitch = require "stitchw"
pack   = stitch.createPackage
	"dependencies": ["./node_modules/isf/lib/application.js"]
	"paths": ["./src"]


# The Compiler Bootstrap
class Compiler

	# Compile the application to its designated location.
	@compile: (to = "./public/js/g.js", callback = null) ->
		try
			pack.compile (err, source) ->
				if err then return throw CompilerErrorReporter.generate 2, err
				if callback? then callback source
				else
					try
						(require "fs").writeFileSync to.toString(), source, "utf-8"
					catch e then return throw CompilerErrorReporter.generate 3, e
		catch e then return throw CompilerErrorReporter.generate 1, e

# Defining the Compiler Error Reporter
class CompilerErrorReporter extends IS.Object

	# Setting the error parameters
	@errorGroups = [ "CompilationError" ]
	@errorGroupMap = [ 1, 1, 1]
	@errorMessages = [
		"An error occured when compiling the application"
		"The compiler failed"
		"Couldn't write the application to the file"
	]

	# Making sure it behaves properly
	@extend IS.ErrorReporter

# Exporting the Compiler
module.exports = Compiler

