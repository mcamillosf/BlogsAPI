const express = require('express');
const bodyParser = require('body-parser');
const users = require('./Controller/userController');
const login = require('./Controller/loginController');
const blogPosts = require('./Controller/postController');
const categories = require('./Controller/categoriesController');

const app = express();
app.use(bodyParser.json());

app.use('/user', users);
app.use('/login', login);
app.use('/categories', categories);
app.use('/post', blogPosts);

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});

app.listen(3000, () => console.log('ouvindo porta 3000!'));
