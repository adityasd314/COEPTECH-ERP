const { model, Schema } = require("mongoose");

const rulesSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
});

const Rule = model('Rule', rulesSchema);

module.exports = Rule;
