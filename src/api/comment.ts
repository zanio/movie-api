import {CheckMovieExist} from "../middleware/checkMovieExist";

const Comment = require('../persistence/comments');
import express from "express";

const router = express.Router();

router.post('/:movie_id', CheckMovieExist, async (request, response) => {
  try {
    const {content}: {content: string} = request.body;
    const movie_id = request.params.movie_id;

    if (!content) {
      return response
        .status(400)
        .json({message: 'content must be provided'});
    }
    if(content.length> 500){
      return response
        .status(400)
        .json({message: 'content length must be greater than 500 characters'});
    }
    const reg = /^\d+$/;
    if(!reg.test(movie_id)){
      return response
        .status(400)
        .json({message: 'movie_id can only be numeric value'});
    }

    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress
    const payload ={
      content,movie_id:Number(movie_id),ip
    }

    const comment = await Comment.create(payload);
    return response.status(200).json(comment);
  } catch (error) {
    console.error(
      `createComment({ content: ${request.body.content} }) >> Error: ${error.stack}`
    );
    response.status(500).json();
  }
});

router.get('/:comment_id', async (request
  , response) => {
  const paramsId = request.params.comment_id;
  const testUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
    .test(paramsId);
  if(!testUUID){
    return response
      .status(400)
      .json({message: 'comment_id must be valid uuid'});
  }

  try {
    const comment = await Comment.find(paramsId);
    if (!comment) {
      return response
        .status(400)
        .json({message: 'comment not found'});
    }
    return response.status(200)
      .json({message: 'Comment successfully retrieved', data: comment});

  } catch (err) {
    return response
      .status(500)
      .json({message: err.toString()});
  }
})

export default router
