import {operate_crawl, operate_harvest} from "./src/operator.ts";


let smoke = Deno.args

try{


    let limit_int = parseInt(smoke[2])
    let url = new URL(smoke[1])
    let option = smoke[0].split(/-/)[1]

    switch(option){

        case "sc":

            // @ts-ignore
            let crawled_pages : Array<HttpRecord> = await operate_crawl(url.href, limit_int)


            crawled_pages.forEach(element =>{

                console.log("crawled", element.url.href, "with status", element.response.status)

            })

            break;

        case "eh":

            let harvested_links = await operate_harvest(url.href,limit_int,10)

            // @ts-ignore
            console.log("harvested", harvested_links.length, "links")
            console.log(harvested_links)

            break;

        default:

            console.error("not a valid option")

            break;

    }


} catch (err) {

    console.error(err)

}

