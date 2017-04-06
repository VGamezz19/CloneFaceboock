

Template.story.events({
    'click .like':function(e) {
        e.preventDefault();
        var story = Blaze.getData(e.currentTarget);
        var liker = Meteor.user();
        var likeData = {name: liker.profile.name.first + " " + liker.profile.name.last};
        var alreadyLiked = _.findWhere(story.likes, likeData);
        if(!alreadyLiked){
            Stories.update({_id: story._id}, {$push:{likes: likeData}});
        } else {
            Stories.update({_id: story._id}, {$pull:{likes:likeData}});
        }
    },
    'click .delete-story':function(e){
      e.preventDefault();
      var story = Blaze.getData(e.currentTarget);
      //console.log(story);
      Stories.remove(story._id);
    },
    'submit .comment-story':function(event){
      event.preventDefault();

      const target = event.target;
      const commentText = target.text.value;

      var story = Blaze.getData(event.currentTarget);

      //Add in Collection Stories a nes atribue, "Comment"
      if (commentText){
        Stories.update({_id: story._id}, {$push:{comments: {
                                                             commentText: commentText,
                                                             commentDate: new Date(),
                                                             owner: Meteor.userId()
                                                          }}});

      }
      target.text.value = '';

    }

    /*




    Template.body.events({
      'submit .new-task'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const text = target.text.value;

        // Insert a task into the collection
        Tasks.insert({
          text,
          createdAt: new Date(), // current time
        });

        // Clear form
        target.text.value = '';
      },
    */
})

Template.story.helpers({
    status:function(){
        return this.createdFor === this.createdBy;
    },
    ownerStory:function(){
        return this.createdBy === Meteor.userId();
    },
    /*commentStory:function(e){
      var story = Blaze.getData(e.currentTarget);
      var story = Stories.findOne({_id: storyId});
      console.log("comment");
      return story;
    }*/
    likeCount:function(storyId){
        var story = Stories.findOne({_id: storyId});
        var likes = story.likes;
        if(!likes.length) {
            return "Nobody has liked this post yet.";
        } else if(likes.length <= 3) {
            var string = "";
            switch (likes.length) {
                case 1:
                    return likes[0].name + " likes this";
                    break;
                case 2:
                    return likes[0].name + " and " + likes[1].name + " like this";
                    break;
                case 3:
                    return likes[0].name + ", " + likes[1].name + " and " + likes[2].name + " like this";
                break;
            }

        } else {
            var correctLength = likes.length - 3;
            var correctOther;
            if(correctLength === 1) {
                correctOther = " other person likes this";
            } else {
                correctOther = " other people like this";
            }
            return likes[0].name + ", " + likes[1].name + ", " + likes[2].name + " and " + correctLength + correctOther;
        }

    }

})
