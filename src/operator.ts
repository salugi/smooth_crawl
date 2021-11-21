
import {
    conduct_link_harvest,
} from "./conductor.ts"

import {HttpRecord} from "./models/HttpRecord.ts";

import {conduct_basic_archive} from "./conductor.ts";
import {bookie_emitter} from "./bookie.ts";





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

export async function operate_harvest(url:string,link_limit:number,page_limit:number){

    try{

        // let publisher = new PublisherFactory("havest_basic_archive")
        let crawl_links = await conduct_link_harvest(url,link_limit,page_limit)


        for(let i = 0; i < crawl_links.length;i++){

            await new Promise(resolve => setTimeout(resolve, 80))

            bookie_emitter.emit("book_http_archive", crawl_links[i])

        }

        // publisher.close_publisher()

        return crawl_links

    }catch(error){

        console.error(error)

    }

}
