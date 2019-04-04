$(document).ready(
    function(){
        function Users(id,username,password){
            this.id = id;
            this.username = username;
            this.password = password;
        }
        Users.prototype.operation1 = '编辑';
        Users.prototype.operation2 = '删除';
        var u = [];
        var x = [
            {id: 1, username: "root", password: "root", identity: "administrator"},
            {id: 2, username: "root", password: "root", identity: "administrator"},
            {id: 3, username: "root", password: "root", identity: "administrator"}
        ]
        x.forEach((value,index)=>{
            u[index]= new Users(value.id,value.username,value.identity);
        })
        console.log('这是u',u);
        console.log(u[0].operation1);
    }
)




