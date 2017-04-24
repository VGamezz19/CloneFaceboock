

Template.story.events({

  /**
     * @summary Event on click. Update collection Storis with 'like' in one story
     * @isMethod true
     * @locus Template.story.events
     * @param  {Object} event need event for update
     */

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

    /**
       * @summary Event on click. Delete one story
       * @isMethod true
       * @locus Template.story.events
       * @param  {Object} event need event for remove
       */
    'click .delete-story':function(e){
      e.preventDefault();
      var story = Blaze.getData(e.currentTarget);
      //console.log(story);
      Stories.remove(story._id);
    },

    /**
       * @summary Event submit. Inset new comment in one story
       * @isMethod true
       * @locus Template.story.events
       * @param  {Object} event need event for insert
       */
    'submit .comment-story':function(event){
      event.preventDefault();

      const target = event.target;
      const commentText = target.text.value;

      var story = Blaze.getData(event.currentTarget);

      //Add in Collection Stories a nes atribue, "Comment"
      if (commentText){
        //El creador del commentario
        var userOwner = Meteor.user();
        console.log(userOwner);
        Stories.update({_id: story._id}, {$push:{comments: {
                                                   commentText: commentText,
                                                   commentDate: new Date(),
                                                   owner: Meteor.userId(),
                                                   idStory : story._id,
                                                   userImageComment : userOwner.profile.picture.thumbnail,
                                                   creatorNameComment : userOwner.profile.name.first,
                                                   username : userOwner.profile.login.username


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

    /**
       * @summary Compare owner with this user conectet
       * @isMethod true
       * @locus Template.story.helpers
       */
    ownerStory:function(){
        return this.createdBy === Meteor.userId();
    },

    /**
       * @summary Return True or False if this user put one 'like' or not
       * @isMethod true
       * @locus Template.story.helpers
       */
    styleLike:function(){

      var liker = Meteor.user();
      var likeData = {name: liker.profile.name.first + " " + liker.profile.name.last};
      var alreadyLiked = _.findWhere(this.likes, likeData);
      if (! alreadyLiked) {
        return false;
      } else {
        return true;
      }
    },

    /**
       * @summary Function to refactor the date of the story
       * @isMethod true
       * @locus Template.story.helpers
       * @param  {Date} date Need date story for refactor it and show it
       */
    datestory:function(date) {
      return moment(date).format('MM-DD-YYYY HH:mm');
    },

    /**
       * @summary Function with 'case' that return how many 'likes' has this story
       * @isMethod true
       * @locus Template.story.helpers
       * @param  {Integer} storyId Id story
       */
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
  /**
     * @summary Event on click. Delete one comment from stroy
     * @isMethod true
     * @locus Template.commentTemaplte.events
     * @param  {Object} e need event for delete
     */
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
  /**
     * @summary Function to refactor the date of the comment
     * @isMethod true
     * @locus Template.commentTemaplte.helpers
     * @param  {Date} date Need date comment for refactor it and show it
     */
  dateRefactor:function(date){

    return moment(date).format('MM-DD-YYYY HH:mm');
  },
  /**
     * @summary Return true if this comment are from the user conectecd
     * @isMethod true
     * @locus Template.commentTemaplte.helpers
     */
  ownerComment:function(){
      return this.owner === Meteor.userId();
  }
})
