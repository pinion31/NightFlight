import 'babel-polyfill';
import SourceMapSupport from 'source-map-support';
import express from 'express';
import bodyParser from 'body-parser';


const app = express();

app.use(express.static('static'));
app.use(bodyParser.json());


app.listen(3000, () => {
  console.log('App started on port 3000');

});