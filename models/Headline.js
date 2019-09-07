var mongoose=require("mongoose");

var Schema=mongoose.Schema;

var HeadlineSchema= new Schema ({
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
    },
    title: {
        type: String,
    },
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }],
 
});

var Headline=mongoose.model("Headline", HeadlineSchema);

module.exports=Headline