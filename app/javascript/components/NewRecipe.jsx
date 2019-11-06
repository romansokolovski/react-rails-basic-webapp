import React from "react";
import { Link } from "react-router-dom";

class NewRecipe extends React.Component {

    /**NewRecipe component’s constructor, you initialized your state object with empty name, ingredients, and instruction fields.
     *  These are the fields you need to create a valid recipe.
     *  You also have three methods; onChange, onSubmit, and stripHtmlEntities, which you bound to this.**/

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            ingredients: "",
            instruction: ""
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.stripHtmlEntities = this.stripHtmlEntities.bind(this);
    }

    /**stripHtmlEntities method, you’re replacing the < and > characters with their escaped value.
     * This way you’re not storing raw HTML in your database.**/

    stripHtmlEntities(str) {
        return String(str)
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    /**In the onChange method, you used the ES6 computed property names to set the value of every user input to its
     * corresponding key in your state.**/

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    /**In the onSubmit method, you checked that none of the required inputs are empty.
     * You then build an object that contains the parameters required by the recipe controller to create a new recipe.
     * Using regular expression, you replace every new line character in the instruction with a break tag,
     * so you can retain the text format entered by the user.**/

    onSubmit(event) {
        event.preventDefault();
        const url = "/api/v1/recipes/create";
        const { name, ingredients, instruction } = this.state;

        if (name.length == 0 || ingredients.length == 0 || instruction.length == 0)
            return;

        const body = {
            name,
            ingredients,
            instruction: instruction.replace(/\n/g, "<br> <br>")
        };

        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(url, {
            method: "POST",
            headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(response => this.props.history.push(`/recipe/${response.id}`))
            .catch(error => console.log(error.message));
    }

    /**n the render method, you have a form that contains three input fields;
     * one for the recipeName, recipeIngredients, and instruction.
     * Each input field has an onChange event handler that calls the onChange method.
     * Also, there’s an onSubmit event handler on the submit button that calls the onSubmit method which then submits the form data.**/

    render() {
        return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col-sm-12 col-lg-6 offset-lg-3">
                        <h1 className="font-weight-normal mb-5">
                            Add a new recipe to the recipe collection.
                        </h1>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label htmlFor="recipeName">Recipe name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="recipeName"
                                    className="form-control"
                                    required
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="recipeIngredients">Ingredients</label>
                                <input
                                    type="text"
                                    name="ingredients"
                                    id="recipeIngredients"
                                    className="form-control"
                                    required
                                    onChange={this.onChange}
                                />
                                <small id="ingredientsHelp" className="form-text text-muted">
                                    Separate each ingredient with a comma.
                                </small>
                            </div>
                            <label htmlFor="instruction">Preparation Instructions</label>
                            <textarea
                                className="form-control"
                                id="instruction"
                                name="instruction"
                                rows="5"
                                required
                                onChange={this.onChange}
                            />
                            <button type="submit" className="btn custom-button mt-3">
                                Create Recipe
                            </button>
                            <Link to="/recipes" className="btn btn-link mt-3">
                                Back to recipes
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewRecipe;