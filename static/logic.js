
document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {
    const button = document.getElementById("submitButton");
    const headingsButton = document.getElementById("headingsButton")
    console.log(button);

    const keyword = document.getElementById("mainKeyword");
    const subKeyword = document.getElementById("sub-keywords");
    const textLength = document.getElementById("textLength");

    keyword.addEventListener("keyup", updateDisabledState)
    subKeyword.addEventListener("keyup", updateDisabledState)
    textLength.addEventListener("change", updateDisabledState)

    headingsButton.onclick = function (event) {
        event.preventDefault()
        const keyword = document.getElementById("mainKeyword").value;
        const subKeyword = document.getElementById("sub-keywords").value;
        const textLength = document.getElementById("textLength").value;

        setLoadingState(headingsButton)

        const body = { keyword: keyword, subKeyword: subKeyword, textLength: textLength }

        fetch("/api/headings", {
            method: "POST", 
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        })
        
        .then(response => response.json())
        .then(handleHeadingsResponse)

    }

    button.onclick = function (event) {
        event.preventDefault()
        const keyword = document.getElementById("mainKeyword").value;
        const subKeyword = document.getElementById("sub-keywords").value;
        const textLength = document.getElementById("textLength").value;

        setLoadingState(button)

        const body = { keyword: keyword, subKeyword: subKeyword, textLength: textLength }

        fetch("/api/seo", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        })

            .then(response => response.json())
            .then(handleResponse)

        console.log(keyword, subKeyword, textLength)
        console.log(body)

        console.log(event)

    }

}

function handleHeadingsResponse(response) {
    console.log(response.data)
    console.log(response.data.length)

    addCheckboxes(response.data.length, response.data)

    const headingsButton = document.getElementById("headingsButton")
    removeLoadingState(headingsButton)

    const chooseHeadingsButtonDiv = document.getElementById("chooseHeadingsButtonDiv")
    chooseHeadingsButtonDiv.removeAttribute("hidden")

}

function handleResponse(response) {

    const outputField = document.getElementById("outputField")
    outputField.innerHTML = response.map(value => value.section).join("\n")

    const button = document.getElementById("submitButton");

    removeLoadingState(button)

    console.log(response)

}

function updateDisabledState() {
    const button = document.getElementById("submitButton");
    if (allValid()) {
        button.disabled = false
    } else {
        button.disabled = true
    }
}

function allValid(event) {

    const keyword = document.getElementById("mainKeyword").value;
    const subKeyword = document.getElementById("sub-keywords").value;
    const textLength = document.getElementById("textLength").value;

    if (keyword === "" || subKeyword === "" || textLength === "Text length")
        return false


    return true

}

function setLoadingState(button) {
    const span = document.createElement("span")
    span.classList.add("spinner-border")
    span.classList.add("spinner-border-sm")

    button.appendChild(span)
    button.disabled = true
}

function removeLoadingState(button) {
    button.disabled = false
    const span = button.getElementsByClassName("spinner-border")[0]
    button.removeChild(span)
}

function createCheckbox(response, n) {
    const new_div = document.createElement("div")
    new_div.classList.add("form-check")

    const input = document.createElement("input")
    input.classList.add("form-check-input")
    input.type = "checkbox"
    input.value = ""
    input.id = response[n]

    const lable = document.createElement("lable")
    lable.classList.add("form-check-lable")
    lable.htmlFor = response[n]
    lable.innerHTML = response[n]

    new_div.appendChild(input)
    new_div.appendChild(lable)

    return new_div
}

function addCheckboxes(n, response) {
    const div = document.getElementById("boxDiv")

    for (let i = 0; i < n; i++) {
        new_div = createCheckbox(response, i)
        div.appendChild(new_div)
    }
}