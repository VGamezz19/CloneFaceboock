
Meteor.startup(function(){

    var users = Meteor.users.find().count();
    if(!users) {
        for(var i = 0; i < 100; i++){

          HTTP.call('GET', 'https://randomuser.me/api', {
            data: { some: 'json', stuff: 1 }
          }, function(err,res) {
            var fields = res.data.results[0];
           delete fields.login.salt;
            delete fields.login.md5;
            delete fields.login.sha1;
            delete fields.login.sha256;
            delete fields.registered;
            delete fields.dob;
            delete fields.login.password;
            /*delete fields['phone'];
            delete fields['cell'];
            delete fields['version'];
            console.log(fields); */
            var user = {
                username: fields.login.username,
                email: fields.email,
                password:"password",
                profile: fields
            }
            Accounts.createUser(user);
            console.log(fields);
          });
        }
    }


})
