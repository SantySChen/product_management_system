import { modelOptions, prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from './userModel';

class CartItem {
  @prop({ required: true })
  public _id?: string;

  @prop()
  public image!: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public quantity!: number;

  @prop({ required: true })
  public countInStock!: number;

  @prop({ required: true })
  public price!: number;
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Cart {
  @prop({ type: () => [CartItem], required: true, _id: false })
  public cartItems!: CartItem[];

  @prop({ required: true, default: 0 })
  public subTotal!: number;

  @prop({ required: true, default: 0 })
  public tax!: number;

  @prop({ required: true, default: 0 })
  public discount!: number;

  @prop({ required: true, default: 0 })
  public totalPrice!: number;

  @prop({ ref: 'User', required: true })
  public user!: Ref<User>;
}

export const CartModel = getModelForClass(Cart);