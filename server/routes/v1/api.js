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
        password,
        email,
        interest
    } = req.body
    if (!id || !name || !password || !email || !interest) {
        res.json({
            code: 500,
            v: 'v1',
            status: 'ERR',
            detail: 'INVALID FORMAT'
        })
    } else {
        async.waterfall([
                (callback) => {
                    var sql = `SELECT count(*) as count FROM user_list WHERE id = '${id}'`
                    connection.query(sql, [], (err, result) => {
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
                    var sql = `INSERT INTO user_list (id, name, password, email, interest, intro) values('${id}', '${name}', '${password}', '${email}', '${interest}', '${name}')`
                    connection.query(sql, [], (err, result) => {
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
                    var sql = `SELECT count(*) as count FROM user_list WHERE id = '${id}' AND password = '${password}'`
                    connection.query(sql, [], (err, result) => {
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
                    if(language == 'C'){
                        let file = 'code/code.c'
                        fs.writeFile(file, content, 'utf8', function(err){
                            console.log('Make .c finish')
                        })
                        var compile = spawn('gcc', [file])
                        compile.stdout.on('data', function(data){
                            console.log('stdout : ' + data)
                        })
                        compile.stderr.on('data', function(data){
                            console.log(String(data))
                        })
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
                            console.log('Make .cpp finish')
                        })
                        var compile = spawn('g++', [file])
                        compile.stdout.on('data', function(data){
                            console.log('stdout : ' + data)
                        })
                        compile.stderr.on('data', function(data){
                            console.log(String(data))
                        })
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