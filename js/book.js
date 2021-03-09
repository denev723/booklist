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

const getBook = async (bookId) => {
  const token = getToken();
  try {
    const res = await axios.get(`https://api.marktube.tv/v1/book/${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log("getBook error", error);
    return null;
  }
};

const deleteBook = async (bookId) => {
  const token = getToken();
  await axios.delete(`https://api.marktube.tv/v1/book/${bookId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const render = (book) => {
  const detailElement = document.querySelector("#detail");

  detailElement.innerHTML = `<div class="card bg-light w-100">
    <div class="card-header"><h4>${book.title}</h4></div>
    <div class="card-body">
      <h5 class="card-title">"${book.message}"</h5>
      <p class="card-text">글쓴이 : ${book.author}</p>
      <p class="card-text">링크 : <a href="${
        book.url
      }" target="_BLANK">바로 가기</a></p>
      <a href="/edit?id=${book.bookId}" class="btn btn-primary btn-sm">Edit</a>
      <button type="button" class="btn btn-danger btn-sm" id="btn-delete">Delete</button>
    </div>
    <div class="card-footer">
        <small class="text-muted">작성일 : ${new Date(
          book.createdAt
        ).toLocaleString()}</small>
      </div>
  </div>`;

  document.querySelector("#btn-delete").addEventListener("click", async () => {
    try {
      await deleteBook(book.bookId);
      location.href = "/";
    } catch (error) {
      console.log(error);
    }
  });
};

async function init() {
  const bookId = new URL(location.href).searchParams.get("id");

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

  const book = await getBook(bookId);
  if (book === null) {
    alert("서버에서 책 가져오기를 실패하였습니다.");
    return;
  }

  render(book);
}

document.addEventListener("DOMContentLoaded", init);
