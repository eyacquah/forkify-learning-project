import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

// https://forkify-api.herokuapp.com/v2

// if (module.hot) {
//   module.hot.accept();
// }

async function controlRecipes() {
  try {
    // Get the id from the hash in url
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // Get recipe data from api / Load Recipe
    await model.loadRecipe(id);
    // RENDERING RECIPE view
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
}

async function controlSearchResults() {
  try {
    // 1. Get search query from input field
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();

    // 2. Make API requests for the query
    await model.loadSearchResults(query);

    // 3. Render the results from the query
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4. Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    resultsView.renderError();
    console.error(error);
  }
}

function controlPagination(goToPage) {
  // 1. Render New results based on page selected
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2. Render new pagination buttons
  paginationView.render(model.state.search);
}

function controlServings(newServings) {
  // Update the recipe serviings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

function controlBookmark() {
  // Add or Delete Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

// Load Bookmarks
function controlLoadBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  try {
    // Show loading Spinner
    addRecipeView.renderSpinner();

    // Upload Recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Succes Message
    addRecipeView.renderMessage();

    // Render Bookmark
    bookmarksView.render(model.state.bookmarks);

    // Change ID in url
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Close Form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
}

function newFeature() {
  console.log("Code I wrote from a new git branch just created. :)");
}

// Publisher - Subscriber Pattern
function init() {
  bookmarksView.addHandlerRender(controlLoadBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
}

init();
