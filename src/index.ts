import express from 'express';
import cors from 'cors';
import dontenv from 'dotenv';
import router from './routes/serviceRoute';

dontenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
