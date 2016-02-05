var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: 'Meet mom for lunch',
	completed: false
}, {
	id: 2,
	description: 'Go to market',
	completed: false
}, {
	id: 3,
	description: 'Buy the juice',
	completed: true
}];

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos
// GET /todos/2

app.get('/todos', function (req, res) {
	res.json(todos);
});

app.get('/todos/:id', function (req, res) {
	var todoID = parseInt(req.params.id, 10);
	var matchedTodo;
	// Iterate of todos array. Find the match.
	// res.send(todos);
	todos.forEach(function (todo) {
		if (todo.id === todoID)
			matchedTodo = todo;
	});

	if (matchedTodo)
		res.json(matchedTodo);
	else
		res.status(404).send();

});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});