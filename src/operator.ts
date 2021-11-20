
import {
    conduct_link_harvest,
} from "./conductor.ts"

import {HttpRecord} from "./models/HttpRecord.ts";

import {conduct_basic_archive} from "./conductor.ts";





export async function operate_crawl(url:string,link_limit:number){

    try{

        let crawl_links = await conduct_link_harvest(url,link_limit,50)
        let http_records = new Array<HttpRecord>()

        for(let i = 0; i < crawl_links.length;i++){

            let record = await conduct_basic_archive(crawl_links[i])

            http_records.push(record)

        }

        return http_records

    }catch(error){

        console.error(error)

    }

}


