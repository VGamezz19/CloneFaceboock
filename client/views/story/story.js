

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
        //El creador del commentario
        var userOwner = Meteor.user();

        Stories.update({_id: story._id}, {$push:{comments: {
                                                   commentText: commentText,
                                                   commentDate: new Date(),
                                                   owner: Meteor.userId(),
                                                   idStory : story._id,
                                                   userImageComment : userOwner.profile.picture.thumbnail,
                                                   creatorNameComment : userOwner.profile.name.first,


                                                }}});
        //for order comments
        Stories.update({_id: story._id},{$push:{comments:{$each:[],$sort: {"commentDate": -1}} }},{'multi':true});

      }
      target.text.value = '';

    }


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
    datestory:function(date) {
      return moment(date).format('MM-DD-YYYY HH:mm');
    },

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

Template.commentTemaplte.events({
  'click .delete-comment':function(e){
    e.preventDefault();
    var comment = Blaze.getData(e.currentTarget);
    console.log("hola");
    Stories.update({_id: comment.idStory}, {$pull: { comments: {
                                                      commentText: comment.commentText ,
                                                      commentDate: comment.commentDate,
                                                      owner: comment.owner,
                                                      idStory: comment.idStory,
                                                      userImageComment: comment.userImageComment,
                                                      creatorNameComment: comment.creatorNameComment,



                                                    }}});
  }
})

//Need this package meteor add momentjs:moment
Template.commentTemaplte.helpers({
  dateRefactor:function(date){

    return moment(date).format('MM-DD-YYYY HH:mm');
  },
  ownerComment:function(){
      return this.owner === Meteor.userId();
  }
})
