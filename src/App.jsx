import './App.css';
import banner from '../public/hero.png'
import Search from './components/Search';
import { useEffect, useState } from 'react';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import {useDebounce} from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL_API;
function App() {
  const [movieList,setMovieList]=useState([])
  const [isLoading,setIsLoading]=useState(false)
  const [errorMessage,setErrorMessage]=useState('')
  const [searchItem,setSearchItem]=useState('')
  const [debounceSearchTerm,setDebounceSearchTerm]=useState('');
  const [trendingMovies,setTrendingMovies]= useState([]);
  console.log(trendingMovies)
  useDebounce(()=>setDebounceSearchTerm(searchItem),500,[searchItem])

  const options={
    method:'GET',
    headers:{
      accept:'application/json',
      Authorization:`Bearer ${API_KEY}`
    }
  }
  const fetchMovies= async(query='')=>{
    setIsLoading(true)
    try {
      const endpoint = query?`${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`:`${BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint,options);
      if(!response.ok){
        throw new Error("Failed To Fetch Movies")
      }
      const data = await response.json();
      console.log(response)
      setMovieList(data.results||[]);
      setErrorMessage('');
      if(query&&data.results.length>0){
        await updateSearchCount(query,data.results[0])
      }

    } catch (error) {
      console.log(error);
      setErrorMessage("Error Fetching Movies ... Please Try Again")      
    }finally{
      setIsLoading(false)
    }
  }
  const getAllTrendingMovies = async ()=>{
    try { 
      const trendingMovies = await getTrendingMovies();
      setTrendingMovies(trendingMovies)
    } catch (error) {
      console.log(`Error Fetching Movies ${error}`)
    }
  }
  useEffect(()=>{
    fetchMovies(debounceSearchTerm);
  },[debounceSearchTerm]);
  useEffect(()=>{
     getAllTrendingMovies()
  },[])
  return (
   <main>
      <div className='pattern'/>
      <div  className='wrapper'>
        <header>
          <img src={banner} alt="" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without The Hassle</h1>
          <Search searchItem={searchItem} setSearchItem={setSearchItem}/>
        </header>
        {trendingMovies.length>0&&(
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((trendMovie,index)=>(
                <li key={trendMovie.$id}>
                  <p>{index+1}</p>
                  <img src={trendMovie.poster_url} alt={trendMovie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className='all-movies'>
          <h2>All Movies</h2>
          {isLoading?(
            <Spinner/>
          ):errorMessage?(<p className='text-red-500'>{errorMessage}</p>):(
            <ul>
              {movieList.map((movie)=>(
                <MovieCard movie={movie}/>               
              ))}
            </ul>
          )}
        </section>
      </div>
   </main>
  )
}

export default App
