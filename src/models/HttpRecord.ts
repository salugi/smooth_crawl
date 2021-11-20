import { RecordKey } from "./RecordKey.ts";

export interface HttpRecord extends RecordKey {

    url:URL,
    response:any,
    response_text:string

}