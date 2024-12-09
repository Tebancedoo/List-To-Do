// Importar las dependencias necesarias
const express = require('express');  
const path = require('path');       
const cors = require('cors');       
const { Client } = require('pg');


// Crear una aplicación Express
const app = express();

// Habilitar CORS (si tu frontend y backend están en diferentes puertos)
app.use(cors());

// Configurar la conexión a la base de datos PostgreSQL
const client = new Client({
    user: 'postgres',            
    host: 'localhost',           
    database: 'project',         
    password: '0',               
    port: 5432,
});

// Conectar con la base de datos
client.connect()
  .then(() => {
    console.log('Conectado a PostgreSQL');
  })
  .catch(err => {
    console.error('Error al conectar a PostgreSQL', err.stack);
    process.exit(1);  
  });
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Bienvenido a la API de Node.js' });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
} else {

    app.get('/', (req, res) => {
    res.send('Servidor corriendo en modo desarrollo');
  });



  // obtener las notas
  app.get('/notes', (req, res) => {
    const query = 'SELECT * FROM notes';
    client.query(query)
    .then(result => {
        res.json(result.rows);
    })
    .catch(err => {
        console.log("Error al consultar las notas");
        res.status(500).send("Error al obtener las notas");
    });
  });


   // crear las notas
   app.post('/addnotes', (req, res) => {
    const {msj} = req.body; 
    if (!msj) {
        return res.status(400).json({ error: 'Falta la nota' });
    }

    const query = 'INSERT INTO notes (note_val) VALUES($1) RETURNING *';

    client.query(query,[msj])
    .then(result => {
        const nuevaNota = result.rows[0];
        res.status(201).json({
            message: 'Nota creada con éxito',
        });

    })
    .catch(err => {
        console.error('Error al insertar la nota', err.stack);
        res.status(500).send('Error al insertar la nota');
      });
  });


// Editar notas
app.put('/editnote/:id', (req,res) =>{
    const {id} = req.params;
    const {msj} = req.body;

    if(!msj){
        return res.status(404).json({ error: 'Falta el mensaje' }); 
    }

    //limpia cualquier cosa que no sea numero
    const cleanedId = id.replace(/\D/g, '');
    const query = 'UPDATE notes SET note_val = $1 WHERE note_id = $2 RETURNING * ';
    client.query(query, [msj,cleanedId])
    .then(result => {

        if (result.rows.length === 0){
            return res.status(400).json({ error: 'Nota no encontrada' }); 
        }

        res.status(200).json({
            message: 'Nota actualizada con éxito',
            noteUpdate: result.rows[0],
        });
    })

    .catch(err => {
        console.error('Error al actualizar la nota', err.stack);
        res.status(500).send('Error al actualizar la nota');
      });
});


// Eliminar una nota
app.delete('/deletenote/:id', (req,res) => {
    const {id} = req.params;

    if(!id){
        return res.status(404).json({ error: 'Falta el id' }); 
    }
     const cleanedId = id.replace(/\D/g, '');

    const query = 'DELETE FROM notes WHERE note_id = $1 RETURNING * ';
    client.query(query, [cleanedId])
    .then(result => {

        res.status(200).json({
            message: 'Nota eliminada con éxito',
        });

    })

    .catch(err => {
        console.error('Error al eliminar la nota', err.stack);
        res.status(500).send('Error al eliminar la nota');
      });

});

    // obtener los  usuarios
    app.get('/users', (req, res) => {
        const query = 'SELECT * FROM users';
        client.query(query)
        .then(result => {
            res.json(result.rows);
        })
        .catch (err => {
            console.log("Error al consultar los  usuarios");
            res.status(500).send("Error al obtener los  usuarios");
        });
      });
}

const PORT = process.env.PORT || 5000;  

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
