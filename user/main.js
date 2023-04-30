


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


function login(e) {
    e.preventDefault();
    console.log(e.target.name);

    const loginDetails = {
        email: e.target.email.value,
        password: e.target.password.value

    }
    console.log(loginDetails)
    axios.post('http://localhost:1000/user/login',loginDetails).then(response => {
        alert(response.data.message)

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userDetails', JSON.stringify(response.data.user))

            window.location.href = "/user/index.html"
    }).catch(err => {
        console.log(JSON.stringify(err))
        document.body.innerHTML += `<div style="color:red;">${err.message} <div>`;
    })
}