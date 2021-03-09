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

const getBooks = async (token) => {
  try {
    const res = await axios.get("https://api.marktube.tv/v1/book", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log("getBook Error", error);
    return null;
  }
};

const deleteBook = async (bookId) => {
  const token = getToken();
  if (token === null) {
    location.assign("/login");
    return;
  }
  await axios.delete(`https://api.marktube.tv/v1/book/${bookId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return;
};

const logout = async (e) => {
  const token = getToken();
  if (token === null) {
    location.assign("/login");
    return;
  }
  try {
    await axios.delete("https://api.marktube.tv/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log("logout error", error);
  } finally {
    localStorage.clear();
    location.assign("/login");
  }
};

const btnLogout = () => {
  const logoutBtn = document.querySelector("#btn_logout");
  logoutBtn.addEventListener("click", logout);
};

const render = (books) => {
  const listElement = document.querySelector("#list");
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const bookElement = document.createElement("div");
    bookElement.classList.value = "col-md-4";
    bookElement.innerHTML = `
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <p class="card-text">${book.title === "" ? "제목 없음" : book.title}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <a href="/book?id=${book.bookId}">
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary"
              >
                View
              </button>
            </a>
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary btn-delete"
              data-book-id="${book.bookId}"
            >
              Delete
            </button>
          </div>
          <small class="text-muted">${new Date(
            book.createdAt
          ).toLocaleString()}</small>
        </div>
      </div>
    </div>
    `;
    listElement.append(bookElement);
  }
  document.querySelectorAll(".btn-delete").forEach((element) => {
    element.addEventListener("click", async (event) => {
      const bookId = event.target.dataset.bookId;
      try {
        await deleteBook(bookId);
        location.reload();
      } catch (error) {
        console.log(error);
      }
    });
  });
};

async function init() {
  btnLogout();

  const token = getToken();
  if (token === null) {
    location.assign("/login");
    return;
  }

  const user = await getUser(token);
  if (user === null) {
    localStorage.clear();
    location.assign("/login");
    return;
  }

  const books = await getBooks(token);
  if (books === null) {
    return;
  }

  render(books);
}

document.addEventListener("DOMContentLoaded", init);
