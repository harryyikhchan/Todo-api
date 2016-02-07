var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];

app.get('/', function (req, res) {
	res.send('Todo API Root');
});
var todoNextId = 1;

app.use(bodyParser.json());

// GET /todos
app.get('/todos', function (req, res) {
	res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});


	if (matchedTodo)
		res.json(matchedTodo);
	else
		res.status(404).send();

});

// POST /todos
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description' , 'completed'); 

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0 ) {
		return res.status(400).send();
	}

	// set body.description to be trimmed value
	body.description = body.description.trim();

	// add id field
	body.id = todoNextId++;
	// push body into array
	todos.push(body);

	res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id' , function (req, res) {
	var DeletedId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: DeletedId});

	if (matchedTodo) {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
	else
		res.status(404).json({"error": "no todo found with that id"});
	
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});