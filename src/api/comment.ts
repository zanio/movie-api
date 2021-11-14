const Comment = require('../persistence/comments');
import express from "express";

const router = express.Router();

router.get('/test', (request, response) =>{
  return response.status(200)
    .json({message: 'paresh'});
});

router.post('/', async (request, response) => {
  try {
    const {content}: {content: string} = request.body;
    if (!content) {
      return response
        .status(400)
        .json({message: 'content must be provided'});
    }

    const comment = await Comment.create(content);
    return response.status(200).json(comment);
  } catch (error) {
    console.error(
      `createComment({ email: ${request.body.email} }) >> Error: ${error.stack}`
    );
    response.status(500).json();
  }
});

export default router;
