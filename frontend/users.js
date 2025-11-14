async function loadUsers() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:3000/api/users", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const json = await res.json();
  const users = json.data || [];

  const table = document.getElementById("userTable");
  table.innerHTML = "";

  users.forEach(u => {
    table.innerHTML += `<tr>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td><button class="btn btn-danger btn-sm" onclick="delUser('${u.id}')">Delete</button></td>
    </tr>`;
  });
}

function delUser(id) {
  alert("Delete API not implemented in backend!");
}

loadUsers();
