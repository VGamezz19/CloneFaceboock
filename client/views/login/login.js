Template.login.events({
    'submit #loginform':function(e){
        e.preventDefault();
        var username = $('input[name="username"]').val();
        var password = $('input[name="password"]').val();
        var options = {username: username, password: password};
        Meteor.loginWithPassword(username,password, function(err,res){
          console.log("hola");
            if(!err) {
              console.log("hola2");
                Router.go("/")
            } else{
              console.log(err);
            }
        })
    }
})
