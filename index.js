const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const BOOKS_TYPE = '2-26094705';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const apiUrl = `https://api.hubapi.com/crm/v3/objects/${BOOKS_TYPE}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const params = {
        properties: 'name,isbn,publisher',
    }

    try {
        const response = await axios.get(apiUrl, { headers, params });
        const books = response.data.results;
        res.render('books', { title: 'List of books', books });
    } catch (err) {
        console.error(err);
        res.render('error');
    }
})
// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj/:id', async (req, res) => {
    const apiUrl = `https://api.hubapi.com/crm/v3/objects/${BOOKS_TYPE}/${req.params.id}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json',
    };
    const params = { properties: 'name,isbn,publisher' }

    try {
        const response = await axios.get(apiUrl, { headers, params });
        const book = response.data;
        res.render('updates', { title: 'Update Custom Object Form | Integrating With Hubspot I Practicum.', book });
    } catch (err) {
        console.error(err);
        res.render('error');
    }
})

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj/:id', async (req, res) => {
    const apiUrl = `https://api.hubapi.com/crm/v3/objects/${BOOKS_TYPE}/${req.params.id}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.patch(apiUrl, { properties: req.body }, { headers });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('error');
    }
})


app.get('/create-cobj', (req, res) => {
    res.render('create', { title: 'Create Custom Object Form | Integrating With Hubspot I Praticum' });
})

app.post('/create-cobj', async (req, res) => {
    const apiUrl = `https://api.hubapi.com/crm/v3/objects/${BOOKS_TYPE}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json',
    }

    try {
        const response = await axios.post(apiUrl, { properties: req.body }, { headers });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('error');
    }
})

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));