/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

const DishSearch = () => {
  const [query, setQuery] = useState('');
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchDishes = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch dishes');
      }
      
      const data = await response.json();
      setDishes(data.results || []);
    } catch (err) {
      setError('Failed to fetch dishes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

    const getRecipeDetails = async(id) => {
      setRecipeLoading(true);
      setError(null);
      try{
        const response = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
        )
        if(!response.ok) throw new Error("information not fetched");
        const data = await response.json();
        setSelectedRecipe(data);
      } catch (err){
        setError('Failed to fetch recipe details, Please try again.');
      } finally{
        setLoading(false);
      }
  };

  const handleDishClick = (id) => {
    getRecipeDetails(id);
  }


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">DisHub</h1>
        
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchDishes()}
              placeholder="Search for dishes..."
              className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <Search className="absolute right-4 top-4 text-gray-400" />
          </div>
          <button
            onClick={searchDishes}
            disabled={loading}
            className="px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && (
          <div className="p-4 mb-8 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dishes.map((dish) => (
            <div 
            key={dish.id} 
            onClick={() => handleDishClick(dish.id)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={dish.image}
                alt={dish.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = "/api/placeholder/400/320";
                }}
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:cursor-pointer">
                  {dish.title}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {dishes.length === 0 && hasSearched && !loading && !error && (
          <div className="text-center text-gray-500 mt-8">
            No dishes found. Try searching for something!
          </div>
        )}
        {selectedRecipe && (
          <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
          <DialogContent className="sm:max-w-md max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogTitle>{selectedRecipe.title}</DialogTitle>
            <DialogDescription>
              <img src={selectedRecipe.image} alt={selectedRecipe.title} className="w-full rounded-lg mb-4" />
              <h3 className="text-lg font-semibold">Ingredients:</h3>
              <ul className="list-disc ml-6">
                {selectedRecipe.extendedIngredients.map((ingredient) => (
                  <li key={ingredient.id}>{ingredient.original}</li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold mt-4">Instructions:</h3>
              <p className="mt-2">{selectedRecipe.instructions || "No instructions available."}</p>
            </DialogDescription>
            <DialogClose asChild>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg mt-4">Close</button>
            </DialogClose>
          </DialogContent>
        </Dialog>
        )}
      </div>
    </div>
  );
};

export default DishSearch;