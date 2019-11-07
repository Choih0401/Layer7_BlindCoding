import express from 'express'
import * as API from './api'

const router = express.Router()

router.get('/', (req, res) => {
    res.json({
        code: 200,
        v: 'v1',
        status: 'OK'
    })
})

router.post('/auth/signup', API.signUp)

router.post('/auth/signin', API.signIn)

router.post('/challenge/compile', API.compile)

router.get('/challenge/leaderboard', API.leaderboard)

router.post('/challenge/updatescore', API.updateScore)

router.post('/challenge/compare', API.timeCompare)

router.post('/auth/init', API.init)

router.post('/auth/penalty', API.penalty)

export default router