
Template.profileDetails.onCreated(function(){
    var self = this;
    var username = Router.current().params.username;
    self.autorun(function(){
        username = Router.current().params.username;
        self.subscribe("userData", username, {
            onReady:function(){
                var user = Meteor.users.findOne({username: username});
                self.subscribe("userFriendCount", user._id);
                self.subscribe("userNewFriends", user._id);
            }
        });
    })

    self.autorun(function(){
        if(Template.instance().subscriptionsReady()) {
            var user = Meteor.users.findOne({username: username});
            if(!user) {
                Router.go("/");
            }
        }
    })

})

Template.profileDetails.helpers({
    fullname:function(){
        var username = Router.current().params.username;
        var user = Meteor.users.findOne({username:username});
        return user ? user.profile.name.first + " " + user.profile.name.last : null;
    },
    profilePicture:function() {
        var username = Router.current().params.username;
        var user = Meteor.users.findOne({username:username});
        return user ? user.profile.picture.large : null;
    },
    friendCount:function(){
        var username = Router.current().params.username;
        var user = Meteor.users.findOne({username:username});
        if(user) {
            var count = Counts.findOne({_id: user._id});
        }
        return count ? count.count : 0;
    },
    newFriends:function(){
        var username = Router.current().params.username;
        var user = Meteor.users.findOne({username:username});
        var userArr = [];
        if(user){
            var edges = UserEdges.find({$or: [{requester: user._id},{requestee: user._id}], status:"accepted"}).fetch();
            var friendEdges = _.filter(edges, function(edge){
                if(edge.requester === user._id || edge.requestee === user._id) {
                    if(edge.requester !== user._id) {
                        userArr.push(edge.requester)
                    } else {
                        userArr.push(edge.requestee);
                    }
                }
            })
            return user ? Meteor.users.find({_id: {$in: userArr}}) : [];
        }

    },
    about:function(){
        var username = Router.current().params.username;
        var user = Meteor.users.findOne({username:username});
                return user ? user.profile.location.street + " " +
                              user.profile.location.city + ", " + user.profile.location.state + " " + user.profile.location.zip : "";
    },
    storyCount:function(){
        var username = Router.current().params.username;
        var user = Meteor.users.findOne({username:username});
    }
})


Template.profileDetails.events({
    'click .add-friend':function(){
        var profileUser = Router.current().params.username;
        var requester = Meteor.user();
        var requestee = Meteor.users.findOne({username:profileUser});
        if(requester._id !== requestee._id){
            Meteor.call("addFriend",requester._id, requestee._id, function(err,res){
            });
        }

    }
})
