import EventEmitter from "https://deno.land/x/events/mod.ts"
import {conduct_basic_archive} from "./conductor.ts";


export let bookie_emitter = new EventEmitter()

export function book_http_record(unparsed_url : string){
    (async () =>{
        try {

            let parsed_url = new URL(unparsed_url)
            let record =  await conduct_basic_archive(parsed_url.href)

            console.log(record.url.href,"recorded with status",record.response.status)



        }catch (error) {
            let funk = "book_http_record"

            console.error(funk)
            console.error(error)
        }
    })()
}

bookie_emitter.on("book_http_archive", book_http_record)