// import modules

const express = require('express');
const morgan = require('morgan');
const books = require('./books-data.js');
const cors = require('cors');
const playstore = require('./playstore');

// Initiators
const app = express();
app.use(morgan('common')); // Lets see what 'common' format looks like
app.use(cors());

// Body

app.get('/books', (req, res) => {
	const { search = '', sort } = req.query;

	// search filter

	let results = books.filter(book =>
		book.title.toLowerCase().includes(search.toLowerCase())
	);

	// sort validation

	if (sort) {
		if (!['title', 'rank'].includes(sort)) {
			return res.status(400).send('Sort must be one of title or rank');
		}
	}

	if (sort) {
		results.sort((a, b) => {
			return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
		});
	}

	res.json(results);
});

app.get('/apps', (req, res) => {
	const genresList = [
		'Action',
		'Puzzle',
		'Strategy',
		'Casual',
		'Arcade',
		'Card',
	];
	let data = playstore;
	const { sort, genres } = req.query;

	if (sort) {
		if (!['rating', 'app'].includes(sort)) {
			return res.status(400).send(`Sort must be rating or app`);
		}
	}

	if (genres) {
		if (genresList.includes(genres)) {
			data = data.filter(element => {
				return element.Genres.toLowerCase() === genres.toLowerCase();
			});
		} else {
			res.status(404).send('You must supply a valid genre');
		}
	}

	if (sort === 'app') {
		data.sort((a, b) => {
			return a['App'].toLowerCase() > b['App'].toLowerCase()
				? 1
				: a['App'].toLowerCase() < b['App'].toLowerCase()
				? -1
				: 0;
		});
	} else if (sort === 'rating') {
		data.sort((a, b) => {
			return a['Rating'] - b['Rating'];
		});
	}
	data.forEach(element => {
		// console.log(element.Rating);
		console.log(element.App);
	});
	res.status(200).send(data);
});

app.listen(8000, () => {
	console.log('Server started on PORT 8000');
});
