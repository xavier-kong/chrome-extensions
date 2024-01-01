
function createButton() {
    const button = document.createElement(
        "button"
    );
    button.id = "thebutton";

    return button;
}

const toolbarDiv = document.querySelectorAll('ytd-menu-renderer');

if (toolbarDiv[0]) {
    const existingButton = document.getElementById("thebutton");
    if (!existingButton) {
        toolbarDiv[0].appendChild(createButton());
    }
}

