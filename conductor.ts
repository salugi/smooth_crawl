
import {get_html_text, get_http_record} from "./http_client.ts"
import {catalogue_basic_data, catalogue_links} from "./cataloguer.ts";

import {v4} from "https://deno.land/std/uuid/mod.ts";
import {HttpRecord} from "./models/HttpRecord.ts";

/*

returns http record

archival objects:
link data (all links on a page parsed)
metadata (all metadata tages)

*/

export function conduct_basic_archive(unparsed_url:string) : Promise<HttpRecord> {

    return new Promise<HttpRecord>(async(resolve,reject)=> {

        try {

            let parsed_url = new URL(unparsed_url)
            let record = await get_http_record(parsed_url.href)
            let archival_data : any = await catalogue_basic_data(parsed_url.origin, record.response_text)

            record.archive_object.links = archival_data.link_data
            record.archive_object.meta = archival_data.meta_data

            resolve(record)

        } catch (error) {

            reject(error)

        }

    })

}


/*

harvests links, number_to_gather === number of links to gather

*/

export async function conduct_link_harvest(link:string, link_limit:number, page_limit:number) : Promise<Array<string>> {

    return new Promise<Array<string>>(async (resolve, reject)=>{

        try {

            let links = Array();

            links.push(link)

            for (let i = 0; i < links.length; i++) {

                let url : URL = new URL(links[i])
                let text : string = await get_html_text(url)
                let unharvested_links : Array<URL> = await catalogue_links(url.origin, text)
                let harvested_links : Array<string> = await harvest_links(links, unharvested_links)
                let stop : number = 0;

                if (links.length + harvested_links.length > link_limit){

                    stop = link_limit - links.length

                }else{

                    stop = harvested_links.length

                }

                for (let j = 0; j < stop; j++) {

                    links.push(harvested_links[j])

                }

                if(i >= page_limit){

                    break;

                }

            }

            resolve(links)

        } catch (error) {

            reject(error)

        }

    })

}

function harvest_links(gathered_links: Array<string>, links:Array<any>) : Promise<Array<string>> {

    return new Promise( (resolve, reject) => {

        try {

            let return_array = Array()

            for (const link of links) {

                let should_add = !gathered_links.includes(link.href)
                let file_extension = get_url_extension(link.href)
                let not_in_list = !non_crawl_file.includes(file_extension)

                if (
                    should_add
                    &&
                    not_in_list
                ) {

                    return_array.push(link.href)

                }

            }



            resolve(return_array)

        } catch (error) {

            console.error(error)

        }

    })

}


function get_url_extension( url: string ) {
    //@ts-ignore
    return url.split(/[#?]/)[0].split('.').pop().trim();
}



export async function conduct_worker_harvest(link:string, link_limit:number, page_limit:number) : Promise<Array<string>> {

    return new Promise<Array<string>>(async (resolve, reject)=>{

        try {

            let links = Array();
            let should_break = false

            links.push(link)

            for (let page_index = 0; page_index < links.length; page_index++) {

                let url : URL = new URL(links[page_index])
                let text : string = await get_html_text(url)
                let unharvested_links : Array<URL> = await catalogue_links(url.origin, text)
                let harvested_links : Array<string> = await harvest_links(links, unharvested_links)
                let stop : number = 0;

                if (links.length + harvested_links.length > link_limit){

                    stop = link_limit - links.length
                    should_break = true

                }else{

                    stop = harvested_links.length

                }

                if(page_index >= page_limit ){

                    should_break = true

                }

                for (let j = 0; j < stop; j++) {

                    links.push(harvested_links[j])

                    //worker.postMessage({ url : harvested_links[j]})

                    //publisher.publish_message( { url : harvested_links[j] } )

                }

                if(should_break){

                    break;

                }

            }

            resolve(links)

        } catch (error) {

            reject(error)

        }

    })

}



let non_crawl_file = ["jpg", "pdf", "gif", "webm", "jpeg","css","js","png"]