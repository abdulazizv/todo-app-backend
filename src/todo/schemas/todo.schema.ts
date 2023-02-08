import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from "mongoose";

export type TodoDocument = HydratedDocument<Todo>;

@Schema()
export class Todo {
  @Prop()
  title: string;

  @Prop()
  status: boolean;

  @Prop()
  expiring_date: Date;

  @Prop()
  user_id: [{ type: ObjectId; ref: 'User' }];
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
