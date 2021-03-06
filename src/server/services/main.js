import express from 'express';
import bodyParser from 'body-parser';
import auth from './auth';
import secure from './secure';
import nconf from 'nconf';
import path from 'path';
import morgan from 'morgan';

let app = express();

//load configuration
nconf.argv().env(['USER']);
nconf.file(path.join(__dirname, '../../../config', 'config.default.json'));
nconf.file(path.join(__dirname, '../../../config', `config.${process.env.NODE_ENV}.json`));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(morgan('combined'));

secure.setup(app);

app.use('/app', express.static(path.resolve('dist/app')));
app.use('/libs', express.static(path.resolve('dist/libs')));

var renderIndex = (req, res) => {
  res.sendFile(path.resolve('dist/index.html'));
};

app.get('/*', renderIndex);
app.use('/api/auth', auth);

export default app;
