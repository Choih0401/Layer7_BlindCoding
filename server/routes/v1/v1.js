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

router.post('/auth/signup', API.signUp) // 회원가입

router.post('/auth/signin', API.signIn) // 로그인

router.get('/contents/search', API.searchContents) // 검색

router.post('/user/profile/edit', API.editUserProfile) //페이지수정

router.get('/user/profile/:user_id', API.getUserProfile) //마이페이지

router.post('/user/profile/edit/verify', API.verifyEditUserProfile) //마이페이지 비밀번호 확인

router.get('/category/:idx', API.getCategoryContents) //윾테고리

router.get('/content/read/:idx', API.getContentsDetail) //콘텐츠 상세정보 보여주기

router.get('/content/view/:idx', API.getContentsOverview) // 콘텐츠 인트로 보여주기

router.get('/creator/adm/contents/:id', API.showContent)

router.post('/creator/adm/contents/delete', API.deleteContent)

router.post('/creator/adm/contents/new/content', API.writeContent)

router.post('/creator/adm/contents/edit/content', API.updateContent)

router.post('/creator/adm/contents/new/preview', API.writePreview)

router.post('/creator/adm/contents/edit/preview', API.updatePreview)

router.post('/creator/adm/contents/new/publish', API.writePublish)

router.post('/creator/adm/contents/edit/publish', API.updatePublish)

router.get('/main/contents', API.getMainContents)

export default router