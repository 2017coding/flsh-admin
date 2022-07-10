import http from '@/utils/request'

export const getUserList = (data) => {
  return http({
    url: '/manage/user/selectUserInfoPage',
    method: 'post',
    data: data
  })
}

export const getRoleList = (data) => {
  return http({
    url: '/manage/role/selectRoleRecordPage',
    method: 'post',
    data: data
  })
}

export function bindRole(data) {
  return http({
    url: '/manage/user/userBindRoleOperate',
    method: 'post',
    data: { ...data }
  })
}
