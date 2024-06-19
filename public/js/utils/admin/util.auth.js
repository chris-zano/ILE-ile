/**
 * Retrieves the authentication token from localStorage and validates it.
 */
const authToken = JSON.parse(localStorage.getItem("x03n8af6"));
isADorAU(authToken);

/**
 * Validates the authentication token and handles session management.
 * If the prefix is (AU), the user is an "Active User" and the user session is valid for 8 hours from the time the token was created.
 * If the current difference in the timestamps from now to when the session token was created is greater than the valid session duration, 
 * an expired token is set to indicate the session is invalid, and the user is redirected to login.
 * If the prefix is (AD) or any other value, the session is considered invalid, and the user is redirected to login.
 * 
 * @param {string} authToken - The authentication token to be validated.
 */
function isADorAU(authToken) {
    let tokenCopy = String(authToken);
    const leadingCharacters = tokenCopy.slice(0, tokenCopy.indexOf("-"));
    const timeStampFromAuthToken = Number(tokenCopy.slice(tokenCopy.indexOf("-") + 1, tokenCopy.indexOf("::")));

    const validSessionDurationInMilliseconds = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
    const differenceOfTimestamps = new Date().getTime() - timeStampFromAuthToken;
    const isCurrentSessionValid = differenceOfTimestamps < validSessionDurationInMilliseconds;

    if (leadingCharacters === "AU" && isCurrentSessionValid) {
        return true;
    }

    if (leadingCharacters === "AD" || leadingCharacters !== "AU") {
        window.alert("Your auth credentials have been invalidated.\nRedirecting you to login now.");
        return window.location.replace("/login");
    }

    const setExpiredToken = tokenCopy.replace("AU", "AD");
    localStorage.setItem("x03n8af6", JSON.stringify(setExpiredToken));
    return window.location.replace("/login");
}
