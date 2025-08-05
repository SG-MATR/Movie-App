import starImage from '../../public/star.svg'
const MovieCard = ({movie}) => {
 const ratingStars = Array.from({ length: Math.floor(movie.vote_average) });  
  return (
        <div className='movie-card'>
            <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`:''} alt={movie.title}/>
        <div className='mt-4'>
            <h3 className='text-start'>{movie.title}</h3>
            <div className='content'>
                <div className='rating'>
                    <img src={starImage} alt="star icon" />
                    <p>{movie.vote_average?movie.vote_average.toFixed(1):'N/A'}</p>
                </div>
                <span>.</span>
                <p className='lang'>{movie.original_language}</p>
                <span>.</span>
                <p className='year'>
                    {movie.release_date? movie.release_date.split('-')[0]:'N/A'}
                </p>
            </div>
        </div> 
        </div>
  )
}

export default MovieCard