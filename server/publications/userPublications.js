// ----------------------------------------------------------------------------
// @date: May 25, 2015
// @author: kris@sunsama.com
// @descriptions: this is where any publications involving the user will live
// ----------------------------------------------------------------------------

Meteor.publish("userData", function(username){
    return Meteor.users.find({username:username});
})

Meteor.publish("userNotifications", function(userId){
    return UserEdges.find({"requestee": userId, "seen":false});
})

Meteor.publish("friendRequests", function(userId){
    return UserEdges.find({requestee: this.userId, status:"pending"})
})

Meteor.publish("requestingUsersArray", function(userArr){
    return Meteor.users.find({_id: {$in: userArr}}, {fields: {profile:1}});
});

Meteor.publish("userFriendCount", function(userId){
    var self = this;
    check(userId, String);
    var count = 0;
    var initializing = true;

    // observeChanges only returns after the initial `added` callbacks
    // have run. Until then, we don't want to send a lot of
    // `self.changed()` messages - hence tracking the
    // `initializing` state.
    var handle = UserEdges.find({$or: [{requester: userId},
                                    {requestee: userId}], status:"accepted"}).observeChanges({
        added: function (id) {
            count++;
            if (!initializing)
                self.changed("counts", userId, {count: count});
        },
        removed: function (id) {
            count--;
            self.changed("counts", userId, {count: count});
        }
    // don't care about changed
    });

    // Instead, we'll send one `self.added()` message right after
    // observeChanges has returned, and mark the subscription as
    // ready.
    initializing = false;
    self.added("counts", userId, {count: count});
    self.ready();

    // Stop observing the cursor when client unsubs.
    // Stopping a subscription automatically takes
    // care of sending the client any removed messages.
    self.onStop(function () {
        handle.stop();
    });
});

Meteor.publish("userNewFriends", function(userId) {
    var edges = UserEdges.find({$or: [{requester: userId},{requestee: userId}], status:"accepted"});
    var edgeArr = edges.fetch();
    var ids = [];
    edgeArr.forEach(function(edge){
        if(edge.requester === userId) {
            ids.push(edge.requestee)
        } else {
            ids.push(edge.requester);
        }
    });
    return [Meteor.users.find({_id: {$in: ids}}, {fields: {profile:1}, limit: 10}),
            edges];

});


Meteor.publish("profileStories", function(username, limit, skip){
    var user = Meteor.users.findOne({username:username}, {fields: {_id:1}});
    return Stories.find({createdFor: user._id});
})

Meteor.publish("feed",function(){
    var self = this;
    var edges = UserEdges.find({$or: [{requester: self.userId},{requestee: self.userId}], status:"accepted"});
    var edgeArr = edges.fetch();
    var ids = [];
    edgeArr.forEach(function(edge){
        if(edge.requester === self.userId) {
            ids.push(edge.requestee)
        } else {
            ids.push(edge.requester);
        }
    });
    ids.push(self.userId);
    return Stories.find({$or: [{createdBy: {$in: ids}}, {createdFor: {$in: ids}}]}, {sort: {createdAt:-1}, limit:20});
})
