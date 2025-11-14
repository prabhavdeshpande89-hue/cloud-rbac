async function loadProfile() {
  const token = localStorage.getItem("token");
  if (!token) return (window.location.href = "index.html");

  const res = await fetch("https://cloud-rbac-api.onrender.com/api/profile", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  if (data.user) {
    document.getElementById("role").innerText = "Role: " + data.user.role;

    if (data.user.role === "admin") {
      document.getElementById("adminPanel").style.display = "block";
    }
  } else {
    logout();
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

loadProfile();
