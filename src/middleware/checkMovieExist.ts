import {HttpService} from "../modules/HttpService";

export const CheckMovieExist = async (request, response, next) => {
  const {movie_id} = request.params;
  console.log(movie_id,'movie_id')
  const url = process.env.MOVIE_API_URL+"films"+'/'+movie_id
  const checkIfMovieIdExist= await HttpService.get(url);
  if(!checkIfMovieIdExist){
    return response
      .status(400)
      .json({message: 'movie_id does not exist'});
  }
  next();
}

