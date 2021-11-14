import express from 'express';

const router = express.Router();

import comment from './comment';
import Movie from "./Movie";


router.use('/api/v1/comments', comment);
router.use('/api/v1/movies', Movie);

export default router;
