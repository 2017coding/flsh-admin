import service from '@/utils/request'

export const getAuthorityList = (data) => {
  return service({
    url: '/selectRoleRecordPage',
    method: 'post',
    data
  })
}

export const createAuthority = (data) => {
  return service({
    url: '/addRoleRecord',
    method: 'post',
    data
  })
}

export const updateAuthority = (data) => {
  return service({
    url: '/updateRoleRecord',
    method: 'post',
    data
  })
}
