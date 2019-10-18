var mysql_dbc = require('../../db/db_con')()
var connection = mysql_dbc.init()
var fs = require('fs')
var spawn = require('child_process').spawn;
import async from 'async'
require('dotenv').config()

export const signUp = function(req, res) {
    var {
        id,
        name,
        password
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
                    var sql = 'INSERT INTO user_list (id, name, password, email, interest, intro) values(?, ?, ?)'
                    connection.query(sql, [id, name, password], (err, result) => {
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
                    var sql = 'SELECT count(*) as count FROM user_list WHERE id = ? AND password = ?'
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
                    var sql = 'SELECT count(*) as count FROM flag WHERE answer = ? and is_use = 1'
                    if(language == 'c'){
                        let file = 'code/code.c'
                        fs.writeFile(file, content, 'utf8', function(err){
                        })
                        var compile = spawn('gcc', [file])
                        compile.on('close', function(data){
                            if(data == 0){
                                var run = spawn('./a.out', [])
                                run.stdout.on('data', function(output){
                                    connection.query(sql, [output.toString('utf8')], (err, result) => {
                                        if(result[0].count == 0){
                                            callback(null, {status: 'Incorrect', output: output.toString('utf8')})
                                        }else{
                                            callback(null, {status: 'Correct', output: output.toString('utf8')})
                                        }
                                    })
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
                                    connection.query(sql, [output.toString('utf8')], (err, result) => {
                                        if(result[0].count == 0){
                                            callback(null, {status: 'Incorrect', output: output.toString('utf8')})
                                        }else{
                                            callback(null, {status: 'Correct', output: output.toString('utf8')})
                                        }
                                    })
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
                            connection.query(sql, [data.toString('utf8').replace(/\n+$/,'')], (err, result) => {
                                if(result[0].count == 0){
                                    callback(null, {status: 'Incorrect', output: data.toString('utf8').replace(/\n+$/,'')})
                                }else{
                                    callback(null, {status: 'Correct', output: data.toString('utf8').replace(/\n+$/,'')})
                                }
                            })
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
                            connection.query(sql, [data.toString('utf8').replace(/\n+$/,'')], (err, result) => {
                                if(result[0].count == 0){
                                    callback(null, {status: 'Incorrect', output: data.toString('utf8').replace(/\n+$/,'')})
                                }else{
                                    callback(null, {status: 'Correct', output: data.toString('utf8').replace(/\n+$/,'')})
                                }
                            })
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
            var sql = 'SELECT * FROM user_list WHERE is_use = 1 ORDER BY score, endtime'
            connection.query(sql, [], (err, result) => {
                if (err) {
                    callback({err: 'QUERY', message: 'QUERY ERROR'})
                }else{
                    let arr = []
                    if(result.length != 0){
                        result.forEach((v, i) => {
                            arr.push({
                                name: v.name,
                                score: v.score
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