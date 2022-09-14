import {model, connection, Model, Schema} from 'mongoose'

type PhrasesType = {
    category: string,
}
new Schema({}, {
    versionKey: false
});

const schema = new Schema<PhrasesType>({
    category: String,
    
}, {
    versionKey: false
})

const modelName: string = 'categories'

export default(connection && connection.models[modelName]) ? 
    (connection.models[modelName] as Model<PhrasesType>) 
:
    model<PhrasesType>(modelName, schema)