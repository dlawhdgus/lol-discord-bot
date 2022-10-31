const Discord = require('discord.js')
const { EmbedBuilder } = require('discord.js')
const GetApiData = require('../modules')

module.exports.helper = () => {
    const help = new EmbedBuilder()
        .setTitle('사용법')
        .setDescription(`
        ${Discord.bold('1. !닉네임')}
        *사용자의 정보를 보여줍니다.*
        ${Discord.bold('2. !닉네임 전적')}
        *사용자의 최근 10판 전적을 보여줍니다.*
        ${Discord.bold('3. !닉네임 vs 닉네임')}
        *두 사용자의 최근 10판의 승률과 Kda를 보여줍니다.*
        ${Discord.bold('4. !닉네임 챔피언이름')}
        *사용자에대한 챔피언의 숙련도를 보여줍니다.*


        닉네임에 공백 X
        `)

    return help
}

module.exports.NotFoundError = () => {
    const NotFoundError = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('소환사가 없습니다.')
        .setColor(0xFF0000)

    return NotFoundError
}

module.exports.ServerError = () => {
    const ServerError = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('server error')
        .setColor(0xFF0000)

    return ServerError
}

module.exports.DiffUsers = async (username) => {
    const player1Username = username.split(' ')[0]
    const player2Username = username.split(' ')[2]
    const player = await GetApiData.DiffPlayers(player1Username, player2Username)

    const PlayerDiffembed = new EmbedBuilder()
        .setTitle(`${player.Player1.Player1Username}      VS      ${player.Player2.Player2Username}`)
        .setDescription(`승률
        ${player.Player1.Player1WinRate}% ${player.Player2.Player2WinRate}%
        KDA
        ${player.Player1.Player1KdaRate} ${player.Player2.Player2KdaRate}
        `)
        .setColor(0x0F0F0F)

    return PlayerDiffembed
}

module.exports.UserProfile = async (username) => {
    const puuidResponse = await GetApiData.GetUserData(username)
    const RankData = await GetApiData.GetRankData(puuidResponse.id)
    const IconId = puuidResponse.profileIconId
    const IconUri = `http://ddragon.leagueoflegends.com/cdn/12.20.1/img/profileicon/${IconId}.png`
    const level = puuidResponse.summonerLevel
    if (!(RankData.data[0]) || !((RankData.data[0].queueType) === 'RANKED_SOLO_5x5')) {
        const UserProfileEmbed = new EmbedBuilder()
            .setTitle(puuidResponse.name)
            .setThumbnail(IconUri)
            .setDescription(`Level : ${level}
                        랭크 정보가 없습니다.`)
            .setColor(0xFFFFFF)

        return UserProfileEmbed
    } else {
        const Tier = RankData.data[0].tier
        const rank = RankData.data[0].rank
        const wins = RankData.data[0].wins
        const losses = RankData.data[0].losses
        const games = Number(wins) + Number(losses)
        const UserProfileEmbed = new EmbedBuilder()
            .setTitle(puuidResponse.name)
            .setThumbnail(IconUri)
            .setDescription(`Level : ${level}
                            개인/2인 랭크
                            ${Tier} ${rank}
                            ${games}전 ${wins}승 ${losses}패`)
            .setColor(0xFFFFFF)

        return UserProfileEmbed
    }
}

module.exports.RecentGames = async (username) => {
    const User = await GetApiData.UserDataTemplate(username)
    const UserGames = new EmbedBuilder()
        .setAuthor({ name: `${User.name}`, iconURL: `${User.userIcon}` })
        .setTitle('승 / 패   KDA   게임모드   끝난시간')
        .setDescription(`
            ${User.Win[0]} ${String(User.Kda[0])} ${User.GameMode[0]} ${User.EndTime[0].toLocaleString()}
            ${User.Win[1]} ${String(User.Kda[1])} ${User.GameMode[1]} ${User.EndTime[1].toLocaleString()}
            ${User.Win[2]} ${String(User.Kda[2])} ${User.GameMode[2]} ${User.EndTime[2].toLocaleString()}
            ${User.Win[3]} ${String(User.Kda[3])} ${User.GameMode[3]} ${User.EndTime[3].toLocaleString()}
            ${User.Win[4]} ${String(User.Kda[4])} ${User.GameMode[4]} ${User.EndTime[4].toLocaleString()}
            ${User.Win[5]} ${String(User.Kda[5])} ${User.GameMode[5]} ${User.EndTime[5].toLocaleString()}
            ${User.Win[6]} ${String(User.Kda[6])} ${User.GameMode[6]} ${User.EndTime[6].toLocaleString()}
            ${User.Win[7]} ${String(User.Kda[7])} ${User.GameMode[7]} ${User.EndTime[7].toLocaleString()}
            ${User.Win[8]} ${String(User.Kda[8])} ${User.GameMode[8]} ${User.EndTime[8].toLocaleString()}
            ${User.Win[9]} ${String(User.Kda[9])} ${User.GameMode[9]} ${User.EndTime[9].toLocaleString()}
            `)
        .setColor(0xFF00FF)
    return UserGames
}

module.exports.ChampionsLevel = async (username) => {
    const summonertotalName = username.split('!')[0]
    const summonerName = summonertotalName.split(' ')[0]

    const ChampionData = await GetApiData.UserChampionsLevel(username)
    const puuidResponse = await GetApiData.GetUserData(summonerName)
    const name = ChampionData.name
    const Gameusername = puuidResponse.name
    const ChampionIconUri = ChampionData.ChampIconUri
    const UserIconUri = `http://ddragon.leagueoflegends.com/cdn/12.20.1/img/profileicon/${puuidResponse.profileIconId}.png`
    
    if (ChampionData.level) {
        const level = ChampionData.level
        const point = ChampionData.point

        const ChampionsLevelEmbed = new EmbedBuilder()
            .setAuthor({ name: Gameusername, iconURL: UserIconUri })
            .setTitle(name)
            .setThumbnail(ChampionIconUri)
            .addFields(
                { name: 'level', value: `${String(level)}렙`, inline: true },
                { name: 'point', value: `${String(point)}점`, inline: true }
            )

        return ChampionsLevelEmbed
    } else {
        const ChampionsLevelEmbed = new EmbedBuilder()
            .setAuthor({ name: Gameusername, iconURL: UserIconUri })
            .setTitle(name)
            .setThumbnail(ChampionIconUri)
            .setDescription('챔피언 정보가 없습니다.')

        return ChampionsLevelEmbed
    }
}