let expenseArray=[];
let selectedIndex=null;

function init(){
    axios.get('http://localhost:1000/user/get-expense')
            .then( (response) => {
                console.log(response);

                for (var i = 0; i<response.data.allUsers.length; i++){
                    showExpense(response.data.allUsers[i]);
                }
            })
            .catch( err => {
                console.log(err);
            })
}

function onPressingAddExpense(){
    console.log("adding expense");
            const expense = document.getElementById('expense').value;
            const description = document.getElementById('description').value;
            const category = document.getElementById('category').value;

            const obj ={
                expense,
                description,
                category
            };

            axios.post ("http://localhost:1000/user/add-expense", obj)
            .then( (response) => {
                console. log (response);
                showExpense(response.data.newUserDetail);
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
    const childHTML = `<li id = ${ex.id}> ${ex.expense} -> ${ex.description} + ${ex.category} <button onclick=deleteUser('${ex.id}')>DELETE</button> </li>`;

    parentNode.innerHTML = parentNode.innerHTML + childHTML;
}

function deleteUser(id){
    console.log(id);
    axios.delete(`http://localhost:1000/user/delete-expense/${id}`)
    .then((response) => {
        removeFromScreen(response);
    })
    .catch(err => {
        console.log(err);
    })

}

function removeFromScreen(userId){
    const parentNode = document.getElementById('expenseList');
    const childNodeToBeDeleted = document.getElementById(userId);

    if(childNodeToBeDeleted){
        parentNode.removeChild(childNodeToBeDeleted)
    }
}