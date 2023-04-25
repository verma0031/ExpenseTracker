
function showPremiumUser(){
    document.getElementById('rzp-button1').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "You are a premium user "
    
    // const parentNode = document.getElementById('message');
    // const btn = document.createElement('button');
    // btn.textContent = "Show LeaderBoard";
    // btn.id = "leaderButton";
    // btn.onclick = showLeaderBoard;

    // parentNode.appendChild(btn);

    



}

function showLeaderBoard(){

    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.value = 'Show Leaderboard'
    inputElement.onclick = async() => {
        const token = localStorage.getItem(localStorage.getItem('curr'));
        const userLeaderBoardArray = await axios.get('http://localhost:1000/premium/showLeaderBoard', { headers: {"Authorization" : token} })
        console.log(userLeaderBoardArray)

        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML += '<h1> Leader Board </<h1>'
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderboardElem.innerHTML += `<li>Name - ${userDetails.name} Total Expense - ${userDetails.total_cost || 0} </li>`
        })
    }
    document.getElementById("message").appendChild(inputElement);

}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem(localStorage.getItem('curr'));
    console.log("\ndom content\n",token);
    const decodeToken = parseJwt(token);
    console.log("DECODED TOKEN",decodeToken);
    const ispremiumuser = decodeToken.ispremiumuser;
    console.log("\nis premium user\n",ispremiumuser);

    if(ispremiumuser){
        showPremiumUser()
    }

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
})


function onPressingAddExpense(){
    console.log("adding expense");
    const token = localStorage.getItem(localStorage.getItem('curr'));
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
    const token = localStorage.getItem(localStorage.getItem('curr'));
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


document.getElementById('rzp-button1').onclick = async function (e) {
    console.log("rpz button clicked");
    const token = localStorage.getItem(localStorage.getItem('curr'));
    console.log("token in rzp", token);
    const response  = await axios.get("http://localhost:1000/purchase/premiummembership", { headers: {"Authorization" : token} });
    console.log("response after axios",response);
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "order_id": response.data.order.id,// For one time payment
     // This handler function will handle the success payment
     "handler": async function (response) {
        const res = await axios.post('http://localhost:1000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} })
        
        console.log("after transaction status", res);
         alert('You are a Premium User Now')
         document.getElementById('rzp-button1').style.visibility = "hidden"
         document.getElementById('message').innerHTML = "You are a premium user "
         localStorage.setItem(localStorage.getItem('curr'), res.data.token)
         showLeaderBoard()
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
    console.log(response)
    alert('Something went wrong')
 });
}