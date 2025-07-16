import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";

@modelOptions( {schemaOptions: { timestamps: true } })
export class User {
    public _id?: string

    @prop({ required: true, unique: true })
    public email!: string

    @prop({ required: true })
    public password!: string
    
    @prop({ requied: true, default: false })
    public isManager!: boolean
}

export const UserModel = getModelForClass(User)