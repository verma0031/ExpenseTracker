let expenseArray=[];
let selectedIndex=null;


function init(){
    const token = localStorage.getItem('token');
    axios.get('http://localhost:1000/user/getExpense', {headers: {"Authorization": token}})
            .then( (response) => {
                console.log(response);

                for (var i = 0; i<response.data.expenses.length; i++){
                    showExpense(response.data.expenses[i]);
                    // showInTable(response.data.allUsers[i]);
                }
            })
            .catch( err => {
                console.log(err);
            })
}

function onPressingAddExpense(){
    console.log("adding expense");
    const token = localStorage.getItem('token');
    const expense = document.getElementById('expense').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    const obj ={
        expense,
        description,
        category
    };

            axios.post ("http://localhost:1000/user/addExpense", obj, {headers: {"Authorization": token}})
            .then( (response) => {
                console. log (response);
                showExpense(response.data.newUserDetail);
                // showInTable(response.data.newUserDetail);
            })
            .catch((err) => {
                document.body.innerHTML = document.body.innerHTML + "<h4>Something went wrong <h4>";
                console.log(err);
            })

}

function showExpense(ex){
    document. getElementById('expense').value='';
    document.getElementById("description").value='';
    document. getElementById('category'). value='';
    

    const parentNode = document.getElementById('expenseList');
    // const childHTML = `<li id = ${ex.id}> ${ex.expense} -> ${ex.description} + ${ex.category} <button onclick=deleteUser('${ex.id}')>DELETE</button> </li>`;

    const childNode = document.createElement('li');
    childNode.id = `${ex.id}`;
    childNode.textContent = `${ex.expense} ${ex.description} ${ex.category} `;


    const btn = document.createElement('button');
    btn.textContent = "DELETE";
    btn.onclick = deleteUser;

    childNode.appendChild(btn);

    // parentNode.innerHTML = parentNode.innerHTML + childHTML;

    parentNode.appendChild(childNode);
}

function deleteUser(){
    const id = this.parentNode.id;
    const token = localStorage.getItem('token');
    console.log(id);
    axios.delete(`http://localhost:1000/user/delete-expense/${id}`, {headers: {"Authorization": token}})
    .then((response) => {
        console.log(response);
        
        // removeFromScreen(response);
        // removeFromTable(response);

        this.parentNode.remove();
    })
    .catch(err => {
        console.log(err);
    })

}

// function removeFromTable(userId){
//     const parentNode = document.getElementById('tablerows');
//     const childNodeToBeDeleted = document.getElementById(userId);

//     if(childNodeToBeDeleted){
//         parentNode.removeChild(childNodeToBeDeleted)
//     }

// }

// function showInTable(expenseObj){

//     var table = document.getElementById('tablerows');
//     var row = table.insertRow();

//     var exp=row.insertCell(0);
//     var descp=row.insertCell(1);
//     var cat=row.insertCell(2);
//     var edt=row.insertCell(3);

//     exp.innerHTML = expenseObj.expense;
//     descp.innerHTML = expenseObj.description;
//     cat.innerHTML = expenseObj.category;
//     edt.innerHTML = `<button id = "${expenseObj.id}" class="btn" onclick = "deleteUser(${expenseObj.id})">DELETE</button>`;
// }

// document.getElementById("tablerows").children.forEach(tr => {
//     console.log(tr);
//     tr.addEventListener("click", (event)=>{
//         event.preventDefault();
//         if(event.target.classList.contains("btn")) {
//             // event.target.parentNode.parentNode.remove();
//             console.log(event.target.parentNode.parentNode);
//         } else {
//             console.log(event.target);
//         }
//     });
// });

function userSignUp(){
    try{
        console.log("adding user");
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const obj ={
                name,
                email,
                password
            };

            console.log(obj);

            const response = axios.post ("http://localhost:1000/user/signup", obj)

            if(response === 201){
                window.location.href="./user/login.html";
            }
            else{
                throw new Error('Failed to login');
            }
    }
    catch(err){
        document.body. innerHTML += `<div style="color;red; ">${err} <div>` ;
    }
}


function onLogin(){
    const loginDetails = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }

    console.log(loginDetails);

    axios.post('http://localhost:1000/user/login', loginDetails)
    .then((response) => {
            console.log(response);
            alert(response.data.message);

            localStorage.setItem('token', response.data.token);

            window.location.href = '/user/index.html';
            
    })
    .catch(err => {
        console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style="color: red;">${err.message} </div>`;

    })

}

