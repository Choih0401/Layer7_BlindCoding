var mysql_dbc = require('../../db/db_con')()
var connection = mysql_dbc.init()
var fs = require('fs')
var crypto = require('crypto');
var spawn = require('child_process').spawn;
import async from 'async'
require('dotenv').config()

export const signUp = function(req, res) {
    var {
        id,
        name,
        password,
        email,
        phonenumber
    } = req.body
    if (!id || !name || !password) {
        res.json({
            code: 500,
            v: 'v1',
            status: 'ERR',
            detail: 'INVALID FORMAT'
        })
    } else {
        async.waterfall([
                (callback) => {
                    password = crypto.createHash('sha512').update(crypto.createHash('sha512').update(password).digest('base64')).digest('base64');
                    var sql = 'SELECT count(*) as count FROM user_list WHERE id = ?'
                    connection.query(sql, [id], (err, result) => {
                        if (err) {
                            callback({
                                err: 'QUERY',
                                message: 'QUERY ERROR'
                            })
                        } else {
                            if (result[0].count > 0) {
                                callback({
                                    err: 'ERR_SIGNUP',
                                    message: 'USERID ALREADY EXISTS'
                                })
                            } else {
                                callback(null, '')
                            }
                        }
                    })
                },
                (resultData, callback) => {
                    var sql = 'INSERT INTO user_list (id, name, password, email, phonenumber) values(?, ?, ?, ?, ?)'
                    connection.query(sql, [id, name, password, email, phonenumber], (err, result) => {
                        if (err) {
                            callback({
                                err: 'QUERY',
                                message: 'QUERY ERROR'
                            })
                        } else {
                            callback(null, '')
                        }
                    })
                }
            ],
            (err, result) => {
                if (err) {
                    res.json({
                        code: 500,
                        v: 'v1',
                        status: 'ERR_SIGNUP',
                        detail: err
                    })
                } else {
                    res.json({
                        code: 200,
                        v: 'v1',
                        status: 'SUCCESS',
                        detail: 'Sign up successful!'
                    })
                }
            })
    }
}

export const signIn = function(req, res) {
    var {
        id,
        password
    } = req.body
    if (!id || !password) {
        res.json({
            code: 500,
            v: 'v1',
            status: 'ERR',
            detail: 'INVALID FORMAT'
        })
    } else {
        async.waterfall([
                (callback) => {
                    password = crypto.createHash('sha512').update(crypto.createHash('sha512').update(password).digest('base64')).digest('base64');
                    var sql = 'SELECT count(*) as count FROM user_list WHERE id = ? AND password = ? AND is_use = 1'
                    connection.query(sql, [id, password], (err, result) => {
                        if (err) {
                            callback({
                                err: 'QUERY',
                                message: 'QUERY ERROR'
                            })
                        } else {
                            if (result[0].count == 0) {
                                callback({
                                    err: 'ERR_SIGNIN',
                                    message: 'INVALID PASSWORD OR ID'
                                })
                            } else {
                                callback(null, '')
                            }
                        }
                    })
                }
            ],
            (err, result) => {
                if (err) {
                    res.json({
                        code: 500,
                        v: 'v1',
                        status: 'ERR_SIGNIN',
                        detail: err
                    })
                } else {
                    res.json({
                        code: 200,
                        v: 'v1',
                        status: 'SUCCESS',
                        detail: 'Sign in successful!'
                    })
                }
            })
    }
}

export const compile = function(req, res) {
    var {
        language,
        content
    } = req.body
    if (!language || !content) {
        res.json({
            code: 500,
            v: 'v1',
            status: 'ERR',
            detail: 'INVALID FORMAT'
        })
    } else {
        async.waterfall([
                (callback) => {
                    if(language == 'c'){
                        let file = 'code/code.c'
                        fs.writeFile(file, content, 'utf8', function(err){
                        })
                        var compile = spawn('gcc', [file])
                        compile.on('close', function(data){
                            if(data == 0){
                                var run = spawn('./a.out', [])
                                run.stdout.on('data', function(output){
                                    callback(null, {output: output.toString('utf8')})
                                })
                            }else{
                                callback({err: '.c code'})
                            }
                        })
                    }else if(language == 'cpp'){
                        let file = 'code/code.cpp'
                        fs.writeFile(file, content, 'utf8', function(err){
                        })
                        var compile = spawn('g++', [file])
                        compile.on('close', function(data){
                            if(data == 0){
                                var run = spawn('./a.out', [])
                                run.stdout.on('data', function(output){
                                    callback(null, {output: output.toString('utf8')})
                                })
                            }else{
                                callback({err: '.cpp code'})
                            }
                        })
                    }else if(language == 'python2'){
                        let file = 'code/code.py'
                        fs.writeFile(file, content, 'utf8', function(err){
                        })
                        var compile = spawn('python', [file])
                        compile.stdout.on('data', function(data){
                            callback(null, {output: data.toString('utf8').replace(/\n+$/,'')})
                        })
                        compile.stderr.on('data', function(data){
                            callback({err: String(data)})
                        })
                    }else if(language == 'python3'){
                        let file = 'code/code.py'
                        fs.writeFile(file, content, 'utf8', function(err){
                        })
                        var compile = spawn('python3', [file])
                        compile.stdout.on('data', function(data){
                            callback(null, {output: data.toString('utf8').replace(/\n+$/,'')})
                        })
                        compile.stderr.on('data', function(data){
                            callback({err: String(data)})
                        })
                    }else{
                        res.json({
                            code: 500,
                            v: 'v1',
                            status: 'ERR',
                            detail: 'INVALID FORMAT'
                        })
                    }
                }
            ],
            (err, result) => {
                if (err) {
                    res.json({
                        code: 500,
                        v: 'v1',
                        status: 'ERR_COMPILE',
                        detail: err
                    })
                } else {
                    res.json({
                        code: 200,
                        v: 'v1',
                        status: 'SUCCESS',
                        detail: result
                    })
                }
            })
    }
}

export const leaderboard = function(req, res) {
    async.waterfall([
        (callback) => {
            var sql = 'SELECT * FROM user_list WHERE is_use = 0 ORDER BY question desc, score, endtime'
            connection.query(sql, [], (err, result) => {
                if (err) {
                    callback({err: 'QUERY', message: 'QUERY ERROR'})
                }else{
                    let arr = []
                    if(result.length != 0){
                        result.forEach((v, i) => {
                            arr.push({
                                name: v.name,
                                score: v.score,
                                question: v.question
                            })
                        })
                        callback(null, arr)
                    }else{
                        callback(null, arr)
                    }
                }
            })
        }
    ],
    (err, result) => {
        if (err) {
            res.json({
                code: 500,
                v: 'v1',
                status: 'ERR_LEADERBOARD',
                detail: err
            })
        } else {
            res.json({
                code: 200,
                v: 'v1',
                status: 'SUCCESS',
                detail: result
            })
        }
    })
}

export const updateScore = function(req, res) {
    var {
        id
    } = req.body
    var score
    if (!id) {
        res.json({
            code: 500,
            v: 'v1',
            status: 'ERR',
            detail: 'INVALID FORMAT'
        })
    } else {
        async.waterfall([
                (callback) => {
                    var sql = 'SELECT * FROM user_list WHERE id = ?'
                    connection.query(sql, [id], (err, result) => {
                        if (err) {
                            callback({
                                err: 'QUERY',
                                message: 'QUERY ERROR'
                            })
                        } else {
                            if (result.length == 0) {
                                callback({
                                    err: 'ERR_UPDATESCORE',
                                    message: 'INVALID ID'
                                })
                            } else {
                                score = result[0].question
                                callback(null, '')
                            }
                        }
                    })
                },
                (resultData, callback) => {
                    var sql = 'UPDATE user_list SET question = ? WHERE id = ?'
                    connection.query(sql, [score + 1, id], (err, result) => {
                        if (err) {
                            callback({
                                err: 'QUERY',
                                message: 'QUERY ERROR'
                            })
                        } else {
                            callback(null, '')
                        }
                    })
                }
            ],
            (err, result) => {
                if (err) {
                    res.json({
                        code: 500,
                        v: 'v1',
                        status: 'ERR_UPDATESCORE',
                        detail: err
                    })
                } else {
                    res.json({
                        code: 200,
                        v: 'v1',
                        status: 'SUCCESS',
                        detail: 'Update score successful'
                    })
                }
            })
    }
}

export const timeCompare = function(req, res) {
    var {
        id
    } = req.body
    var old, now, gap, sec_gap
    async.waterfall([
        (callback) => {
            var sql = 'SELECT starttime, endtime FROM user_list WHERE id = ?'
            connection.query(sql, [id], (err, result) => {
                if(err){
                    callback({
                        err: 'QUERY',
                        message: 'QUERY ERROR'
                    })
                }else{
                    old = result[0].starttime
                    now = result[0].endtime
                    gap = now.getTime() - old.getTime()
                    sec_gap = gap / 1000
                    callback(null, '')
                }
            })
        },
        (resultData, callback) => {
            var sql = 'UPDATE user_list SET score = ?, is_use = 0 WHERE id = ?'
            connection.query(sql, [sec_gap, id], (err, result) => {
                if(err){
                    callback({
                        err: 'QUERY',
                        message: 'QUERY ERROR'
                    })
                }else{
                    callback(null, '')
                }
            })
        }
    ],
    (err, result) => {
        if(err){
            res.json({
                code: 500,
                v: 'v1',
                status: 'ERR_TIMECOMPARE',
                detail: err
            })
        }else{
            res.json({
                code: 200,
                v: 'v1',
                status: 'SUCCESS',
                detail: 'Compare time successful'
            })
        }
    })
}