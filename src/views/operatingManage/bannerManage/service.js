import http from '@/utils/request'

export const getDictList = (data) => {
  return http({
    url: '/manage/config/selectConfigInfoPage',
    method: 'post',
    data: data
  })
}

export function addDict(data) {
  return http({
    url: '/manage/config/addOrUpdateConfigInfo',
    method: 'post',
    data: { ...data, operateType: 1 }
  })
}

export function updateDict(data) {
  return http({
    url: '/manage/config/addOrUpdateConfigInfo',
    method: 'post',
    data: { ...data, operateType: 2 }
  })
}

export function delDict(data) {
  return http({
    url: '/manage/config/addOrUpdateConfigInfo',
    method: 'post',
    data: { ...data, operateType: 3 }
  })
}
