import {order_crawl_harvest} from "./harvest_operator.ts";

let smoke = Deno.args

try{


    let limit_int = parseInt(smoke[1])
    let url = new URL(smoke[0])

    // @ts-ignore
    let crawled_pages : Array<HttpRecord> = await order_crawl_harvest(url.href, limit_int)


    crawled_pages.forEach(element =>{

        console.log(element.url.href, element.response.status)

    })

} catch (err) {

    console.error(err)

}