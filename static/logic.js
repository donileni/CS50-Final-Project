
document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {
    const button = document.getElementById("submitButton");
    const headingsButton = document.getElementById("headingsButton")

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

let selectedButtons = []

function handleHeadingsResponse(response) {

    addButtons(response.data.length, response.data)

    const headingsButton = document.getElementById("headingsButton")
    removeLoadingState(headingsButton)

    const chooseHeadingsButtonDiv = document.getElementById("chooseHeadingsButtonDiv")
    chooseHeadingsButtonDiv.removeAttribute("hidden")

    const buttons = document.getElementsByClassName("list-group-item")


    for (const button of buttons) {
        button.onclick = function () {
            
            const buttonSpan = button.querySelector(".order")
            if (!buttonSpan) {
                selectedButtons.push(button.value)
            } else {
                selectedButtons = selectedButtons.filter(value => value !== button.value)
            }
            
            const currentButtons = [...document.querySelectorAll(".order")]
            
            currentButtons.forEach(item => item.remove())

            const allButtons = document.getElementsByClassName("headingsButton")
            console.log(allButtons)
        
            for (const currentButton of allButtons) {
                const value = currentButton.value

                
                const index = selectedButtons.findIndex(item => item === value)
                if (index === -1) {
                    continue
                }

                const i = (index + 1)

                const newSpan = createSpan(value)
                newSpan.classList.add("order")
                newSpan.value = i
                newSpan.innerText = i

                currentButton.appendChild(newSpan)
            }

        }
    }

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

function createButton(response, n) {

    const button = document.createElement("button")
    const value = response[n]

    button.classList.add("list-group-item")
    button.classList.add("list-group-item-action")
    button.classList.add("d-flex")
    button.classList.add("justify-content-between")
    button.classList.add("headingsButton")
    button.type = "button"
    button.id = value
    button.innerText = value
    button.value = value

    return button
}

function addButtons(n, response) {
    const ul = document.getElementById("unorderedList")

    for (let i = 0; i < n; i++) {
        new_ls = createButton(response, i)
        ul.appendChild(new_ls)
    }
}

function createSpan(value) {
    
    const span = document.createElement("span")
    span.classList.add("badge")
    span.classList.add("bg-primary")
    span.classList.add("rounded-pill")
    span.classList.add("order")
    span.id = ("span-" + value)
    span.value = ""

    return span
}