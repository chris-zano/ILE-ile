const getFirebaseConfig = async () => {
    const response = await fetch(`/users/get-firebase-auth`);
    const data = await response.json();
    const status = response.status;
  
    if (status === 200) return data;
    console.log(status, "===>>", data);
    return null;
  };