import {model, connection, Model, Schema} from 'mongoose'

type PhrasesType = {
    title: string,
    img: string,
    details: {
        name: string,
        size: string,
        developer: string,
        publisher: string,
        release: string,
    },
    screenshot: [string],
    trailer: string,
    about: string,
    downloads: {
        torrent: string,
        direct: string
    }
    post: string,
    link: string,
    genre: [string],
    counts: number
    
}
new Schema({}, {
    versionKey: false
});

const schema = new Schema<PhrasesType>({
    title: String,
    img: String,
    details: {
        name: String,
        size: String,
        developer: String,
        publisher: String,
        release: String,
    },
    screenshot: [String],
    trailer: String,
    about: String,
    downloads: {
        torrent: String,
        direct: String
    },
    post: String,
    link: String,
    genre: [String],
    counts: Number
}, {
    versionKey: false
})

const modelName: string = 'RBgames'

export default(connection && connection.models[modelName]) ? 
    (connection.models[modelName] as Model<PhrasesType>) 
:
    model<PhrasesType>(modelName, schema)