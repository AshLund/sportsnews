var mongoose=require("mongoose");

var Schema=mongoose.Schema;

var HeadlineSchema= new Schema ({
    link: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        unique: true,
    },
    title: {
        type: String,
        unique: true,
    },
    saved:{
        type: Boolean,
        default: false
      },
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }],
 
});

var Headline=mongoose.model("Headline", HeadlineSchema);

module.exports=Headline