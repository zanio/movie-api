import express from 'express';
import session from './session';

const router = express.Router();

import comment from './comment';

router.get('/test', (request, response) =>{
  return response.status(200)
    .json({message: 'paresh'});
});

router.use('/api/comments', comment);
router.use('/api/sessions', session);

export default router;
