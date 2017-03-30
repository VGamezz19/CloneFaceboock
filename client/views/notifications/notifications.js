Template.notifications.onCreated(function(){

})

Template.notifications.events({
    'click .accept':function(e){
        var userEdge = Blaze.getData(e.currentTarget);
        UserEdges.update({_id: userEdge._id}, {$set: {status: "accepted"}});
    }
})

Template.notifications.helpers({
    friendRequests:function(){
        var user = Meteor.userId();
        return UserEdges.find({requestee: user, status:"pending"});
    },
    friendPicture:function(friend) {
        var user = Meteor.users.findOne({_id:friend});
        return user ?  user.profile.picture.medium : null;
    },
    friendName:function(friend) {
        var user = Meteor.users.findOne({_id:friend});
        return user ? user.profile.name.first + " " + user.profile.name.last : null;
    },
    friendAddress:function(friend, address) {
        var user = Meteor.users.findOne({_id:friend});
        switch (address) {
            case 0:
                return user ? user.profile.location.street : "";
                break;
            case 1:
                return user ? user.profile.location.city + ", " + user.profile.location.state + " " + user.profile.location.zip : "";
                break;
        }
    },
    friendUsername:function(friend) {
        var user = Meteor.users.findOne({_id:friend});
        return user ? user.profile.username : "";
    }
})
