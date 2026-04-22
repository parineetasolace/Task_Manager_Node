const BASE_URL = window.location.origin;
console.log("url: ", BASE_URL);

const myForm = document.getElementById("myForm");
const btn = document.getElementById("btn");

let token = localStorage.getItem("token");

myForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const age = document.getElementById("age").value;

  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, age }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.error);
      alert(data.error);
      return;
    }

    console.log("Signup success:", data);

    localStorage.setItem("token", data.token);
    window.location = "tasks.html";
    alert("Signup successful");
  } catch (err) {
    console.error("Error:", err);
  }
});

async function login() {
  const body = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    window.location = "tasks.html";
  } else {
    alert(data.error);
  }
}

async function logout() {
  await fetch(`${BASE_URL}/users/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  localStorage.removeItem("token");
  window.location = "login.html";
}

async function createTask() {
  const body = {
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDesc").value,
  };

  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const task = await res.json();

  if (res.ok) loadTasks();
  else alert(task.error);
}

async function loadTasks() {
  const res = await fetch(`${BASE_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const tasks = await res.json();

  const container = document.getElementById("taskList");
  container.innerHTML = "";

  tasks.forEach((task) => {
    const div = document.createElement("div");
    div.className = "box";
    div.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Completed: ${task.completed}</p>
            <button onclick="deleteTask('${task._id}')">Delete</button>
        `;
    container.appendChild(div);
  });
}

async function deleteTask(id) {
  await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  loadTasks();
}

async function loadProfile() {
  const res = await fetch(`${BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const user = await res.json();

  document.getElementById("profileBox").innerHTML = `
        <h3>${user.name}</h3>
        <p>${user.email}</p>
        <p>Age: ${user.age}</p>
    `;

  document.getElementById("avatarImg").src =
    `${BASE_URL}/users/${user._id}/avatar`;
}

async function uploadAvatar() {
  const file = document.getElementById("avatarInput").files[0];
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch(`${BASE_URL}/users/me/avatar`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (res.ok) {
    alert("Avatar uploaded!");
    loadProfile();
  }
}
