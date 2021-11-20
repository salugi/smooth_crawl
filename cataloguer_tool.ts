
import {v4} from "https://deno.land/std/uuid/mod.ts"

export function meta_parse(a:Array<any>):Array<string>{
    try {

        let out = Array<any>();

        for (let i = 0; i < a.length; i++) {

            if (a[i].attributes.content !== undefined
                &&
                a[i].attributes.content !== null) {

                let meta_tag = {
                    name: "",
                    content: Array()
                }

                if (a[i].attributes.charset !== undefined) {

                    meta_tag.name = "charset"
                    meta_tag.content.push(a[i].attributes.charset)

                    out.push(meta_tag)

                    continue

                } else if (a[i].attributes.property !== undefined) {

                    meta_tag.name = a[i].attributes.property
                    meta_tag.content = a[i].attributes.content.split(",")

                    out.push(meta_tag)

                    continue

                } else if (a[i].attributes["http-equiv"] !== undefined) {

                    meta_tag.name = a[i].attributes["http-equiv"]
                    meta_tag.content = a[i].attributes.content.split(",")
                    out.push(meta_tag)

                    continue

                } else if (a[i].attributes.name !== undefined) {

                    meta_tag.name = a[i].attributes.name
                    meta_tag.content = a[i].attributes.content.split(",")

                    out.push(meta_tag)

                    continue

                }else {

                    out.push({

                        "meta-related":a[i].attributes.content

                    })

                }

            }

        }

        return out

    }catch(error){

        console.log("crawler-tools.ts")
        Deno.exit(2)

    }

}


function meta_check(a:string):Boolean{

    if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(a) ||
        /(tel:.*)/.test(a)                                      ||
        /(javascript:.*)/.test(a)                               ||
        /(mailto:.*)/.test(a)
    ) {
        return true

    }else{

        return false

    }
}

export function link_parse(domain:string, lineage_links: Array<string>):any{

    try {

        let c: Array<any> = new Array()

        if (lineage_links.length > 1) {

            for (let i = 0; i < lineage_links.length; i++) {

                if (
                    !/\s/g.test(lineage_links[i])
                    &&
                    lineage_links[i].length > 0
                ) {

                    let test = lineage_links[i].substring(0, 4)

                    if (meta_check(lineage_links[i])) {

                        continue

                    } else if (/[\/]/.test(test.substring(0, 1))) {

                        if (/[\/]/.test(test.substring(1, 2))) {

                            let reparse_backslash = lineage_links[i].slice(1, lineage_links[i].length)
                            lineage_links[i] = reparse_backslash

                        }


                        c.push(new URL(domain + lineage_links[i]))

                        continue

                    } else if (
                        (/\.|#|\?|[A-Za-z0-9]/.test(test.substring(0, 1))
                            &&
                            !/(http)/.test(test))
                    ) {

                       try {

                           //weed out potential non http protos
                            let url = new URL(lineage_links[i])


                        } catch {

                            let url = new URL("/" + lineage_links[i], domain)

                           c.push(url)

                        }

                        continue

                    } else if (/\\\"/.test(test)) {

                        let edge_case_split_tester = lineage_links[i].split(/\\\"/)
                        lineage_links[i] = edge_case_split_tester[0]

                        if (!/http/.test(lineage_links[i].substring(0, 4))) {

                            let url = new URL("/" + lineage_links[i], domain)

                            c.push(url)

                            continue

                        }
                    } else {

                        try {

                            let link_to_test = new URL(lineage_links[i])
                            let temp_url = new URL(domain)
                            let host_domain = temp_url.host.split(".")
                            let host_tester = host_domain[host_domain.length - 2] + host_domain[host_domain.length - 1]
                            let compare_domain = link_to_test.host.split(".")
                            let compare_tester = compare_domain[compare_domain.length - 2] + compare_domain[compare_domain.length - 1]

                            if (host_tester !== compare_tester) {

                                continue

                            }


                            c.push(link_to_test)

                        } catch (error) {

                            console.error(error)

                        }

                        continue

                    }

                }

            }

        }

        return c

    }catch(err){

        console.error(err)

    }

}
