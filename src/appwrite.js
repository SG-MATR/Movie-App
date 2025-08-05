import { Client, Databases, ID, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const APPWRITE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID
const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
const database = new Databases(client)



export const updateSearchCount = async(searchTerm,movie)=>{
    // Use appwrite sdk to check if the search term exists in the database
    try {
        const result = await database.listDocuments(DATABASE_ID,APPWRITE_COLLECTION_ID,[
            Query.equal('searchTerm',searchTerm)
        ]);
    // if the document founded in database so increase the count    
        if(result.documents.length>0){
            const doc = result.documents[0];
            await database.updateDocument(DATABASE_ID,APPWRITE_COLLECTION_ID,doc.$id,{
                count:doc.count+1
            })
    // if not found then create a new document with the search term and set count to 1 which it's default    
        }else{
            await database.createDocument(DATABASE_ID,APPWRITE_COLLECTION_ID,ID.unique(),{
                searchTerm,
                count:1,
                movie_id:movie.id,
                poster_url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })
        }
    } catch (error) {
        
    }
}

export const getTrendingMovies = async()=>{
    try {
        const results = await database.listDocuments(DATABASE_ID,APPWRITE_COLLECTION_ID,[
            Query.limit(5),
            Query.orderDesc('count')
        ]);
        return results.documents;
    } catch (error) {
        console.log(error)
    }
}