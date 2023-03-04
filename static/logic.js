
document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {
    const button = document.getElementById("submitButton");
    console.log(button);

    const keyword = document.getElementById("mainKeyword");
    const subKeyword = document.getElementById("sub-keywords");
    const textLength = document.getElementById("textLength");

    keyword.addEventListener("keyup", updateDisabledState)
    subKeyword.addEventListener("keyup", updateDisabledState)
    textLength.addEventListener("change", updateDisabledState)


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