import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true
 },
  subtitle: { 
    type: String 
},
  description: { 
    type: String
 },
  image: { 
    type: String, 
    default: "" 
},
  level: { 
    type: String, 
    enum: ["Beginner","Intermediate","Advanced"], 
    default: "Beginner" 
},
  category: { 
    type: String 
},
  recommended: { 
    type: Boolean, 
    default: false 
},
  popularScore: { 
    type: Number, 
    default: 0 
},
  durationMinutes: { 
    type: Number, 
    default: 0 
},
  author: { 
    type: String, 
    default: "" 
}
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
