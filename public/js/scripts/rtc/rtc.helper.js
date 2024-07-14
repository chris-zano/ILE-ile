const userData = JSON.parse(window.sessionStorage.getItem("auth-user")) || undefined;

if (!userData) window.location.replace("/login");

