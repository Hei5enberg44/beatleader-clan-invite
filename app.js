import chalk from 'chalk'

(async () => {
    const COOKIE_VALUE = ''
    const COOKIE = `.AspNetCore.Cookies=${COOKIE_VALUE}; Expires=Tue, 1 Jan 2038 00:00:00 GMT; Domain=beatleader.xyz; Path=/`
    const BLACKLIST = [
        '76561198125542519'
    ]

    const getFRPlayers = async () => {
        let nextPage = 1
        const itemsPerPage = 50
        const players = []

        do {
            const request = await fetch(`https://api.beatleader.xyz/players?sortBy=pp&page=${nextPage}&count=${itemsPerPage}&countries=FR`, {
                method: 'GET'
            })

            if(request.ok) {
                const result = await request.json()
                const metadata = result.metadata
                const data = result.data

                for(const player of data) {
                    if(!BLACKLIST.includes(player.id)) {
                        players.push({
                            id: player.id,
                            name: player.name
                        })
                    }
                }

                nextPage = metadata.page + 1 <= Math.ceil(metadata.total / metadata.itemsPerPage) ? nextPage + 1 : null
            } else {
                nextPage = null
            }
        } while(nextPage !== null)

        return players
    }

    const invitePlayerToClan = async (player) => {
        const request = await fetch(`https://api.beatleader.xyz/clan/invite?player=${player.id}`, {
            method: 'POST',
            headers: {
                'Cookie': COOKIE,
                'Accept': 'text/plain'
            }
        })

        const result = await request.text()
        console.log(result.ok ? chalk.green(result) : chalk.red(result))
    }

    console.log(chalk.blue('Récupération de la liste des joueurs FR...'))
    const players = await getFRPlayers()
    console.log(chalk.green('Récupération de la liste des joueurs FR terminée'))
    
    console.log(chalk.blue('Envoi des invitations à rejoindre le clan BSFR'))
    for(const player of players) {
        console.log(chalk.blue(`Invitation du joueur "${player.name}"`))
        invitePlayerToClan(player)
    }
    console.log(chalk.green('Toutes les invitations ont bien été envoyées'))
})()