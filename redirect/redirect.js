const url = window.location.href;

const regexUrl = /\S+url=(?<redirectUrl>\S+)/;
const match = regexUrl.exec(url);

const redirectUrl = match.groups.redirectUrl;
