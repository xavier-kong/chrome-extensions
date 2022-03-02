const div = document.getElementById("div");
    
const paragraph = document.createElement("p");

paragraph.textContent = 'Hello. I was created dynamically';

div.appendChild(paragraph);