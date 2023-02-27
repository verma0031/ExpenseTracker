let expenseArray=[];
let selectedIndex=null;

function init(){
    if(localStorage.expenseRecords){
        document.getElementById ("tablerows").innerHTML="";
        expenseArray=JSON.parse(localStorage.expenseRecords);
        for(let i=0 ; i<expenseArray.length ; i++){
            prepareTable(i,expenseArray[i].expenseAmount , expenseArray[i].expenseDescription , expenseArray[i].expenseCategory);
        }
    }
}

function onPressingAddExpense(){
    let expenseObj={
        expenseAmount : document.getElementById('expense').value , 
        expenseDescription : document.getElementById('description').value , 
        expenseCategory : document.getElementById('category').value , 
    };

    if(selectedIndex==null){
        expenseArray.push(expenseObj);
    }
    else{
        expenseArray.splice(selectedIndex , 1 , expenseObj);
    }

    localStorage.expenseRecords=JSON.stringify(expenseArray);

    init();

    onClearPressed();
}

function prepareTable(index , expense , description , category){
    var table = document.getElementById ("tablerows");
    var row=table.insertRow();

    var exp=row.insertCell(0);
    var descp=row.insertCell(1);
    var cat=row.insertCell(2);
    var edt=row.insertCell(3);

    exp.innerHTML=expense;
    descp.innerHTML=description;
    cat.innerHTML=category;
    edt.innerHTML='<button style="width:100%;" onclick="onPressingEdit('+index+')">Edit</button><br/><button style=" background-color:red;width:100%; margin-top:2px" onclick="deleteTableRow('+index+')">Delete</button>';
}

function deleteTableRow(index){
    expenseArray.splice(index ,1);
    localStorage.expenseRecords=JSON.stringify(expenseArray);
    init();
}

function onPressingEdit(index){
    selectedIndex=index;

    let expenseObj=expenseArray[index];

    document.getElementById('expense').value = expenseObj.expenseAmount; 
    document.getElementById('description').value = expenseObj.expenseDescription;
    document.getElementById('category').value = expenseObj.expenseCategory;


    document.getElementById('submit').value = 'Update';
}

function onClearPressed(){
    selectedIndex=null;
    document.getElementById('expense').value="";
    document.getElementById('description').value="";
    document.getElementById('category').value="fuel";

    document.getElementById('submit').value="Add Expense"
}