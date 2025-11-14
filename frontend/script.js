const API_URL = "https://employee-backend-wbi0.onrender.com"; // your Render backend URL

// Load all employees when the page opens
async function loadEmployees() {
  try {
    const res = await fetch(`${API_URL}/employees`);
    const employees = await res.json();

    const table = document.getElementById("employeeTable");
    table.innerHTML = "";

    employees.forEach(emp => {
      const row = `
        <tr>
          <td><input id="name-${emp._id}" value="${emp.name}" /></td>
          <td><input id="position-${emp._id}" value="${emp.position}" /></td>
          <td><input id="salary-${emp._id}" value="${emp.salary}" type="number" /></td>
          <td>Present</td>
          <td>
            <button onclick="updateEmployee('${emp._id}')">Update</button>
            <button onclick="deleteEmployee('${emp._id}')">Delete</button>
          </td>
        </tr>`;
      table.innerHTML += row;
    });
  } catch (error) {
    console.error("Error loading employees:", error);
  }
}

// Add new employee
async function addEmployee() {
  const name = document.getElementById("name").value;
  const position = document.getElementById("position").value;
  const salary = document.getElementById("salary").value;

  if (!name || !position || !salary) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, position, salary })
    });

    if (res.ok) {
      alert("Employee added successfully!");
      document.getElementById("name").value = "";
      document.getElementById("position").value = "";
      document.getElementById("salary").value = "";
      loadEmployees();
    } else {
      alert("Failed to add employee.");
    }
  } catch (error) {
    console.error("Error adding employee:", error);
  }
}

// Update employee
async function updateEmployee(id) {
  const name = document.getElementById(`name-${id}`).value;
  const position = document.getElementById(`position-${id}`).value;
  const salary = document.getElementById(`salary-${id}`).value;

  try {
    await fetch(`${API_URL}/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, position, salary })
    });
    alert("Employee updated!");
    loadEmployees();
  } catch (error) {
    console.error("Error updating employee:", error);
  }
}

// Delete employee
async function deleteEmployee(id) {
  try {
    await fetch(`${API_URL}/employees/${id}`, { method: "DELETE" });
    alert("Employee deleted!");
    loadEmployees();
  } catch (error) {
    console.error("Error deleting employee:", error);
  }
}

// Load employees when the page loads
window.onload = loadEmployees;
