var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

app.use(bodyParser.json());

// GET /todos?completed=true&q=work
app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed == 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed == 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);
	}, function(e) {
		res.status(500).send();
	});

});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function(todo) {
		if (!!todo)
			res.json(todo);
		else
			res.status(404).send();
	}, function(e) {
		res.status(500).send();
	});

});

// POST /todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	// call create on db.todo
	db.todo.create(body).then(function(todo) {
		res.json(todo);
	}, function(e) {
		res.status(400).json(e);
	});

});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var DeletedId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: DeletedId
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				'error': 'No todo with id'
			});
		} else {
			res.status(204).send();
		}
	}, function(e) {
		res.status(500).send();
	});

});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var UpdatedId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};


	// Validate completed
	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}
	// Validate description
	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	// Update the existing id
	db.todo.findById(UpdatedId).then(function(todo) {
		if (todo) {
			todo.update(attributes).then(function(todo) {
				res.json(todo.toJSON());
			}, function(e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function() {
		res.status(500).send();
	});

});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});