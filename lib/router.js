Router.route('/',{
    onBeforeAction:function(){
        if(!Meteor.userId()){
            this.redirect("login");
        } else {
            this.next();
        }
    },
    template:"facebook"
});

Router.route('/profile/:username',{
    template:"profileFeed"
});


Router.route('/register',{
    template:"register"
});

Router.route('/login',{
    template:"login"
})

Router.route('/notifications',{
    template:"notifications"
})
