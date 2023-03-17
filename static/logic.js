
document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {

    setTimeout(function(){
        const mainContainer = document.querySelector("#mainContainer")
        mainContainer.classList.remove("hidden")
        mainContainer.classList.add("fade-in")
    },0)

    const headingsButton = document.getElementById("headingsButton")
    const chooseHeadingsButton = document.getElementById("chooseHeadings")
    const copyButton = document.getElementById("copyButton")
    const clearButton = document.getElementById("clearButton")
    const getStartedButton = document.getElementById("getStartedButton")
    const titleField = document.getElementById("titleField")

    const keyword = document.getElementById("mainKeyword");
    const subKeyword = document.getElementById("sub-keywords");
    const textLength = document.getElementById("textLength");

    keyword.addEventListener("keyup", updateDisabledState)
    subKeyword.addEventListener("keyup", updateDisabledState)
    textLength.addEventListener("change", updateDisabledState)
    titleField.addEventListener("keyup", function(){
        if (titleField.value == "") {
            getStartedButton.disabled = true
        } else {
            getStartedButton.disabled = false
        }
    })

    updateDisabledState()

    headingsButton.onclick = function (event) {
        event.preventDefault()
        const keyword = document.getElementById("mainKeyword").value;
        const subKeyword = document.getElementById("sub-keywords").value;
        const textLength = document.getElementById("textLength").value;

        clearAllHeadings()

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

    chooseHeadingsButton.onclick = function (event) {
        event.preventDefault()
        const keyword = document.getElementById("mainKeyword").value;
        const subKeyword = document.getElementById("sub-keywords").value;
        const textLength = document.getElementById("textLength").value;

        setLoadingState(chooseHeadingsButton)

        const body = { keyword: keyword, subKeyword: subKeyword, textLength: textLength, headings: selectedHeadings }

        fetch("/api/seo", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        })

            .then(response => response.json())
            .then(handleResponse)

    }

    copyButton.addEventListener("click", function() {
        const outputField = document.getElementById("outputField")

        navigator.clipboard.writeText(outputField.value)
        changeCopyButton(copyButton)

    });

    clearButton.addEventListener("click", function() {
        const outputField = document.getElementById("outputField")

        outputField.value = ""

    });

    getStartedButton.addEventListener("click", function() {
        titleInputField = document.getElementById("titleField")
        const title = titleInputField.value
        const getStartedDiv = document.getElementById("getStartedDiv")
        
        const textOutputDiv = document.getElementById("textOutputDiv")
        const tabSection = document.getElementById("tabSection")

        const outputField = document.getElementById("outputField")
        outputField.value = ("<h1>" + title + "<h1>")

        textOutputDiv.hidden = false
        tabSection.hidden = false
        getStartedDiv.classList.toggle("d-none")
        
    })

}

let selectedHeadings = []
 
function handleHeadingsResponse(response) {

    const textLength = document.getElementById("textLength");
    let currentSelectedHeadings = 0;
    const maxHeadings = setMaxHeadings(textLength.value)

    const selectHeadingsTab = document.getElementById("nav-profile-tab")
    const selectTrigger = new bootstrap.Tab(selectHeadingsTab)

    addButtons(response.data.length, response.data)

    const headingsButton = document.getElementById("headingsButton")
    removeLoadingState(headingsButton)
    selectTrigger.show()

    const chooseHeadingsButtonDiv = document.getElementById("chooseHeadingsButtonDiv")
    chooseHeadingsButtonDiv.removeAttribute("hidden")

    const buttons = document.getElementsByClassName("list-group-item")


    for (const button of buttons) {
        button.onclick = function () {

            const buttonSpan = button.querySelector(".order")
            if (!buttonSpan) {
                selectedHeadings.push(button.value)
                currentSelectedHeadings++
            } else {
                currentSelectedHeadings--
                selectedHeadings = selectedHeadings.filter(value => value !== button.value)
            }

            const chooseHeadingsButton = document.getElementById("chooseHeadings")

            const currentButtons = [...document.querySelectorAll(".order")]
            
            currentButtons.forEach(item => item.remove())

            const allButtons = document.getElementsByClassName("headingsButton")
        
            for (const currentButton of allButtons) {
                const value = currentButton.value

                
                const index = selectedHeadings.findIndex(item => item === value)
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

            //Limit the number of headings based on textLength
            if (currentSelectedHeadings == maxHeadings) {
                chooseHeadingsButton.disabled = false
                for (const btn of buttons) {
                    const btnSpan = btn.querySelector(".order")
                    if (!btnSpan) {
                        btn.disabled = true
                    } else {
                        btn.disabled = false
                    }
                }
            } else {
                chooseHeadingsButton.disabled = true
                for (const btn of buttons) {
                    btn.disabled = false
                }
            }

        }
    }

    const chooseHeadingsButton = document.getElementById("chooseHeadings")
    chooseHeadingsButton.hidden = false

}

function handleResponse(response) {

    const outputField = document.getElementById("outputField")
    const titleField = document.getElementById("titleField")
    const title = ("<h1>" + titleField.value + "<h1>")

    
    outputField.value = (title + "\n\n" + response.map(value => value.section).join("\n"))
    

    const chooseHeadingsButton = document.getElementById("chooseHeadings");

    removeLoadingState(chooseHeadingsButton)

}

function updateDisabledState() {
    const headingsButton = document.getElementById("headingsButton");
    if (allValid()) {
        headingsButton.disabled = false
    } else {
        headingsButton.disabled = true
    }
}

function allValid(event) {

    const keyword = document.getElementById("mainKeyword").value;
    const textLength = document.getElementById("textLength").value;

    if (keyword === "" || textLength === "Text length")
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

function clearAllHeadings() {
    selectedHeadings = []
    const allButtons = [...document.querySelectorAll(".headingsButton")]

    allButtons.forEach(button => button.remove())
    const chooseHeadingsButton = document.getElementById("chooseHeadings")
    chooseHeadingsButton.disabled = true
    chooseHeadingsButton.hidden = true
}

function changeCopyButton(button) {
    button.classList.remove("btn-primary")
    button.classList.add("btn-success")

    button.innerText = " Copied!"

    const checkedIcon = document.createElement("i")
    checkedIcon.classList.add("bi")
    checkedIcon.classList.add("bi-clipboard-check")

    const originalIcon = document.createElement("i")
    originalIcon.classList.add("bi")
    originalIcon.classList.add("bi-clipboard")

    button.insertBefore(checkedIcon, copyButton.childNodes[0])
    
    setTimeout(function() {      
        button.classList.remove("btn-success")
        button.classList.add("btn-primary")
        button.innerText = " Copy"
        button.insertBefore(originalIcon, button.childNodes[0])
    }, 1000);
}

function setMaxHeadings(textLength) {
    let maxHeadings = 0;
    if (textLength == "500") {
        maxHeadings = 2
    } else if (textLength == "1000") {
        maxHeadings = 4
    } else if (textLength == "1500") {
        maxHeadings = 6
    } else {
        maxHeadings = 8
    }

    return maxHeadings
} 