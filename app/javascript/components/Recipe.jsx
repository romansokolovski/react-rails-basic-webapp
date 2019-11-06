import React from "react";
import { Link } from "react-router-dom";

class Recipe extends React.Component {
    /**the constructor, initialized a state object that holds the state of a recipe. **/

    constructor(props) {
        super(props);
        this.state = { recipe: { ingredients: "" } };
        this.addHtmlEntities = this.addHtmlEntities.bind(this);
        this.deleteRecipe = this.deleteRecipe.bind(this);
    }

    /** the componentDidMount method, using object destructuring, you get the id param from the props object,
     * then using the Fetch API, you make a HTTP request to fetch the recipe that owns the id
     * and save it to the component state using the setState method. If the recipe does not exist,
     * the app redirects the user to the recipes page.**/

    componentDidMount() {
        const {
            match: {
                params: { id }
            }
        } = this.props;

        const url = `/api/v1/show/${id}`;

        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(response => this.setState({ recipe: response }))
            .catch(() => this.props.history.push("/recipes"));
    }

    /**addHtmlEntities method, which takes a string and replaces all escaped opening and closing brackets with their HTML entities.
     *  This will help us convert whatever escaped character was saved in your recipe instruction:**/

    addHtmlEntities(str) {
        return String(str)
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">");
    }

    /**In the deleteRecipe method, you get the id of the recipe to be deleted,
     * then build your url and grab the CSRF token. Next, you make a DELETE request to the Recipes controller to delete the recipe.
     * If the recipe is successfully deleted, the application redirects the user to the recipes page.**/

    deleteRecipe() {
        const {
            match: {
                params: { id }
            }
        } = this.props;
        const url = `/api/v1/destroy/${id}`;
        const token = document.querySelector('meta[name="csrf-token"]').content;

        fetch(url, {
            method: "DELETE",
            headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(() => this.props.history.push("/recipes"))
            .catch(error => console.log(error.message));
    }

    /**render method, you split your comma separated ingredients into an array and mapped over it, creating a list of ingredients.
     *  If there are no ingredients, the app displays a message that says No ingredients available.
     *  It also displays the recipe image as a hero image, adds a delete recipe button next to the recipe instruction,
     *  and adds a button that links back to the recipes page.**/

    render() {
        const { recipe } = this.state;
        let ingredientList = "No ingredients available";

        if (recipe.ingredients.length > 0) {
            ingredientList = recipe.ingredients
                .split(",")
                .map((ingredient, index) => (
                    <li key={index} className="list-group-item">
                        {ingredient}
                    </li>
                ));
        }
        const recipeInstruction = this.addHtmlEntities(recipe.instruction);

        return (
            <div className="">
                <div className="hero position-relative d-flex align-items-center justify-content-center">
                    <img
                        src={recipe.image}
                        alt={`${recipe.name} image`}
                        className="img-fluid position-absolute"
                    />
                    <div className="overlay bg-dark position-absolute" />
                    <h1 className="display-4 position-relative text-white">
                        {recipe.name}
                    </h1>
                </div>
                <div className="container py-5">
                    <div className="row">
                        <div className="col-sm-12 col-lg-3">
                            <ul className="list-group">
                                <h5 className="mb-2">Ingredients</h5>
                                {ingredientList}
                            </ul>
                        </div>
                        <div className="col-sm-12 col-lg-7">
                            <h5 className="mb-2">Preparation Instructions</h5>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: `${recipeInstruction}`
                                }}
                            />
                        </div>
                        <div className="col-sm-12 col-lg-2">
                            <button type="button" className="btn btn-danger" onClick={this.deleteRecipe}>
                                Delete Recipe
                            </button>
                        </div>
                    </div>
                    <Link to="/recipes" className="btn btn-link">
                        Back to recipes
                    </Link>
                </div>
            </div>
        );
    }
}

export default Recipe;