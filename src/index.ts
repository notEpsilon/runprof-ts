import express from 'express';
import userAuthRouter from './routes/user.route';

const app = express();

app.use(express.json());
app.use('/auth', userAuthRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`App listening on port ${port}`));
