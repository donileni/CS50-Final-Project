# SEO Generator

#### Video Demo: <https://youtu.be/fPBFdp_rV9A>

#### Description:

This is my final project in Harvard's [CS50](https://cs50.harvard.edu/x/2022/project/) course. I decided to create an application for generating SEO-compatible content. In doing so, I combined the power of ChatGPT with Grammarly to create an application where users can create and edit content. Python is used as the backend with Flask; meanwhile, JavaScript is used to provide the application with dynamic elements.

## Download and Run

- Install Python and Git

```
# Clone repository
git clone https://github.com/donileni/CS50-Final-Project.git

# Change directory
cd CS50-Final-Project

# Install requirements
pip install -r requirements.txt
# or
pip3 install -r requirements.txt
```

- Add an `OPENAI_API_KEY` and `GRAMMARLY_CLIENT_ID` to the `.env.example` file (remove `.example`)

```
# Run flask server
$ flask run
```

### Documentation
To better understand how the app works, I will briefly break down each file, and the code contained within, starting with `app.py`. 

### `app.py`
`app.py` contains the code for the backend Flask application. The file contains required imports, including ’openai’ and ’flask’. What’s more, the file additionally contains three routes and four functions: 

*Routes*

- `/`: This route is responsible for rendering `index.html` and passing along the ’GRAMMARLY_CLIENT_ID’ variable. 

- `/api/seo`: This route features a `POST` method and is responsible for passing along the generated content to the frontend. As such, it initially fetches the user’s input from the frontend, which are a few headings. From there, the route calls the ´generate_content()´ and returns the result.

- `/api/headings`: The third route also features a `POST` method and is responsible for passing along the generated headings to the frontend. It initially fetches the user inputs, including the main keyword, sub-keyword, etc. From there, it uses this data when calling the `generate_suggested_headings()` function. Lastly, the suggested headings are returned.

*Functions*

- `create_prompts()`: This function is responsible for generating the prompts asked to ChatGPT using the headings chosen by the user.

- `generate_section()`: This function uses the OpenAI API to generate a single section using a prompt provided as an argument.

- `generate_content()`: This function takes the headings chosen in the app’s UI as an argument. From there, it calls the `create_prompts()` function to generate the prompts. Then it loops throng the list of prompts to generate each section, which is saved in the `sections` array. 

- `generate_suggested_headings()`: This is the last function, and it takes the keyword and sub-keyword from the UI as arguments. From there, the OpenAI API is used to create a fixed number of headings and add them to a list. Next, we tidy up the list and return all the headings. 


### `logic.js`
`logic.js` contains all the JavaScript logic for the application, which is how we are able to add dynamic elements to the application. To begin with, this file adds an event listener for `DOMContentLoaded` that runs the `onLoad()` function when all the HTML code is completely rendered. 

- `onLoad()`: To begin with, this function queries all the buttons and input fields of the webpage. Next, we add a few event listeners to the input fields, ensuring that the users have inputted information before they can proceed. Next, we add a couple of on-click events to the various buttons. For instance, for the `headingsButton`, we add an on-click event that takes the value of the input fields and passes them along to the backend. 

- `handleHeadingsResponse()`: This function creates buttons for the various headings generated in the backend. From there, it adds an on-click event to each, allowing the users to pick a fixed number of headings based on the text length.This function additionally checks if a button has been clicked adding a symbol indicating in which order the headings have been chosen. It also adds/removes headings from the `selectedHeadingsList` array when a user clicks the various alternatives.

- `handleResponse()`: This function triggers when the users are done selecting headings. It populates the text area with the content generated in the backend. From there, it also removes the loading state from the `chooseHeadingsButton`. 

- `updateDisabledState()`: Updates the state of the `headingsButton` from disabled to enabled if all input fields are valid. 

- `allValid()`: Checks if the users have inputted a keyword and selected a text length. 

- `setLoadingState()`: Adds a spinner to a button when called and disables the button in question. 

- `removeLoadingState()`: Removes the spinner from a button and reenables the button in question. 

- `createButton()`: Creates a button for the headings with the right classes, id, etc. 

- `addButtons()`: Adds the headings buttons created using the ´createButton()´ function to a list element on the app's UI. 

- `createSpan()`: Creates a new span and adds it to the headings buttons when the user picks a heading. 

- `clearAllHeadings()`: Removes all the headings buttons and updates the state of the 
`chooseHeadingsButton`.

- `changeCopyButton()`: Temporarily updates the copy button to indicate that it has been clicked and has copied the contents of the text area. 

- `setMaxHeadings()`: Sets the max number of headings based on the text length chosen by the users. 

- `fadeIn()`: Adds a fade-in effect for a container based on its `id`.

### `layout.html`
The `layout.html` file creates the foundational layout for the page. This is where Bootstrap is added along with the `logic.js` and `styles.css` files. 

### `index.html`
`index.html` extends `layout.html`, and it contains all the code for the necessary HTML elements. What’s more, this is also where we add Grammarly using the client ID specified as an environment variable. 

### `styles.css`
`styles.css` contains the code for adding additional styling to the HTML elements. 
