import express from "express";
import {HttpService} from "../modules/HttpService";
import dotenv from "dotenv";
import {CheckMovieExist} from "../middleware/checkMovieExist";
import {reduceFn, sortFn} from "../modules/utility";
const Comment = require('../persistence/comments');
const router = express.Router();
dotenv.config();

router.get('/', async (request, response) =>{
  const url = process.env.MOVIE_API_URL+"films"
 const content = await HttpService.get(url)
  const movies = content.results;
  const ids = movies.map(item=>item.url.split('/')[5]);
  const comments = await Comment.findAll();
  console.log(ids)
  const movieIdsAndCommentIdFromComments = comments.map(item=> ({
    movieId:item.movie_id,id:item.id
  }));
  console.log(movieIdsAndCommentIdFromComments)
  const baseUrl = process.env.BASE_URL+"/api/v1/comments/"
  const filmLink = "https://swapi.dev/api/films/";
  const movieResponse = [];
  const commentLinks = [];
  movieIdsAndCommentIdFromComments.forEach(({id:commentId,movieId:id}) => {
    const doesMovieIdExist = ids.filter(movieId=>id===movieId.toString());
    let newMovie =null;
    if(doesMovieIdExist){
    const filmLinkWithId = filmLink+id+"/";
      newMovie =  movies.find(item=>item.url===filmLinkWithId);
      if(newMovie){
        newMovie.comments=commentLinks.push(baseUrl+commentId);
        movieResponse.push(newMovie);
      }

    }
  });
 const movieIdFromComment = movieIdsAndCommentIdFromComments.map(item=>item.movieId.toString());
  const intersectionMovieIds = ids.filter(x => !movieIdFromComment.includes(x));
  intersectionMovieIds.forEach(id=>{
    const filmLinkWithId = filmLink+id+"/";
    const newMovie = movies.find(item=>item.url===filmLinkWithId);

    if(newMovie){
      newMovie.comments = []
      movieResponse.push(newMovie);
    }
  })

  const lastResponse = movieResponse
    .map(({release_date,title,
            opening_crawl,comments:comm,url:ul})=>({release_date,title,opening_crawl,commentCount:comm.length,comments:comm,url:ul}))
    .sort(sortFn('release_date')).reverse();

  return response.status(200)
    .json({message: 'movies successfully retrieved', data: lastResponse});
});

router.get('/:movie_id/characters', CheckMovieExist, async (request,
                                                            response) =>{

  const sortQueryString = request.query.sort as string;
  const sortsOptions = ['name','gender','height'];
  const doesSortExist = sortsOptions.includes(sortQueryString);
  if(sortQueryString && !doesSortExist){
    return response
      .status(400)
      .json({message: 'sort can only be one of name, gender, height'});
  }

  const orderBy = request.query.orderBy as string;
  const order = orderBy??'desc';

  const filterBy = request.query.filter as string;
  const filter = filterBy??'';
  if(filter && !['male','female'].includes(filter)){
    return response
      .status(400)
      .json({message: 'filter can only be ["gender"]'});
  }

  const paramsId = request.params.movie_id;
  const url = process.env.MOVIE_API_URL+"films"+"/"+paramsId;

  const data = await HttpService.get(url)
  const characters = data.characters;
  const charactersPromise =[]
  characters.forEach(itemUrl=>{
    charactersPromise.push(HttpService.get(itemUrl))
  })
 const resultCharacters = await Promise.all(charactersPromise);

  let finalResponse = [...resultCharacters];
  if(sortQueryString){
    finalResponse = finalResponse.sort(sortFn(sortQueryString))
  }

  if(filter){
    finalResponse = finalResponse.filter((item) => item.gender===filter);
  }
  const reg = /^\d+$/;
  const heights=finalResponse.filter(it=>it.height).map(it=>it.height).filter(num=>reg.test(num));
  const calculateHeight = reduceFn(heights);
  const calculateHeightInInch = calculateHeight/2.54;
  const HeightInFt = Math.floor(calculateHeightInInch/12);
  const remainingInches = calculateHeightInInch - HeightInFt * 12;
  const dataResponse = {
    characters: finalResponse,
    metadata:{
    count:finalResponse.length,
    totalHeight:finalResponse.length>0? {
      cm:calculateHeight,
      ft: `${HeightInFt}ft and ${Math.round(remainingInches)} inches `
    }:{}
    }};

  return response.status(200)
    .json({message: 'movies successfully retrieved', data:dataResponse});
});


router.get('/:movie_id/comments', CheckMovieExist, async (request
                                    , response) =>{
  const paramsId = request.params.movie_id;
  try{
    const comments = await Comment.findAllByMovieId(paramsId);
    // comment should be listed in reverse chronological order.
    return response.status(200)
      .json({message: 'characters successfully retrieved', data: comments});
  } catch (e) {
    return response
      .status(500)
      .json({message: e.toString()});
  }

});


export default router;
