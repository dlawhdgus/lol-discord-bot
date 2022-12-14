const { connection } = require('mongoose')
const UsersColl = connection.collection('users')
const date = new Date()

exports.InsertIds = async (username, RankMatchIds, NormalMatchIds) => {
    const MatchId = await UsersColl.insertOne({ username: username, RankMatchIds: RankMatchIds, NormalMatchIds: NormalMatchIds, createAt: date })
}
exports.InsertNormalIds = async (username, NormalMatchIds) => {
    const MatchId = await UsersColl.insertOne({ NormalMatchIds: NormalMatchIds })
}
exports.InsertDatas = async (username, RankData, NormalData) => {
    const MatchData = await UsersColl.insertOne({ username: username, RankData: RankData, NormalData: NormalData })
}
exports.InsertGames = async (username, RecentRecode) => {
    const RecentGame = await UsersColl.updateOne({ username: username }, { $set: { RecentRecode: RecentRecode } })
    return await UsersColl.findOne({ username: username })
}