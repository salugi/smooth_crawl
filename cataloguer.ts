import {DOMParser} from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
import {link_parse, meta_parse} from "./cataloguer_tool.ts";
import {v4} from "https://deno.land/std/uuid/mod.ts";

export async function catalogue_links(origin:string, text:string):Promise<any>{

    return new Promise(function(resolve) {

        try {

            let link_set = Array();

            if(text.length > 1) {

                const document: any = new DOMParser().parseFromString(text, 'text/html');

                if (document === undefined) {

                    let funnel_point = "cataloguer.ts"
                    let funk = "crawl"
                    let error = "unable to interchange gen_object"
                    let id = v4.generate()

                    resolve(link_set)

                } else {

                    let link_jagged_array = Array<Array<any>>(
                        document.querySelectorAll('a'),
                        document.querySelectorAll('link'),
                        document.querySelectorAll('base'),
                        document.querySelectorAll('area')
                    )

                    for (let i = 0; i < link_jagged_array.length; i++) {

                        for (let j = 0; j < link_jagged_array[i].length; j++) {

                            if (link_jagged_array[i][j].attributes.href !== undefined
                                &&
                                link_jagged_array[i][j].attributes.href.length > 0) {

                                link_set.push(link_jagged_array[i][j].attributes.href)

                            }

                        }

                    }

                    link_set = [...new Set(link_set)]

                    // @ts-ignore
                    let fully_parsed_links = link_parse(origin, link_set)

                    resolve(fully_parsed_links)

                }

            }else{
                resolve(link_set)
            }

        }catch(error){

            let funnel_point = "cataloguer.ts"
            let funk = "crawl"
            let id = v4.generate()

            console.error(error)
        }

    })

}
export async function catalogue_basic_data(origin:string, text:string):Promise<any>{

    return new Promise(function(resolve) {

        try {

            let link_set = Array();

            if(text.length > 1) {

                const document: any = new DOMParser().parseFromString(text, 'text/html');

                if (document === undefined) {

                    let funnel_point = "cataloguer.ts"
                    let funk = "crawl"
                    let error = "unable to interchange gen_object"
                    let id = v4.generate()

                    //resolve(link_set)

                } else {

                    let link_jagged_array = Array<Array<any>>(
                        document.querySelectorAll('a'),
                        document.querySelectorAll('link'),
                        document.querySelectorAll('base'),
                        document.querySelectorAll('area')
                    )

                    let meta_information = document.querySelectorAll('meta')

                    for (let i = 0; i < link_jagged_array.length; i++) {

                        for (let j = 0; j < link_jagged_array[i].length; j++) {

                            if (link_jagged_array[i][j].attributes.href !== undefined
                                &&
                                link_jagged_array[i][j].attributes.href.length > 0) {

                                link_set.push(link_jagged_array[i][j].attributes.href)

                            }

                        }

                    }

                    link_set = [...new Set(link_set)]

                    // @ts-ignore
                    let fully_parsed_links = link_parse(origin, link_set)
                    let parsed_meta_information = meta_parse(meta_information)

                    let archives = {
                        link_data:fully_parsed_links,
                        meta_data:parsed_meta_information
                    }

                    resolve(archives)

                }

            }else{
                resolve(link_set)
            }

        }catch(error){

            let funnel_point = "cataloguer.ts"
            let funk = "crawl"
            let id = v4.generate()

            console.error(error)
        }

    })

}