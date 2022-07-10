import service from '@/utils/request'

export const getAuthorityList = (data) => {
  return service({
    url: '/manage/role/selectRoleRecordPage',
    method: 'post',
    data
  })
}

export const createAuthority = (data) => {
  return service({
    url: '/manage/role/addRoleRecord',
    method: 'post',
    data
  })
}

export const updateAuthority = (data) => {
  return service({
    url: '/manage/role/updateRoleRecord',
    method: 'post',
    data
  })
}
