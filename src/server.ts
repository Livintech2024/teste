import Express, { Response, Request } from 'express';
import cors from 'cors';

//Rotas
import { createUser, deleteUser, updateUser, findUser, findAllUser } from './routers/UserRouter';
import { createClient, deleteClient, updateClient, findClient, findAllClient } from './routers/ClientRouter';
import { createRelayModule, deleteRelayModule, findAllRelayModules, findAllClientRelayModules, findRelayModule, updateRelayModule, createRelayModuleInputOutput } from './routers/RelayModuleRouter';
import { createInput, deleteInput, findAllInput, findInput, updateInput } from './routers/InputRouter';
import { createIRGB, deleteIRGB, findAllIRGB,findAllFromClientIRGB, findIRGB, updateIRGB } from './routers/IRGBModuleRouter';
import { createSpace, deleteSpace, findAllSpaces, findSpace, updateSpace } from './routers/SpaceRouter';
import { createEvent, deleteEvent, findAllEvents, findEvent, updateEvent } from './routers/EventRouter';
import { createDeviceLoad, deleteDeviceLoad, findAllDevicesLoad, findDeviceLoad, updateDeviceLoad } from './routers/DeviceLoadRouter';
import { createDeviceIR, deleteDeviceIR, findAllDevicesIR, findDeviceIR, updateDeviceIR } from './routers/DeviceIRRouter';
import { createScene, deleteScene, findAllScenes, findScene, findAllUserScenes, updateScene } from './routers/SceneRouter';
import { createOutputIrRouter, getAllOutputIrRouter, updataOutputIrRouter } from './routers/OutputIrRouter';
import { createOutputRelayRouter, getAllOutputRelayRouter, updateOutputRelayRouter } from './routers/OutputRelayRouter';
import { createOutputRGBRouter, getAllOutputRGBRouter } from './routers/OutputRGBRouter';
import { deleteImage, getImage, postImage, updateImage } from './routers/imageRouter';
import { login, register } from './routers/AuthRouter';

//Outras importações
import { mqttAlive, DiscoveryModules } from './services/mqtt';
import swaggerFile from './swagger.json';
import { serve, setup } from 'swagger-ui-express';
import morgan from 'morgan';

//importando websocket

import {Server } from "socket.io"
import http from "http"


//Importações imagens
import multer from 'multer'
import { postItem } from './routers/AWSS3Router';
//App
const app = Express();

//------------------

const PORT = 8000;
const HOST = '172.17.0.1';

// Configurar o middleware cors
app.use(cors());
app.use(morgan('combined'));
app.use(Express.json());
app.use('/api/v1/docs', serve, setup(swaggerFile));


//Websocket
const server = http.createServer(app)
const io = new Server(server, {cors: {origin: 'http://192.168.0.104:8081'}})


io.on('connection', socket =>{
    console.log("Usuário conectado", socket.id)

    socket.on('disconnect',  reason=>{
        console.log('Usuário desconectado:', socket.id)
    })

    socket.on('set_username', username => {
        socket.data.username = username
    })

    socket.on('set_bulb_state_mqtt', data=>{
        io.emit('receive_message',{
            device:data.device,
            status:data.status
        })
        socket.data.currentSpaceDevices = data
        console.log(data)
    })

    socket.on('eventBulb', message => {
        socket.data.message = message
        console.log(socket.data.message)
        io.emit('Lâmpada foi mexida')
    })

    socket.on('currentStateBulb', text =>{
        io.emit('receive_bulb_message', {
            action: text,
            authorId: socket.id,
            author: socket.data.username
        })
    })
})

//Envio de Arquivos para AWS

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.post('/api/v1' + postItem.router, upload.single('item'), postItem.controller)

app.post('/api/v1' + postImage.router, upload.single('image'), postImage.controller)
app.get('/api/v1' + getImage.router, getImage.controller);

//Rota de login
app.post('/api/v1' + login.router, login.controller);
app.post('/api/v1' + register.router, register.controller);

//Rota Padrão
app.get('/', (req, res) => res.send('Bem vindo ao servidor'));

//Criação de usuário
app.post('/api/v1' + createUser.router, createUser.controller);
app.delete('/api/v1' + deleteUser.router, deleteUser.controller);
app.get('/api/v1' + findUser.router, findUser.controller);
app.get('/api/v1' + findAllUser.router, findAllUser.controller);
app.put('/api/v1' + updateUser.router, updateUser.controller);

//Criação de cliente
app.post('/api/v1' + createClient.router, createClient.controller);
app.delete('/api/v1' + deleteClient.router, deleteClient.controller);
app.get('/api/v1' + findClient.router, findClient.controller);
app.get('/api/v1' + findAllClient.router, findAllClient.controller);
app.put('/api/v1' + updateClient.router, updateClient.controller);

