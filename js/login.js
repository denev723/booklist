const getToken = () => localStorage.getItem("token");

const handleSubmit = async (e) => {
  event.preventDefault();
  event.stopPropagation();

  const emailElement = document.querySelector("#email");
  const passwordElement = document.querySelector("#password");

  const email = emailElement.value;
  const password = passwordElement.value;

  try {
    const res = await axios.post("https://api.marktube.tv/v1/me", {
      email,
      password,
    });
    const { token } = res.data;
    localStorage.setItem("token", token);
    location = "/";
  } catch (error) {}
};

const btnLogin = () => {
  const form = document.querySelector("#form-login");
  form.addEventListener("submit", handleSubmit);
};

async function init() {
  btnLogin();

  const token = getToken();
  if (token !== null) {
    location.assign("/");
    return;
  }
}

document.addEventListener("DOMContentLoaded", init);
