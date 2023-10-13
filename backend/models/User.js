import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"

const Session = mongoose.Schema({
    refreshToken: {
        type: String,
        default: "",
    },
})

const QuizSchema = mongoose.Schema({
    number: {
        type: Number
    },
    question: {
        type: String,
        required: true
    },
    choices: {},
    answer: {
        type: String,
        required: true
    },
})

const QuestionSchema = mongoose.Schema({
    topic_name: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    content: [QuizSchema],
    score: {
        type: Number
    }
})

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now,
        },
        quizzes: [QuestionSchema],
        favoriteQuizzes: [QuestionSchema],
        recent: [QuestionSchema],
        refreshToken: {
            type: [Session],
        },
    }
)

UserSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.refreshToken
        return ret
    },
})

UserSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User", UserSchema)

export default User