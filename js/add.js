const getToken = () => localStorage.getItem("token");

const getUser = async (token) => {
  try {
    const res = await axios.get("https://api.marktube.tv/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log("getUser Error", error);
    return null;
  }
};

const handleSubmit = async (e) => {
  event.preventDefault();
  event.stopPropagation();

  const titleElement = document.querySelector("#title");
  const messageElement = document.querySelector("#message");
  const authorElement = document.querySelector("#author");
  const urlElement = document.querySelector("#url");

  const title = titleElement.value;
  const message = messageElement.value;
  const author = authorElement.value;
  const url = urlElement.value;

  if (title === "" || message === "" || author === "" || url === "") {
    alert("모든 빈칸을 채워주세요");
    return;
  }

  try {
    const token = getToken();
    await axios.post(
      "https://api.marktube.tv/v1/book",
      { title, message, author, url },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    location.href = "/booklist/";
  } catch (error) {
    console.log("save Error", error);
  }
};

const btnSave = () => {
  const form = document.querySelector("#form-add-book");
  form.addEventListener("submit", handleSubmit);
};

async function init() {
  btnSave();

  const token = getToken();
  if (token === null) {
    location.assign("/booklist/login");
    return;
  }

  const user = await getUser(token);
  if (user === null) {
    localStorage.clear();
    location.assign("/booklist/login");
    return;
  }
}

document.addEventListener("DOMContentLoaded", init);
