import fs from 'fs';
import path from 'path'
import admin from 'firebase-admin';
import express from 'express';
import 'dotenv/config';
import { db, connectToDb } from './db.js';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse(
    fs.readFileSync('./credentials.json')
);
admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

// Init the server app
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

const prepareArticle = (article, uid) => {
    if (article) {
        article.comments = article.comments || [];
        article.upvoteIds = article.upvoteIds || [];
        article.canUpvote = uid && !article.upvoteIds.includes(uid);
    }  
}

app.use(async (req, res, next) => {
    const { authtoken } = req.headers;

    if (authtoken) {
        try {
            req.user = await admin.auth().verifyIdToken(authtoken);
        } catch (e) {
            return res.status(400).send('Unable to verify authtoken.');
        }
    } else {
        console.log(`No auth token found.`);
    }

    req.user = req.user || {};

    next();
});

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;
    const { uid } = req.user;

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        prepareArticle(article, uid);
        res.status(200).json(article);
    } else {
        res.status(404).send(`Article not found.`)
    }
})

app.use((req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.send(401).send('Not allowed.');
    }
});

app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;
    const { uid } = req.user;

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        const upvoteIds = article.upvoteIds || [];
        const canUpvote = uid && !upvoteIds.includes(uid);

        if (canUpvote) {
            await db.collection('articles').updateOne({ name }, {
                $inc: { upvotes: 1 },
                $push: { upvoteIds: uid },
            });
        }

        const updatedArticle = await db.collection('articles').findOne({ name });
        prepareArticle(updatedArticle, uid);
        res.status(200).json(updatedArticle);
    } else {
        res.status(404).send(`Article not found.`)
    }
});

app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;
    const { text } = req.body;
    const { email } = req.user;
    const { uid } = req.user;

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        if (!text) {
            return res.status(400).send(Error ('Comment is required.'));
        }
        await db.collection('articles').updateOne({ name }, {
            $push: { comments: { email, text } },
        });

        const updatedArticle = await db.collection('articles').findOne({ name });
        prepareArticle(updatedArticle, uid);
        res.status(200).json(updatedArticle);
    } else {
        res.status(404).send(`Article not found.`)
    }
});

app.put('/api/articles/:name/clear-interactions', async (req, res) => {
    const { name } = req.params;
    const { uid } = req.user;

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        const canClearAll = uid && req.user.email === 'admin@my-blog.com';

        if (canClearAll) {
            await db.collection('articles').updateOne({ name }, {
                $set: { upvotes: 0, upvoteIds: [], comments: [] },
            });
            console.log(`Cleared all interactions for ${name}`);
        }

        const updatedArticle = await db.collection('articles').findOne({ name });
        prepareArticle(updatedArticle, uid);
        res.status(200).json(updatedArticle);
    } else {
        res.status(404).send(`Article not found.`)
    }
});

// Start the listener (Use port from prod host, or default to 8000 for dev)
const PORT = process.env.PORT || 8000;
connectToDb(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}!`)
    });
});