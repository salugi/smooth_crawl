
// @ts-ignore
import {v4} from "https://deno.land/std/uuid/mod.ts";
import {HttpRecord} from "./models/HttpRecord.ts";

export async function get_html_text(url:URL) : Promise<any> {

    return new Promise(async function (resolve, reject) {

                await fetch(url.href).then(function (result) {

                    if (result !== undefined && result !== null) {

                        //second promise. turn result to text.
                        result.text().then(function (text) {

                                resolve(text)

                        }).catch(error => {

                            let funnel_point = "radio_flyer.ts"
                            let funk = "http call inny"
                            let id = v4.generate()

                            console.error(funk)
                            console.error(error)
                        })

                    }
                }).catch(error => {

                    let funnel_point = "radio_flyer.ts"
                    let funk = "http call outty"
                    let id = v4.generate()

                    console.error(funk)
                    console.log(error)

                })
    })
}

export async function get_http_record(unparsed_url:string) : Promise<HttpRecord> {

    return new Promise(async function (resolve, reject) {

        let parsed_url = new URL(unparsed_url)


        let record : HttpRecord ={
            id:v4.generate(),
            creation_date : Date.now(),
            url:parsed_url,
            response:{},
            response_text:"",
            archive_object:{}
        }

        await fetch(record.url.href).then(function (result) {

            if (result !== undefined && result !== null) {

                record.response = result

                //second promise. turn result to text.
                result.text().then(function (text) {

                    if (text.length > 1){

                        record.response_text = text

                    }

                    resolve(record)

                }).catch(error => {

                    let funnel_point = "radio_flyer.ts"
                    let funk = "get_http_record inny"
                    let id = v4.generate()

                    console.error(funk)
                    console.error(error)

                    //reject(error)
                })

            }
        }).catch(error => {

            let funnel_point = "radio_flyer.ts"
            let funk = "get_http_record outty"
            let id = v4.generate()

            console.error(funk)
            console.log(error)

            //reject(error)

        })
    })
}