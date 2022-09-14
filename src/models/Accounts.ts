import {model, connection, Model, Schema} from 'mongoose'

type PhrasesType = {
    username: string,
    password: string
    
}
new Schema({}, {
    versionKey: false
});

const schema = new Schema<PhrasesType>({
    username: String,
    password: String,
    
}, {
    versionKey: false
})

const modelName: string = 'accounts'

export default(connection && connection.models[modelName]) ? 
    (connection.models[modelName] as Model<PhrasesType>) 
:
    model<PhrasesType>(modelName, schema)