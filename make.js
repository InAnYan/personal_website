const axios = require('axios')
const fs = require('fs')
const fsp = require('fs/promises')
const readline = require('readline')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const owner = "InAnYan"
const projects_path = "./projects/"
const layout = "project.njk"
const papersRepo = "papers"

async function main() {
    const fileStream = fs.createReadStream('projects.txt')

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })

    var i = 0;

    for await (const line of rl) {
        try {
            console.log(`https://api.github.com/repos/${owner}/${line}`)
            const repoResponse = await axios.get(`https://api.github.com/repos/${owner}/${line}`)
            const repo = repoResponse.data

            const readmeResponse = await axios.get(`https://raw.githubusercontent.com/${owner}/${line}/master/README.md`)
            const readme = readmeResponse.data

            const options = {
                title: repo.description,
                layout: layout,
                url: `https://github.com/${owner}/${line}`,
                tags: "project",
                permalink: `/projects/project_${i}.html`,
                name: line,
            }

            var contents = "---\n"
            for (const [key, value] of Object.entries(options)) {
                contents += `${key}: ${value}\n`
            }
            contents += "---\n\n" + readme

            await fsp.writeFile(`${projects_path}/project_${i}.md`, contents)

            i += 1
            await delay(1000)
        } catch (e) {
            console.log(`Error (${line}): ${e}`)
        }
    }

    /*
    await exec(`git clone https://github.com/${owner}/${papersRepo} tmp/`)

    for (const item in fs.readdirSync('tmp/')) {
        const path = `tmp/${item}`

        if (fs.lstatSync(path).isDirectory()) {
            for (const entry in fs.readdirSync(path)) {
                if (entry == "Paper.tex" || entry == "Paper_English.tex") {
                }
            }
        }
    }
    */
}

main()