let currentEmployeeId = null; 

async function fetchEmployees() {
    const status = document.getElementById('status-select').value;
    const employeeList = document.getElementById('employee-list');
    const errorMessage = document.getElementById('error-message');

    employeeList.innerHTML = '';
    errorMessage.innerHTML = '';

    try {
        const response = await fetch(`http://localhost:8080/api/employee/employeestatus?Status=${status}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const employees = await response.json();
        
        if (employees.length === 0) {
            employeeList.innerHTML = '<p>No employees found.</p>';
            return;
        }

        let table = '<table><tr><th>Emp ID</th><th>Name</th><th>Email</th><th>Age</th><th>DOB</th><th>Salary</th><th>Status</th><th>Actions</th></tr>';

        employees.forEach(employee => {
            table += `<tr>
                <td>${employee.empid}</td>
                <td>${employee.empName}</td>
                <td>${employee.email}</td>
                <td>${employee.empAge}</td>
                <td>${new Date(employee.dob).toLocaleDateString()}</td>
                <td>${employee.salary.toFixed(2)}</td>
                <td>${employee.status}</td>
                <td>
                    <button class="btn-edit" onclick="openModal('edit', ${employee.empid})">Edit</button>
                    <button class="btn-update" onclick="updateEmployee(${employee.empid})">Update</button>
                </td>
            </tr>`;
        });

        table += '</table>';
        employeeList.innerHTML = table;

    } catch (error) {
        console.error('Error fetching employees:', error);
        errorMessage.innerHTML = '<p>Error fetching employee data.</p>';
    }
}


function openModal(action, empid) {
    const modal = document.getElementById("employeeModal");
    const title = document.getElementById("modal-title");
    const submitButton = document.getElementById("submit-button");

    if (action === 'edit') {
        
        fetch(`http://localhost:8080/api/employee/employeesstatus/${empid}`)
            .then(response => response.json())
            .then(employee => {
                document.getElementById("empid").value = employee.empid;
                document.getElementById("name").value = employee.empName;
                document.getElementById("email").value = employee.email;
                document.getElementById("age").value = employee.empAge;
                document.getElementById("dob").value = employee.dob;
                document.getElementById("salary").value = employee.salary;
                document.getElementById("status").value = employee.status.toString();
                title.innerText = "Edit Employee";
                submitButton.innerText = "Update Employee";
            });
        currentEmployeeId = empid;
    } else {
        
        document.getElementById("employee-form").reset();
        title.innerText = "Add Employee";
        submitButton.innerText = "Add Employee";
        currentEmployeeId = null; 
    }

    modal.style.display = "block";
}


function closeModal() {
    document.getElementById("employeeModal").style.display = "none";
}


async function submitEmployee(event) {
    event.preventDefault();
    const empid = document.getElementById("empid").value;
    const employeeData = {
        empName: document.getElementById("name").value,
        email: document.getElementById("email").value,
        empAge: document.getElementById("age").value,
        dob: document.getElementById("dob").value,
        salary: document.getElementById("salary").value,
        status: document.getElementById("status").value === "true" 
    };

    try {
        if (currentEmployeeId) {
            
            const response = await fetch(`http://localhost:8080/api/employee/employeestatus/${currentEmployeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeData)
            });
            if (!response.ok) throw new Error('Failed to update employee');
        } else {
            
            const response = await fetch(`http://localhost:8080/api/employee/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeData)
            });
            if (!response.ok) throw new Error('Failed to add employee');
        }

        closeModal();
        fetchEmployees(); 
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to save employee data.');
    }
}


document.addEventListener('DOMContentLoaded', fetchEmployees);
