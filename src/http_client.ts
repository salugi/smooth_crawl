// @ts-ignore
import {v4} from "https://deno.land/std/uuid/mod.ts";
import {HttpRecord} from "./models/HttpRecord.ts";

/*

returns http text (normally html)

*/

const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), 5000)

export async function get_html_text(unparsed_url:string) : Promise<string> {

    return new Promise(async function (resolve, reject) {

        //parse url cuz symbols

                let parsed_url = new URL(unparsed_url)

        //send get
                await fetch(parsed_url.href,{signal:controller.signal}).then(function (result) {
                    clearTimeout(timeoutId)
                    if (result !== undefined) {

                        //turn result to text.
                        result.text().then(function (text) {

                                resolve(text)

                        }).catch(error => {

                            console.error("get_html_text result.text errored out")

                            reject(error)

                        })

                    }
                }).catch(error => {

                    console.error("get_html_text fetch errored out")

                    reject(error)

                })
    })
}

/*

returns http record

*/

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

        await fetch(record.url.href,{signal:controller.signal}).then(function (result) {

            clearTimeout(timeoutId)

            if (result !== undefined && result !== null) {

                record.response = result

                // turn result to text.
                result.text().then(function (text) {

                    if (text.length > 1){

                        record.response_text = text

                    }

                    resolve(record)

                }).catch(error => {

                    console.error("get_http_record result.text errored out")

                    reject(error)

                })

            }
        }).catch(error => {

            console.error("get_http_record fetch errored out")

            reject(error)

        })
    })
}