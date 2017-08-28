/**
 * Created by maxislav on 20.10.16.
 */
process.env.TZ = 'UTC';
//const livereload = require('express-livereload');
const path = require('path');
const express = require('express');
//const port = 8080;
const kmlData = require('./kml-data');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const tileProxy = require('./tile-proxy');
const socketData = require('./socket-data');
const weather = require('./weather');
const {sendFile} = require('./send-file');
const servConfig = require("./server.config.json")

const dirname =  path.normalize(__dirname+'/../');
const app = express();
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



const server = require('http').Server(app);
server.listen(servConfig.socketPort, ()=>{
  console.log('socket start at port:',servConfig.socketPort)
});



app.get('/borisbolukbb', weather);

/**
 * tiler proxy
 */
app.get('/server*',(req, res, next)=>{
  res.setStatus = 500;
  res.send('<h4 style="color: darkred; padding: 10px; text-align: center">Permission denied</h4>');

} );
app.get('*/hills/:z/:x/:y', tileProxy);

app.post('/import/kml-data',kmlData);

//http://178.62.44.54/?state=&code=5f2bb3d2417d2834a1f0cf240a9d6c7a9ee12558
app.use((req, res, next)=>{
 // console.log('req.query.state->',req.query.state)
  if(req.query.gprmc){

    //res.send('<a href="http://localhost/#/auth/map/strava-invite/'+req.query.code+'">accept</a>')
      next();
    return
  }

  if(req.url.match(/:/)){
    res.status(500);
    res.end('olol');
    return;
  }
  res.header("Access-Control-Allow-Origin", "http://maxislav.github.io");
  if(req.url.match(/node_modules/)){
   // console.log('node_modules ->', req.url)
  }else {
      //console.log('req.url ->', req.url)
  }

  if(!req.url.match(/^(\/dist|\/src|\/node|\/lib|\/system|\/langs).+/)){
      console.log('bot url ->', req.url)
  }

  if(/sprite/.test(req.url)){
    console.log('sprite', req.url)
  }
  if(/\..{1,4}$/.test(req.url)){

    console.log('path - >', req.url);
    if(/\.(js|css|html|png|gif)$/.test(req.url)){
      res.set({
	      'Cache-control': 'public, max-age=2629000;',
      })
    }
    res.sendFile(dirname + req.url);

  }else{
    console.log('html5', req.url);
    res.sendFile(dirname + '/index.html')
  }




});

app.listen(servConfig.staticPort,()=>console.log('started at '+servConfig.staticPort));
socketData(server, app);