UserEdges = new Mongo.Collection("userEdges");
Stories = new Mongo.Collection("stories");

UserEdges.allow({
    insert:function(userId, doc) {
        return !!userId;
    },
    update:function(userId, doc) {
        if(doc.status === "pending" && doc.requestee === userId){
            return true;
        } else if(doc.status === "pending" && doc.requestee !== userId) {
            return false;
        }
    }
})

Stories.allow({
    insert:function(userId, doc) {
        return !!userId;
    },
    update:function(userId, doc) {
        return !!userId;
    }
})
