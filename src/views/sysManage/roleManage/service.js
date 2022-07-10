import http from '@/utils/request'

export const getRoleList = (data) => {
  return http({
    url: '/manage/role/selectRoleRecordPage',
    method: 'post',
    data: data
  })
}

export function addRole(data) {
  return http({
    url: '/manage/role/addOrUpdateRoleRecord',
    method: 'post',
    data: { ...data, operateType: 1 }
  })
}

export function updateRole(data) {
  return http({
    url: '/manage/role/addOrUpdateRoleRecord',
    method: 'post',
    data: { ...data, operateType: 2 }
  })
}

export function delRole(data) {
  return http({
    url: '/manage/role/addOrUpdateRoleRecord',
    method: 'post',
    data: { ...data, operateType: 3 }
  })
}
