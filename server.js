var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: 'Meet Anita for dinner',
	completed: false
}, {
	id: 2,
	description: 'Go to supermarket',
	completed: false
}, {
	id: 3,
	description: 'Buy Milk',
	completed: true
}];

app.get('/', function (req, res) {
	res.send('Todo API Root');
});
var todoNextId = 4;

app.use(bodyParser.json());

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

// POST /todos
app.post('/todos', function (req, res) {
	var body = req.body;

	// add id field
	body.id = todoNextId++;
	// push body into array
	todos.push(body);
	console.log(todos);
	// console.log('description ' + body.description);

	res.json(body);
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});