import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Activity, Gender, Goal, Role } from "src/types/user-properties.type";
import { hash as bcryptPasswordHash } from "bcryptjs";
import { BCRYPT_SALT_ROUNDS } from "src/utils/constants";
import { UserRoles } from "src/types/enums/user-properties.enum";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  gender: Gender;

  @Prop()
  country: string;

  @Prop()
  city: string;

  @Prop()
  preferedActivities: Activity[];

  @Prop({ required: true })
  goals: Goal[];

  @Prop()
  age: number;

  @Prop({ required: true, default: UserRoles.REGISTERED_USER })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>("save", async function (next) {
  const hashedPassword = await bcryptPasswordHash(
    this.password,
    BCRYPT_SALT_ROUNDS,
  );
  this.password = hashedPassword;

  next();
});
