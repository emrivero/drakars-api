 import { plugin } from '@typegoose/typegoose';
 import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
 import * as formatter from '@meanie/mongoose-to-json';
 import * as mongooseDelete from 'mongoose-delete';

 @plugin(formatter)
 @plugin(mongooseDelete)
 export abstract class BaseModel extends TimeStamps {}
