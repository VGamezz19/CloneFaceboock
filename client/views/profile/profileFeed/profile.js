Template.profileFeed.onCreated(function(){
    var self = this;
    Tracker.autorun(function(){
        var username = Router.current().params.username;
        self.subscribe("profileStories", username);
    })

})

Template.profileFeed.events({
    'click .new-post':function(e){
      console.log("hola");
        e.preventDefault();
        var profileUser = Meteor.users.findOne({username:Router.current().params.username});
        var currentUser = Meteor.user();
        var story = $('textarea[name="new-post"]').val();
        if(story.length) {

            Stories.insert({
                createdBy: currentUser._id,
                createdFor: profileUser._id,
                userImage: currentUser.profile.picture.thumbnail,
                storyImage: null,
                storyText: story,
                creatorName: currentUser.profile.name.first + " " + currentUser.profile.name.last,
                creatorUsername: currentUser.profile.login.username,
                creatorThumbnail: currentUser.profile.picture.thumbnail,
                createdForName: profileUser.profile.name.first + " " + profileUser.profile.name.last,
                createdForUsername: profileUser.profile.login.username,
                createdForThumbnail: profileUser.profile.picture.thumbnail,
                likes: [],
                createdAt: new Date(),
                comments: []
            });
            $('textarea[name="new-post"]').val("");
        }

    }

})

Template.profileFeed.helpers({
    statusPlaceholder:function(){
        var profileUser = Meteor.users.findOne({username:Router.current().params.username});
        if(profileUser && profileUser._id === Meteor.userId()){
            return "Update your status";
        } else {
            return "Post to their wall!";
        }
    },
    stories:function(){
        var profileUser = Meteor.users.findOne({username:Router.current().params.username}, {fields: {_id:1}});
        return profileUser ? Stories.find({createdFor: profileUser._id}, {sort: {createdAt:-1}, limit: 10}) : [];
    }

})
