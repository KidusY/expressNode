require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const Movies = require('./movie.json');
//express
const app = express();

//middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use((req, res, next) => {
	const ourToken = process.env.API_TOKEN;
	const usersToken = req.get('Authorization');
	if (!usersToken || usersToken.split(' ')[0] !== 'Bearer' || usersToken.split(' ')[1] !== ourToken) {
		return res.status(401).send('Unauthorized login');
	}
	next();
});

app.get('/', (req, res) => {
	let movies = Movies;
	let { genre, country, avg_vote } = req.query;
	if (genre) {
		movies = Movies.filter((movie) => movie.genre.toLowerCase().includes(genre.toLowerCase()));
	}
	if (country) {
		movies = Movies.filter((movie) => movie.country.toLowerCase().includes(country.toLowerCase()));
	}
	if (avg_vote) {
		movies = Movies.filter((movie) => movie.avg_vote >= avg_vote);
	}
	res.json(movies);
});

app.listen(8000, () => {
	console.log('server running');
});
