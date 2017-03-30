Template.modal.events({
    'click .new-post':function(e){
        e.preventDefault();
        var profileUser = Meteor.user();
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
                creatorUsername: currentUser.profile.username,
                creatorThumbnail: currentUser.profile.picture.thumbnail,
                createdForName: profileUser.profile.name.first + " " + profileUser.profile.name.last,
                createdForUsername: profileUser.profile.username,
                createdForThumbnail: profileUser.profile.picture.thumbnail,
                likes: [],
                createdAt: new Date(),
                comments: []
            });
            $('textarea[name="new-post"]').val("");
        }

    }
})
