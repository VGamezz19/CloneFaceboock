Template.topnav.onCreated(function(){
    var self = this;
    self.autorun(function(){
        var subscription = self.subscribe("friendRequests");
        if(subscription.ready()) {
            var userIds = [];
            var users = UserEdges.find({requestee: Meteor.userId()}, {fields:{requester:1}}).fetch();
            users.forEach(function(user){
                userIds.push(user.requester)
            })
            self.subscribe("requestingUsersArray", userIds);
        }
    })
})


Template.topnav.events({
    'click .logout':function(){
        Meteor.logout(function(err){
            if(!err) {
                Router.go("/");
            }
        })
    }
})

Template.topnav.helpers({
    fullname:function(user){
        return user ? user.profile.name.first + " " + user.profile.name.last : null;
    },
    friendRequestCount:function(){
        var user = Meteor.user();
        if(user) {
            var count = UserEdges.find({requestee: user._id, status:"pending"}).count();
            return count > 0 ? count : null;
        }
    }
})
