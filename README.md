to run: 

``` bash
cd .\tetris-javascript-main\
cd .\TetrisApp\
docker-compose up --build
```

## Workflow 1: Login y Registro de usuarios

### register
#### Uso
Como se utilizo MongoDB, el uso es atravez del endpoint *register*, donde mediante el uso de un **POST** se pueden agregar usuarios, este endpoint requiere de:
* username: *str*
* password: *str*

Esta informacion debe venir en formato JSON dentro de el body.

#### Implementacion
Mediante el uso de la biblioteca *mongoose*, se comunica la aplicacio con la base de datos, posteriormente se genera un **salted_password** la cual es asignada para ser guardada como documento dentro de la DB.
```js
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Received ∫:', req.body); // Verifica lo que llega

    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }

    // Verificar si ya existe un usuario con el mismo nombre de usuario
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already taken');
    }

    // Crear un nuevo usuario
    const user = new User({
      username,
      password: password,
    });

    // Guardar el usuario en la base de datos
    await user.save();
```


### login
#### Uso
Como se utilizo MongoDB, el uso es atravez del endpoint *login*, donde mediante el uso de un **POST** se pueden agregar usuarios, este endpoint requiere de:
* username: *str*
* password: *str*

Esta informacion debe venir en formato JSON dentro de el body.

Este endpoint retorna un JWT con la informacion del usuario y su sesion, el cual se almacena en la cookies del navegador.

#### Implementacion
Mediante el uso de *moongose*, se realiza una peticion a la base de datos la cual nos devuelve 1 o menos documentos, con esto se realiza la validacion y posterior mente se retorna un JWT

```js
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!user || ! isMatch) {
      return res.status(400).send('Invalid credentials');
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});
```
## Workflow 2: creacion y listado de lobbies
### Create
#### Uso
Como se utilizo MongoDB, el uso es atravez del endpoint *create*, donde mediante el uso de un **POST** se puede crear un lobby, este endpoint requiere de:
* name: *str*

#### Implementacion
Mediante el uso de *moongose*, se crea el lobby realizando, agregando un documento a la base de datos de lobby, con esto, se le agrega un parametro el cual es la cantidad de jugadores activos en ese momento.
```js

router.post('/create', async (req, res) => {
    try {
        const { lobby_name } = req.body;
        console.log('Received:', req.body);

        // TODO SAVE THE SCHEMA
        // Create a new lobby
        const newLobby = {
            name: lobby_name,
            current_users: 1
        };
        console.log('New lobby:', newLobby);
        // Save the lobby to the database
        const lobby = new Lobby(newLobby);
        await lobby.save();

        console.log('Lobby saved:', newLobby);

        // Associate the lobby with the user

        res.status(201).send({ message: 'Lobby created successfully', lobby: newLobby });
    } catch (error) {
        res.status(500).send({ message: 'Error creating lobby', error: error.message });
    }
});
```
### Listar lobbies
#### Uso
Simplemente se realiza un metodo get contra la ruta de `/lobby/lobbies` y retorna un arreglo de documentos con los lobbys en formato de listas html.

#### Implementacion
Se realiza con *moongose* una busqueda de todos los documentos lobby que existen y se retornan en un listados en un html.

```js
router.get('/lobbies', async (req, res) => {
    try {
        const lobbys = await Lobby.find({ createdBy: req.userId });
        console.log('Lobbies:', lobbys);
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Your Lobbies</title>
            </head>
            <body>
                <h1>Your Lobbies</h1>
                <ul>
        `;
        lobbys.forEach(lobby => {
            html += `<li><a href="${lobby._id}">${lobby.name}</a></li>`;
        });
        html += `
                </ul>
            </body>
            </html>
        `;
        res.status(200).send(html);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching lobbies', error: error.message });
    }
});
```







Por ahora, se tiene el juego separado de la app web. La app web se encuentra dentro de la carpeta del juego completo.

## Login
http://localhost:3000/login

## 

## Register
http://localhost:3000/register

## Create Lobby
http://localhost:3000/create

## View Lobbies
http://localhost:3000/lobby/lobbies
