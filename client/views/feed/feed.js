Template.feed.onCreated(function(){
    var self = this;
    self.subscribe("feed");
})

Template.feed.helpers({
    feedStories:function() {
        return Stories.find({}, {sort: {createdAt: -1}});
    }
})
