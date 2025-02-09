const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

});

userSchema.methods.generateAuthTokens = async function () {
    try {
      const tokenGenerated = jwt.sign(
        { _id: this._id },
        process.env.SECRET_KEY
      );
      await this.save();
      return tokenGenerated;
    } catch (error) {
      console.log("Error", error);
    }
  };

userSchema.methods.comparePassword = async function(userPassword){
    try{
        const isMatch = await bcrypt.compare(userPassword,this.password);
        return isMatch;
    }   
    catch(error){ 
        console.log('Error',error);
    }
}

userSchema.pre("save", async function (next) {
    if (this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


const User = mongoose.model("User", userSchema);

module.exports = User;
