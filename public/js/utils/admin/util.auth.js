const auth_token = JSON.parse(localStorage.getItem("x03n8af6"));
isADorAU(auth_token)

function isADorAU(authToken) {
    let token_copy = String(authToken);
    const leading_characters = token_copy.slice(0, token_copy.indexOf("-"));
    const timestamp = Number(token_copy.slice(token_copy.indexOf("-") + 1, token_copy.indexOf(":")));

    const validSessionDuration = 8 * 60 * 60 * 1000;
    const diffenceOfTimestamps = new Date().getTime() - timestamp;

    if (leading_characters === "AU") {
        if (diffenceOfTimestamps >= validSessionDuration) {
            const newValidToken = token_copy.replace("AU", "AD");
            localStorage.setItem("x03n8af6", JSON.stringify(newValidToken));
            window.location.replace("/login");
        }
        else {
            return true;
        }
    }
    else if (leading_characters === "AD") {
        window.location.replace("/login");
    }
    else {
        window.alert("Your auth credentials have been invalidated.\nRedirecting you to login now.")
        window.location.replace("/login");
    }
}