//Criação de Módulo Relay
app.post('/api/v1' + createRelayModule.router, createRelayModule.controller);
app.post('api/v1' + createRelayModuleInputOutput.router, createRelayModuleInputOutput.controller)
app.delete('/api/v1' + deleteRelayModule.router, deleteRelayModule.controller);
app.get('/api/v1' + findRelayModule.router, findRelayModule.controller);
app.get('/api/v1' + findAllRelayModules.router, findAllRelayModules.controller);
app.get('/api/v1' + findAllClientRelayModules.router, findAllClientRelayModules.controller);
app.put('/api/v1' + updateRelayModule.router, updateRelayModule.controller);

//Criação de Entradas(inputs)
app.post('/api/v1' + createInput.router, createInput.controller);
app.delete('/api/v1' + deleteInput.router, deleteInput.controller);
app.get('/api/v1' + findInput.router, findInput.controller);
app.get('/api/v1' + findAllInput.router, findAllInput.controller);
app.put('/api/v1' + updateInput.router, updateInput.controller);

/*app.post('/api/v1'+ createOutput.router, createOutput.controller);
app.delete('/api/v1'+ deleteOutput.router, deleteOutput.controller);
app.get('/api/v1'+ findOutput.router, findOutput.controller);
app.get('/api/v1'+ findAllOutput.router, findAllOutput.controller);
app.put('/api/v1'+ updateOutput.router, updateOutput.controller);*/

//-------------------------------------------------------------------------------------
//OutputIr
app.post('/api/v1' + createOutputIrRouter.router, createOutputIrRouter.controller);
app.get('/api/v1' + getAllOutputIrRouter.router, getAllOutputIrRouter.controller);
app.put('/api/v1' + updataOutputIrRouter.router, updataOutputIrRouter.controller )

//Output Relay
app.post('/api/v1' + createOutputRelayRouter.router, createOutputRelayRouter.controller)
app.get('/api/v1' + getAllOutputRelayRouter.router, getAllOutputRelayRouter.controller)
app.put('/api/v1' + updateOutputRelayRouter.router, updateOutputRelayRouter.controller)

//Output RGB
app.post('/api/v1' + createOutputRGBRouter.router, createOutputRGBRouter.controller)
app.get('/api/v1' + getAllOutputRGBRouter.router, getAllOutputRGBRouter.controller)

//Criação de Módulo IRGB
app.post('/api/v1' + createIRGB.router, createIRGB.controller);
app.delete('/api/v1' + deleteIRGB.router, deleteIRGB.controller);
app.get('/api/v1' + findIRGB.router, findIRGB.controller);
app.get('/api/v1' + findAllIRGB.router, findAllIRGB.controller);
app.get('/api/v1' + findAllFromClientIRGB.router, findAllFromClientIRGB.controller);
app.put('/api/v1' + updateIRGB.router, updateIRGB.controller);
//-------------------------------------------------------------------------------------

//Espaços
app.post('/api/v1' + createSpace.router, createSpace.controller);
app.delete('/api/v1' + deleteSpace.router, deleteSpace.controller);
app.get('/api/v1' + findSpace.router, findSpace.controller);
app.get('/api/v1' + findAllSpaces.router, findAllSpaces.controller);
app.put('/api/v1' + updateSpace.router, updateSpace.controller);

//Eventos
app.post('/api/v1' + createEvent.router, createEvent.controller);
app.delete('/api/v1' + deleteEvent.router, deleteEvent.controller);
app.get('/api/v1' + findEvent.router, findEvent.controller);
app.get('/api/v1' + findAllEvents.router, findAllEvents.controller);
app.put('/api/v1' + updateEvent.router, updateEvent.controller);

//Device Loads
app.post('/api/v1' + createDeviceLoad.router, createDeviceLoad.controller);
app.delete('/api/v1' + deleteDeviceLoad.router, deleteDeviceLoad.controller);
app.get('/api/v1' + findDeviceLoad.router, findDeviceLoad.controller);
app.get('/api/v1' + findAllDevicesLoad.router, findAllDevicesLoad.controller);
app.put('/api/v1' + updateDeviceLoad.router, updateDeviceLoad.controller);

//Devices IR
app.post('/api/v1' + createDeviceIR.router, createDeviceIR.controller);
app.delete('/api/v1' + deleteDeviceIR.router, deleteDeviceIR.controller);
app.get('/api/v1' + findDeviceIR.router, findDeviceIR.controller);
app.get('/api/v1' + findAllDevicesIR.router, findAllDevicesIR.controller);
app.put('/api/v1' + updateDeviceIR.router, updateDeviceIR.controller);

//Cenários
app.post('/api/v1' + createScene.router, createScene.controller);
app.delete('/api/v1' + deleteScene.router, deleteScene.controller);
app.get('/api/v1' + findScene.router, findScene.controller);
app.get('/api/v1' + findAllScenes.router, findAllScenes.controller);
app.put('/api/v1' + updateScene.router, updateScene.controller);
app.get('/api/v1' + findAllUserScenes.router, findAllUserScenes.controller)
//Procurar por Módulos e MQTT
app.get('/api/v1/searchmodules', DiscoveryModules);
app.get('/api/v1/mqtt', mqttAlive);


server.listen(PORT, () => {
	console.log(`Server is running now ${PORT}`);
});